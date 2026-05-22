-- ============================================================
-- QUINDIOFLIX - TRIGGERS
-- Versión: 1.0
-- ============================================================
-- Este script crea los triggers de negocio solicitados:
-- a) REPRODUCCION  - Verificar cuenta activa antes de insertar.
-- b) PERFIL        - Verificar límite de perfiles según plan.
-- c) CALIFICACION  - Verificar >= 50% reproducción antes de calificar.
-- d) PAGO          - Actualizar estado y fecha de último pago (compound).
-- 
-- Se agrega la columna fecha_ultimo_pago a USUARIO para el trigger (d).
-- Se ajusta SP_RENOVAR_SUSCRIPCIONES para no duplicar la lógica del trigger (d).
-- ============================================================

-- SET SERVEROUTPUT ON;

-- ============================================================
-- 0. Verificación: no ejecutar como SYS (evita ORA-04089)
-- ============================================================
DECLARE
    v_user VARCHAR2(30);
BEGIN
    SELECT USER INTO v_user FROM DUAL;
    IF v_user = 'SYS' THEN
        RAISE_APPLICATION_ERROR(
            -20999,
            'ERROR: Este script NO debe ejecutarse como SYS. ' ||
            'Crea el usuario C_QUINDIOFLIX (00_CREAR_USUARIO.sql), ' ||
            'conectate como C_QUINDIOFLIX y re-ejecuta los scripts DDL y Triggers.'
        );
    END IF;
END;

-- ============================================================
-- 0. Preparación: agregar columna fecha_ultimo_pago a USUARIO
-- (si no existe, para soportar el trigger de pagos)
-- ============================================================
BEGIN
    EXECUTE IMMEDIATE 'ALTER TABLE USUARIO ADD fecha_ultimo_pago DATE';
    DBMS_OUTPUT.PUT_LINE('Columna fecha_ultimo_pago agregada a USUARIO.');
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Nota: ' || SQLERRM);
END;


-- ============================================================
-- a) TRIGGER: TRG_VERIFICAR_USUARIO_ACTIVO_REPRODUCCION
-- Nivel de fila (BEFORE INSERT).
-- Verifica que el perfil que intenta reproducir pertenezca a
-- un usuario con estado = 'ACTIVO'. Si no, rechaza la inserción.
-- ============================================================
CREATE OR REPLACE TRIGGER TRG_VERIFICAR_USUARIO_ACTIVO_REPRODUCCION
BEFORE INSERT ON REPRODUCCION
FOR EACH ROW
DECLARE
    v_estado USUARIO.estado%TYPE;
BEGIN
    SELECT u.estado
    INTO v_estado
    FROM PERFIL p
    JOIN USUARIO u ON p.id_usuario = u.id_usuario
    WHERE p.id_perfil = :NEW.id_perfil;

    IF v_estado != 'ACTIVO' THEN
        RAISE_APPLICATION_ERROR(
            -20101,
            'El usuario no tiene una cuenta activa. No se puede registrar la reproduccion.'
        );
    ELSE
        DBMS_OUTPUT.PUT_LINE('TRG_VERIFICAR_USUARIO_ACTIVO_REPRODUCCION - Perfil: ' || :NEW.id_perfil || ' | Estado usuario: ACTIVO');
    END IF;
END;


-- ============================================================
-- b) TRIGGER: TRG_VERIFICAR_MAX_PERFILES
-- COMPOUND TRIGGER (BEFORE EACH ROW + AFTER STATEMENT).
-- Verifica que el usuario no exceda el máximo de perfiles
-- permitidos por su plan (Basic: 2, Standard: 3, Premium: 5).
-- Se consulta PLAN_SUSCRIPCION.max_perfiles para respetar el
-- esquema existente (los valores allí deben coincidir).
-- 
-- Se utiliza COMPOUND TRIGGER para evitar ORA-04091 (mutating
-- table) al consultar PERFIL desde un trigger de fila.
-- ============================================================
CREATE OR REPLACE TRIGGER TRG_VERIFICAR_MAX_PERFILES
FOR INSERT ON PERFIL
COMPOUND TRIGGER

    TYPE t_user_tab IS TABLE OF NUMBER;
    v_users t_user_tab := t_user_tab();

    BEFORE EACH ROW IS
    BEGIN
        v_users.EXTEND;
        v_users(v_users.LAST) := :NEW.id_usuario;
    END BEFORE EACH ROW;

    AFTER STATEMENT IS
        v_count NUMBER;
        v_max   NUMBER;
    BEGIN
        FOR i IN 1 .. v_users.COUNT LOOP
            -- Evitar verificar el mismo usuario dos veces
            DECLARE
                v_dup BOOLEAN := FALSE;
            BEGIN
                FOR j IN 1 .. i - 1 LOOP
                    IF v_users(j) = v_users(i) THEN
                        v_dup := TRUE;
                        EXIT;
                    END IF;
                END LOOP;
                IF v_dup THEN
                    CONTINUE;
                END IF;
            END;

            SELECT COUNT(*) INTO v_count
            FROM PERFIL
            WHERE id_usuario = v_users(i);

            SELECT ps.max_perfiles INTO v_max
            FROM USUARIO u
            JOIN PLAN_SUSCRIPCION ps ON u.id_plan = ps.id_plan
            WHERE u.id_usuario = v_users(i);

            IF v_count > v_max THEN
                RAISE_APPLICATION_ERROR(
                    -20102,
                    'El usuario ha alcanzado el numero maximo de perfiles permitidos por su plan (' || v_max || ').'
                );
            ELSE
                DBMS_OUTPUT.PUT_LINE('TRG_VERIFICAR_MAX_PERFILES - Usuario: ' || v_users(i) || ' | Perfiles: ' || v_count || '/' || v_max || ' OK');
            END IF;
        END LOOP;
    END AFTER STATEMENT;

END TRG_VERIFICAR_MAX_PERFILES;


-- ============================================================
-- c) TRIGGER: TRG_VERIFICAR_REPRODUCCION_CALIFICACION
-- Nivel de fila (BEFORE INSERT).
-- Verifica que el perfil haya reproducido al menos el 50% del
-- contenido antes de permitir la calificación.
-- Soporta contenido directo (película/documental/música) y
-- contenido por episodios (serie/podcast).
-- ============================================================
CREATE OR REPLACE TRIGGER TRG_VERIFICAR_REPRODUCCION_CALIFICACION
BEFORE INSERT ON CALIFICACION
FOR EACH ROW
DECLARE
    v_count NUMBER;
BEGIN
    SELECT COUNT(*)
    INTO v_count
    FROM REPRODUCCION r
    WHERE r.id_perfil = :NEW.id_perfil
      AND (
          r.id_contenido = :NEW.id_contenido
          OR r.id_episodio IN (
              SELECT e.id_episodio
              FROM EPISODIO e
              JOIN TEMPORADA t ON e.id_temporada = t.id_temporada
              WHERE t.id_contenido = :NEW.id_contenido
          )
      )
      AND r.porcentaje_avance >= 50;

    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(
            -20103,
            'El perfil debe haber reproducido al menos el 50% del contenido antes de calificarlo.'
        );
    ELSE
        DBMS_OUTPUT.PUT_LINE('TRG_VERIFICAR_REPRODUCCION_CALIFICACION - Perfil: ' || :NEW.id_perfil || ' | Reproducciones >= 50%: ' || v_count || ' OK');
    END IF;
END;


-- ============================================================
-- d) TRIGGER: TRG_ACTUALIZAR_USUARIO_PAGO
-- Nivel de sentencia compuesto (COMPOUND TRIGGER).
-- AFTER STATEMENT sobre INSERT en PAGO.
-- 
-- Cuando se inserta un pago exitoso, actualiza automáticamente:
-- - USUARIO.estado           -> 'ACTIVO'
-- - USUARIO.fecha_ultimo_pago -> SYSDATE
-- 
-- Se utiliza un COMPOUND TRIGGER porque un trigger puramente
-- de sentencia en Oracle no puede acceder a :NEW.id_usuario.
-- La sección BEFORE EACH ROW acumula los IDs de usuario cuyo
-- pago fue exitoso, y la sección AFTER STATEMENT procesa la
-- actualización masiva una sola vez por sentencia.
-- ============================================================
CREATE OR REPLACE TRIGGER TRG_ACTUALIZAR_USUARIO_PAGO
FOR INSERT ON PAGO
COMPOUND TRIGGER

    TYPE t_usuarios IS TABLE OF NUMBER;
    v_usuarios t_usuarios := t_usuarios();

    BEFORE EACH ROW IS
    BEGIN
        IF :NEW.estado_pago = 'EXITOSO' THEN
            v_usuarios.EXTEND;
            v_usuarios(v_usuarios.LAST) := :NEW.id_usuario;
        END IF;
    END BEFORE EACH ROW;

    AFTER STATEMENT IS
    BEGIN
        FOR i IN 1 .. v_usuarios.COUNT LOOP
            UPDATE USUARIO
            SET estado            = 'ACTIVO',
                fecha_ultimo_pago = SYSDATE
            WHERE id_usuario = v_usuarios(i);
            DBMS_OUTPUT.PUT_LINE('TRG_ACTUALIZAR_USUARIO_PAGO - Usuario: ' || v_usuarios(i) || ' | Estado actualizado a ACTIVO, fecha_ultimo_pago = SYSDATE');
        END LOOP;
    END AFTER STATEMENT;

END;


-- ============================================================
-- 4. Permisos de ejecución (si se necesitan para triggers, aunque
-- normalmente los triggers se ejecutan con los permisos del
-- propietario del esquema)
-- ============================================================

COMMIT;

-- ============================================================
-- FIN DEL SCRIPT DE TRIGGERS
-- ============================================================

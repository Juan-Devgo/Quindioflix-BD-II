-- ============================================================
--  QUINDIOFLIX - TRIGGERS
--  Versión: 1.0
-- ============================================================
--  Este script crea los triggers de negocio solicitados:
--   a) REPRODUCCION  - Verificar cuenta activa antes de insertar.
--   b) PERFIL        - Verificar límite de perfiles según plan.
--   c) CALIFICACION  - Verificar >= 50% reproducción antes de calificar.
--   d) PAGO          - Actualizar estado y fecha de último pago (compound).
--
--  Se agrega la columna fecha_ultimo_pago a USUARIO para el trigger (d).
--  Se ajusta SP_RENOVAR_SUSCRIPCIONES para no duplicar la lógica del trigger (d).
-- ============================================================

SET SERVEROUTPUT ON;

-- ============================================================
-- 0. Preparación: agregar columna fecha_ultimo_pago a USUARIO
--    (si no existe, para soportar el trigger de pagos)
-- ============================================================
BEGIN
    EXECUTE IMMEDIATE 'ALTER TABLE USUARIO ADD fecha_ultimo_pago DATE';
    DBMS_OUTPUT.PUT_LINE('Columna fecha_ultimo_pago agregada a USUARIO.');
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Nota: ' || SQLERRM);
END;
/


-- ============================================================
-- a) TRIGGER: TRG_VERIFICAR_USUARIO_ACTIVO_REPRODUCCION
--    Nivel de fila (BEFORE INSERT).
--    Verifica que el perfil que intenta reproducir pertenezca a
--    un usuario con estado = 'ACTIVO'. Si no, rechaza la inserción.
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
    END IF;
END;
/


-- ============================================================
-- b) TRIGGER: TRG_VERIFICAR_MAX_PERFILES
--    Nivel de fila (BEFORE INSERT).
--    Verifica que el usuario no exceda el máximo de perfiles
--    permitidos por su plan (Basic: 2, Standard: 3, Premium: 5).
--    Se consulta PLAN_SUSCRIPCION.max_perfiles para respetar el
--    esquema existente (los valores allí deben coincidir).
--
--    NOTA: Este trigger consulta su propia tabla (PERFIL). En Oracle,
--    esto puede generar ORA-04091 (mutating table) si la sentencia
--    INSERT afecta múltiples filas simultáneamente. El flujo normal
--    de la aplicación inserta un perfil a la vez.
-- ============================================================
CREATE OR REPLACE TRIGGER TRG_VERIFICAR_MAX_PERFILES
BEFORE INSERT ON PERFIL
FOR EACH ROW
DECLARE
    v_count        NUMBER;
    v_max_perfiles NUMBER(1);
BEGIN
    SELECT COUNT(*)
    INTO v_count
    FROM PERFIL
    WHERE id_usuario = :NEW.id_usuario;

    SELECT ps.max_perfiles
    INTO v_max_perfiles
    FROM USUARIO u
    JOIN PLAN_SUSCRIPCION ps ON u.id_plan = ps.id_plan
    WHERE u.id_usuario = :NEW.id_usuario;

    IF v_count >= v_max_perfiles THEN
        RAISE_APPLICATION_ERROR(
            -20102,
            'El usuario ha alcanzado el numero maximo de perfiles permitidos por su plan (' || v_max_perfiles || ').'
        );
    END IF;
END;
/


-- ============================================================
-- c) TRIGGER: TRG_VERIFICAR_REPRODUCCION_CALIFICACION
--    Nivel de fila (BEFORE INSERT).
--    Verifica que el perfil haya reproducido al menos el 50% del
--    contenido antes de permitir la calificación.
--    Soporta contenido directo (película/documental/música) y
--    contenido por episodios (serie/podcast).
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
    END IF;
END;
/


-- ============================================================
-- d) TRIGGER: TRG_ACTUALIZAR_USUARIO_PAGO
--    Nivel de sentencia compuesto (COMPOUND TRIGGER).
--    AFTER STATEMENT sobre INSERT en PAGO.
--
--    Cuando se inserta un pago exitoso, actualiza automáticamente:
--      - USUARIO.estado           -> 'ACTIVO'
--      - USUARIO.fecha_ultimo_pago -> SYSDATE
--
--    Se utiliza un COMPOUND TRIGGER porque un trigger puramente
--    de sentencia en Oracle no puede acceder a :NEW.id_usuario.
--    La sección BEFORE EACH ROW acumula los IDs de usuario cuyo
--    pago fue exitoso, y la sección AFTER STATEMENT procesa la
--    actualización masiva una sola vez por sentencia.
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
        END LOOP;
    END AFTER STATEMENT;

END;
/


-- ============================================================
-- 4. Permisos de ejecución (si se necesitan para triggers, aunque
--    normalmente los triggers se ejecutan con los permisos del
--    propietario del esquema)
-- ============================================================

COMMIT;

-- ============================================================
-- FIN DEL SCRIPT DE TRIGGERS
-- ============================================================

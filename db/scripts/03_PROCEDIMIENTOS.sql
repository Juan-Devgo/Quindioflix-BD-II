-- ============================================================
--  QUINDIOFLIX - PROCEDIMIENTOS ALMACENADOS (3.2.2)
--  Versión: 1.0
-- ============================================================
--  Procedimientos de negocio:
--   a) SP_REGISTRAR_USUARIO  – registro completo de usuario.
--   b) SP_CHANGE_PLAN        – cambio de plan con validaciones.
--   c) SP_CONSUMPTION_REPORT – reporte de consumo por perfil y
--      categoría mediante SYS_REFCURSOR.
-- ============================================================

SET SERVEROUTPUT ON;

-- ============================================================
-- a) SP_REGISTRAR_USUARIO
--    Recibe la información del usuario y el plan seleccionado,
--    valida que el email no exista, crea la cuenta, genera un
--    perfil por defecto (ADULTO) y registra el primer pago.
-- ============================================================
CREATE OR REPLACE PROCEDURE SP_REGISTRAR_USUARIO (
    p_nombre           IN VARCHAR2,
    p_email            IN VARCHAR2,
    p_telefono         IN VARCHAR2,
    p_fecha_nacimiento IN DATE,
    p_id_ciudad        IN NUMBER,
    p_id_plan          IN NUMBER,
    p_metodo_pago      IN VARCHAR2 DEFAULT 'TARJETA_CREDITO',
    p_id_usuario       OUT NUMBER,
    p_mensaje          OUT VARCHAR2
) IS
    v_count  NUMBER;
    v_precio NUMBER(10,2);
BEGIN
    -- 1. Validaciones de entrada
    IF p_nombre IS NULL OR p_email IS NULL THEN
        RAISE_APPLICATION_ERROR(-20060, 'El nombre y el email son obligatorios');
    END IF;

    IF p_fecha_nacimiento > SYSDATE THEN
        RAISE_APPLICATION_ERROR(-20061, 'La fecha de nacimiento no puede ser futura');
    END IF;

    -- 2. Verificar email duplicado
    SELECT COUNT(*) INTO v_count
    FROM USUARIO
    WHERE email = p_email;

    IF v_count > 0 THEN
        RAISE_APPLICATION_ERROR(-20062, 'El email ya esta registrado en la plataforma');
    END IF;

    -- 3. Verificar plan y obtener precio
    SELECT precio_mensual INTO v_precio
    FROM PLAN_SUSCRIPCION
    WHERE id_plan = p_id_plan;

    -- 4. Crear usuario
    INSERT INTO USUARIO (
        nombre, email, telefono, fecha_nacimiento,
        id_ciudad, id_plan, fecha_registro, fecha_vencimiento,
        estado
    ) VALUES (
        p_nombre, p_email, p_telefono, p_fecha_nacimiento,
        p_id_ciudad, p_id_plan, SYSDATE, SYSDATE + 30,
        'ACTIVO'
    ) RETURNING id_usuario INTO p_id_usuario;

    -- 5. Crear perfil por defecto
    INSERT INTO PERFIL (id_usuario, nombre, tipo, activo)
    VALUES (p_id_usuario, 'Perfil Principal', 'ADULTO', 'S');

    -- 6. Registrar primer pago
    INSERT INTO PAGO (
        id_usuario, id_plan, fecha_pago, monto,
        metodo_pago, estado_pago, descuento_aplicado,
        descripcion_descuento
    ) VALUES (
        p_id_usuario, p_id_plan, SYSDATE, v_precio,
        p_metodo_pago, 'EXITOSO', 0,
        'Pago inicial - Registro de nuevo usuario'
    );

    COMMIT;

    p_mensaje := 'Usuario registrado exitosamente. ID: ' || p_id_usuario;

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        ROLLBACK;
        p_mensaje := 'Error: Plan de suscripcion no encontrado';
        RAISE_APPLICATION_ERROR(-20063, 'El plan de suscripcion especificado no existe');
    WHEN OTHERS THEN
        ROLLBACK;
        p_mensaje := 'Error en SP_REGISTRAR_USUARIO: ' || SQLERRM;
        RAISE_APPLICATION_ERROR(-20064, 'Error al registrar usuario: ' || SQLERRM);
END;
/


-- ============================================================
-- b) SP_CHANGE_PLAN
--    Recibe el ID de usuario y el nuevo plan, valida que sea
--    un cambio permitido (no puede bajar de plan si tiene más
--    perfiles activos de los permitidos), actualiza el plan y
--    registra el cambio como un nuevo pago.
-- ============================================================
CREATE OR REPLACE PROCEDURE SP_CHANGE_PLAN (
    p_id_usuario    IN NUMBER,
    p_id_nuevo_plan IN NUMBER,
    p_mensaje       OUT VARCHAR2
) IS
    v_perfiles_actuales  NUMBER;
    v_max_perfiles_nuevo NUMBER;
    v_precio_nuevo       NUMBER(10,2);
    v_plan_actual        NUMBER;
    v_nombre_plan        VARCHAR2(50);
BEGIN
    -- 1. Verificar que el usuario existe y obtener plan actual
    SELECT id_plan INTO v_plan_actual
    FROM USUARIO
    WHERE id_usuario = p_id_usuario;

    -- 2. Obtener datos del nuevo plan
    SELECT max_perfiles, precio_mensual, nombre
    INTO v_max_perfiles_nuevo, v_precio_nuevo, v_nombre_plan
    FROM PLAN_SUSCRIPCION
    WHERE id_plan = p_id_nuevo_plan;

    -- 3. Contar perfiles activos del usuario
    SELECT COUNT(*)
    INTO v_perfiles_actuales
    FROM PERFIL
    WHERE id_usuario = p_id_usuario
      AND activo = 'S';

    -- 4. Validar que no exceda el limite del nuevo plan
    IF v_perfiles_actuales > v_max_perfiles_nuevo THEN
        RAISE_APPLICATION_ERROR(-20070,
            'No puede cambiar al plan ' || v_nombre_plan ||
            ' porque tiene ' || v_perfiles_actuales ||
            ' perfiles activos y el plan permite maximo ' ||
            v_max_perfiles_nuevo || ' perfiles.');
    END IF;

    -- 5. Actualizar plan del usuario
    UPDATE USUARIO
    SET id_plan = p_id_nuevo_plan
    WHERE id_usuario = p_id_usuario;

    -- 6. Registrar el cambio de plan como un pago
    INSERT INTO PAGO (
        id_usuario, id_plan, fecha_pago, monto,
        metodo_pago, estado_pago, descuento_aplicado,
        descripcion_descuento
    ) VALUES (
        p_id_usuario, p_id_nuevo_plan, SYSDATE, v_precio_nuevo,
        'TARJETA_CREDITO', 'EXITOSO', 0,
        'Cambio de plan a ' || v_nombre_plan
    );

    COMMIT;

    p_mensaje := 'Plan actualizado exitosamente al plan ' || v_nombre_plan ||
                 '. Perfiles activos: ' || v_perfiles_actuales || '/' ||
                 v_max_perfiles_nuevo || '.';

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        ROLLBACK;
        RAISE_APPLICATION_ERROR(-20071, 'El usuario o el plan especificado no existe');
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE_APPLICATION_ERROR(-20072, 'Error al cambiar de plan: ' || SQLERRM);
END;
/


-- ============================================================
-- c) SP_CONSUMPTION_REPORT
--    Recibe un ID de usuario y un rango de fechas, y devuelve
--    un cursor con el reporte detallado de reproducciones de
--    cada perfil, agrupado por categoria (genero), incluyendo
--    totales de tiempo consumido en minutos.
-- ============================================================
CREATE OR REPLACE PROCEDURE SP_CONSUMPTION_REPORT (
    p_id_usuario   IN NUMBER,
    p_fecha_inicio IN DATE,
    p_fecha_fin    IN DATE,
    p_reporte      OUT SYS_REFCURSOR,
    p_mensaje      OUT VARCHAR2
) IS
    v_count NUMBER;
BEGIN
    -- 1. Verificar que el usuario existe
    SELECT COUNT(*) INTO v_count
    FROM USUARIO
    WHERE id_usuario = p_id_usuario;

    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20080, 'El usuario especificado no existe');
    END IF;

    -- 2. Abrir cursor con el reporte
    OPEN p_reporte FOR
        SELECT
            p.nombre                                      AS nombre_perfil,
            NVL(g.nombre, 'Sin categoria')                AS categoria,
            COUNT(DISTINCT r.id_reproduccion)             AS total_reproducciones,
            ROUND(SUM(
                CASE
                    WHEN r.fecha_fin IS NOT NULL THEN
                        NVL((r.fecha_fin - r.fecha_inicio) * 1440, 0)
                    WHEN r.id_episodio IS NOT NULL THEN
                        NVL(e.duracion_minutos, 0) * r.porcentaje_avance / 100
                    ELSE
                        NVL(c.duracion_minutos, 0) * r.porcentaje_avance / 100
                END
            ), 2)                                        AS total_minutos_consumidos
        FROM REPRODUCCION r
        JOIN PERFIL p ON r.id_perfil = p.id_perfil
        LEFT JOIN EPISODIO e ON r.id_episodio = e.id_episodio
        LEFT JOIN TEMPORADA t ON e.id_temporada = t.id_temporada
        LEFT JOIN CONTENIDO c ON COALESCE(r.id_contenido, t.id_contenido) = c.id_contenido
        LEFT JOIN CONTENIDO_GENERO cg ON c.id_contenido = cg.id_contenido
        LEFT JOIN GENERO g ON cg.id_genero = g.id_genero
        WHERE p.id_usuario = p_id_usuario
          AND TRUNC(r.fecha_inicio) BETWEEN p_fecha_inicio AND p_fecha_fin
        GROUP BY p.nombre, g.nombre
        ORDER BY p.nombre, total_minutos_consumidos DESC;

    p_mensaje := 'Reporte generado exitosamente para el usuario ' || p_id_usuario ||
                 ' entre ' || TO_CHAR(p_fecha_inicio, 'YYYY-MM-DD') ||
                 ' y ' || TO_CHAR(p_fecha_fin, 'YYYY-MM-DD') || '.';

EXCEPTION
    WHEN OTHERS THEN
        RAISE_APPLICATION_ERROR(-20081, 'Error al generar el reporte de consumo: ' || SQLERRM);
END;
/


-- ============================================================
-- Permisos de ejecución
-- ============================================================
GRANT EXECUTE ON SP_REGISTRAR_USUARIO   TO ROL_ADMIN;
GRANT EXECUTE ON SP_REGISTRAR_USUARIO   TO ROL_SOPORTE;

GRANT EXECUTE ON SP_CHANGE_PLAN         TO ROL_ADMIN;
GRANT EXECUTE ON SP_CHANGE_PLAN         TO ROL_SOPORTE;
GRANT EXECUTE ON SP_CHANGE_PLAN         TO ROL_ANALISTA;

GRANT EXECUTE ON SP_CONSUMPTION_REPORT  TO ROL_ADMIN;
GRANT EXECUTE ON SP_CONSUMPTION_REPORT  TO ROL_ANALISTA;

COMMIT;


-- ============================================================
-- Ejemplos de uso
-- ============================================================
/*
-- a) Registrar un nuevo usuario
DECLARE
    v_id  NUMBER;
    v_msg VARCHAR2(500);
BEGIN
    SP_REGISTRAR_USUARIO(
        p_nombre           => 'Carlos Mendoza',
        p_email            => 'carlos.mendoza@email.com',
        p_telefono         => '3009998877',
        p_fecha_nacimiento => DATE '1990-05-20',
        p_id_ciudad        => 1,
        p_id_plan          => 2,
        p_metodo_pago      => 'PSE',
        p_id_usuario       => v_id,
        p_mensaje          => v_msg
    );
    DBMS_OUTPUT.PUT_LINE(v_msg);
END;
/

-- b) Cambiar de plan
DECLARE
    v_msg VARCHAR2(500);
BEGIN
    SP_CHANGE_PLAN(
        p_id_usuario    => 1,
        p_id_nuevo_plan => 3,
        p_mensaje       => v_msg
    );
    DBMS_OUTPUT.PUT_LINE(v_msg);
END;
/

-- c) Reporte de consumo
DECLARE
    v_cursor SYS_REFCURSOR;
    v_msg    VARCHAR2(500);
    v_perfil VARCHAR2(100);
    v_cat    VARCHAR2(100);
    v_repr   NUMBER;
    v_min    NUMBER;
BEGIN
    SP_CONSUMPTION_REPORT(
        p_id_usuario   => 1,
        p_fecha_inicio => DATE '2024-01-01',
        p_fecha_fin    => DATE '2025-12-31',
        p_reporte      => v_cursor,
        p_mensaje      => v_msg
    );
    DBMS_OUTPUT.PUT_LINE(v_msg);
    LOOP
        FETCH v_cursor INTO v_perfil, v_cat, v_repr, v_min;
        EXIT WHEN v_cursor%NOTFOUND;
        DBMS_OUTPUT.PUT_LINE(
            'Perfil: ' || v_perfil ||
            ' | Cat: ' || v_cat ||
            ' | Reprods: ' || v_repr ||
            ' | Min: ' || v_min
        );
    END LOOP;
    CLOSE v_cursor;
END;
/
*/

-- ============================================================
-- FIN DEL SCRIPT DE PROCEDIMIENTOS
-- ============================================================

-- ============================================================
-- QUINDIOFLIX - PROCEDIMIENTOS DE TRANSACCIONES
-- Versión: 1.0
-- ============================================================
-- Este script crea los procedimientos almacenados para manejar
-- transacciones críticas de negocio:
-- 1. Registro de un nuevo cliente (usuario + perfil + pago).
-- 2. Renovación masiva de suscripciones para usuarios activos.
-- 3. Eliminación completa de una cuenta y todos sus datos.
-- 
-- Cada procedimiento utiliza:
-- - COMMIT explícito al finalizar exitosamente.
-- - ROLLBACK (o ROLLBACK TO SAVEPOINT) ante excepciones.
-- - RAISE_APPLICATION_ERROR para errores personalizados.
-- - DBMS_OUTPUT.PUT_LINE para mostrar mensajes de seguimiento.
-- ============================================================

-- SET SERVEROUTPUT ON;

-- ============================================================
-- 1. SP_REGISTRAR_CLIENTE
-- Registra un nuevo usuario, crea su perfil principal y
-- registra el primer pago de suscripción.
-- ============================================================
CREATE OR REPLACE PROCEDURE SP_REGISTRAR_CLIENTE (
    p_nombre            IN VARCHAR2,
    p_email             IN VARCHAR2,
    p_telefono          IN VARCHAR2,
    p_fecha_nacimiento  IN DATE,
    p_id_ciudad         IN NUMBER,
    p_id_plan           IN NUMBER,
    p_id_referidor      IN NUMBER DEFAULT NULL,
    p_perfil_nombre     IN VARCHAR2,
    p_perfil_tipo       IN VARCHAR2 DEFAULT 'ADULTO',
    p_metodo_pago       IN VARCHAR2 DEFAULT 'TARJETA_CREDITO',
    p_id_usuario        OUT NUMBER,
    p_mensaje           OUT VARCHAR2
) IS
    v_id_usuario    NUMBER;
    v_precio        NUMBER(10,2);
    v_max_perfiles  NUMBER(1);
    v_count         NUMBER;
BEGIN
    -- Validaciones de negocio
    IF p_nombre IS NULL OR p_email IS NULL THEN
        RAISE_APPLICATION_ERROR(-20010, 'El nombre y el email son obligatorios');
    END IF;

    IF p_fecha_nacimiento > SYSDATE THEN
        RAISE_APPLICATION_ERROR(-20011, 'La fecha de nacimiento no puede ser futura');
    END IF;

    -- Verificar email duplicado
    SELECT COUNT(*) INTO v_count
    FROM USUARIO
    WHERE email = p_email;

    IF v_count > 0 THEN
        RAISE_APPLICATION_ERROR(-20012, 'El email ya esta registrado en la plataforma');
    END IF;

    -- Verificar existencia del plan y obtener datos
    SELECT precio_mensual, max_perfiles
    INTO v_precio, v_max_perfiles
    FROM PLAN_SUSCRIPCION
    WHERE id_plan = p_id_plan;

    IF p_perfil_tipo NOT IN ('ADULTO', 'INFANTIL') THEN
        RAISE_APPLICATION_ERROR(-20013, 'El tipo de perfil debe ser ADULTO o INFANTIL');
    END IF;

    -- Verificar referidor si se proporciona
    IF p_id_referidor IS NOT NULL THEN
        SELECT COUNT(*) INTO v_count
        FROM USUARIO
        WHERE id_usuario = p_id_referidor;

        IF v_count = 0 THEN
            RAISE_APPLICATION_ERROR(-20016, 'El usuario referidor no existe');
        END IF;
    END IF;

    -- 1) Insertar usuario
    INSERT INTO USUARIO (
        nombre, email, telefono, fecha_nacimiento,
        id_ciudad, id_plan, fecha_registro, fecha_vencimiento,
        estado, id_referidor
    ) VALUES (
        p_nombre, p_email, p_telefono, p_fecha_nacimiento,
        p_id_ciudad, p_id_plan, SYSDATE, SYSDATE + 30,
        'ACTIVO', p_id_referidor
    ) RETURNING id_usuario INTO v_id_usuario;

    -- 2) Insertar perfil principal
    INSERT INTO PERFIL (id_usuario, nombre, tipo, activo)
    VALUES (v_id_usuario, p_perfil_nombre, p_perfil_tipo, 'S');

    -- 3) Registrar primer pago
    INSERT INTO PAGO (
        id_usuario, id_plan, fecha_pago, monto,
        metodo_pago, estado_pago, descuento_aplicado,
        descripcion_descuento
    ) VALUES (
        v_id_usuario, p_id_plan, SYSDATE, v_precio,
        p_metodo_pago, 'EXITOSO', 0,
        'Pago inicial - Registro de nuevo cliente'
    );

    -- 4) Si hay referidor, registrar en tabla REFERIDO
    IF p_id_referidor IS NOT NULL THEN
        INSERT INTO REFERIDO (
            id_usuario_referidor, id_usuario_nuevo,
            fecha_referido, beneficio_aplicado_referidor,
            beneficio_aplicado_nuevo
        ) VALUES (
            p_id_referidor, v_id_usuario,
            SYSDATE, 'N', 'N'
        );
    END IF;

    COMMIT;

    p_id_usuario := v_id_usuario;
    p_mensaje := 'Usuario registrado exitosamente. ID: ' || v_id_usuario;
    DBMS_OUTPUT.PUT_LINE(p_mensaje);

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        ROLLBACK;
        p_mensaje := 'Error: Plan de suscripcion no encontrado';
        DBMS_OUTPUT.PUT_LINE(p_mensaje);
        RAISE_APPLICATION_ERROR(-20014, 'El plan de suscripcion especificado no existe');
    WHEN OTHERS THEN
        ROLLBACK;
        p_mensaje := 'Error en SP_REGISTRAR_CLIENTE: ' || SQLERRM;
        DBMS_OUTPUT.PUT_LINE(p_mensaje);
        RAISE_APPLICATION_ERROR(-20015, 'Error al registrar cliente: ' || SQLERRM);
END;


-- ============================================================
-- 2. SP_RENOVAR_SUSCRIPCIONES
-- Para cada usuario ACTIVO cuya suscripción esté vencida o
-- por vencer (<= 5 días), calcula el precio, registra el
-- pago y extiende la fecha de vencimiento (+30 días).
-- Usa SAVEPOINT por cada usuario para no perder las
-- renovaciones previas si un usuario específico falla.
-- ============================================================
CREATE OR REPLACE PROCEDURE SP_RENOVAR_SUSCRIPCIONES (
    p_renovaciones OUT NUMBER,
    p_errores      OUT NUMBER,
    p_mensaje      OUT VARCHAR2
) IS
    CURSOR c_usuarios_activos IS
        SELECT
            u.id_usuario,
            u.id_plan,
            u.fecha_vencimiento,
            p.precio_mensual,
            p.nombre AS nombre_plan
        FROM USUARIO u
        JOIN PLAN_SUSCRIPCION p ON u.id_plan = p.id_plan
        WHERE u.estado = 'ACTIVO'
          AND (u.fecha_vencimiento IS NULL OR u.fecha_vencimiento <= SYSDATE + 5);

    v_nuevo_monto       NUMBER(10,2);
    v_nueva_fecha       DATE;
    v_metodo_pago       VARCHAR2(20);
    v_renovaciones      NUMBER := 0;
    v_errores           NUMBER := 0;
BEGIN
    FOR r_usuario IN c_usuarios_activos LOOP
        SAVEPOINT sp_renovacion_usuario;

        BEGIN
            -- Determinar nueva fecha de vencimiento
            IF r_usuario.fecha_vencimiento IS NULL THEN
                v_nueva_fecha := SYSDATE + 30;
            ELSE
                v_nueva_fecha := GREATEST(r_usuario.fecha_vencimiento, SYSDATE) + 30;
            END IF;

            -- Calcular precio (precio base del plan)
            v_nuevo_monto := r_usuario.precio_mensual;

            -- Intentar recuperar el último método de pago exitoso del usuario
            BEGIN
                SELECT metodo_pago
                INTO v_metodo_pago
                FROM PAGO
                WHERE id_usuario = r_usuario.id_usuario
                  AND estado_pago = 'EXITOSO'
                ORDER BY fecha_pago DESC
                FETCH FIRST 1 ROW ONLY;
            EXCEPTION
                WHEN NO_DATA_FOUND THEN
                    v_metodo_pago := 'TARJETA_CREDITO';
            END;

            -- Registrar pago de renovación
            INSERT INTO PAGO (
                id_usuario, id_plan, fecha_pago, monto,
                metodo_pago, estado_pago, descuento_aplicado,
                descripcion_descuento
            ) VALUES (
                r_usuario.id_usuario, r_usuario.id_plan, SYSDATE, v_nuevo_monto,
                v_metodo_pago, 'EXITOSO', 0,
                'Renovacion automatica - Plan ' || r_usuario.nombre_plan
            );

            -- Actualizar usuario con nueva fecha de vencimiento
            -- NOTA: el estado se actualiza automaticamente a 'ACTIVO'
            --       y la fecha_ultimo_pago a SYSDATE mediante el
            --       trigger TRG_ACTUALIZAR_USUARIO_PAGO al insertar
            --       el pago exitoso.
            UPDATE USUARIO
            SET fecha_vencimiento = v_nueva_fecha
            WHERE id_usuario = r_usuario.id_usuario;

            v_renovaciones := v_renovaciones + 1;

        EXCEPTION
            WHEN OTHERS THEN
                -- Se revierte solo la renovación del usuario actual;
                -- las renovaciones previas se mantienen gracias al SAVEPOINT.
                ROLLBACK TO sp_renovacion_usuario;
                v_errores := v_errores + 1;
                DBMS_OUTPUT.PUT_LINE(
                    'Error renovando usuario ID ' || r_usuario.id_usuario || ': ' || SQLERRM
                );
                -- NO se relanza la excepción para continuar con el siguiente usuario
        END;
    END LOOP;

    COMMIT;

    p_renovaciones := v_renovaciones;
    p_errores      := v_errores;
    p_mensaje := 'Proceso de renovacion completado. Exitosas: ' || v_renovaciones ||
                 ', Errores: ' || v_errores;
    DBMS_OUTPUT.PUT_LINE(p_mensaje);

EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        p_mensaje := 'Error general en SP_RENOVAR_SUSCRIPCIONES: ' || SQLERRM;
        DBMS_OUTPUT.PUT_LINE(p_mensaje);
        RAISE_APPLICATION_ERROR(-20020, 'Error fatal al renovar suscripciones: ' || SQLERRM);
END;


-- ============================================================
-- 3. SP_ELIMINAR_CUENTA
-- Elimina todos los datos asociados a un usuario:
-- calificaciones, favoritos, reproducciones, reportes de
-- contenido, perfiles, pagos, registros de referidos y
-- finalmente el usuario. Rompe la auto-referencia de
-- id_referidor antes de eliminar.
-- ============================================================
CREATE OR REPLACE PROCEDURE SP_ELIMINAR_CUENTA (
    p_id_usuario IN NUMBER,
    p_mensaje    OUT VARCHAR2
) IS
    v_count NUMBER;
BEGIN
    -- Validar que el usuario existe
    SELECT COUNT(*) INTO v_count
    FROM USUARIO
    WHERE id_usuario = p_id_usuario;

    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20030, 'El usuario especificado no existe');
    END IF;

    -- 1) Romper auto-referencia: usuarios que fueron referidos por este
    UPDATE USUARIO
    SET id_referidor = NULL
    WHERE id_referidor = p_id_usuario;

    -- 2) Eliminar calificaciones (CALIFICACION) asociadas a los perfiles del usuario
    DELETE FROM CALIFICACION
    WHERE id_perfil IN (
        SELECT id_perfil FROM PERFIL WHERE id_usuario = p_id_usuario
    );

    -- 3) Eliminar favoritos asociados a los perfiles del usuario
    DELETE FROM FAVORITO
    WHERE id_perfil IN (
        SELECT id_perfil FROM PERFIL WHERE id_usuario = p_id_usuario
    );

    -- 4) Eliminar reproducciones asociadas a los perfiles del usuario
    DELETE FROM REPRODUCCION
    WHERE id_perfil IN (
        SELECT id_perfil FROM PERFIL WHERE id_usuario = p_id_usuario
    );

    -- 5) Eliminar reportes de contenido realizados por los perfiles del usuario
    DELETE FROM REPORTE_CONTENIDO
    WHERE id_perfil_reportador IN (
        SELECT id_perfil FROM PERFIL WHERE id_usuario = p_id_usuario
    );

    -- 6) Eliminar perfiles del usuario
    DELETE FROM PERFIL WHERE id_usuario = p_id_usuario;

    -- 7) Eliminar pagos del usuario
    DELETE FROM PAGO WHERE id_usuario = p_id_usuario;

    -- 8) Eliminar registros de referidos donde participa el usuario
    DELETE FROM REFERIDO
    WHERE id_usuario_referidor = p_id_usuario
       OR id_usuario_nuevo = p_id_usuario;

    -- 9) Eliminar el usuario
    DELETE FROM USUARIO WHERE id_usuario = p_id_usuario;

    COMMIT;

    p_mensaje := 'Cuenta eliminada exitosamente. ID usuario: ' || p_id_usuario;
    DBMS_OUTPUT.PUT_LINE(p_mensaje);

EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        p_mensaje := 'Error en SP_ELIMINAR_CUENTA: ' || SQLERRM;
        DBMS_OUTPUT.PUT_LINE(p_mensaje);
        RAISE_APPLICATION_ERROR(-20031, 'Error al eliminar la cuenta: ' || SQLERRM);
END;


-- ============================================================
-- 4. Permisos de ejecución sobre los procedimientos
-- ============================================================
GRANT EXECUTE ON SP_REGISTRAR_CLIENTE       TO ROL_ADMIN;
GRANT EXECUTE ON SP_REGISTRAR_CLIENTE       TO ROL_SOPORTE;
GRANT EXECUTE ON SP_RENOVAR_SUSCRIPCIONES   TO ROL_ADMIN;
GRANT EXECUTE ON SP_RENOVAR_SUSCRIPCIONES   TO ROL_SOPORTE;
GRANT EXECUTE ON SP_ELIMINAR_CUENTA         TO ROL_ADMIN;
GRANT EXECUTE ON SP_ELIMINAR_CUENTA         TO ROL_SOPORTE;

COMMIT;


-- ============================================================
-- 5. Ejemplos de uso
-- ============================================================
/*
-- Registrar un nuevo cliente
DECLARE
    v_id  NUMBER;
    v_msg VARCHAR2(500);
BEGIN
    SP_REGISTRAR_CLIENTE(
        p_nombre           => 'Laura Gomez',
        p_email            => 'laura.gomez@email.com',
        p_telefono         => '3001234567',
        p_fecha_nacimiento => DATE '1995-03-15',
        p_id_ciudad        => 1,
        p_id_plan          => 1,
        p_id_referidor     => NULL,
        p_perfil_nombre    => 'Laura',
        p_perfil_tipo      => 'ADULTO',
        p_metodo_pago      => 'PSE',
        p_id_usuario       => v_id,
        p_mensaje          => v_msg
    );
    DBMS_OUTPUT.PUT_LINE(v_msg);
END;

-- Renovar suscripciones activas
DECLARE
    v_renov NUMBER;
    v_err   NUMBER;
    v_msg   VARCHAR2(500);
BEGIN
    SP_RENOVAR_SUSCRIPCIONES(
        p_renovaciones => v_renov,
        p_errores      => v_err,
        p_mensaje      => v_msg
    );
    DBMS_OUTPUT.PUT_LINE(v_msg);
END;

-- Eliminar una cuenta existente
DECLARE
    v_msg VARCHAR2(500);
BEGIN
    SP_ELIMINAR_CUENTA(
        p_id_usuario => 1,
        p_mensaje    => v_msg
    );
    DBMS_OUTPUT.PUT_LINE(v_msg);
END;
*/

-- ============================================================
-- FIN DEL SCRIPT DE TRANSACCIONES
-- ============================================================

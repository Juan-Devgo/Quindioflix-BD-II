-- ============================================================
-- QUINDIOFLIX - PROCEDIMIENTOS CON CURSORES
-- Versión: 1.0
-- ============================================================
-- Procedimientos basados en cursores:
-- a) SP_REPORTE_MOROSIDAD      – escanea usuarios con suscripción
-- vencida (+30 días sin pago) y genera reporte detallado.
-- b) SP_ACTUALIZAR_POPULARIDAD – escanea el catálogo y actualiza
-- la popularidad de cada contenido según vistas completas.
-- ============================================================

-- SET SERVEROUTPUT ON;

-- ============================================================
-- 0. Preparación: agregar columna popularidad a CONTENIDO
-- (si no existe, para soportar el procedimiento de popularidad)
-- ============================================================
BEGIN
    EXECUTE IMMEDIATE 'ALTER TABLE CONTENIDO ADD popularidad NUMBER DEFAULT 0';
    DBMS_OUTPUT.PUT_LINE('Columna popularidad agregada a CONTENIDO.');
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Nota: ' || SQLERRM);
END;


-- ============================================================
-- a) SP_REPORTE_MOROSIDAD
-- Cursor explicito que recorre los usuarios cuya suscripcion
-- lleva mas de 30 dias vencida y no tienen un pago exitoso
-- posterior a la fecha de vencimiento.
--
-- OUT params para backend:
-- - p_reporte        : SYS_REFCURSOR con los datos del reporte
-- - p_total_morosos: total de usuarios morosos
-- - p_monto_total  : monto total adeudado
-- - p_mensaje      : mensaje resumen
--
-- Genera un reporte por consola con:
-- - nombre del usuario
-- - correo electronico
-- - plan contratado
-- - dias de mora (dias transcurridos desde la fecha de vencimiento)
-- - monto adeudado (precio mensual del plan multiplicado por
-- los meses vencidos completos)
-- ============================================================
CREATE OR REPLACE PROCEDURE SP_REPORTE_MOROSIDAD (
    p_reporte       OUT SYS_REFCURSOR,
    p_total_morosos OUT NUMBER,
    p_monto_total   OUT NUMBER,
    p_mensaje       OUT VARCHAR2
) IS
    CURSOR c_morosos IS
        SELECT
            u.id_usuario,
            u.nombre,
            u.email,
            ps.nombre   AS nombre_plan,
            ps.precio_mensual,
            u.fecha_vencimiento,
            TRUNC(SYSDATE - u.fecha_vencimiento) AS dias_mora
        FROM USUARIO u
        JOIN PLAN_SUSCRIPCION ps ON u.id_plan = ps.id_plan
        WHERE u.fecha_vencimiento IS NOT NULL
          AND u.fecha_vencimiento + 30 < SYSDATE
          AND NOT EXISTS (
              SELECT 1
              FROM PAGO p
              WHERE p.id_usuario = u.id_usuario
                AND p.estado_pago = 'EXITOSO'
                AND p.fecha_pago > u.fecha_vencimiento
          )
        ORDER BY dias_mora DESC;

    v_total_morosos NUMBER := 0;
    v_monto_total   NUMBER(10,2) := 0;
    v_monto_adeudado NUMBER(10,2);
BEGIN
    DBMS_OUTPUT.PUT_LINE('============================================================');
    DBMS_OUTPUT.PUT_LINE('  REPORTE DE MOROSIDAD - SUSCRIPCIONES VENCIDAS > 30 DIAS');
    DBMS_OUTPUT.PUT_LINE('  Fecha de generacion: ' || TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS'));
    DBMS_OUTPUT.PUT_LINE('============================================================');
    DBMS_OUTPUT.PUT_LINE(
        RPAD('NOMBRE', 25) || ' | ' ||
        RPAD('EMAIL', 30) || ' | ' ||
        RPAD('PLAN', 15) || ' | ' ||
        LPAD('DIAS MORA', 10) || ' | ' ||
        LPAD('MONTO ADEUDADO', 15)
    );
    DBMS_OUTPUT.PUT_LINE(RPAD('-', 105, '-'));

    OPEN p_reporte FOR
        SELECT
            u.id_usuario,
            u.nombre,
            u.email,
            ps.nombre   AS nombre_plan,
            ps.precio_mensual,
            u.fecha_vencimiento,
            TRUNC(SYSDATE - u.fecha_vencimiento) AS dias_mora,
            CEIL(TRUNC(SYSDATE - u.fecha_vencimiento) / 30.0) * ps.precio_mensual AS monto_adeudado
        FROM USUARIO u
        JOIN PLAN_SUSCRIPCION ps ON u.id_plan = ps.id_plan
        WHERE u.fecha_vencimiento IS NOT NULL
          AND u.fecha_vencimiento + 30 < SYSDATE
          AND NOT EXISTS (
              SELECT 1
              FROM PAGO p
              WHERE p.id_usuario = u.id_usuario
                AND p.estado_pago = 'EXITOSO'
                AND p.fecha_pago > u.fecha_vencimiento
          )
        ORDER BY dias_mora DESC;

    FOR r_moroso IN c_morosos LOOP
        -- Monto adeudado = precio mensual x meses vencidos completos (minimo 1)
        v_monto_adeudado := CEIL(r_moroso.dias_mora / 30.0) * r_moroso.precio_mensual;

        DBMS_OUTPUT.PUT_LINE(
            RPAD(SUBSTR(r_moroso.nombre, 1, 25), 25) || ' | ' ||
            RPAD(SUBSTR(r_moroso.email, 1, 30), 30) || ' | ' ||
            RPAD(r_moroso.nombre_plan, 15) || ' | ' ||
            LPAD(r_moroso.dias_mora, 10) || ' | ' ||
            LPAD(TO_CHAR(v_monto_adeudado, 'FM$999,999,990.00'), 15)
        );

        v_total_morosos := v_total_morosos + 1;
        v_monto_total   := v_monto_total + v_monto_adeudado;
    END LOOP;

    DBMS_OUTPUT.PUT_LINE(RPAD('-', 105, '-'));
    DBMS_OUTPUT.PUT_LINE('Total de usuarios morosos: ' || v_total_morosos);
    DBMS_OUTPUT.PUT_LINE('Monto total adeudado:      ' || TO_CHAR(v_monto_total, 'FM$999,999,990.00'));
    DBMS_OUTPUT.PUT_LINE('============================================================');

    p_total_morosos := v_total_morosos;
    p_monto_total   := v_monto_total;
    p_mensaje := 'Reporte de morosidad generado. Morosos: ' || v_total_morosos ||
                 ', Monto total: ' || TO_CHAR(v_monto_total, 'FM$999,999,990.00');
    DBMS_OUTPUT.PUT_LINE(p_mensaje);

    IF v_total_morosos = 0 THEN
        DBMS_OUTPUT.PUT_LINE('No se encontraron usuarios con morosidad superior a 30 dias.');
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        p_mensaje := 'Error en SP_REPORTE_MOROSIDAD: ' || SQLERRM;
        DBMS_OUTPUT.PUT_LINE(p_mensaje);
        RAISE_APPLICATION_ERROR(-20060, 'Error al generar reporte de morosidad: ' || SQLERRM);
END;


-- ============================================================
-- b) SP_ACTUALIZAR_POPULARIDAD
-- Cursor explicito que recorre todo el catalogo de contenidos
-- y, para cada uno, cuenta cuantas reproducciones completas
-- (porcentaje_avance >= 90 %) ha tenido.
--
-- OUT params para backend:
-- - p_total_actualizados : cantidad de registros actualizados
-- - p_mensaje          : mensaje resumen
--
-- Se consideran:
-- · Contenido directo (pelicula, documental, musica):
-- reproducciones con id_contenido = c.id_contenido.
-- · Contenido por episodios (serie, podcast):
-- reproducciones de episodios que pertenezcan a temporadas
-- del contenido.
--
-- Actualiza el campo CONTENIDO.popularidad con el total de
-- vistas completas y genera un resumen por consola.
-- ============================================================
CREATE OR REPLACE PROCEDURE SP_ACTUALIZAR_POPULARIDAD (
    p_total_actualizados OUT NUMBER,
    p_mensaje            OUT VARCHAR2
) IS
    CURSOR c_contenido IS
        SELECT
            c.id_contenido,
            c.titulo,
            c.tipo
        FROM CONTENIDO c
        ORDER BY c.id_contenido;

    v_vistas_completas   NUMBER;
    v_total_actualizados NUMBER := 0;
BEGIN
    DBMS_OUTPUT.PUT_LINE('============================================================');
    DBMS_OUTPUT.PUT_LINE('  ACTUALIZACION DE POPULARIDAD DEL CATALOGO');
    DBMS_OUTPUT.PUT_LINE('  Fecha de ejecucion: ' || TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS'));
    DBMS_OUTPUT.PUT_LINE('============================================================');

    FOR r_cont IN c_contenido LOOP
        -- Contar reproducciones completas (>= 90 %) para este contenido
        SELECT COUNT(*)
        INTO v_vistas_completas
        FROM (
            -- Reproducciones directas del contenido (pelicula, documental, musica)
            SELECT r.id_reproduccion
            FROM REPRODUCCION r
            WHERE r.id_contenido = r_cont.id_contenido
              AND r.porcentaje_avance >= 90

            UNION ALL

            -- Reproducciones de episodios de serie / podcast
            SELECT r.id_reproduccion
            FROM REPRODUCCION r
            JOIN EPISODIO e   ON r.id_episodio = e.id_episodio
            JOIN TEMPORADA t  ON e.id_temporada = t.id_temporada
            WHERE t.id_contenido = r_cont.id_contenido
              AND r.porcentaje_avance >= 90
        );

        -- Actualizar campo popularidad
        UPDATE CONTENIDO
        SET popularidad = v_vistas_completas
        WHERE id_contenido = r_cont.id_contenido;

        v_total_actualizados := v_total_actualizados + 1;

        DBMS_OUTPUT.PUT_LINE(
            'Contenido: ' || RPAD(SUBSTR(r_cont.titulo, 1, 40), 40) ||
            ' | Tipo: ' || RPAD(r_cont.tipo, 12) ||
            ' | Vistas completas: ' || LPAD(v_vistas_completas, 6)
        );
    END LOOP;

    COMMIT;

    p_total_actualizados := v_total_actualizados;
    p_mensaje := 'Actualizacion de popularidad completada. Registros actualizados: ' || v_total_actualizados;

    DBMS_OUTPUT.PUT_LINE('============================================================');
    DBMS_OUTPUT.PUT_LINE('Total de registros actualizados: ' || v_total_actualizados);
    DBMS_OUTPUT.PUT_LINE(p_mensaje);
    DBMS_OUTPUT.PUT_LINE('============================================================');

EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        p_mensaje := 'Error en SP_ACTUALIZAR_POPULARIDAD: ' || SQLERRM;
        DBMS_OUTPUT.PUT_LINE(p_mensaje);
        RAISE_APPLICATION_ERROR(-20061, 'Error al actualizar popularidad del catalogo: ' || SQLERRM);
END;


-- ============================================================
-- Permisos de ejecución
-- ============================================================
GRANT EXECUTE ON SP_REPORTE_MOROSIDAD TO ROL_ADMIN;
GRANT EXECUTE ON SP_REPORTE_MOROSIDAD TO ROL_SOPORTE;
GRANT EXECUTE ON SP_REPORTE_MOROSIDAD TO ROL_ANALISTA;

GRANT EXECUTE ON SP_ACTUALIZAR_POPULARIDAD TO ROL_ADMIN;
GRANT EXECUTE ON SP_ACTUALIZAR_POPULARIDAD TO ROL_CONTENIDO;
GRANT EXECUTE ON SP_ACTUALIZAR_POPULARIDAD TO ROL_ANALISTA;

COMMIT;


-- ============================================================
-- Ejemplos de uso (descomentar para ejecutar)
-- ============================================================
/*
-- Generar reporte de morosidad
DECLARE
    v_cursor SYS_REFCURSOR;
    v_total  NUMBER;
    v_monto  NUMBER;
    v_msg    VARCHAR2(500);
BEGIN
    SP_REPORTE_MOROSIDAD(
        p_reporte       => v_cursor,
        p_total_morosos => v_total,
        p_monto_total   => v_monto,
        p_mensaje       => v_msg
    );
    DBMS_OUTPUT.PUT_LINE(v_msg);
END;

-- Actualizar popularidad del catalogo
DECLARE
    v_total NUMBER;
    v_msg   VARCHAR2(500);
BEGIN
    SP_ACTUALIZAR_POPULARIDAD(
        p_total_actualizados => v_total,
        p_mensaje            => v_msg
    );
    DBMS_OUTPUT.PUT_LINE(v_msg);
END;
*/

-- ============================================================
-- FIN DEL SCRIPT DE CURSORES
-- ============================================================

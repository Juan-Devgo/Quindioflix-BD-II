-- ============================================================
-- QUINDIOFLIX - VISTAS MATERIALIZADAS
-- Versión: 1.0
-- ============================================================
-- Este script crea las vistas materializadas para reportes
-- analíticos de la plataforma QuindioFlix:
-- a) MV_CONTENIDO_POPULAR   – Reproducciones y calificación promedio
-- por contenido. Base para el reporte "Contenido Mas Popular".
-- b) MV_INGRESOS_MENSUAL    – Ingresos mensuales por ciudad y plan.
-- Base para el reporte financiero mensual.
-- ============================================================

-- SET SERVEROUTPUT ON;

-- ============================================================
-- a) MV_CONTENIDO_POPULAR
-- Pre-calcula el número total de reproducciones y la
-- calificación promedio para cada pieza de contenido.
-- Soporta contenido directo (película/documental/música)
-- y contenido por episodios (serie/podcast).
-- ============================================================
CREATE MATERIALIZED VIEW MV_CONTENIDO_POPULAR
BUILD IMMEDIATE
REFRESH COMPLETE ON DEMAND
AS
SELECT
    c.id_contenido,
    c.titulo,
    c.tipo,
    c.anio_lanzamiento,
    c.clasificacion_edad,
    COALESCE(v.total_reproducciones, 0) AS total_reproducciones,
    cal.promedio_calificacion
FROM CONTENIDO c
LEFT JOIN (
    SELECT id_contenido, COUNT(*) AS total_reproducciones
    FROM (
        SELECT id_contenido
        FROM REPRODUCCION
        WHERE id_contenido IS NOT NULL
        UNION ALL
        SELECT t.id_contenido
        FROM REPRODUCCION r
        JOIN EPISODIO e ON r.id_episodio = e.id_episodio
        JOIN TEMPORADA t ON e.id_temporada = t.id_temporada
    )
    GROUP BY id_contenido
) v ON v.id_contenido = c.id_contenido
LEFT JOIN (
    SELECT id_contenido, AVG(estrellas) AS promedio_calificacion
    FROM CALIFICACION
    GROUP BY id_contenido
) cal ON cal.id_contenido = c.id_contenido;

COMMENT ON MATERIALIZED VIEW MV_CONTENIDO_POPULAR IS
'Pre-calcula el numero total de reproducciones y la calificacion promedio por contenido. Base para el reporte "Contenido Mas Popular".';


-- ============================================================
-- b) MV_INGRESOS_MENSUAL
-- Pre-calcula los ingresos mensuales agrupados por ciudad
-- y plan de suscripción. Solo considera pagos exitosos.
-- ============================================================
CREATE MATERIALIZED VIEW MV_INGRESOS_MENSUAL
BUILD IMMEDIATE
REFRESH COMPLETE ON DEMAND
AS
SELECT
    TRUNC(p.fecha_pago, 'MM') AS mes,
    c.id_ciudad,
    NVL(c.nombre, 'Sin ciudad') AS nombre_ciudad,
    ps.id_plan,
    ps.nombre AS nombre_plan,
    SUM(p.monto) AS total_ingresos,
    COUNT(*) AS cantidad_pagos
FROM PAGO p
JOIN USUARIO u ON p.id_usuario = u.id_usuario
LEFT JOIN CIUDAD c ON u.id_ciudad = c.id_ciudad
JOIN PLAN_SUSCRIPCION ps ON p.id_plan = ps.id_plan
WHERE p.estado_pago = 'EXITOSO'
GROUP BY TRUNC(p.fecha_pago, 'MM'),
         c.id_ciudad,
         NVL(c.nombre, 'Sin ciudad'),
         ps.id_plan,
         ps.nombre;

COMMENT ON MATERIALIZED VIEW MV_INGRESOS_MENSUAL IS
'Pre-calcula los ingresos mensuales por ciudad y plan de suscripcion. Base para el reporte financiero mensual.';


-- ============================================================
-- ÍNDICES sobre las vistas materializadas (reportes analíticos)
-- ============================================================

-- Índices para MV_CONTENIDO_POPULAR
CREATE INDEX idx_mv_popular_reproducciones ON MV_CONTENIDO_POPULAR(total_reproducciones DESC);
CREATE INDEX idx_mv_popular_calificacion   ON MV_CONTENIDO_POPULAR(promedio_calificacion DESC);
CREATE INDEX idx_mv_popular_contenido    ON MV_CONTENIDO_POPULAR(id_contenido);

-- Índices para MV_INGRESOS_MENSUAL
CREATE INDEX idx_mv_ingresos_mes    ON MV_INGRESOS_MENSUAL(mes);
CREATE INDEX idx_mv_ingresos_ciudad ON MV_INGRESOS_MENSUAL(id_ciudad);
CREATE INDEX idx_mv_ingresos_plan   ON MV_INGRESOS_MENSUAL(id_plan);


-- ============================================================
-- Permisos de lectura para los roles de reportes
-- ============================================================
GRANT SELECT ON MV_CONTENIDO_POPULAR TO ROL_ANALISTA;
GRANT SELECT ON MV_CONTENIDO_POPULAR TO ROL_ADMIN;

GRANT SELECT ON MV_INGRESOS_MENSUAL  TO ROL_ANALISTA;
GRANT SELECT ON MV_INGRESOS_MENSUAL  TO ROL_ADMIN;


-- ============================================================
-- c) SP_REFRESH_MV_REPORTES
-- Refresca ambas vistas materializadas y reporta el estado.
-- OUT params para backend:
-- - p_contenido_ok   : 'S' si MV_CONTENIDO_POPULAR se refresco
-- - p_ingresos_ok    : 'S' si MV_INGRESOS_MENSUAL se refresco
-- - p_mensaje        : mensaje resumen
-- ============================================================
CREATE OR REPLACE PROCEDURE SP_REFRESH_MV_REPORTES (
    p_contenido_ok OUT CHAR,
    p_ingresos_ok  OUT CHAR,
    p_mensaje      OUT VARCHAR2
) IS
BEGIN
    p_contenido_ok := 'N';
    p_ingresos_ok  := 'N';

    DBMS_MVIEW.REFRESH('MV_CONTENIDO_POPULAR', 'C');
    p_contenido_ok := 'S';
    DBMS_OUTPUT.PUT_LINE('MV_CONTENIDO_POPULAR refrescada correctamente.');

    DBMS_MVIEW.REFRESH('MV_INGRESOS_MENSUAL', 'C');
    p_ingresos_ok := 'S';
    DBMS_OUTPUT.PUT_LINE('MV_INGRESOS_MENSUAL refrescada correctamente.');

    p_mensaje := 'Vistas materializadas refrescadas exitosamente.';
    DBMS_OUTPUT.PUT_LINE(p_mensaje);

EXCEPTION
    WHEN OTHERS THEN
        p_mensaje := 'Error refrescando vistas materializadas: ' || SQLERRM;
        DBMS_OUTPUT.PUT_LINE(p_mensaje);
        RAISE_APPLICATION_ERROR(-20090, p_mensaje);
END;

GRANT EXECUTE ON SP_REFRESH_MV_REPORTES TO ROL_ADMIN;
GRANT EXECUTE ON SP_REFRESH_MV_REPORTES TO ROL_ANALISTA;


COMMIT;


-- ============================================================
-- FIN DEL SCRIPT DE VISTAS MATERIALIZADAS
-- ============================================================

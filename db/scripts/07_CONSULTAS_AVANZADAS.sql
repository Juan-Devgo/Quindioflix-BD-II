-- ============================================================
--  QUINDIOFLIX - CONSULTAS AVANZADAS (Procedimientos almacenados)
--  Autores:
-- 		Juan Sebastián Londoño Ramírez
-- 		Juan Diego García Nieto 
--  Versión: 1.0
-- ============================================================
--  Contenido:
--   3.1.1  Consultas parametrizadas      (&, &&, DEFINE)
--   3.1.2  Tablas de cruzamiento         (PIVOT / UNPIVOT)
--   3.1.3  Funciones avanzadas de GROUP BY
-- ============================================================

SET SERVEROUTPUT ON;

-- ============================================================
--  3.1.1 CONSULTAS PARAMETRIZADAS
-- ============================================================

-- ------------------------------------------------------------
-- a) Top 10 contenidos más vistos en una ciudad
-- Parámetro: p_ciudad (VARCHAR2)
-- ------------------------------------------------------------
CREATE OR REPLACE PROCEDURE SP_TOP_10_CONTENIDOS_CIUDAD (
    p_ciudad IN VARCHAR2,
    p_cursor OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN p_cursor FOR
        SELECT COALESCE(c.titulo, c2.titulo) as contenido,
               COUNT(*) as total_reproducciones
        FROM REPRODUCCION r
        JOIN PERFIL p ON r.id_perfil = p.id_perfil
        JOIN USUARIO u ON p.id_usuario = u.id_usuario
        JOIN CIUDAD ci ON u.id_ciudad = ci.id_ciudad
        LEFT JOIN CONTENIDO c ON r.id_contenido = c.id_contenido
        LEFT JOIN EPISODIO e ON r.id_episodio = e.id_episodio
        LEFT JOIN TEMPORADA t ON e.id_temporada = t.id_temporada
        LEFT JOIN CONTENIDO c2 ON t.id_contenido = c2.id_contenido
        WHERE ci.nombre = p_ciudad
        GROUP BY COALESCE(c.titulo, c2.titulo)
        ORDER BY total_reproducciones DESC
        FETCH FIRST 10 ROWS ONLY;
END;
/

-- ------------------------------------------------------------
-- b) Ingresos por plan de suscripción para un mes y año
-- Parámetros: p_mes (NUMBER), p_anio (NUMBER)
-- ------------------------------------------------------------
CREATE OR REPLACE PROCEDURE SP_INGRESOS_POR_PLAN_MES_ANIO (
    p_mes   IN NUMBER,
    p_anio  IN NUMBER,
    p_cursor OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN p_cursor FOR
        SELECT ps.nombre as plan_suscripcion,
               SUM(p.monto) as ingresos_totales,
               COUNT(*) as cantidad_pagos
        FROM PAGO p
        JOIN PLAN_SUSCRIPCION ps ON p.id_plan = ps.id_plan
        WHERE EXTRACT(MONTH FROM p.fecha_pago) = p_mes
          AND EXTRACT(YEAR FROM p.fecha_pago) = p_anio
          AND p.estado_pago = 'EXITOSO'
        GROUP BY ps.nombre
        ORDER BY ingresos_totales DESC;
END;
/

-- ------------------------------------------------------------
-- c) Calificación promedio por categoría para un género
-- Parámetro: p_genero (VARCHAR2)
-- ------------------------------------------------------------
CREATE OR REPLACE PROCEDURE SP_CALIFICACION_PROMEDIO_GENERO (
    p_genero IN VARCHAR2,
    p_cursor OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN p_cursor FOR
        SELECT c.tipo as categoria,
               ROUND(AVG(cal.estrellas), 2) as promedio_estrellas,
               COUNT(*) as total_calificaciones
        FROM CALIFICACION cal
        JOIN CONTENIDO c ON cal.id_contenido = c.id_contenido
        JOIN CONTENIDO_GENERO cg ON c.id_contenido = cg.id_contenido
        JOIN GENERO g ON cg.id_genero = g.id_genero
        WHERE g.nombre = p_genero
        GROUP BY c.tipo
        ORDER BY promedio_estrellas DESC;
END;
/

-- ------------------------------------------------------------
-- c.2) Total de contenidos por calificación para un género
--      (Consulta complementaria que reutiliza el género)
-- Parámetro: p_genero (VARCHAR2)
-- ------------------------------------------------------------
CREATE OR REPLACE PROCEDURE SP_CALIFICACIONES_POR_GENERO (
    p_genero IN VARCHAR2,
    p_cursor OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN p_cursor FOR
        SELECT c.tipo as categoria,
               cal.estrellas,
               COUNT(*) as cantidad
        FROM CALIFICACION cal
        JOIN CONTENIDO c ON cal.id_contenido = c.id_contenido
        JOIN CONTENIDO_GENERO cg ON c.id_contenido = cg.id_contenido
        JOIN GENERO g ON cg.id_genero = g.id_genero
        WHERE g.nombre = p_genero
        GROUP BY c.tipo, cal.estrellas
        ORDER BY c.tipo, cal.estrellas DESC;
END;
/


-- ============================================================
--  3.1.2 TABLAS DE CRUZAMIENTO – PIVOT Y UNPIVOT
-- ============================================================

-- ------------------------------------------------------------
-- a) PIVOT: Usuarios activos por ciudad (filas) y plan (columnas)
-- ------------------------------------------------------------
CREATE OR REPLACE PROCEDURE SP_USUARIOS_ACTIVOS_PIVOT (
    p_cursor OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN p_cursor FOR
        SELECT *
        FROM (
            SELECT ci.nombre as ciudad, ps.nombre as plan, u.id_usuario
            FROM USUARIO u
            JOIN CIUDAD ci ON u.id_ciudad = ci.id_ciudad
            JOIN PLAN_SUSCRIPCION ps ON u.id_plan = ps.id_plan
            WHERE u.estado = 'ACTIVO'
        )
        PIVOT (
            COUNT(id_usuario) as usuarios
            FOR plan IN ('Básico' AS Básico, 'Estándar' AS Estándar, 'Premium' AS Premium)
        )
        ORDER BY ciudad;
END;
/

-- ------------------------------------------------------------
-- b) PIVOT: Total de vistas por categoría (filas) y dispositivo (columnas)
-- ------------------------------------------------------------
CREATE OR REPLACE PROCEDURE SP_VISTAS_CATEGORIA_DISPOSITIVO_PIVOT (
    p_cursor OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN p_cursor FOR
        WITH vistas_contenido AS (
            SELECT 
                COALESCE(c.tipo, c2.tipo) as categoria,
                r.dispositivo
            FROM REPRODUCCION r
            LEFT JOIN CONTENIDO c ON r.id_contenido = c.id_contenido
            LEFT JOIN EPISODIO e ON r.id_episodio = e.id_episodio
            LEFT JOIN TEMPORADA t ON e.id_temporada = t.id_temporada
            LEFT JOIN CONTENIDO c2 ON t.id_contenido = c2.id_contenido
        )
        SELECT *
        FROM vistas_contenido
        PIVOT (
            COUNT(*) as vistas
            FOR dispositivo IN ('CELULAR' AS Celular, 'TABLET' AS Tablet, 'TV' AS TV, 'COMPUTADOR' AS Computador)
        )
        ORDER BY categoria;
END;
/

-- ------------------------------------------------------------
-- c) UNPIVOT: Convertir el reporte PIVOT de usuarios activos
--    de nuevo a filas para análisis detallado.
-- ------------------------------------------------------------
CREATE OR REPLACE PROCEDURE SP_USUARIOS_ACTIVOS_UNPIVOT (
    p_cursor OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN p_cursor FOR
        WITH reporte_pivotado AS (
            SELECT *
            FROM (
                SELECT ci.nombre as ciudad, ps.nombre as plan, u.id_usuario
                FROM USUARIO u
                JOIN CIUDAD ci ON u.id_ciudad = ci.id_ciudad
                JOIN PLAN_SUSCRIPCION ps ON u.id_plan = ps.id_plan
                WHERE u.estado = 'ACTIVO'
            )
            PIVOT (
                COUNT(id_usuario) as usuarios
                FOR plan IN ('Básico' AS Básico, 'Estándar' AS Estándar, 'Premium' AS Premium)
            )
        )
        SELECT ciudad, plan, usuarios_activos
        FROM reporte_pivotado
        UNPIVOT (
            usuarios_activos
            FOR plan IN (Básico, Estándar, Premium)
        )
        ORDER BY ciudad, plan;
END;
/

-- ------------------------------------------------------------
-- d) UNPIVOT: Convertir un resumen mensual con columnas por
--    mes (Enero, Febrero, Marzo) en filas individuales.
-- ------------------------------------------------------------
CREATE OR REPLACE PROCEDURE SP_RESUMEN_MENSUAL_UNPIVOT (
    p_cursor OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN p_cursor FOR
        WITH resumen_mensual AS (
            SELECT 
                ps.nombre as plan,
                SUM(CASE WHEN EXTRACT(MONTH FROM p.fecha_pago) = 1 THEN p.monto ELSE 0 END) as Enero,
                SUM(CASE WHEN EXTRACT(MONTH FROM p.fecha_pago) = 2 THEN p.monto ELSE 0 END) as Febrero,
                SUM(CASE WHEN EXTRACT(MONTH FROM p.fecha_pago) = 3 THEN p.monto ELSE 0 END) as Marzo
            FROM PAGO p
            JOIN PLAN_SUSCRIPCION ps ON p.id_plan = ps.id_plan
            WHERE p.estado_pago = 'EXITOSO'
              AND EXTRACT(YEAR FROM p.fecha_pago) = 2024
            GROUP BY ps.nombre
        )
        SELECT plan, mes, ingresos
        FROM resumen_mensual
        UNPIVOT (
            ingresos
            FOR mes IN (Enero, Febrero, Marzo)
        )
        ORDER BY plan, mes;
END;
/


-- ============================================================
--  3.1.3 FUNCIONES AVANZADAS DE GROUP BY
-- ============================================================

-- ------------------------------------------------------------
-- a) ROLLUP: Ingresos por ciudad y plan, con subtotales por
--    ciudad y total general.
-- ------------------------------------------------------------
CREATE OR REPLACE PROCEDURE SP_INGRESOS_ROLLUP (
    p_cursor OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN p_cursor FOR
        SELECT 
            ci.nombre as ciudad,
            ps.nombre as plan,
            SUM(p.monto) as ingresos,
            COUNT(*) as cantidad_pagos
        FROM PAGO p
        JOIN USUARIO u ON p.id_usuario = u.id_usuario
        JOIN CIUDAD ci ON u.id_ciudad = ci.id_ciudad
        JOIN PLAN_SUSCRIPCION ps ON p.id_plan = ps.id_plan
        WHERE p.estado_pago = 'EXITOSO'
        GROUP BY ROLLUP(ci.nombre, ps.nombre)
        ORDER BY ci.nombre, ps.nombre;
END;
/

-- ------------------------------------------------------------
-- b) CUBE: Vistas por categoría de contenido y dispositivo,
--    incluyendo todas las combinaciones posibles.
-- ------------------------------------------------------------
CREATE OR REPLACE PROCEDURE SP_VISTAS_CUBE (
    p_cursor OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN p_cursor FOR
        WITH vistas_contenido AS (
            SELECT 
                COALESCE(c.tipo, c2.tipo) as categoria,
                r.dispositivo
            FROM REPRODUCCION r
            LEFT JOIN CONTENIDO c ON r.id_contenido = c.id_contenido
            LEFT JOIN EPISODIO e ON r.id_episodio = e.id_episodio
            LEFT JOIN TEMPORADA t ON e.id_temporada = t.id_temporada
            LEFT JOIN CONTENIDO c2 ON t.id_contenido = c2.id_contenido
        )
        SELECT 
            categoria,
            dispositivo,
            COUNT(*) as total_vistas
        FROM vistas_contenido
        GROUP BY CUBE(categoria, dispositivo)
        ORDER BY categoria, dispositivo;
END;
/

-- ------------------------------------------------------------
-- c) GROUPING(): Reemplazar los NULL generados por ROLLUP/CUBE
--    con etiquetas legibles.
-- ------------------------------------------------------------
CREATE OR REPLACE PROCEDURE SP_INGRESOS_GROUPING (
    p_cursor OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN p_cursor FOR
        SELECT 
            CASE WHEN GROUPING(ci.nombre) = 1 THEN '** TODAS LAS CIUDADES **' ELSE ci.nombre END as ciudad,
            CASE WHEN GROUPING(ps.nombre) = 1 THEN '** TODOS LOS PLANES **' ELSE ps.nombre END as plan,
            SUM(p.monto) as ingresos,
            GROUPING(ci.nombre) as flag_ciudad,
            GROUPING(ps.nombre) as flag_plan
        FROM PAGO p
        JOIN USUARIO u ON p.id_usuario = u.id_usuario
        JOIN CIUDAD ci ON u.id_ciudad = ci.id_ciudad
        JOIN PLAN_SUSCRIPCION ps ON p.id_plan = ps.id_plan
        WHERE p.estado_pago = 'EXITOSO'
        GROUP BY ROLLUP(ci.nombre, ps.nombre)
        ORDER BY GROUPING(ci.nombre), GROUPING(ps.nombre), ci.nombre, ps.nombre;
END;
/

-- ------------------------------------------------------------
-- d) GROUPING SETS: Totales únicamente por categoría y por
--    ciudad, sin el detalle de la cruza entre ambas.
-- ------------------------------------------------------------
CREATE OR REPLACE PROCEDURE SP_VISTAS_GROUPING_SETS (
    p_cursor OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN p_cursor FOR
        WITH vistas_contenido AS (
            SELECT 
                COALESCE(c.tipo, c2.tipo) as categoria,
                ci.nombre as ciudad
            FROM REPRODUCCION r
            JOIN PERFIL p ON r.id_perfil = p.id_perfil
            JOIN USUARIO u ON p.id_usuario = u.id_usuario
            JOIN CIUDAD ci ON u.id_ciudad = ci.id_ciudad
            LEFT JOIN CONTENIDO c ON r.id_contenido = c.id_contenido
            LEFT JOIN EPISODIO e ON r.id_episodio = e.id_episodio
            LEFT JOIN TEMPORADA t ON e.id_temporada = t.id_temporada
            LEFT JOIN CONTENIDO c2 ON t.id_contenido = c2.id_contenido
        )
        SELECT 
            CASE WHEN GROUPING(categoria) = 1 THEN '** TODAS LAS CATEGORIAS **' ELSE categoria END as categoria,
            CASE WHEN GROUPING(ciudad) = 1 THEN '** TODAS LAS CIUDADES **' ELSE ciudad END as ciudad,
            COUNT(*) as total_vistas
        FROM vistas_contenido
        GROUP BY GROUPING SETS ((categoria), (ciudad))
        ORDER BY categoria, ciudad;
END;
/


-- ============================================================
--  Permisos de ejecución
-- ============================================================
GRANT EXECUTE ON SP_TOP_10_CONTENIDOS_CIUDAD TO ROL_ANALISTA;
GRANT EXECUTE ON SP_TOP_10_CONTENIDOS_CIUDAD TO ROL_ADMIN;

GRANT EXECUTE ON SP_INGRESOS_POR_PLAN_MES_ANIO TO ROL_ANALISTA;
GRANT EXECUTE ON SP_INGRESOS_POR_PLAN_MES_ANIO TO ROL_ADMIN;

GRANT EXECUTE ON SP_CALIFICACION_PROMEDIO_GENERO TO ROL_ANALISTA;
GRANT EXECUTE ON SP_CALIFICACION_PROMEDIO_GENERO TO ROL_ADMIN;

GRANT EXECUTE ON SP_CALIFICACIONES_POR_GENERO TO ROL_ANALISTA;
GRANT EXECUTE ON SP_CALIFICACIONES_POR_GENERO TO ROL_ADMIN;

GRANT EXECUTE ON SP_USUARIOS_ACTIVOS_PIVOT TO ROL_ANALISTA;
GRANT EXECUTE ON SP_USUARIOS_ACTIVOS_PIVOT TO ROL_ADMIN;

GRANT EXECUTE ON SP_VISTAS_CATEGORIA_DISPOSITIVO_PIVOT TO ROL_ANALISTA;
GRANT EXECUTE ON SP_VISTAS_CATEGORIA_DISPOSITIVO_PIVOT TO ROL_ADMIN;

GRANT EXECUTE ON SP_USUARIOS_ACTIVOS_UNPIVOT TO ROL_ANALISTA;
GRANT EXECUTE ON SP_USUARIOS_ACTIVOS_UNPIVOT TO ROL_ADMIN;

GRANT EXECUTE ON SP_RESUMEN_MENSUAL_UNPIVOT TO ROL_ANALISTA;
GRANT EXECUTE ON SP_RESUMEN_MENSUAL_UNPIVOT TO ROL_ADMIN;

GRANT EXECUTE ON SP_INGRESOS_ROLLUP TO ROL_ANALISTA;
GRANT EXECUTE ON SP_INGRESOS_ROLLUP TO ROL_ADMIN;

GRANT EXECUTE ON SP_VISTAS_CUBE TO ROL_ANALISTA;
GRANT EXECUTE ON SP_VISTAS_CUBE TO ROL_ADMIN;

GRANT EXECUTE ON SP_INGRESOS_GROUPING TO ROL_ANALISTA;
GRANT EXECUTE ON SP_INGRESOS_GROUPING TO ROL_ADMIN;

GRANT EXECUTE ON SP_VISTAS_GROUPING_SETS TO ROL_ANALISTA;
GRANT EXECUTE ON SP_VISTAS_GROUPING_SETS TO ROL_ADMIN;

COMMIT;

-- ============================================================
--  Ejemplos de uso (descomentar para probar)
-- ============================================================
/*
DECLARE
    v_cursor SYS_REFCURSOR;
    v_contenido VARCHAR2(300);
    v_total NUMBER;
BEGIN
    SP_TOP_10_CONTENIDOS_CIUDAD('Armenia', v_cursor);
    LOOP
        FETCH v_cursor INTO v_contenido, v_total;
        EXIT WHEN v_cursor%NOTFOUND;
        DBMS_OUTPUT.PUT_LINE(v_contenido || ' - ' || v_total);
    END LOOP;
    CLOSE v_cursor;
END;
/

DECLARE
    v_cursor SYS_REFCURSOR;
    v_plan VARCHAR2(50);
    v_ingresos NUMBER;
    v_cantidad NUMBER;
BEGIN
    SP_INGRESOS_POR_PLAN_MES_ANIO(1, 2024, v_cursor);
    LOOP
        FETCH v_cursor INTO v_plan, v_ingresos, v_cantidad;
        EXIT WHEN v_cursor%NOTFOUND;
        DBMS_OUTPUT.PUT_LINE(v_plan || ': $' || v_ingresos || ' (' || v_cantidad || ' pagos)');
    END LOOP;
    CLOSE v_cursor;
END;
/

DECLARE
    v_cursor SYS_REFCURSOR;
    v_categoria VARCHAR2(15);
    v_promedio NUMBER;
    v_total NUMBER;
BEGIN
    SP_CALIFICACION_PROMEDIO_GENERO('Drama', v_cursor);
    LOOP
        FETCH v_cursor INTO v_categoria, v_promedio, v_total;
        EXIT WHEN v_cursor%NOTFOUND;
        DBMS_OUTPUT.PUT_LINE(v_categoria || ': ' || v_promedio || ' estrellas');
    END LOOP;
    CLOSE v_cursor;
END;
/
*/

-- ============================================================
--  FIN DEL SCRIPT DE CONSULTAS AVANZADAS (Procedimientos)
-- ============================================================

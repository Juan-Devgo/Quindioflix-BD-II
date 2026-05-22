-- ============================================================
-- QUINDIOFLIX - CONSULTAS AVANZADAS (Funciones de tabla)
-- Autores:
-- Juan Sebastián Londoño Ramírez
-- Juan Diego García Nieto
-- Versión: 2.0
-- ============================================================
-- Contenido:
-- 3.1.1  Consultas parametrizadas      (&, &&, DEFINE)
-- 3.1.2  Tablas de cruzamiento         (PIVOT / UNPIVOT)
-- 3.1.3  Funciones avanzadas de GROUP BY
-- ============================================================

-- SET SERVEROUTPUT ON;

-- ================================================================
-- TIPOS DE DATOS NECESARIOS PARA LAS FUNCIONES DE TABLA
-- ================================================================

CREATE OR REPLACE TYPE T_TOP_CONTENIDO AS OBJECT (
    contenido          VARCHAR2(300),
    total_reproducciones NUMBER
);

CREATE OR REPLACE TYPE TT_TOP_CONTENIDO AS TABLE OF T_TOP_CONTENIDO;

CREATE OR REPLACE TYPE T_INGRESO_PLAN AS OBJECT (
    plan_suscripcion  VARCHAR2(50),
    ingresos_totales  NUMBER,
    cantidad_pagos    NUMBER
);

CREATE OR REPLACE TYPE TT_INGRESO_PLAN AS TABLE OF T_INGRESO_PLAN;

CREATE OR REPLACE TYPE T_CALIF_PROMEDIO AS OBJECT (
    categoria              VARCHAR2(15),
    promedio_estrellas     NUMBER,
    total_calificaciones   NUMBER
);

CREATE OR REPLACE TYPE TT_CALIF_PROMEDIO AS TABLE OF T_CALIF_PROMEDIO;

CREATE OR REPLACE TYPE T_CALIF_POR_GENERO AS OBJECT (
    categoria   VARCHAR2(15),
    estrellas   NUMBER,
    cantidad    NUMBER
);

CREATE OR REPLACE TYPE TT_CALIF_POR_GENERO AS TABLE OF T_CALIF_POR_GENERO;

CREATE OR REPLACE TYPE T_USUARIOS_PIVOT AS OBJECT (
    ciudad    VARCHAR2(100),
    Basico    NUMBER,
    Estandar  NUMBER,
    Premium   NUMBER
);

CREATE OR REPLACE TYPE TT_USUARIOS_PIVOT AS TABLE OF T_USUARIOS_PIVOT;

CREATE OR REPLACE TYPE T_VISTAS_PIVOT AS OBJECT (
    categoria   VARCHAR2(15),
    Celular     NUMBER,
    Tablet      NUMBER,
    TV          NUMBER,
    Computador  NUMBER
);

CREATE OR REPLACE TYPE TT_VISTAS_PIVOT AS TABLE OF T_VISTAS_PIVOT;

CREATE OR REPLACE TYPE T_USUARIOS_UNPIVOT AS OBJECT (
    ciudad           VARCHAR2(100),
    plan             VARCHAR2(50),
    usuarios_activos NUMBER
);

CREATE OR REPLACE TYPE TT_USUARIOS_UNPIVOT AS TABLE OF T_USUARIOS_UNPIVOT;

CREATE OR REPLACE TYPE T_RESUMEN_UNPIVOT AS OBJECT (
    plan      VARCHAR2(50),
    mes       VARCHAR2(20),
    ingresos  NUMBER
);

CREATE OR REPLACE TYPE TT_RESUMEN_UNPIVOT AS TABLE OF T_RESUMEN_UNPIVOT;

CREATE OR REPLACE TYPE T_INGRESOS_ROLLUP AS OBJECT (
    ciudad         VARCHAR2(100),
    plan           VARCHAR2(50),
    ingresos       NUMBER,
    cantidad_pagos NUMBER
);

CREATE OR REPLACE TYPE TT_INGRESOS_ROLLUP AS TABLE OF T_INGRESOS_ROLLUP;

CREATE OR REPLACE TYPE T_VISTAS_CUBE AS OBJECT (
    categoria    VARCHAR2(15),
    dispositivo  VARCHAR2(50),
    total_vistas NUMBER
);

CREATE OR REPLACE TYPE TT_VISTAS_CUBE AS TABLE OF T_VISTAS_CUBE;

CREATE OR REPLACE TYPE T_INGRESOS_GROUPING AS OBJECT (
    ciudad       VARCHAR2(100),
    plan         VARCHAR2(50),
    ingresos     NUMBER,
    flag_ciudad  NUMBER,
    flag_plan    NUMBER
);

CREATE OR REPLACE TYPE TT_INGRESOS_GROUPING AS TABLE OF T_INGRESOS_GROUPING;

CREATE OR REPLACE TYPE T_VISTAS_GROUPING_SETS AS OBJECT (
    categoria    VARCHAR2(15),
    ciudad       VARCHAR2(100),
    total_vistas NUMBER
);

CREATE OR REPLACE TYPE TT_VISTAS_GROUPING_SETS AS TABLE OF T_VISTAS_GROUPING_SETS;


-- ============================================================
-- 3.1.1 CONSULTAS PARAMETRIZADAS
-- ============================================================

-- ------------------------------------------------------------
-- a) Top 10 contenidos más vistos en una ciudad
-- Parámetro: p_ciudad (VARCHAR2)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION FN_TOP_10_CONTENIDOS_CIUDAD (
    p_ciudad IN VARCHAR2
) RETURN TT_TOP_CONTENIDO PIPELINED AS
BEGIN
    DBMS_OUTPUT.PUT_LINE('FN_TOP_10_CONTENIDOS_CIUDAD - Ciudad: ' || p_ciudad);
    FOR r IN (
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
        FETCH FIRST 10 ROWS ONLY
    ) LOOP
        PIPE ROW(T_TOP_CONTENIDO(r.contenido, r.total_reproducciones));
    END LOOP;
    RETURN;
END;

-- ------------------------------------------------------------
-- b) Ingresos por plan de suscripción para un mes y año
-- Parámetros: p_mes (NUMBER), p_anio (NUMBER)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION FN_INGRESOS_POR_PLAN_MES_ANIO (
    p_mes   IN NUMBER,
    p_anio  IN NUMBER
) RETURN TT_INGRESO_PLAN PIPELINED AS
BEGIN
    DBMS_OUTPUT.PUT_LINE('FN_INGRESOS_POR_PLAN_MES_ANIO - Mes: ' || p_mes || ' | Anio: ' || p_anio);
    FOR r IN (
        SELECT ps.nombre as plan_suscripcion,
               SUM(p.monto) as ingresos_totales,
               COUNT(*) as cantidad_pagos
        FROM PAGO p
        JOIN PLAN_SUSCRIPCION ps ON p.id_plan = ps.id_plan
        WHERE EXTRACT(MONTH FROM p.fecha_pago) = p_mes
          AND EXTRACT(YEAR FROM p.fecha_pago) = p_anio
          AND p.estado_pago = 'EXITOSO'
        GROUP BY ps.nombre
        ORDER BY ingresos_totales DESC
    ) LOOP
        PIPE ROW(T_INGRESO_PLAN(r.plan_suscripcion, r.ingresos_totales, r.cantidad_pagos));
    END LOOP;
    RETURN;
END;

-- ------------------------------------------------------------
-- c) Calificación promedio por categoría para un género
-- Parámetro: p_genero (VARCHAR2)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION FN_CALIFICACION_PROMEDIO_GENERO (
    p_genero IN VARCHAR2
) RETURN TT_CALIF_PROMEDIO PIPELINED AS
BEGIN
    DBMS_OUTPUT.PUT_LINE('FN_CALIFICACION_PROMEDIO_GENERO - Genero: ' || p_genero);
    FOR r IN (
        SELECT c.tipo as categoria,
               ROUND(AVG(cal.estrellas), 2) as promedio_estrellas,
               COUNT(*) as total_calificaciones
        FROM CALIFICACION cal
        JOIN CONTENIDO c ON cal.id_contenido = c.id_contenido
        JOIN CONTENIDO_GENERO cg ON c.id_contenido = cg.id_contenido
        JOIN GENERO g ON cg.id_genero = g.id_genero
        WHERE g.nombre = p_genero
        GROUP BY c.tipo
        ORDER BY promedio_estrellas DESC
    ) LOOP
        PIPE ROW(T_CALIF_PROMEDIO(r.categoria, r.promedio_estrellas, r.total_calificaciones));
    END LOOP;
    RETURN;
END;

-- ------------------------------------------------------------
-- c.2) Total de contenidos por calificación para un género
-- (Consulta complementaria que reutiliza el género)
-- Parámetro: p_genero (VARCHAR2)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION FN_CALIFICACIONES_POR_GENERO (
    p_genero IN VARCHAR2
) RETURN TT_CALIF_POR_GENERO PIPELINED AS
BEGIN
    DBMS_OUTPUT.PUT_LINE('FN_CALIFICACIONES_POR_GENERO - Genero: ' || p_genero);
    FOR r IN (
        SELECT c.tipo as categoria,
               cal.estrellas,
               COUNT(*) as cantidad
        FROM CALIFICACION cal
        JOIN CONTENIDO c ON cal.id_contenido = c.id_contenido
        JOIN CONTENIDO_GENERO cg ON c.id_contenido = cg.id_contenido
        JOIN GENERO g ON cg.id_genero = g.id_genero
        WHERE g.nombre = p_genero
        GROUP BY c.tipo, cal.estrellas
        ORDER BY c.tipo, cal.estrellas DESC
    ) LOOP
        PIPE ROW(T_CALIF_POR_GENERO(r.categoria, r.estrellas, r.cantidad));
    END LOOP;
    RETURN;
END;


-- ============================================================
-- 3.1.2 TABLAS DE CRUZAMIENTO – PIVOT Y UNPIVOT
-- ============================================================

-- ------------------------------------------------------------
-- a) PIVOT: Usuarios activos por ciudad (filas) y plan (columnas)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION FN_USUARIOS_ACTIVOS_PIVOT
RETURN TT_USUARIOS_PIVOT PIPELINED AS
BEGIN
    DBMS_OUTPUT.PUT_LINE('FN_USUARIOS_ACTIVOS_PIVOT - Iniciando...');
    FOR r IN (
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
            FOR plan IN ('Básico' AS "Basico", 'Estándar' AS "Estandar", 'Premium' AS "Premium")
        )
        ORDER BY ciudad
    ) LOOP
        PIPE ROW(T_USUARIOS_PIVOT(r.ciudad, r."Basico", r."Estandar", r."Premium"));
    END LOOP;
    RETURN;
END;

-- ------------------------------------------------------------
-- b) PIVOT: Total de vistas por categoría (filas) y dispositivo (columnas)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION FN_VISTAS_CATEGORIA_DISPOSITIVO_PIVOT
RETURN TT_VISTAS_PIVOT PIPELINED AS
BEGIN
    DBMS_OUTPUT.PUT_LINE('FN_VISTAS_CATEGORIA_DISPOSITIVO_PIVOT - Iniciando...');
    FOR r IN (
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
        ORDER BY categoria
    ) LOOP
        PIPE ROW(T_VISTAS_PIVOT(r.categoria, r.Celular, r.Tablet, r.TV, r.Computador));
    END LOOP;
    RETURN;
END;

-- ------------------------------------------------------------
-- c) UNPIVOT: Convertir el reporte PIVOT de usuarios activos
-- de nuevo a filas para análisis detallado.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION FN_USUARIOS_ACTIVOS_UNPIVOT
RETURN TT_USUARIOS_UNPIVOT PIPELINED AS
BEGIN
    DBMS_OUTPUT.PUT_LINE('FN_USUARIOS_ACTIVOS_UNPIVOT - Iniciando...');
    FOR r IN (
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
                FOR plan IN ('Básico' AS "Basico", 'Estándar' AS "Estandar", 'Premium' AS "Premium")
            )
        )
        SELECT ciudad, plan, usuarios_activos
        FROM reporte_pivotado
        UNPIVOT (
            usuarios_activos
            FOR plan IN ("Basico", "Estandar", "Premium")
        )
        ORDER BY ciudad, plan
    ) LOOP
        PIPE ROW(T_USUARIOS_UNPIVOT(r.ciudad, r.plan, r.usuarios_activos));
    END LOOP;
    RETURN;
END;

-- ------------------------------------------------------------
-- d) UNPIVOT: Convertir un resumen mensual con columnas por
-- mes (Enero, Febrero, Marzo) en filas individuales.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION FN_RESUMEN_MENSUAL_UNPIVOT
RETURN TT_RESUMEN_UNPIVOT PIPELINED AS
BEGIN
    DBMS_OUTPUT.PUT_LINE('FN_RESUMEN_MENSUAL_UNPIVOT - Iniciando...');
    FOR r IN (
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
        ORDER BY plan, mes
    ) LOOP
        PIPE ROW(T_RESUMEN_UNPIVOT(r.plan, r.mes, r.ingresos));
    END LOOP;
    RETURN;
END;


-- ============================================================
-- 3.1.3 FUNCIONES AVANZADAS DE GROUP BY
-- ============================================================

-- ------------------------------------------------------------
-- a) ROLLUP: Ingresos por ciudad y plan, con subtotales por
-- ciudad y total general.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION FN_INGRESOS_ROLLUP
RETURN TT_INGRESOS_ROLLUP PIPELINED AS
BEGIN
    DBMS_OUTPUT.PUT_LINE('FN_INGRESOS_ROLLUP - Iniciando...');
    FOR r IN (
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
        ORDER BY ci.nombre, ps.nombre
    ) LOOP
        PIPE ROW(T_INGRESOS_ROLLUP(r.ciudad, r.plan, r.ingresos, r.cantidad_pagos));
    END LOOP;
    RETURN;
END;

-- ------------------------------------------------------------
-- b) CUBE: Vistas por categoría de contenido y dispositivo,
-- incluyendo todas las combinaciones posibles.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION FN_VISTAS_CUBE
RETURN TT_VISTAS_CUBE PIPELINED AS
BEGIN
    DBMS_OUTPUT.PUT_LINE('FN_VISTAS_CUBE - Iniciando...');
    FOR r IN (
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
        ORDER BY categoria, dispositivo
    ) LOOP
        PIPE ROW(T_VISTAS_CUBE(r.categoria, r.dispositivo, r.total_vistas));
    END LOOP;
    RETURN;
END;

-- ------------------------------------------------------------
-- c) GROUPING(): Reemplazar los NULL generados por ROLLUP/CUBE
-- con etiquetas legibles.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION FN_INGRESOS_GROUPING
RETURN TT_INGRESOS_GROUPING PIPELINED AS
BEGIN
    DBMS_OUTPUT.PUT_LINE('FN_INGRESOS_GROUPING - Iniciando...');
    FOR r IN (
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
        ORDER BY GROUPING(ci.nombre), GROUPING(ps.nombre), ci.nombre, ps.nombre
    ) LOOP
        PIPE ROW(T_INGRESOS_GROUPING(r.ciudad, r.plan, r.ingresos, r.flag_ciudad, r.flag_plan));
    END LOOP;
    RETURN;
END;

-- ------------------------------------------------------------
-- d) GROUPING SETS: Totales únicamente por categoría y por
-- ciudad, sin el detalle de la cruza entre ambas.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION FN_VISTAS_GROUPING_SETS
RETURN TT_VISTAS_GROUPING_SETS PIPELINED AS
BEGIN
    DBMS_OUTPUT.PUT_LINE('FN_VISTAS_GROUPING_SETS - Iniciando...');
    FOR r IN (
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
        ORDER BY categoria, ciudad
    ) LOOP
        PIPE ROW(T_VISTAS_GROUPING_SETS(r.categoria, r.ciudad, r.total_vistas));
    END LOOP;
    RETURN;
END;


-- ============================================================
-- Permisos de ejecución
-- ============================================================
GRANT EXECUTE ON FN_TOP_10_CONTENIDOS_CIUDAD TO ROL_ANALISTA;
GRANT EXECUTE ON FN_TOP_10_CONTENIDOS_CIUDAD TO ROL_ADMIN;

GRANT EXECUTE ON FN_INGRESOS_POR_PLAN_MES_ANIO TO ROL_ANALISTA;
GRANT EXECUTE ON FN_INGRESOS_POR_PLAN_MES_ANIO TO ROL_ADMIN;

GRANT EXECUTE ON FN_CALIFICACION_PROMEDIO_GENERO TO ROL_ANALISTA;
GRANT EXECUTE ON FN_CALIFICACION_PROMEDIO_GENERO TO ROL_ADMIN;

GRANT EXECUTE ON FN_CALIFICACIONES_POR_GENERO TO ROL_ANALISTA;
GRANT EXECUTE ON FN_CALIFICACIONES_POR_GENERO TO ROL_ADMIN;

GRANT EXECUTE ON FN_USUARIOS_ACTIVOS_PIVOT TO ROL_ANALISTA;
GRANT EXECUTE ON FN_USUARIOS_ACTIVOS_PIVOT TO ROL_ADMIN;

GRANT EXECUTE ON FN_VISTAS_CATEGORIA_DISPOSITIVO_PIVOT TO ROL_ANALISTA;
GRANT EXECUTE ON FN_VISTAS_CATEGORIA_DISPOSITIVO_PIVOT TO ROL_ADMIN;

GRANT EXECUTE ON FN_USUARIOS_ACTIVOS_UNPIVOT TO ROL_ANALISTA;
GRANT EXECUTE ON FN_USUARIOS_ACTIVOS_UNPIVOT TO ROL_ADMIN;

GRANT EXECUTE ON FN_RESUMEN_MENSUAL_UNPIVOT TO ROL_ANALISTA;
GRANT EXECUTE ON FN_RESUMEN_MENSUAL_UNPIVOT TO ROL_ADMIN;

GRANT EXECUTE ON FN_INGRESOS_ROLLUP TO ROL_ANALISTA;
GRANT EXECUTE ON FN_INGRESOS_ROLLUP TO ROL_ADMIN;

GRANT EXECUTE ON FN_VISTAS_CUBE TO ROL_ANALISTA;
GRANT EXECUTE ON FN_VISTAS_CUBE TO ROL_ADMIN;

GRANT EXECUTE ON FN_INGRESOS_GROUPING TO ROL_ANALISTA;
GRANT EXECUTE ON FN_INGRESOS_GROUPING TO ROL_ADMIN;

GRANT EXECUTE ON FN_VISTAS_GROUPING_SETS TO ROL_ANALISTA;
GRANT EXECUTE ON FN_VISTAS_GROUPING_SETS TO ROL_ADMIN;

COMMIT;

-- ============================================================
-- Ejemplos de uso (descomentar para probar)
-- ============================================================
/*
BEGIN
    FOR r IN (SELECT * FROM TABLE(FN_TOP_10_CONTENIDOS_CIUDAD('Armenia'))) LOOP
        DBMS_OUTPUT.PUT_LINE(r.contenido || ' - ' || r.total_reproducciones);
    END LOOP;
END;

BEGIN
    FOR r IN (SELECT * FROM TABLE(FN_INGRESOS_POR_PLAN_MES_ANIO(1, 2024))) LOOP
        DBMS_OUTPUT.PUT_LINE(r.plan_suscripcion || ': $' || r.ingresos_totales || ' (' || r.cantidad_pagos || ' pagos)');
    END LOOP;
END;

BEGIN
    FOR r IN (SELECT * FROM TABLE(FN_CALIFICACION_PROMEDIO_GENERO('Drama'))) LOOP
        DBMS_OUTPUT.PUT_LINE(r.categoria || ': ' || r.promedio_estrellas || ' estrellas');
    END LOOP;
END;
*/

-- ============================================================
-- FIN DEL SCRIPT DE CONSULTAS AVANZADAS (Funciones de tabla)
-- ============================================================

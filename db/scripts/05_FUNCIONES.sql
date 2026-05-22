-- ============================================================
--  QUINDIOFLIX - FUNCIONES ALMACENADAS
--  Versión: 1.0
-- ============================================================
--  Funciones de negocio:
--   a) FN_CALCULAR_MONTO      – monto a cobrar con descuento
--      por antigüedad (fidelidad).
--   b) FN_CONTENIDO_RECOMENDADO – título de contenido sugerido
--      según el género más consumido por un perfil.
-- ============================================================

SET SERVEROUTPUT ON;

-- ============================================================
-- a) FN_CALCULAR_MONTO
--    Recibe un id_usuario y devuelve el monto que le
--    corresponde pagar el próximo mes, aplicando el descuento
--    por fidelidad:
--      · > 12 meses : 10 %
--      · > 24 meses : 15 %
-- ============================================================
CREATE OR REPLACE FUNCTION FN_CALCULAR_MONTO (
    p_id_usuario IN NUMBER
) RETURN NUMBER IS
    v_precio         NUMBER(10,2);
    v_fecha_registro DATE;
    v_meses          NUMBER;
    v_descuento      NUMBER(5,2) := 0;
    v_monto_final    NUMBER(10,2);
BEGIN
    SELECT ps.precio_mensual, u.fecha_registro
    INTO v_precio, v_fecha_registro
    FROM USUARIO u
    JOIN PLAN_SUSCRIPCION ps ON u.id_plan = ps.id_plan
    WHERE u.id_usuario = p_id_usuario;

    v_meses := TRUNC(MONTHS_BETWEEN(SYSDATE, v_fecha_registro));

    IF v_meses > 24 THEN
        v_descuento := 0.15;
    ELSIF v_meses > 12 THEN
        v_descuento := 0.10;
    END IF;

    v_monto_final := v_precio * (1 - v_descuento);

    RETURN v_monto_final;

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RETURN 0;
    WHEN OTHERS THEN
        RAISE_APPLICATION_ERROR(-20050, 'Error en FN_CALCULAR_MONTO: ' || SQLERRM);
END;
/


-- ============================================================
-- b) FN_CONTENIDO_RECOMENDADO
--    Recibe un id_perfil y devuelve el título del contenido
--    más relevante, basado en el género que más ha visto el
--    perfil.  Como criterio de desempate se elige el contenido
--    con mejor calificación promedio y, de persistir el empate,
--    el más recientemente agregado al catálogo.
-- ============================================================
CREATE OR REPLACE FUNCTION FN_CONTENIDO_RECOMENDADO (
    p_id_perfil IN NUMBER
) RETURN VARCHAR2 IS
    v_top_genero NUMBER;
    v_titulo     VARCHAR2(300);
BEGIN
    -- 1) Determinar el género más consumido por el perfil
    SELECT id_genero
    INTO v_top_genero
    FROM (
        SELECT cg.id_genero
        FROM REPRODUCCION r
        LEFT JOIN EPISODIO e ON r.id_episodio = e.id_episodio
        LEFT JOIN TEMPORADA t ON e.id_temporada = t.id_temporada
        JOIN CONTENIDO_GENERO cg
             ON cg.id_contenido = COALESCE(r.id_contenido, t.id_contenido)
        WHERE r.id_perfil = p_id_perfil
        GROUP BY cg.id_genero
        ORDER BY COUNT(*) DESC, cg.id_genero ASC
    )
    WHERE ROWNUM = 1;

    -- 2) Elegir el mejor contenido de ese género
    SELECT titulo
    INTO v_titulo
    FROM (
        SELECT c.titulo
        FROM CONTENIDO c
        JOIN CONTENIDO_GENERO cg ON c.id_contenido = cg.id_contenido
        LEFT JOIN CALIFICACION cal ON cal.id_contenido = c.id_contenido
        WHERE cg.id_genero = v_top_genero
        GROUP BY c.id_contenido, c.titulo, c.fecha_agregado_catalogo
        ORDER BY NVL(AVG(cal.estrellas), 0) DESC, c.fecha_agregado_catalogo DESC
    )
    WHERE ROWNUM = 1;

    RETURN v_titulo;

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RETURN NULL;
    WHEN OTHERS THEN
        RAISE_APPLICATION_ERROR(-20051, 'Error en FN_CONTENIDO_RECOMENDADO: ' || SQLERRM);
END;
/


-- ============================================================
-- Permisos de ejecución
-- ============================================================
GRANT EXECUTE ON FN_CALCULAR_MONTO TO ROL_ADMIN;
GRANT EXECUTE ON FN_CALCULAR_MONTO TO ROL_SOPORTE;
GRANT EXECUTE ON FN_CALCULAR_MONTO TO ROL_ANALISTA;

GRANT EXECUTE ON FN_CONTENIDO_RECOMENDADO TO ROL_ADMIN;
GRANT EXECUTE ON FN_CONTENIDO_RECOMENDADO TO ROL_CONTENIDO;
GRANT EXECUTE ON FN_CONTENIDO_RECOMENDADO TO ROL_ANALISTA;

COMMIT;


-- ============================================================
-- Ejemplos de uso (descomentar para ejecutar)
-- ============================================================
/*
SELECT FN_CALCULAR_MONTO(1) FROM DUAL;

SELECT FN_CONTENIDO_RECOMENDADO(1) FROM DUAL;
*/

-- ============================================================
-- FIN DEL SCRIPT DE FUNCIONES
-- ============================================================

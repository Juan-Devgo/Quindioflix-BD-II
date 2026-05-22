-- ============================================================
-- QUINDIOFLIX
-- Script: 10_INSERCIONES.sql
-- Descripción: Inserción masiva de datos para reportes analíticos
-- Orden: respeta dependencias de claves foráneas
-- ============================================================

-- SET DEFINE OFF;
-- SET SERVEROUTPUT ON;

BEGIN
    DBMS_OUTPUT.PUT_LINE('Iniciando inserción de datos QuindioFlix...');
END;

-- ============================================================
-- BLOQUE 1: Planes, Ciudades, Géneros, Departamentos
-- ============================================================
DECLARE
    -- Planes
    v_plan_basico   NUMBER;
    v_plan_estandar NUMBER;
    v_plan_premium  NUMBER;

    -- Ciudades
    v_ciu_armenia   NUMBER;
    v_ciu_pereira   NUMBER;
    v_ciu_manizales NUMBER;

    -- Géneros
    v_gen_accion    NUMBER;
    v_gen_comedia   NUMBER;
    v_gen_drama     NUMBER;
    v_gen_suspenso  NUMBER;
    v_gen_romance   NUMBER;
    v_gen_ciencia   NUMBER;
    v_gen_terror    NUMBER;
    v_gen_infantil  NUMBER;

    -- Departamentos
    v_depto_tech    NUMBER;
    v_depto_cont    NUMBER;
    v_depto_mkt     NUMBER;
    v_depto_sop     NUMBER;
    v_depto_fin     NUMBER;

    -- Empleados (jefes de departamento)
    v_emp_tech_jefe NUMBER;
    v_emp_cont_jefe NUMBER;
    v_emp_mkt_jefe  NUMBER;
    v_emp_sop_jefe  NUMBER;
    v_emp_fin_jefe  NUMBER;

    -- Colecciones
    TYPE num_tbl IS TABLE OF NUMBER INDEX BY PLS_INTEGER;
    v_usuarios  num_tbl;
    v_perfiles  num_tbl;
    v_contenido num_tbl;
    v_temporada num_tbl;
    v_episodio  num_tbl;
    v_empleados num_tbl;

    i  PLS_INTEGER;
    j  PLS_INTEGER;
    k  PLS_INTEGER;

BEGIN
    -- 1. PLAN_SUSCRIPCION (3 registros)
    INSERT INTO PLAN_SUSCRIPCION (nombre, max_perfiles, max_pantallas, calidad, precio_mensual)
    VALUES ('Básico', 1, 1, 'SD', 12900) RETURNING id_plan INTO v_plan_basico;
    INSERT INTO PLAN_SUSCRIPCION (nombre, max_perfiles, max_pantallas, calidad, precio_mensual)
    VALUES ('Estándar', 2, 2, 'HD', 19900) RETURNING id_plan INTO v_plan_estandar;
    INSERT INTO PLAN_SUSCRIPCION (nombre, max_perfiles, max_pantallas, calidad, precio_mensual)
    VALUES ('Premium', 4, 4, '4K', 29900) RETURNING id_plan INTO v_plan_premium;
    DBMS_OUTPUT.PUT_LINE('Planes insertados: 3');

    -- 2. CIUDAD (3 registros principales del Eje Cafetero)
    INSERT INTO CIUDAD (nombre, departamento) VALUES ('Armenia', 'Quindío') RETURNING id_ciudad INTO v_ciu_armenia;
    INSERT INTO CIUDAD (nombre, departamento) VALUES ('Pereira', 'Risaralda') RETURNING id_ciudad INTO v_ciu_pereira;
    INSERT INTO CIUDAD (nombre, departamento) VALUES ('Manizales', 'Caldas') RETURNING id_ciudad INTO v_ciu_manizales;
    DBMS_OUTPUT.PUT_LINE('Ciudades insertadas: 3');

    -- 3. DEPARTAMENTO (5 registros)
    INSERT INTO DEPARTAMENTO (nombre) VALUES ('Tecnología') RETURNING id_departamento INTO v_depto_tech;
    INSERT INTO DEPARTAMENTO (nombre) VALUES ('Contenido') RETURNING id_departamento INTO v_depto_cont;
    INSERT INTO DEPARTAMENTO (nombre) VALUES ('Marketing') RETURNING id_departamento INTO v_depto_mkt;
    INSERT INTO DEPARTAMENTO (nombre) VALUES ('Soporte') RETURNING id_departamento INTO v_depto_sop;
    INSERT INTO DEPARTAMENTO (nombre) VALUES ('Finanzas') RETURNING id_departamento INTO v_depto_fin;
    DBMS_OUTPUT.PUT_LINE('Departamentos insertados: 5');

    -- 4. EMPLEADO: jefes de departamento (5 registros)
    INSERT INTO EMPLEADO (nombre, email, telefono, fecha_contratacion, id_departamento, rol, activo)
    VALUES ('Carlos Ruiz', 'c.ruiz@quindioflix.co', '3001112233', DATE '2020-01-15', v_depto_tech, 'JEFE', 'S') RETURNING id_empleado INTO v_emp_tech_jefe;
    INSERT INTO EMPLEADO (nombre, email, telefono, fecha_contratacion, id_departamento, rol, activo)
    VALUES ('Ana López', 'a.lopez@quindioflix.co', '3002223344', DATE '2019-03-10', v_depto_cont, 'JEFE', 'S') RETURNING id_empleado INTO v_emp_cont_jefe;
    INSERT INTO EMPLEADO (nombre, email, telefono, fecha_contratacion, id_departamento, rol, activo)
    VALUES ('Pedro Gómez', 'p.gomez@quindioflix.co', '3003334455', DATE '2021-06-01', v_depto_mkt, 'JEFE', 'S') RETURNING id_empleado INTO v_emp_mkt_jefe;
    INSERT INTO EMPLEADO (nombre, email, telefono, fecha_contratacion, id_departamento, rol, activo)
    VALUES ('María Torres', 'm.torres@quindioflix.co', '3004445566', DATE '2020-09-20', v_depto_sop, 'JEFE', 'S') RETURNING id_empleado INTO v_emp_sop_jefe;
    INSERT INTO EMPLEADO (nombre, email, telefono, fecha_contratacion, id_departamento, rol, activo)
    VALUES ('Luis Mendoza', 'l.mendoza@quindioflix.co', '3005556677', DATE '2018-11-05', v_depto_fin, 'JEFE', 'S') RETURNING id_empleado INTO v_emp_fin_jefe;
    DBMS_OUTPUT.PUT_LINE('Jefes insertados: 5');

    -- Actualizar jefes en departamentos
    UPDATE DEPARTAMENTO SET id_jefe = v_emp_tech_jefe WHERE id_departamento = v_depto_tech;
    UPDATE DEPARTAMENTO SET id_jefe = v_emp_cont_jefe WHERE id_departamento = v_depto_cont;
    UPDATE DEPARTAMENTO SET id_jefe = v_emp_mkt_jefe  WHERE id_departamento = v_depto_mkt;
    UPDATE DEPARTAMENTO SET id_jefe = v_emp_sop_jefe  WHERE id_departamento = v_depto_sop;
    UPDATE DEPARTAMENTO SET id_jefe = v_emp_fin_jefe  WHERE id_departamento = v_depto_fin;

    -- Empleados adicionales (5 supervisores/modernadores + 5 empleados)
    -- Tecnología
    INSERT INTO EMPLEADO (nombre, email, telefono, fecha_contratacion, id_departamento, id_supervisor, rol, activo)
    VALUES ('Diana Sánchez', 'd.sanchez@quindioflix.co', '3006667788', DATE '2021-02-10', v_depto_tech, v_emp_tech_jefe, 'SUPERVISOR', 'S');
    INSERT INTO EMPLEADO (nombre, email, telefono, fecha_contratacion, id_departamento, id_supervisor, rol, activo)
    VALUES ('Jorge Castillo', 'j.castillo@quindioflix.co', '3007778899', DATE '2022-05-15', v_depto_tech, v_emp_tech_jefe, 'EMPLEADO', 'S');
    -- Contenido
    INSERT INTO EMPLEADO (nombre, email, telefono, fecha_contratacion, id_departamento, id_supervisor, rol, activo)
    VALUES ('Sofía Herrera', 's.herrera@quindioflix.co', '3008889900', DATE '2020-07-22', v_depto_cont, v_emp_cont_jefe, 'EMPLEADO', 'S');
    INSERT INTO EMPLEADO (nombre, email, telefono, fecha_contratacion, id_departamento, id_supervisor, rol, activo)
    VALUES ('Andrés Vega', 'a.vega@quindioflix.co', '3009990011', DATE '2023-01-10', v_depto_cont, v_emp_cont_jefe, 'EMPLEADO', 'S');
    -- Marketing
    INSERT INTO EMPLEADO (nombre, email, telefono, fecha_contratacion, id_departamento, id_supervisor, rol, activo)
    VALUES ('Laura Jiménez', 'l.jimenez@quindioflix.co', '3010001122', DATE '2021-08-30', v_depto_mkt, v_emp_mkt_jefe, 'EMPLEADO', 'S');
    INSERT INTO EMPLEADO (nombre, email, telefono, fecha_contratacion, id_departamento, id_supervisor, rol, activo)
    VALUES ('Ricardo Marín', 'r.marin@quindioflix.co', '3011112233', DATE '2022-11-14', v_depto_mkt, v_emp_mkt_jefe, 'SUPERVISOR', 'S');
    -- Soporte (moderadores)
    INSERT INTO EMPLEADO (nombre, email, telefono, fecha_contratacion, id_departamento, id_supervisor, rol, activo)
    VALUES ('Camila Duarte', 'c.duarte@quindioflix.co', '3012223344', DATE '2020-04-05', v_depto_sop, v_emp_sop_jefe, 'MODERADOR', 'S');
    INSERT INTO EMPLEADO (nombre, email, telefono, fecha_contratacion, id_departamento, id_supervisor, rol, activo)
    VALUES ('Felipe Ortega', 'f.ortega@quindioflix.co', '3013334455', DATE '2021-12-18', v_depto_sop, v_emp_sop_jefe, 'MODERADOR', 'S');
    -- Finanzas
    INSERT INTO EMPLEADO (nombre, email, telefono, fecha_contratacion, id_departamento, id_supervisor, rol, activo)
    VALUES ('Valentina Ríos', 'v.rios@quindioflix.co', '3014445566', DATE '2019-06-25', v_depto_fin, v_emp_fin_jefe, 'SUPERVISOR', 'S');
    INSERT INTO EMPLEADO (nombre, email, telefono, fecha_contratacion, id_departamento, id_supervisor, rol, activo)
    VALUES ('Mateo Gil', 'm.gil@quindioflix.co', '3015556677', DATE '2023-03-08', v_depto_fin, v_emp_fin_jefe, 'EMPLEADO', 'S');
    DBMS_OUTPUT.PUT_LINE('Empleados adicionales insertados: 10');

    -- 5. GÉNERO (8 registros)
    INSERT INTO GENERO (nombre) VALUES ('Acción') RETURNING id_genero INTO v_gen_accion;
    INSERT INTO GENERO (nombre) VALUES ('Comedia') RETURNING id_genero INTO v_gen_comedia;
    INSERT INTO GENERO (nombre) VALUES ('Drama') RETURNING id_genero INTO v_gen_drama;
    INSERT INTO GENERO (nombre) VALUES ('Suspenso') RETURNING id_genero INTO v_gen_suspenso;
    INSERT INTO GENERO (nombre) VALUES ('Romance') RETURNING id_genero INTO v_gen_romance;
    INSERT INTO GENERO (nombre) VALUES ('Ciencia Ficción') RETURNING id_genero INTO v_gen_ciencia;
    INSERT INTO GENERO (nombre) VALUES ('Terror') RETURNING id_genero INTO v_gen_terror;
    INSERT INTO GENERO (nombre) VALUES ('Infantil') RETURNING id_genero INTO v_gen_infantil;
    DBMS_OUTPUT.PUT_LINE('Géneros insertados: 8');

    -- 6. USUARIO (30 registros)
    -- Primeros 10: Armenia
    FOR i IN 1..10 LOOP
        INSERT INTO USUARIO (nombre, email, telefono, fecha_nacimiento, id_ciudad, id_plan, fecha_registro, estado)
        VALUES (
            CASE i
                WHEN 1 THEN 'Juan Pérez' WHEN 2 THEN 'María García' WHEN 3 THEN 'Carlos López'
                WHEN 4 THEN 'Ana Martínez' WHEN 5 THEN 'Luis Rodríguez' WHEN 6 THEN 'Sofía Hernández'
                WHEN 7 THEN 'Diego Gómez' WHEN 8 THEN 'Valentina Díaz' WHEN 9 THEN 'Andrés Moreno'
                ELSE 'Camila Castro'
            END,
            'usuario' || i || '@mail.com',
            '300' || LPAD(i, 7, '0'),
            DATE '1990-01-01' + (i * 365),
            v_ciu_armenia,
            CASE WHEN i <= 3 THEN v_plan_basico WHEN i <= 7 THEN v_plan_estandar ELSE v_plan_premium END,
            DATE '2023-01-01' + (i * 15),
            'ACTIVO'
        ) RETURNING id_usuario INTO v_usuarios(i);
    END LOOP;

    -- Siguientes 10: Pereira
    FOR i IN 11..20 LOOP
        INSERT INTO USUARIO (nombre, email, telefono, fecha_nacimiento, id_ciudad, id_plan, fecha_registro, estado)
        VALUES (
            CASE i
                WHEN 11 THEN 'Sebastián Vargas' WHEN 12 THEN 'Isabella Muñoz' WHEN 13 THEN 'Daniel Cruz'
                WHEN 14 THEN 'Luciana Reyes' WHEN 15 THEN 'Tomás Aguilar' WHEN 16 THEN 'Paula Flores'
                WHEN 17 THEN 'Nicolás Romero' WHEN 18 THEN 'Mariana Soto' WHEN 19 THEN 'Emilio Guerrero'
                ELSE 'Renata Peña'
            END,
            'usuario' || i || '@mail.com',
            '301' || LPAD(i, 7, '0'),
            DATE '1992-01-01' + ((i-10) * 365),
            v_ciu_pereira,
            CASE WHEN i <= 13 THEN v_plan_basico WHEN i <= 17 THEN v_plan_estandar ELSE v_plan_premium END,
            DATE '2023-03-01' + ((i-10) * 15),
            'ACTIVO'
        ) RETURNING id_usuario INTO v_usuarios(i);
    END LOOP;

    -- Últimos 10: Manizales
    FOR i IN 21..30 LOOP
        INSERT INTO USUARIO (nombre, email, telefono, fecha_nacimiento, id_ciudad, id_plan, fecha_registro, estado, id_referidor)
        VALUES (
            CASE i
                WHEN 21 THEN 'Gabriel Acosta' WHEN 22 THEN 'Victoria Bravo' WHEN 23 THEN 'Leonardo Campos'
                WHEN 24 THEN 'Fernanda Cárdenas' WHEN 25 THEN 'Emiliano Silva' WHEN 26 THEN 'Ximena Rojas'
                WHEN 27 THEN 'Hugo Delgado' WHEN 28 THEN 'Antonella Miranda' WHEN 29 THEN 'Maximiliano Paz'
                ELSE 'Daniela León'
            END,
            'usuario' || i || '@mail.com',
            '302' || LPAD(i, 7, '0'),
            DATE '1995-01-01' + ((i-20) * 365),
            v_ciu_manizales,
            CASE WHEN i <= 23 THEN v_plan_basico WHEN i <= 27 THEN v_plan_estandar ELSE v_plan_premium END,
            DATE '2023-06-01' + ((i-20) * 15),
            'ACTIVO',
            CASE WHEN i >= 25 THEN v_usuarios(i-4) ELSE NULL END  -- Algunos referidos
        ) RETURNING id_usuario INTO v_usuarios(i);
    END LOOP;
    DBMS_OUTPUT.PUT_LINE('Usuarios insertados: 30');

    -- 7. PERFIL (50 registros)
    -- Usuarios 1-5: 1 perfil cada uno (plan básico)
    FOR i IN 1..5 LOOP
        INSERT INTO PERFIL (id_usuario, nombre, avatar, tipo, activo)
        VALUES (v_usuarios(i), 'Perfil 1', 'avatar' || i || '.png', 'ADULTO', 'S') RETURNING id_perfil INTO v_perfiles(i);
    END LOOP;

    -- Usuarios 6-15: 2 perfiles cada uno (plan estándar)
    FOR i IN 6..15 LOOP
        INSERT INTO PERFIL (id_usuario, nombre, avatar, tipo, activo)
        VALUES (v_usuarios(i), 'Perfil 1', 'avatar' || i || '_1.png', 'ADULTO', 'S') RETURNING id_perfil INTO v_perfiles((i-6)*2 + 6);
        INSERT INTO PERFIL (id_usuario, nombre, avatar, tipo, activo)
        VALUES (v_usuarios(i), 'Perfil 2', 'avatar' || i || '_2.png', CASE WHEN MOD(i,2)=0 THEN 'INFANTIL' ELSE 'ADULTO' END, 'S') RETURNING id_perfil INTO v_perfiles((i-6)*2 + 7);
    END LOOP;

    -- Usuarios 16-30: 2-4 perfiles (plan premium)
    j := 26; -- índice actual en v_perfiles
    FOR i IN 16..30 LOOP
        INSERT INTO PERFIL (id_usuario, nombre, avatar, tipo, activo)
        VALUES (v_usuarios(i), 'Perfil 1', 'avatar' || i || '_1.png', 'ADULTO', 'S') RETURNING id_perfil INTO v_perfiles(j);
        j := j + 1;
        INSERT INTO PERFIL (id_usuario, nombre, avatar, tipo, activo)
        VALUES (v_usuarios(i), 'Perfil 2', 'avatar' || i || '_2.png', CASE WHEN MOD(i,3)=0 THEN 'INFANTIL' ELSE 'ADULTO' END, 'S') RETURNING id_perfil INTO v_perfiles(j);
        j := j + 1;
        -- 50% de usuarios premium tienen 3er perfil
        IF MOD(i,2) = 0 THEN
            INSERT INTO PERFIL (id_usuario, nombre, avatar, tipo, activo)
            VALUES (v_usuarios(i), 'Perfil 3', 'avatar' || i || '_3.png', 'ADULTO', 'S') RETURNING id_perfil INTO v_perfiles(j);
            j := j + 1;
        END IF;
        -- 25% de usuarios premium tienen 4to perfil
        IF MOD(i,4) = 0 THEN
            INSERT INTO PERFIL (id_usuario, nombre, avatar, tipo, activo)
            VALUES (v_usuarios(i), 'Perfil 4', 'avatar' || i || '_4.png', 'INFANTIL', 'S') RETURNING id_perfil INTO v_perfiles(j);
            j := j + 1;
        END IF;
    END LOOP;
    DBMS_OUTPUT.PUT_LINE('Perfiles insertados: ' || (j-1));

    -- 8. CONTENIDO (40 registros)
    -- 10 Películas
    INSERT INTO CONTENIDO (titulo, tipo, anio_lanzamiento, duracion_minutos, sinopsis, clasificacion_edad, es_original_quindioflix, id_empleado_responsable)
    VALUES ('El Último Cafetal', 'PELICULA', 2023, 125, 'Drama sobre una familia cafetera en el Quindío.', '+13', 'S', v_emp_cont_jefe) RETURNING id_contenido INTO v_contenido(1);
    INSERT INTO CONTENIDO (titulo, tipo, anio_lanzamiento, duracion_minutos, sinopsis, clasificacion_edad, es_original_quindioflix, id_empleado_responsable)
    VALUES ('Aventura en la Cordillera', 'PELICULA', 2022, 110, 'Acción y aventura en los Andes colombianos.', 'TP', 'N', v_emp_cont_jefe) RETURNING id_contenido INTO v_contenido(2);
    INSERT INTO CONTENIDO (titulo, tipo, anio_lanzamiento, duracion_minutos, sinopsis, clasificacion_edad, es_original_quindioflix, id_empleado_responsable)
    VALUES ('Risas del Eje', 'PELICULA', 2024, 95, 'Comedia romántica entre dos pueblos del eje cafetero.', 'TP', 'S', v_emp_cont_jefe) RETURNING id_contenido INTO v_contenido(3);
    INSERT INTO CONTENIDO (titulo, tipo, anio_lanzamiento, duracion_minutos, sinopsis, clasificacion_edad, es_original_quindioflix, id_empleado_responsable)
    VALUES ('La Sombra del Parque', 'PELICULA', 2021, 105, 'Terror psicológico en un parque nacional.', '+16', 'N', v_emp_cont_jefe) RETURNING id_contenido INTO v_contenido(4);
    INSERT INTO CONTENIDO (titulo, tipo, anio_lanzamiento, duracion_minutos, sinopsis, clasificacion_edad, es_original_quindioflix, id_empleado_responsable)
    VALUES ('Código Quindío', 'PELICULA', 2023, 118, 'Ciencia ficción sobre inteligencia artificial en Armenia.', '+13', 'S', v_emp_cont_jefe) RETURNING id_contenido INTO v_contenido(5);
    INSERT INTO CONTENIDO (titulo, tipo, anio_lanzamiento, duracion_minutos, sinopsis, clasificacion_edad, es_original_quindioflix, id_empleado_responsable)
    VALUES ('Amor por Entregas', 'PELICULA', 2022, 102, 'Romance entre repartidores de café.', 'TP', 'N', v_emp_cont_jefe) RETURNING id_contenido INTO v_contenido(6);
    INSERT INTO CONTENIDO (titulo, tipo, anio_lanzamiento, duracion_minutos, sinopsis, clasificacion_edad, es_original_quindioflix, id_empleado_responsable)
    VALUES ('La Leyenda del Cacique', 'PELICULA', 2020, 135, 'Épica histórica del Quindío.', 'TP', 'N', v_emp_cont_jefe) RETURNING id_contenido INTO v_contenido(7);
    INSERT INTO CONTENIDO (titulo, tipo, anio_lanzamiento, duracion_minutos, sinopsis, clasificacion_edad, es_original_quindioflix, id_empleado_responsable)
    VALUES ('Noche de Miedo', 'PELICULA', 2024, 98, 'Terror sobrenatural en una finca cafetera.', '+18', 'N', v_emp_cont_jefe) RETURNING id_contenido INTO v_contenido(8);
    INSERT INTO CONTENIDO (titulo, tipo, anio_lanzamiento, duracion_minutos, sinopsis, clasificacion_edad, es_original_quindioflix, id_empleado_responsable)
    VALUES ('Pequeños Gigantes', 'PELICULA', 2023, 88, 'Aventura infantil en el parque del café.', 'TP', 'S', v_emp_cont_jefe) RETURNING id_contenido INTO v_contenido(9);
    INSERT INTO CONTENIDO (titulo, tipo, anio_lanzamiento, duracion_minutos, sinopsis, clasificacion_edad, es_original_quindioflix, id_empleado_responsable)
    VALUES ('El Misterio del Quindío', 'PELICULA', 2021, 112, 'Suspenso sobre un detective local.', '+13', 'N', v_emp_cont_jefe) RETURNING id_contenido INTO v_contenido(10);

    -- 8 Series
    INSERT INTO CONTENIDO (titulo, tipo, anio_lanzamiento, duracion_minutos, sinopsis, clasificacion_edad, es_original_quindioflix, id_empleado_responsable)
    VALUES ('Café y Secretos', 'SERIE', 2023, NULL, 'Drama familiar en una finca tradicional.', '+13', 'S', v_emp_cont_jefe) RETURNING id_contenido INTO v_contenido(11);
    INSERT INTO CONTENIDO (titulo, tipo, anio_lanzamiento, duracion_minutos, sinopsis, clasificacion_edad, es_original_quindioflix, id_empleado_responsable)
    VALUES ('Valle de Sombras', 'SERIE', 2022, NULL, 'Suspenso en un pueblo misterioso.', '+16', 'N', v_emp_cont_jefe) RETURNING id_contenido INTO v_contenido(12);
    INSERT INTO CONTENIDO (titulo, tipo, anio_lanzamiento, duracion_minutos, sinopsis, clasificacion_edad, es_original_quindioflix, id_empleado_responsable)
    VALUES ('Risas Quindianas', 'SERIE', 2024, NULL, 'Comedia sobre jóvenes emprendedores.', 'TP', 'S', v_emp_cont_jefe) RETURNING id_contenido INTO v_contenido(13);
    INSERT INTO CONTENIDO (titulo, tipo, anio_lanzamiento, duracion_minutos, sinopsis, clasificacion_edad, es_original_quindioflix, id_empleado_responsable)
    VALUES ('Guardianes del Río', 'SERIE', 2021, NULL, 'Acción ambientalista en el Quindío.', 'TP', 'N', v_emp_cont_jefe) RETURNING id_contenido INTO v_contenido(14);
    INSERT INTO CONTENIDO (titulo, tipo, anio_lanzamiento, duracion_minutos, sinopsis, clasificacion_edad, es_original_quindioflix, id_empleado_responsable)
    VALUES ('Amores de Pueblo', 'SERIE', 2020, NULL, 'Romance entre familias de distintas veredas.', 'TP', 'N', v_emp_cont_jefe) RETURNING id_contenido INTO v_contenido(15);
    INSERT INTO CONTENIDO (titulo, tipo, anio_lanzamiento, duracion_minutos, sinopsis, clasificacion_edad, es_original_quindioflix, id_empleado_responsable)
    VALUES ('Misión Armenia', 'SERIE', 2023, NULL, 'Ciencia ficción espacial.', '+13', 'S', v_emp_cont_jefe) RETURNING id_contenido INTO v_contenido(16);
    INSERT INTO CONTENIDO (titulo, tipo, anio_lanzamiento, duracion_minutos, sinopsis, clasificacion_edad, es_original_quindioflix, id_empleado_responsable)
    VALUES ('Terror en la Finca', 'SERIE', 2022, NULL, 'Serie de terror antológica.', '+18', 'N', v_emp_cont_jefe) RETURNING id_contenido INTO v_contenido(17);
    INSERT INTO CONTENIDO (titulo, tipo, anio_lanzamiento, duracion_minutos, sinopsis, clasificacion_edad, es_original_quindioflix, id_empleado_responsable)
    VALUES ('Los Pequeños Exploradores', 'SERIE', 2024, NULL, 'Aventuras infantiles educativas.', 'TP', 'S', v_emp_cont_jefe) RETURNING id_contenido INTO v_contenido(18);

    -- 7 Documentales
    INSERT INTO CONTENIDO (titulo, tipo, anio_lanzamiento, duracion_minutos, sinopsis, clasificacion_edad, es_original_quindioflix, id_empleado_responsable)
    VALUES ('El Café del Quindío', 'DOCUMENTAL', 2023, 92, 'Historia del café en la región.', 'TP', 'S', v_emp_cont_jefe) RETURNING id_contenido INTO v_contenido(19);
    INSERT INTO CONTENIDO (titulo, tipo, anio_lanzamiento, duracion_minutos, sinopsis, clasificacion_edad, es_original_quindioflix, id_empleado_responsable)
    VALUES ('Biodiversidad del Eje', 'DOCUMENTAL', 2022, 85, 'Fauna y flora de la cordillera central.', 'TP', 'N', v_emp_cont_jefe) RETURNING id_contenido INTO v_contenido(20);
    INSERT INTO CONTENIDO (titulo, tipo, anio_lanzamiento, duracion_minutos, sinopsis, clasificacion_edad, es_original_quindioflix, id_empleado_responsable)
    VALUES ('Arquitectura Tradicional', 'DOCUMENTAL', 2021, 78, 'Casas coloniales del Quindío.', 'TP', 'S', v_emp_cont_jefe) RETURNING id_contenido INTO v_contenido(21);
    INSERT INTO CONTENIDO (titulo, tipo, anio_lanzamiento, duracion_minutos, sinopsis, clasificacion_edad, es_original_quindioflix, id_empleado_responsable)
    VALUES ('Mujeres del Cafetal', 'DOCUMENTAL', 2024, 88, 'Historias de mujeres cafeteras.', 'TP', 'N', v_emp_cont_jefe) RETURNING id_contenido INTO v_contenido(22);
    INSERT INTO CONTENIDO (titulo, tipo, anio_lanzamiento, duracion_minutos, sinopsis, clasificacion_edad, es_original_quindioflix, id_empleado_responsable)
    VALUES ('Carnavales y Tradiciones', 'DOCUMENTAL', 2020, 72, 'Festividades locales.', 'TP', 'N', v_emp_cont_jefe) RETURNING id_contenido INTO v_contenido(23);
    INSERT INTO CONTENIDO (titulo, tipo, anio_lanzamiento, duracion_minutos, sinopsis, clasificacion_edad, es_original_quindioflix, id_empleado_responsable)
    VALUES ('El Parque del Café', 'DOCUMENTAL', 2023, 65, 'Historia del parque temático.', 'TP', 'S', v_emp_cont_jefe) RETURNING id_contenido INTO v_contenido(24);
    INSERT INTO CONTENIDO (titulo, tipo, anio_lanzamiento, duracion_minutos, sinopsis, clasificacion_edad, es_original_quindioflix, id_empleado_responsable)
    VALUES ('Cumbia Quindiana', 'DOCUMENTAL', 2022, 70, 'Música tradicional del Quindío.', 'TP', 'N', v_emp_cont_jefe) RETURNING id_contenido INTO v_contenido(25);

    -- 7 Música
    INSERT INTO CONTENIDO (titulo, tipo, anio_lanzamiento, duracion_minutos, sinopsis, clasificacion_edad, es_original_quindioflix, id_empleado_responsable)
    VALUES ('Concierto en Armenia', 'MUSICA', 2024, 120, 'Concierto en vivo con artistas locales.', 'TP', 'S', v_emp_cont_jefe) RETURNING id_contenido INTO v_contenido(26);
    INSERT INTO CONTENIDO (titulo, tipo, anio_lanzamiento, duracion_minutos, sinopsis, clasificacion_edad, es_original_quindioflix, id_empleado_responsable)
    VALUES ('Sinfonía del Eje', 'MUSICA', 2023, 95, 'Orquesta sinfónica del eje cafetero.', 'TP', 'N', v_emp_cont_jefe) RETURNING id_contenido INTO v_contenido(27);
    INSERT INTO CONTENIDO (titulo, tipo, anio_lanzamiento, duracion_minutos, sinopsis, clasificacion_edad, es_original_quindioflix, id_empleado_responsable)
    VALUES ('Festival Quindiano', 'MUSICA', 2022, 150, 'Recopilación del festival anual.', 'TP', 'N', v_emp_cont_jefe) RETURNING id_contenido INTO v_contenido(28);
    INSERT INTO CONTENIDO (titulo, tipo, anio_lanzamiento, duracion_minutos, sinopsis, clasificacion_edad, es_original_quindioflix, id_empleado_responsable)
    VALUES ('Boleros de Montaña', 'MUSICA', 2021, 68, 'Boleros tradicionales con sabor quindiano.', 'TP', 'S', v_emp_cont_jefe) RETURNING id_contenido INTO v_contenido(29);
    INSERT INTO CONTENIDO (titulo, tipo, anio_lanzamiento, duracion_minutos, sinopsis, clasificacion_edad, es_original_quindioflix, id_empleado_responsable)
    VALUES ('Rock del Quindío', 'MUSICA', 2023, 85, 'Bandas de rock locales.', '+13', 'N', v_emp_cont_jefe) RETURNING id_contenido INTO v_contenido(30);
    INSERT INTO CONTENIDO (titulo, tipo, anio_lanzamiento, duracion_minutos, sinopsis, clasificacion_edad, es_original_quindioflix, id_empleado_responsable)
    VALUES ('Canciones Infantiles', 'MUSICA', 2024, 45, 'Música educativa para niños.', 'TP', 'S', v_emp_cont_jefe) RETURNING id_contenido INTO v_contenido(31);
    INSERT INTO CONTENIDO (titulo, tipo, anio_lanzamiento, duracion_minutos, sinopsis, clasificacion_edad, es_original_quindioflix, id_empleado_responsable)
    VALUES ('Jazz en el Parque', 'MUSICA', 2022, 110, 'Festival de jazz al aire libre.', 'TP', 'N', v_emp_cont_jefe) RETURNING id_contenido INTO v_contenido(32);

    -- 8 Podcasts
    INSERT INTO CONTENIDO (titulo, tipo, anio_lanzamiento, duracion_minutos, sinopsis, clasificacion_edad, es_original_quindioflix, id_empleado_responsable)
    VALUES ('Café con Historia', 'PODCAST', 2024, NULL, 'Historias locales contadas por sus protagonistas.', 'TP', 'S', v_emp_cont_jefe) RETURNING id_contenido INTO v_contenido(33);
    INSERT INTO CONTENIDO (titulo, tipo, anio_lanzamiento, duracion_minutos, sinopsis, clasificacion_edad, es_original_quindioflix, id_empleado_responsable)
    VALUES ('Emprendedores del Eje', 'PODCAST', 2023, NULL, 'Entrevistas a emprendedores locales.', 'TP', 'N', v_emp_cont_jefe) RETURNING id_contenido INTO v_contenido(34);
    INSERT INTO CONTENIDO (titulo, tipo, anio_lanzamiento, duracion_minutos, sinopsis, clasificacion_edad, es_original_quindioflix, id_empleado_responsable)
    VALUES ('Misterios Quindianos', 'PODCAST', 2022, NULL, 'Leyendas y misterios locales.', '+13', 'N', v_emp_cont_jefe) RETURNING id_contenido INTO v_contenido(35);
    INSERT INTO CONTENIDO (titulo, tipo, anio_lanzamiento, duracion_minutos, sinopsis, clasificacion_edad, es_original_quindioflix, id_empleado_responsable)
    VALUES ('Cultura y Café', 'PODCAST', 2021, NULL, 'Cultura e historia del eje cafetero.', 'TP', 'S', v_emp_cont_jefe) RETURNING id_contenido INTO v_contenido(36);
    INSERT INTO CONTENIDO (titulo, tipo, anio_lanzamiento, duracion_minutos, sinopsis, clasificacion_edad, es_original_quindioflix, id_empleado_responsable)
    VALUES ('Tecnología para Todos', 'PODCAST', 2023, NULL, 'Tecnología accesible para la comunidad.', 'TP', 'N', v_emp_cont_jefe) RETURNING id_contenido INTO v_contenido(37);
    INSERT INTO CONTENIDO (titulo, tipo, anio_lanzamiento, duracion_minutos, sinopsis, clasificacion_edad, es_original_quindioflix, id_empleado_responsable)
    VALUES ('Deporte Quindiano', 'PODCAST', 2024, NULL, 'Análisis deportivo local y nacional.', 'TP', 'N', v_emp_cont_jefe) RETURNING id_contenido INTO v_contenido(38);
    INSERT INTO CONTENIDO (titulo, tipo, anio_lanzamiento, duracion_minutos, sinopsis, clasificacion_edad, es_original_quindioflix, id_empleado_responsable)
    VALUES ('Salud y Bienestar', 'PODCAST', 2022, NULL, 'Consejos de salud para la región.', 'TP', 'S', v_emp_cont_jefe) RETURNING id_contenido INTO v_contenido(39);
    INSERT INTO CONTENIDO (titulo, tipo, anio_lanzamiento, duracion_minutos, sinopsis, clasificacion_edad, es_original_quindioflix, id_empleado_responsable)
    VALUES ('Cocina Tradicional', 'PODCAST', 2023, NULL, 'Recetas y tradiciones culinarias.', 'TP', 'N', v_emp_cont_jefe) RETURNING id_contenido INTO v_contenido(40);
    DBMS_OUTPUT.PUT_LINE('Contenidos insertados: 40');

    -- 9. CONTENIDO_GENERO (asignación variada)
    -- Películas
    INSERT INTO CONTENIDO_GENERO VALUES (v_contenido(1), v_gen_drama);
    INSERT INTO CONTENIDO_GENERO VALUES (v_contenido(2), v_gen_accion);
    INSERT INTO CONTENIDO_GENERO VALUES (v_contenido(2), v_gen_drama); -- Acción + Drama
    INSERT INTO CONTENIDO_GENERO VALUES (v_contenido(3), v_gen_comedia);
    INSERT INTO CONTENIDO_GENERO VALUES (v_contenido(3), v_gen_romance);
    INSERT INTO CONTENIDO_GENERO VALUES (v_contenido(4), v_gen_terror);
    INSERT INTO CONTENIDO_GENERO VALUES (v_contenido(5), v_gen_ciencia);
    INSERT INTO CONTENIDO_GENERO VALUES (v_contenido(5), v_gen_accion);
    INSERT INTO CONTENIDO_GENERO VALUES (v_contenido(6), v_gen_romance);
    INSERT INTO CONTENIDO_GENERO VALUES (v_contenido(6), v_gen_comedia);
    INSERT INTO CONTENIDO_GENERO VALUES (v_contenido(7), v_gen_accion);
    INSERT INTO CONTENIDO_GENERO VALUES (v_contenido(7), v_gen_drama);
    INSERT INTO CONTENIDO_GENERO VALUES (v_contenido(8), v_gen_terror);
    INSERT INTO CONTENIDO_GENERO VALUES (v_contenido(8), v_gen_suspenso);
    INSERT INTO CONTENIDO_GENERO VALUES (v_contenido(9), v_gen_infantil);
    INSERT INTO CONTENIDO_GENERO VALUES (v_contenido(9), v_gen_comedia);
    INSERT INTO CONTENIDO_GENERO VALUES (v_contenido(10), v_gen_suspenso);
    INSERT INTO CONTENIDO_GENERO VALUES (v_contenido(10), v_gen_drama);
    -- Series
    INSERT INTO CONTENIDO_GENERO VALUES (v_contenido(11), v_gen_drama);
    INSERT INTO CONTENIDO_GENERO VALUES (v_contenido(12), v_gen_suspenso);
    INSERT INTO CONTENIDO_GENERO VALUES (v_contenido(12), v_gen_terror);
    INSERT INTO CONTENIDO_GENERO VALUES (v_contenido(13), v_gen_comedia);
    INSERT INTO CONTENIDO_GENERO VALUES (v_contenido(14), v_gen_accion);
    INSERT INTO CONTENIDO_GENERO VALUES (v_contenido(15), v_gen_romance);
    INSERT INTO CONTENIDO_GENERO VALUES (v_contenido(15), v_gen_drama);
    INSERT INTO CONTENIDO_GENERO VALUES (v_contenido(16), v_gen_ciencia);
    INSERT INTO CONTENIDO_GENERO VALUES (v_contenido(17), v_gen_terror);
    INSERT INTO CONTENIDO_GENERO VALUES (v_contenido(18), v_gen_infantil);
    INSERT INTO CONTENIDO_GENERO VALUES (v_contenido(18), v_gen_accion);
    -- Documentales (todos TP, sin género fijo, asignamos varios)
    FOR i IN 19..25 LOOP
        INSERT INTO CONTENIDO_GENERO VALUES (v_contenido(i), v_gen_drama);
    END LOOP;
    -- Música
    FOR i IN 26..32 LOOP
        INSERT INTO CONTENIDO_GENERO VALUES (v_contenido(i), v_gen_romance);
    END LOOP;
    -- Podcasts
    FOR i IN 33..40 LOOP
        INSERT INTO CONTENIDO_GENERO VALUES (v_contenido(i), CASE WHEN MOD(i,2)=0 THEN v_gen_comedia ELSE v_gen_drama END);
    END LOOP;
    DBMS_OUTPUT.PUT_LINE('Contenido-Genero insertados');

    -- 10. CONTENIDO_RELACIONADO
    INSERT INTO CONTENIDO_RELACIONADO (id_contenido_origen, id_contenido_destino, tipo_relacion, descripcion)
    VALUES (v_contenido(1), v_contenido(11), 'SPIN-OFF', 'La serie expande la historia de la película');
    INSERT INTO CONTENIDO_RELACIONADO (id_contenido_origen, id_contenido_destino, tipo_relacion, descripcion)
    VALUES (v_contenido(5), v_contenido(16), 'SECUELA', 'Continuación de la historia');
    INSERT INTO CONTENIDO_RELACIONADO (id_contenido_origen, id_contenido_destino, tipo_relacion, descripcion)
    VALUES (v_contenido(4), v_contenido(17), 'REMAKE', 'Nueva versión de la historia');
    INSERT INTO CONTENIDO_RELACIONADO (id_contenido_origen, id_contenido_destino, tipo_relacion, descripcion)
    VALUES (v_contenido(9), v_contenido(18), 'SPIN-OFF', 'Versión infantil');
    INSERT INTO CONTENIDO_RELACIONADO (id_contenido_origen, id_contenido_destino, tipo_relacion, descripcion)
    VALUES (v_contenido(3), v_contenido(6), 'VERSION_EXTENDIDA', 'Edición extendida del romance');
    INSERT INTO CONTENIDO_RELACIONADO (id_contenido_origen, id_contenido_destino, tipo_relacion, descripcion)
    VALUES (v_contenido(7), v_contenido(14), 'PRECUELA', 'Historia anterior a la serie');
    DBMS_OUTPUT.PUT_LINE('Contenido relacionado insertado: 6');

    -- 11. TEMPORADA (15 temporadas para series y podcasts)
    -- Series: Café y Secretos (3 temp), Valle de Sombras (2), Risas Quindianas (2), Guardianes del Río (2), Amores de Pueblo (1), Misión Armenia (2), Terror en la Finca (2), Pequeños Exploradores (1)
    -- Podcasts: Café con Historia (2), Emprendedores del Eje (1), Misterios Quindianos (1), Cultura y Café (1), Tecnología para Todos (1), Deporte Quindiano (1), Salud y Bienestar (1), Cocina Tradicional (1)
    k := 1;
    -- Serie 11: Café y Secretos
    INSERT INTO TEMPORADA (id_contenido, numero_temporada, titulo, anio, sinopsis) VALUES (v_contenido(11), 1, 'Orígenes', 2023, 'Los inicios de la familia.') RETURNING id_temporada INTO v_temporada(k); k := k + 1;
    INSERT INTO TEMPORADA (id_contenido, numero_temporada, titulo, anio, sinopsis) VALUES (v_contenido(11), 2, 'Secretos Revelados', 2024, 'Verdades que salen a la luz.') RETURNING id_temporada INTO v_temporada(k); k := k + 1;
    INSERT INTO TEMPORADA (id_contenido, numero_temporada, titulo, anio, sinopsis) VALUES (v_contenido(11), 3, 'Nuevos Rumbos', 2025, 'La familia enfrenta cambios.') RETURNING id_temporada INTO v_temporada(k); k := k + 1;
    -- Serie 12: Valle de Sombras
    INSERT INTO TEMPORADA (id_contenido, numero_temporada, titulo, anio, sinopsis) VALUES (v_contenido(12), 1, 'El Pueblo Oscuro', 2022, 'Llegada al pueblo misterioso.') RETURNING id_temporada INTO v_temporada(k); k := k + 1;
    INSERT INTO TEMPORADA (id_contenido, numero_temporada, titulo, anio, sinopsis) VALUES (v_contenido(12), 2, 'La Verdad', 2023, 'Descubrimientos inesperados.') RETURNING id_temporada INTO v_temporada(k); k := k + 1;
    -- Serie 13: Risas Quindianas
    INSERT INTO TEMPORADA (id_contenido, numero_temporada, titulo, anio, sinopsis) VALUES (v_contenido(13), 1, 'Primeros Pasos', 2024, 'Inicio del emprendimiento.') RETURNING id_temporada INTO v_temporada(k); k := k + 1;
    INSERT INTO TEMPORADA (id_contenido, numero_temporada, titulo, anio, sinopsis) VALUES (v_contenido(13), 2, 'Éxito y Caos', 2025, 'El negocio crece.') RETURNING id_temporada INTO v_temporada(k); k := k + 1;
    -- Serie 14: Guardianes del Río
    INSERT INTO TEMPORADA (id_contenido, numero_temporada, titulo, anio, sinopsis) VALUES (v_contenido(14), 1, 'La Amenaza', 2021, 'Contaminación del río.') RETURNING id_temporada INTO v_temporada(k); k := k + 1;
    INSERT INTO TEMPORADA (id_contenido, numero_temporada, titulo, anio, sinopsis) VALUES (v_contenido(14), 2, 'La Batalla', 2022, 'Lucha por la conservación.') RETURNING id_temporada INTO v_temporada(k); k := k + 1;
    -- Serie 15: Amores de Pueblo
    INSERT INTO TEMPORADA (id_contenido, numero_temporada, titulo, anio, sinopsis) VALUES (v_contenido(15), 1, 'Amor Prohibido', 2020, 'Romeo y Julieta quindiana.') RETURNING id_temporada INTO v_temporada(k); k := k + 1;
    -- Serie 16: Misión Armenia
    INSERT INTO TEMPORADA (id_contenido, numero_temporada, titulo, anio, sinopsis) VALUES (v_contenido(16), 1, 'El Lanzamiento', 2023, 'Primer viaje espacial.') RETURNING id_temporada INTO v_temporada(k); k := k + 1;
    INSERT INTO TEMPORADA (id_contenido, numero_temporada, titulo, anio, sinopsis) VALUES (v_contenido(16), 2, 'Marte Quindiano', 2024, 'Colonización marciana.') RETURNING id_temporada INTO v_temporada(k); k := k + 1;
    -- Serie 17: Terror en la Finca
    INSERT INTO TEMPORADA (id_contenido, numero_temporada, titulo, anio, sinopsis) VALUES (v_contenido(17), 1, 'Pesadillas', 2022, 'Primeras historias de terror.') RETURNING id_temporada INTO v_temporada(k); k := k + 1;
    INSERT INTO TEMPORADA (id_contenido, numero_temporada, titulo, anio, sinopsis) VALUES (v_contenido(17), 2, 'El Mal', 2023, 'Entidades malignas.') RETURNING id_temporada INTO v_temporada(k); k := k + 1;
    -- Serie 18: Pequeños Exploradores
    INSERT INTO TEMPORADA (id_contenido, numero_temporada, titulo, anio, sinopsis) VALUES (v_contenido(18), 1, 'La Aventura Comienza', 2024, 'Primer viaje de exploración.') RETURNING id_temporada INTO v_temporada(k); k := k + 1;
    DBMS_OUTPUT.PUT_LINE('Temporadas insertadas: ' || (k-1));

    -- 12. EPISODIO (50 episodios)
    j := 1;
    -- Temporada 1: 5 episodios
    FOR i IN 1..5 LOOP
        INSERT INTO EPISODIO (id_temporada, numero_episodio, titulo, duracion_minutos, sinopsis, fecha_lanzamiento)
        VALUES (v_temporada(1), i, 'Episodio ' || i, 45 + MOD(i,15), 'Desarrollo de la trama.', DATE '2023-01-15' + (i*7)) RETURNING id_episodio INTO v_episodio(j); j := j + 1;
    END LOOP;
    -- Temporada 2: 4 episodios
    FOR i IN 1..4 LOOP
        INSERT INTO EPISODIO (id_temporada, numero_episodio, titulo, duracion_minutos, sinopsis, fecha_lanzamiento)
        VALUES (v_temporada(2), i, 'Episodio ' || i, 45 + MOD(i,15), 'Más secretos.', DATE '2024-02-01' + (i*7)) RETURNING id_episodio INTO v_episodio(j); j := j + 1;
    END LOOP;
    -- Temporada 3: 3 episodios
    FOR i IN 1..3 LOOP
        INSERT INTO EPISODIO (id_temporada, numero_episodio, titulo, duracion_minutos, sinopsis, fecha_lanzamiento)
        VALUES (v_temporada(3), i, 'Episodio ' || i, 45 + MOD(i,15), 'Nuevos rumbos.', DATE '2025-01-10' + (i*7)) RETURNING id_episodio INTO v_episodio(j); j := j + 1;
    END LOOP;
    -- Temporada 4: 4 episodios
    FOR i IN 1..4 LOOP
        INSERT INTO EPISODIO (id_temporada, numero_episodio, titulo, duracion_minutos, sinopsis, fecha_lanzamiento)
        VALUES (v_temporada(4), i, 'Episodio ' || i, 50 + MOD(i,10), 'Misterio profundo.', DATE '2022-03-01' + (i*7)) RETURNING id_episodio INTO v_episodio(j); j := j + 1;
    END LOOP;
    -- Temporada 5: 3 episodios
    FOR i IN 1..3 LOOP
        INSERT INTO EPISODIO (id_temporada, numero_episodio, titulo, duracion_minutos, sinopsis, fecha_lanzamiento)
        VALUES (v_temporada(5), i, 'Episodio ' || i, 50 + MOD(i,10), 'Revelaciones.', DATE '2023-04-01' + (i*7)) RETURNING id_episodio INTO v_episodio(j); j := j + 1;
    END LOOP;
    -- Temporada 6: 3 episodios
    FOR i IN 1..3 LOOP
        INSERT INTO EPISODIO (id_temporada, numero_episodio, titulo, duracion_minutos, sinopsis, fecha_lanzamiento)
        VALUES (v_temporada(6), i, 'Episodio ' || i, 25 + MOD(i,10), 'Risas iniciales.', DATE '2024-01-15' + (i*7)) RETURNING id_episodio INTO v_episodio(j); j := j + 1;
    END LOOP;
    -- Temporada 7: 3 episodios
    FOR i IN 1..3 LOOP
        INSERT INTO EPISODIO (id_temporada, numero_episodio, titulo, duracion_minutos, sinopsis, fecha_lanzamiento)
        VALUES (v_temporada(7), i, 'Episodio ' || i, 25 + MOD(i,10), 'Caos divertido.', DATE '2025-02-01' + (i*7)) RETURNING id_episodio INTO v_episodio(j); j := j + 1;
    END LOOP;
    -- Temporada 8: 3 episodios
    FOR i IN 1..3 LOOP
        INSERT INTO EPISODIO (id_temporada, numero_episodio, titulo, duracion_minutos, sinopsis, fecha_lanzamiento)
        VALUES (v_temporada(8), i, 'Episodio ' || i, 40 + MOD(i,10), 'La amenaza crece.', DATE '2021-05-01' + (i*7)) RETURNING id_episodio INTO v_episodio(j); j := j + 1;
    END LOOP;
    -- Temporada 9: 2 episodios
    FOR i IN 1..2 LOOP
        INSERT INTO EPISODIO (id_temporada, numero_episodio, titulo, duracion_minutos, sinopsis, fecha_lanzamiento)
        VALUES (v_temporada(9), i, 'Episodio ' || i, 40 + MOD(i,10), 'La batalla final.', DATE '2022-06-01' + (i*7)) RETURNING id_episodio INTO v_episodio(j); j := j + 1;
    END LOOP;
    -- Temporada 10: 2 episodios
    FOR i IN 1..2 LOOP
        INSERT INTO EPISODIO (id_temporada, numero_episodio, titulo, duracion_minutos, sinopsis, fecha_lanzamiento)
        VALUES (v_temporada(10), i, 'Episodio ' || i, 35 + MOD(i,10), 'Amor verdadero.', DATE '2020-07-01' + (i*7)) RETURNING id_episodio INTO v_episodio(j); j := j + 1;
    END LOOP;
    -- Temporada 11: 3 episodios
    FOR i IN 1..3 LOOP
        INSERT INTO EPISODIO (id_temporada, numero_episodio, titulo, duracion_minutos, sinopsis, fecha_lanzamiento)
        VALUES (v_temporada(11), i, 'Episodio ' || i, 45 + MOD(i,15), 'Viaje espacial.', DATE '2023-03-01' + (i*7)) RETURNING id_episodio INTO v_episodio(j); j := j + 1;
    END LOOP;
    -- Temporada 12: 3 episodios
    FOR i IN 1..3 LOOP
        INSERT INTO EPISODIO (id_temporada, numero_episodio, titulo, duracion_minutos, sinopsis, fecha_lanzamiento)
        VALUES (v_temporada(12), i, 'Episodio ' || i, 45 + MOD(i,15), 'Marte.', DATE '2024-04-01' + (i*7)) RETURNING id_episodio INTO v_episodio(j); j := j + 1;
    END LOOP;
    -- Temporada 13: 2 episodios
    FOR i IN 1..2 LOOP
        INSERT INTO EPISODIO (id_temporada, numero_episodio, titulo, duracion_minutos, sinopsis, fecha_lanzamiento)
        VALUES (v_temporada(13), i, 'Episodio ' || i, 40 + MOD(i,10), 'Pesadilla.', DATE '2022-08-01' + (i*7)) RETURNING id_episodio INTO v_episodio(j); j := j + 1;
    END LOOP;
    -- Temporada 14: 2 episodios
    FOR i IN 1..2 LOOP
        INSERT INTO EPISODIO (id_temporada, numero_episodio, titulo, duracion_minutos, sinopsis, fecha_lanzamiento)
        VALUES (v_temporada(14), i, 'Episodio ' || i, 40 + MOD(i,10), 'El mal crece.', DATE '2023-09-01' + (i*7)) RETURNING id_episodio INTO v_episodio(j); j := j + 1;
    END LOOP;
    -- Temporada 15: 3 episodios
    FOR i IN 1..3 LOOP
        INSERT INTO EPISODIO (id_temporada, numero_episodio, titulo, duracion_minutos, sinopsis, fecha_lanzamiento)
        VALUES (v_temporada(15), i, 'Episodio ' || i, 30 + MOD(i,10), 'Aventura inicia.', DATE '2024-05-01' + (i*7)) RETURNING id_episodio INTO v_episodio(j); j := j + 1;
    END LOOP;
    DBMS_OUTPUT.PUT_LINE('Episodios insertados: ' || (j-1));

    -- 13. REPRODUCCION (200 registros)
    FOR i IN 1..200 LOOP
        IF MOD(i, 2) = 1 THEN
            -- Reproducción de contenido directo (película, documental, música)
            INSERT INTO REPRODUCCION (id_perfil, id_contenido, fecha_inicio, fecha_fin, dispositivo, porcentaje_avance)
            VALUES (
                v_perfiles(MOD(i, 26) + 1), -- Usa perfiles 1-26 (los primeros)
                v_contenido(MOD(i, 10) + 1), -- Películas 1-10
                TIMESTAMP '2024-01-01 10:00:00' + NUMTODSINTERVAL(i*3, 'HOUR') + NUMTODSINTERVAL(MOD(i,60), 'MINUTE'),
                CASE WHEN MOD(i,4) = 0 THEN NULL ELSE TIMESTAMP '2024-01-01 10:00:00' + NUMTODSINTERVAL(i*3+1, 'HOUR') + NUMTODSINTERVAL(MOD(i,60), 'MINUTE') END,
                CASE MOD(i,4) WHEN 0 THEN 'CELULAR' WHEN 1 THEN 'TABLET' WHEN 2 THEN 'TV' ELSE 'COMPUTADOR' END,
                CASE WHEN MOD(i,4) = 0 THEN 0 ELSE MOD(i*7, 101) END
            );
        ELSE
            -- Reproducción de episodio (serie/podcast)
            INSERT INTO REPRODUCCION (id_perfil, id_episodio, fecha_inicio, fecha_fin, dispositivo, porcentaje_avance)
            VALUES (
                v_perfiles(MOD(i, 26) + 1),
                v_episodio(MOD(i, 43) + 1), -- Episodios 1-44 (tenemos ~43)
                TIMESTAMP '2025-01-01 08:00:00' + NUMTODSINTERVAL(i*2, 'HOUR') + NUMTODSINTERVAL(MOD(i,60), 'MINUTE'),
                CASE WHEN MOD(i,5) = 0 THEN NULL ELSE TIMESTAMP '2025-01-01 08:00:00' + NUMTODSINTERVAL(i*2+1, 'HOUR') + NUMTODSINTERVAL(MOD(i,60), 'MINUTE') END,
                CASE MOD(i,4) WHEN 0 THEN 'TV' WHEN 1 THEN 'COMPUTADOR' WHEN 2 THEN 'CELULAR' ELSE 'TABLET' END,
                CASE WHEN MOD(i,5) = 0 THEN 0 ELSE MOD(i*13, 101) END
            );
        END IF;
    END LOOP;
    DBMS_OUTPUT.PUT_LINE('Reproducciones insertadas: 200');

    -- Reproducciones en 2026 (adicional para llenar partición)
    FOR i IN 1..20 LOOP
        INSERT INTO REPRODUCCION (id_perfil, id_contenido, fecha_inicio, fecha_fin, dispositivo, porcentaje_avance)
        VALUES (
            v_perfiles(MOD(i, 10) + 1),
            v_contenido(MOD(i, 10) + 1), -- Películas 1-10
            TIMESTAMP '2026-01-01 14:00:00' + NUMTODSINTERVAL(i*4, 'HOUR'),
            TIMESTAMP '2026-01-01 14:00:00' + NUMTODSINTERVAL(i*4+2, 'HOUR'),
            'TV',
            MOD(i*17, 101)
        );
    END LOOP;
    DBMS_OUTPUT.PUT_LINE('Reproducciones 2026 insertadas: 20');

    -- 14. FAVORITO (40 registros)
    FOR i IN 1..40 LOOP
        INSERT INTO FAVORITO (id_perfil, id_contenido, fecha_agregado)
        VALUES (
            v_perfiles(MOD(i, 26) + 1),
            v_contenido(MOD(i, 40) + 1),
            DATE '2024-01-01' + MOD(i, 365)
        );
    END LOOP;
    DBMS_OUTPUT.PUT_LINE('Favoritos insertados: 40');

    -- 15. CALIFICACION (hasta 60 registros, solo para contenido con >=50% reproduccion)
    --     Se obtienen de las reproducciones existentes para cumplir
    --     el trigger TRG_VERIFICAR_REPRODUCCION_CALIFICACION.
    DECLARE
        v_idx PLS_INTEGER := 1;
    BEGIN
        FOR r IN (
            SELECT id_perfil, id_contenido
            FROM (
                SELECT DISTINCT id_perfil, id_contenido
                FROM (
                    -- Reproducciones directas (pelicula, documental, musica)
                    SELECT id_perfil, id_contenido
                    FROM REPRODUCCION
                    WHERE porcentaje_avance >= 50
                      AND id_contenido IS NOT NULL
                    UNION ALL
                    -- Reproducciones por episodio (serie, podcast)
                    SELECT r.id_perfil, t.id_contenido
                    FROM REPRODUCCION r
                    JOIN EPISODIO e ON r.id_episodio = e.id_episodio
                    JOIN TEMPORADA t ON e.id_temporada = t.id_temporada
                    WHERE r.porcentaje_avance >= 50
                )
            )
            WHERE ROWNUM <= 60
        ) LOOP
            INSERT INTO CALIFICACION (id_perfil, id_contenido, estrellas, resena, fecha_calificacion)
            VALUES (
                r.id_perfil,
                r.id_contenido,
                MOD(v_idx, 5) + 1,
                CASE MOD(v_idx, 6)
                    WHEN 0 THEN 'Excelente contenido, muy recomendado.'
                    WHEN 1 THEN 'Buena historia, actuaciones sólidas.'
                    WHEN 2 THEN 'Entretenido pero predecible.'
                    WHEN 3 THEN 'Regular, esperaba más.'
                    WHEN 4 THEN 'No me gustó mucho la trama.'
                    ELSE 'Impresionante, historia del Quindío contada con maestría.'
                END,
                DATE '2024-02-01' + MOD(v_idx, 300)
            );
            v_idx := v_idx + 1;
        END LOOP;
        DBMS_OUTPUT.PUT_LINE('Calificaciones insertadas: ' || (v_idx - 1));
    END;

    -- 16. REPORTE_CONTENIDO (10 registros)
    INSERT INTO REPORTE_CONTENIDO (id_perfil_reportador, id_contenido, motivo, estado, id_empleado_moderador)
    VALUES (v_perfiles(1), v_contenido(8), 'Contenido violento inapropiado', 'PENDIENTE', NULL);
    INSERT INTO REPORTE_CONTENIDO (id_perfil_reportador, id_contenido, motivo, estado, id_empleado_moderador)
    VALUES (v_perfiles(2), v_contenido(17), 'Escenas de terror muy gráficas', 'EN_REVISION', v_emp_sop_jefe);
    INSERT INTO REPORTE_CONTENIDO (id_perfil_reportador, id_contenido, motivo, estado, id_empleado_moderador, fecha_resolucion, comentario_resolucion)
    VALUES (v_perfiles(3), v_contenido(4), 'No apto para menores sin advertencia', 'RESUELTO', v_emp_sop_jefe, SYSTIMESTAMP, 'Se agregó advertencia de contenido');
    INSERT INTO REPORTE_CONTENIDO (id_perfil_reportador, id_contenido, motivo, estado, id_empleado_moderador, fecha_resolucion, comentario_resolucion)
    VALUES (v_perfiles(4), v_contenido(10), 'Información errónea sobre lugares', 'RECHAZADO', v_emp_sop_jefe, SYSTIMESTAMP, 'El contenido fue verificado y es correcto');
    INSERT INTO REPORTE_CONTENIDO (id_perfil_reportador, id_contenido, motivo, estado, id_empleado_moderador)
    VALUES (v_perfiles(5), v_contenido(8), 'Exceso de violencia', 'PENDIENTE', NULL);
    INSERT INTO REPORTE_CONTENIDO (id_perfil_reportador, id_contenido, motivo, estado, id_empleado_moderador)
    VALUES (v_perfiles(6), v_contenido(12), 'Contenido inquietante para niños', 'EN_REVISION', v_emp_sop_jefe);
    INSERT INTO REPORTE_CONTENIDO (id_perfil_reportador, id_contenido, motivo, estado, id_empleado_moderador, fecha_resolucion, comentario_resolucion)
    VALUES (v_perfiles(7), v_contenido(16), 'Lenguaje inapropiado', 'RESUELTO', v_emp_sop_jefe, SYSTIMESTAMP, 'Se editaron las escenas reportadas');
    INSERT INTO REPORTE_CONTENIDO (id_perfil_reportador, id_contenido, motivo, estado, id_empleado_moderador)
    VALUES (v_perfiles(8), v_contenido(7), 'Estereotipos negativos', 'PENDIENTE', NULL);
    INSERT INTO REPORTE_CONTENIDO (id_perfil_reportador, id_contenido, motivo, estado, id_empleado_moderador)
    VALUES (v_perfiles(9), v_contenido(22), 'Imágenes sin autorización', 'EN_REVISION', v_emp_sop_jefe);
    INSERT INTO REPORTE_CONTENIDO (id_perfil_reportador, id_contenido, motivo, estado, id_empleado_moderador, fecha_resolucion, comentario_resolucion)
    VALUES (v_perfiles(10), v_contenido(25), 'Contenido político sesgado', 'RECHAZADO', v_emp_sop_jefe, SYSTIMESTAMP, 'El documental presenta múltiples perspectivas');
    DBMS_OUTPUT.PUT_LINE('Reportes insertados: 10');

    -- 17. PAGO (80 registros)
    FOR i IN 1..80 LOOP
        INSERT INTO PAGO (id_usuario, id_plan, fecha_pago, monto, metodo_pago, estado_pago, descuento_aplicado, descripcion_descuento)
        VALUES (
            v_usuarios(MOD(i, 30) + 1),
            CASE WHEN MOD(i, 3) = 0 THEN v_plan_basico WHEN MOD(i, 3) = 1 THEN v_plan_estandar ELSE v_plan_premium END,
            DATE '2024-01-01' + MOD(i, 450),
            CASE WHEN MOD(i, 3) = 0 THEN 12900 WHEN MOD(i, 3) = 1 THEN 19900 ELSE 29900 END,
            CASE MOD(i, 5) WHEN 0 THEN 'TARJETA_CREDITO' WHEN 1 THEN 'TARJETA_DEBITO' WHEN 2 THEN 'PSE' WHEN 3 THEN 'NEQUI' ELSE 'DAVIPLATA' END,
            CASE WHEN MOD(i, 7) = 0 THEN 'FALLIDO' WHEN MOD(i, 11) = 0 THEN 'PENDIENTE' ELSE 'EXITOSO' END,
            CASE WHEN MOD(i, 10) = 0 THEN 5000 ELSE 0 END,
            CASE WHEN MOD(i, 10) = 0 THEN 'Descuento por referido' ELSE NULL END
        );
    END LOOP;
    DBMS_OUTPUT.PUT_LINE('Pagos insertados: 80');

    -- 18. REFERIDO (5 registros de usuarios referidos)
    INSERT INTO REFERIDO (id_usuario_referidor, id_usuario_nuevo, fecha_referido, beneficio_aplicado_referidor, beneficio_aplicado_nuevo, descripcion_beneficio)
    VALUES (v_usuarios(1), v_usuarios(21), DATE '2023-06-01', 'S', 'S', 'Descuento del 20% en próximo pago');
    INSERT INTO REFERIDO (id_usuario_referidor, id_usuario_nuevo, fecha_referido, beneficio_aplicado_referidor, beneficio_aplicado_nuevo, descripcion_beneficio)
    VALUES (v_usuarios(2), v_usuarios(22), DATE '2023-07-15', 'S', 'N', 'Pendiente de aplicación');
    INSERT INTO REFERIDO (id_usuario_referidor, id_usuario_nuevo, fecha_referido, beneficio_aplicado_referidor, beneficio_aplicado_nuevo, descripcion_beneficio)
    VALUES (v_usuarios(5), v_usuarios(25), DATE '2023-09-10', 'N', 'S', 'Nuevo usuario con mes gratis');
    INSERT INTO REFERIDO (id_usuario_referidor, id_usuario_nuevo, fecha_referido, beneficio_aplicado_referidor, beneficio_aplicado_nuevo, descripcion_beneficio)
    VALUES (v_usuarios(8), v_usuarios(28), DATE '2023-11-20', 'S', 'S', 'Ambos recibieron descuento');
    INSERT INTO REFERIDO (id_usuario_referidor, id_usuario_nuevo, fecha_referido, beneficio_aplicado_referidor, beneficio_aplicado_nuevo, descripcion_beneficio)
    VALUES (v_usuarios(10), v_usuarios(30), DATE '2024-01-05', 'N', 'N', 'Recién referido, sin aplicar');
    DBMS_OUTPUT.PUT_LINE('Referidos insertados: 5');

    DBMS_OUTPUT.PUT_LINE('=== Inserción de datos completada exitosamente ===');
END;

COMMIT;

-- ============================================================
-- VERIFICACIÓN DE CONTEOS
-- ============================================================
SELECT 'PLAN_SUSCRIPCION' AS tabla, COUNT(*) AS registros FROM PLAN_SUSCRIPCION
UNION ALL
SELECT 'CIUDAD', COUNT(*) FROM CIUDAD
UNION ALL
SELECT 'USUARIO', COUNT(*) FROM USUARIO
UNION ALL
SELECT 'PERFIL', COUNT(*) FROM PERFIL
UNION ALL
SELECT 'DEPARTAMENTO', COUNT(*) FROM DEPARTAMENTO
UNION ALL
SELECT 'EMPLEADO', COUNT(*) FROM EMPLEADO
UNION ALL
SELECT 'GENERO', COUNT(*) FROM GENERO
UNION ALL
SELECT 'CONTENIDO', COUNT(*) FROM CONTENIDO
UNION ALL
SELECT 'CONTENIDO_GENERO', COUNT(*) FROM CONTENIDO_GENERO
UNION ALL
SELECT 'CONTENIDO_RELACIONADO', COUNT(*) FROM CONTENIDO_RELACIONADO
UNION ALL
SELECT 'TEMPORADA', COUNT(*) FROM TEMPORADA
UNION ALL
SELECT 'EPISODIO', COUNT(*) FROM EPISODIO
UNION ALL
SELECT 'REPRODUCCION', COUNT(*) FROM REPRODUCCION
UNION ALL
SELECT 'FAVORITO', COUNT(*) FROM FAVORITO
UNION ALL
SELECT 'CALIFICACION', COUNT(*) FROM CALIFICACION
UNION ALL
SELECT 'REPORTE_CONTENIDO', COUNT(*) FROM REPORTE_CONTENIDO
UNION ALL
SELECT 'PAGO', COUNT(*) FROM PAGO
UNION ALL
SELECT 'REFERIDO', COUNT(*) FROM REFERIDO
ORDER BY tabla;

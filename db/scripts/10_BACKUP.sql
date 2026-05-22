-- ============================================================
--  QUINDIOFLIX - PROCEDIMIENTO DE RESPALDO (BACKUP) SOLO DBA
--  Versión: 1.0
-- ============================================================
--  Este script crea el procedimiento SP_BACKUP_QUINDIOFLIX,
--  que permite realizar respaldos lógicos del esquema
--  C_QUINDIOFLIX mediante Oracle Data Pump (DBMS_DATAPUMP).
--
--  Requisitos:
--   · Ejecutar con cuenta DBA / SYSDBA.
--   · Tener creado el DIRECTORY de Oracle apuntando al
--     directorio físico de respaldos.
--   · Poseer el rol DATAPUMP_EXP_FULL_DATABASE.
--
--  Secciones:
--   1. Tabla de auditoría (BACKUP_LOG)
--   2. Función de validación de privilegios DBA
--   3. Procedimiento principal de backup
--   4. Procedimiento de consulta de backups realizados
--   5. Permisos de ejecución (solo DBA)
-- ============================================================

SET SERVEROUTPUT ON;
SET LINESIZE 200;
SET PAGESIZE 100;
COLUMN backup_id         FORMAT 999,999
COLUMN tipo_backup       FORMAT A15
COLUMN nombre_job        FORMAT A30
COLUMN archivo_dump      FORMAT A40
COLUMN directorio        FORMAT A30
COLUMN fecha_inicio      FORMAT A20
COLUMN fecha_fin         FORMAT A20
COLUMN duracion_seg      FORMAT 999,999.99
COLUMN estado            FORMAT A15
COLUMN bytes_generados   FORMAT 999,999,999
COLUMN mensaje           FORMAT A80 WRAP
COLUMN ejecutado_por     FORMAT A25

-- ============================================================
-- QUINDIOFLIX - CONFIGURACIÓN DE RESPALDO DBA
-- Ejecutar únicamente con cuenta DBA / SYSDBA
-- ============================================================
-- 0. CREAR DIRECTORY DE RESPALDO (si no existe)
--    Ajuste '/opt/oracle/backups/quindioflix' según su servidor.
-- ============================================================

BEGIN
    EXECUTE IMMEDIATE
        'CREATE OR REPLACE DIRECTORY DIR_BACKUP_QUINDIOFLIX ' ||
        'AS ''/opt/oracle/backups/quindioflix''';
    DBMS_OUTPUT.PUT_LINE('DIRECTORY DIR_BACKUP_QUINDIOFLIX creado/actualizado.');
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error al crear DIRECTORY: ' || SQLERRM);
        DBMS_OUTPUT.PUT_LINE('Asegúrese de que el directorio físico exista y tenga permisos.');
END;
/

GRANT READ, WRITE ON DIRECTORY DIR_BACKUP_QUINDIOFLIX TO C_QUINDIOFLIX;


-- ============================================================
-- 1. TABLA DE AUDITORÍA DE BACKUPS
-- ============================================================

BEGIN
    EXECUTE IMMEDIATE
        'CREATE TABLE BACKUP_LOG (
            backup_id       NUMBER GENERATED ALWAYS AS IDENTITY
                            CONSTRAINT pk_backup_log PRIMARY KEY,
            tipo_backup     VARCHAR2(20)   NOT NULL,
            nombre_job      VARCHAR2(100)  NOT NULL,
            archivo_dump    VARCHAR2(200),
            directorio      VARCHAR2(100),
            fecha_inicio    TIMESTAMP      DEFAULT SYSTIMESTAMP NOT NULL,
            fecha_fin       TIMESTAMP,
            duracion_seg    NUMBER(12,2),
            estado          VARCHAR2(20)   NOT NULL,
            bytes_generados NUMBER,
            mensaje         VARCHAR2(4000),
            ejecutado_por   VARCHAR2(128)  DEFAULT USER
        )';
    DBMS_OUTPUT.PUT_LINE('Tabla BACKUP_LOG creada exitosamente.');
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE = -955 THEN
            DBMS_OUTPUT.PUT_LINE('Tabla BACKUP_LOG ya existe. Continuando...');
        ELSE
            RAISE;
        END IF;
END;
/


-- ============================================================
-- 2. FUNCIÓN AUXILIAR: VALIDAR PRIVILEGIOS DBA
-- ============================================================

CREATE OR REPLACE FUNCTION FN_ES_DBA RETURN BOOLEAN IS
    v_count NUMBER;
BEGIN
    -- Verifica si el usuario actual tiene el rol DBA o ROL_ADMIN
    SELECT COUNT(*)
    INTO v_count
    FROM session_roles
    WHERE role IN ('DBA', 'ROL_ADMIN', 'DATAPUMP_EXP_FULL_DATABASE');

    RETURN (v_count > 0);
END;
/


-- ============================================================
-- 3. PROCEDIMIENTO PRINCIPAL: SP_BACKUP_QUINDIOFLIX
--    Realiza un respaldo lógico (Data Pump) del esquema
--    C_QUINDIOFLIX.  Solo ejecutable por usuarios DBA.
--
--    Parámetros:
--      p_tipo_backup  : 'FULL' | 'SCHEMA' | 'TABLA'
--      p_nombre_job   : nombre identificador del job Data Pump
--      p_archivo      : nombre base del archivo .dmp (sin extensión)
--      p_incluir_estadisticas : 'Y' para incluir ESTIMATE=STATISTICS
-- ============================================================

CREATE OR REPLACE PROCEDURE SP_BACKUP_QUINDIOFLIX (
    p_tipo_backup          IN VARCHAR2 DEFAULT 'SCHEMA',
    p_nombre_job           IN VARCHAR2 DEFAULT 'BK_QUIND_JOB_' || TO_CHAR(SYSDATE,'YYYYMMDD_HH24MISS'),
    p_archivo              IN VARCHAR2 DEFAULT 'QUINDIOFLIX_BK_' || TO_CHAR(SYSDATE,'YYYYMMDD_HH24MISS'),
    p_incluir_estadisticas IN VARCHAR2 DEFAULT 'Y'
) AUTHID CURRENT_USER IS

    v_job_handle   NUMBER;
    v_estado       VARCHAR2(30);
    v_estado_job   VARCHAR2(30);
    v_bytes        NUMBER;
    v_inicio       TIMESTAMP;
    v_fin          TIMESTAMP;
    v_duracion     NUMBER(12,2);
    v_dumpfile     VARCHAR2(200);
    v_logfile      VARCHAR2(200);
    v_mensaje      VARCHAR2(4000);
    v_backup_id    NUMBER;
    v_es_dba       BOOLEAN;

    -- Excepciones personalizadas
    e_no_dba       EXCEPTION;
    e_parametro    EXCEPTION;
    e_datapump     EXCEPTION;

BEGIN
    -- ----------------------------------------------------------------
    -- 3.1 Validación de privilegios DBA
    -- ----------------------------------------------------------------
    v_es_dba := FN_ES_DBA;

    IF NOT v_es_dba THEN
        RAISE e_no_dba;
    END IF;

    -- ----------------------------------------------------------------
    -- 3.2 Validación de parámetros
    -- ----------------------------------------------------------------
    IF UPPER(p_tipo_backup) NOT IN ('FULL', 'SCHEMA', 'TABLA') THEN
        RAISE e_parametro;
    END IF;

    v_dumpfile := p_archivo || '.dmp';
    v_logfile  := p_archivo || '.log';
    v_inicio   := SYSTIMESTAMP;

    -- ----------------------------------------------------------------
    -- 3.3 Registrar inicio en log de auditoría
    -- ----------------------------------------------------------------
    INSERT INTO BACKUP_LOG (
        tipo_backup, nombre_job, archivo_dump, directorio,
        fecha_inicio, estado, mensaje
    ) VALUES (
        UPPER(p_tipo_backup), p_nombre_job, v_dumpfile, 'DIR_BACKUP_QUINDIOFLIX',
        v_inicio, 'EJECUTANDO', 'Iniciando backup Data Pump...'
    )
    RETURNING backup_id INTO v_backup_id;

    COMMIT;

    -- ╔═══════════════════════════════════════════════════════════════
    -- ║  QUINDIOFLIX - INICIANDO RESPALDO
    -- ╠═══════════════════════════════════════════════════════════════
    -- ║  Backup ID    : ' || v_backup_id)
    -- ║  Tipo         : ' || UPPER(p_tipo_backup))
    -- ║  Job          : ' || p_nombre_job)
    -- ║  Archivo DMP  : ' || v_dumpfile)
    -- ║  Log          : ' || v_logfile)
    -- ║  Directorio   : DIR_BACKUP_QUINDIOFLIX
    -- ║  Ejecutado por: ' || USER
    -- ╚═══════════════════════════════════════════════════════════════


    -- ----------------------------------------------------------------
    -- 3.4 Crear el job de Data Pump
    -- ----------------------------------------------------------------
    v_job_handle := DBMS_DATAPUMP.OPEN(
        operation    => 'EXPORT',
        job_mode     => CASE UPPER(p_tipo_backup)
                            WHEN 'FULL'    THEN 'FULL'
                            WHEN 'SCHEMA'  THEN 'SCHEMA'
                            WHEN 'TABLA'   THEN 'TABLE'
                          END,
        remote_link  => NULL,
        job_name     => p_nombre_job
    );

    -- Archivos de salida
    DBMS_DATAPUMP.ADD_FILE(
        handle    => v_job_handle,
        filename  => v_dumpfile,
        directory => 'DIR_BACKUP_QUINDIOFLIX',
        filetype  => DBMS_DATAPUMP.KU$_FILE_TYPE_DUMP_FILE
    );

    DBMS_DATAPUMP.ADD_FILE(
        handle    => v_job_handle,
        filename  => v_logfile,
        directory => 'DIR_BACKUP_QUINDIOFLIX',
        filetype  => DBMS_DATAPUMP.KU$_FILE_TYPE_LOG_FILE
    );

    -- Configuración según tipo de backup
    IF UPPER(p_tipo_backup) = 'SCHEMA' THEN
        DBMS_DATAPUMP.METADATA_FILTER(
            handle => v_job_handle,
            name   => 'SCHEMA_EXPR',
            value  => 'IN (''C_QUINDIOFLIX'')'
        );
    ELSIF UPPER(p_tipo_backup) = 'TABLA' THEN
        DBMS_DATAPUMP.METADATA_FILTER(
            handle => v_job_handle,
            name   => 'SCHEMA_EXPR',
            value  => 'IN (''C_QUINDIOFLIX'')'
        );
    END IF;

    -- Estadísticas
    IF UPPER(p_incluir_estadisticas) = 'Y' THEN
        DBMS_DATAPUMP.SET_PARAMETER(
            handle => v_job_handle,
            name   => 'ESTIMATE',
            value  => 'STATISTICS'
        );
    END IF;

    -- Paralelismo para acelerar
    DBMS_DATAPUMP.SET_PARAMETER(
        handle => v_job_handle,
        name   => 'PARALLEL',
        value  => 2
    );

    -- Compresión
    DBMS_DATAPUMP.SET_PARAMETER(
        handle => v_job_handle,
        name   => 'COMPRESSION',
        value  => 'ALL'
    );

    -- ----------------------------------------------------------------
    -- 3.5 Ejecutar y esperar a que termine
    -- ----------------------------------------------------------------
    DBMS_DATAPUMP.START_JOB(handle => v_job_handle);
    DBMS_DATAPUMP.WAIT_FOR_JOB(handle => v_job_handle, job_state => v_estado_job);

    -- ----------------------------------------------------------------
    -- 3.6 Obtener resultado y finalizar
    -- ----------------------------------------------------------------
    v_fin       := SYSTIMESTAMP;
    v_duracion  := ROUND(
        EXTRACT(DAY    FROM (v_fin - v_inicio)) * 86400 +
        EXTRACT(HOUR   FROM (v_fin - v_inicio)) * 3600 +
        EXTRACT(MINUTE FROM (v_fin - v_inicio)) * 60 +
        EXTRACT(SECOND FROM (v_fin - v_inicio)),
        2
    );

    -- Tamaño aproximado del archivo dump (bytes)
    BEGIN
        SELECT s.bytes
        INTO v_bytes
        FROM dba_segments s
        WHERE s.owner = 'C_QUINDIOFLIX'
          AND s.segment_name = (SELECT segment_name
                                FROM dba_lobs
                                WHERE owner = 'C_QUINDIOFLIX'
                                  AND table_name = 'BACKUP_LOG'
                                  AND ROWNUM = 1);
    EXCEPTION
        WHEN OTHERS THEN
            v_bytes := NULL;
    END;

    v_estado := CASE v_estado_job
                    WHEN 'COMPLETED'        THEN 'EXITOSO'
                    WHEN 'COMPLETED_EARLY'  THEN 'EXITOSO (PARCIAL)'
                    ELSE 'ERROR: ' || v_estado_job
                END;

    v_mensaje := 'Backup finalizado con estado ' || v_estado_job ||
                 '. Duración: ' || v_duracion || ' segundos.';

    -- Actualizar registro de auditoría
    UPDATE BACKUP_LOG
    SET fecha_fin      = v_fin,
        duracion_seg   = v_duracion,
        estado         = v_estado,
        bytes_generados = v_bytes,
        mensaje        = v_mensaje
    WHERE backup_id = v_backup_id;

    COMMIT;

    -- ╔═══════════════════════════════════════════════════════════════
    -- ║  QUINDIOFLIX - RESPALDO FINALIZADO
    -- ╠═══════════════════════════════════════════════════════════════
    -- ║  Estado       : ' || v_estado
    -- ║  Duración     : ' || v_duracion || ' seg.'
    -- ║  Archivo      : ' || v_dumpfile
    -- ║  Ruta (Oracle): DIR_BACKUP_QUINDIOFLIX
    -- ╚═══════════════════════════════════════════════════════════════

EXCEPTION
    WHEN e_no_dba THEN
        RAISE_APPLICATION_ERROR(
            -20401,
            'Acceso denegado: el procedimiento SP_BACKUP_QUINDIOFLIX solo puede ser ejecutado por usuarios con rol DBA, ROL_ADMIN o DATAPUMP_EXP_FULL_DATABASE.'
        );

    WHEN e_parametro THEN
        RAISE_APPLICATION_ERROR(
            -20402,
            'Parámetro p_tipo_backup inválido. Use: FULL, SCHEMA o TABLA.'
        );

    WHEN OTHERS THEN
        -- Registrar error en auditoría si es posible
        BEGIN
            UPDATE BACKUP_LOG
            SET estado   = 'ERROR',
                mensaje  = 'Error inesperado: ' || SQLERRM,
                fecha_fin = SYSTIMESTAMP
            WHERE backup_id = v_backup_id;
            COMMIT;
        EXCEPTION
            WHEN OTHERS THEN NULL;
        END;

        RAISE_APPLICATION_ERROR(
            -20403,
            'Error durante el backup Data Pump: ' || SQLERRM
        );
END;
/


-- ============================================================
-- 4. PROCEDIMIENTO DE CONSULTA: SP_LISTAR_BACKUPS
--    Permite consultar el historial de backups realizados.
--    Solo ejecutable por DBA.
-- ============================================================

CREATE OR REPLACE PROCEDURE SP_LISTAR_BACKUPS (
    p_dias IN NUMBER DEFAULT 30
) AUTHID CURRENT_USER IS

    v_es_dba BOOLEAN;
    e_no_dba EXCEPTION;

BEGIN
    v_es_dba := FN_ES_DBA;

    IF NOT v_es_dba THEN
        RAISE e_no_dba;
    END IF;

    -- ╔═══════════════════════════════════════════════════════════════
    -- ║  QUINDIOFLIX - HISTORIAL DE RESPALDOS (últimos ' || p_dias || ' días)
    -- ╚═══════════════════════════════════════════════════════════════

    FOR r IN (
        SELECT backup_id,
               tipo_backup,
               nombre_job,
               archivo_dump,
               directorio,
               TO_CHAR(fecha_inicio, 'YYYY-MM-DD HH24:MI:SS') AS inicio,
               TO_CHAR(fecha_fin,   'YYYY-MM-DD HH24:MI:SS') AS fin,
               duracion_seg,
               estado,
               bytes_generados,
               mensaje,
               ejecutado_por
        FROM BACKUP_LOG
        WHERE fecha_inicio >= SYSTIMESTAMP - NUMTODSINTERVAL(p_dias, 'DAY')
        ORDER BY fecha_inicio DESC
    ) LOOP
        DBMS_OUTPUT.PUT_LINE('───────────────────────────────────────────────────────────────');
        DBMS_OUTPUT.PUT_LINE('  Backup ID  : ' || r.backup_id);
        DBMS_OUTPUT.PUT_LINE('  Tipo       : ' || r.tipo_backup);
        DBMS_OUTPUT.PUT_LINE('  Job        : ' || r.nombre_job);
        DBMS_OUTPUT.PUT_LINE('  Archivo    : ' || r.archivo_dump);
        DBMS_OUTPUT.PUT_LINE('  Directorio : ' || r.directorio);
        DBMS_OUTPUT.PUT_LINE('  Inicio     : ' || r.inicio);
        DBMS_OUTPUT.PUT_LINE('  Fin        : ' || r.fin);
        DBMS_OUTPUT.PUT_LINE('  Duración   : ' || r.duracion_seg || ' seg.');
        DBMS_OUTPUT.PUT_LINE('  Estado     : ' || r.estado);
        DBMS_OUTPUT.PUT_LINE('  Bytes      : ' || NVL(TO_CHAR(r.bytes_generados), 'N/A'));
        DBMS_OUTPUT.PUT_LINE('  Ejecutado  : ' || r.ejecutado_por);
        DBMS_OUTPUT.PUT_LINE('  Mensaje    : ' || r.mensaje);
    END LOOP;

    DBMS_OUTPUT.PUT_LINE('───────────────────────────────────────────────────────────────');
    DBMS_OUTPUT.PUT_LINE('  Total de registros mostrados: ' || SQL%ROWCOUNT);

EXCEPTION
    WHEN e_no_dba THEN
        RAISE_APPLICATION_ERROR(
            -20404,
            'Acceso denegado: SP_LISTAR_BACKUPS solo puede ser ejecutado por usuarios con rol DBA o ROL_ADMIN.'
        );
    WHEN OTHERS THEN
        RAISE_APPLICATION_ERROR(
            -20405,
            'Error al listar backups: ' || SQLERRM
        );
END;
/


-- ============================================================
-- 5. PERMISOS DE EJECUCIÓN (SOLO DBA / ADMIN)
-- ============================================================

GRANT EXECUTE ON FN_ES_DBA TO ROL_ADMIN;

GRANT EXECUTE ON SP_BACKUP_QUINDIOFLIX TO ROL_ADMIN;
GRANT EXECUTE ON SP_BACKUP_QUINDIOFLIX TO ADMIN_QUINDIO;

GRANT EXECUTE ON SP_LISTAR_BACKUPS TO ROL_ADMIN;
GRANT EXECUTE ON SP_LISTAR_BACKUPS TO ADMIN_QUINDIO;

-- Revocar posibles permisos previos de otros roles/usuarios
BEGIN
    FOR r IN (
        SELECT grantee
        FROM dba_tab_privs
        WHERE table_name = 'SP_BACKUP_QUINDIOFLIX'
          AND owner = USER
          AND grantee NOT IN ('ROL_ADMIN', 'ADMIN_QUINDIO')
    ) LOOP
        EXECUTE IMMEDIATE 'REVOKE EXECUTE ON SP_BACKUP_QUINDIOFLIX FROM ' || r.grantee;
    END LOOP;
EXCEPTION
    WHEN OTHERS THEN NULL;
END;
/


-- ============================================================
-- 6. SINÓNIMO PÚBLICO (opcional, para acceso DBA directo)
-- ============================================================

CREATE OR REPLACE PUBLIC SYNONYM SP_BACKUP_QUINDIOFLIX FOR C_QUINDIOFLIX.SP_BACKUP_QUINDIOFLIX;
CREATE OR REPLACE PUBLIC SYNONYM SP_LISTAR_BACKUPS FOR C_QUINDIOFLIX.SP_LISTAR_BACKUPS;


COMMIT;


-- ============================================================
-- 7. EJEMPLOS DE USO (descomentar para ejecutar)
-- ============================================================
/*
EXEC DBMS_OUTPUT.PUT_LINE('');
EXEC DBMS_OUTPUT.PUT_LINE('--- Ejecutando backup de ejemplo ---');

-- Backup completo del esquema (por defecto)
EXEC SP_BACKUP_QUINDIOFLIX;

-- Backup explícito de tipo SCHEMA
EXEC SP_BACKUP_QUINDIOFLIX('SCHEMA', 'BK_MANUAL_001', 'MANUAL_BK_001');

-- Listar backups de los últimos 7 días
EXEC SP_LISTAR_BACKUPS(7);

-- Consultar la tabla de auditoría directamente
SELECT * FROM BACKUP_LOG ORDER BY fecha_inicio DESC;
*/

-- ============================================================
-- FIN DEL SCRIPT DE BACKUP
-- ============================================================

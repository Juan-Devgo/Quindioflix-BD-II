-- ============================================================
--  QUINDIOFLIX - MONITOREO DEL SISTEMA (SOLO DBA)
--  Versión: 1.0
-- ============================================================
--  Este script consulta el estado y métricas clave de la base
--  de datos QuindioFlix.  Requiere permisos de DBA.
--
--  Secciones:
--   1. Tablas del esquema (tamaño físico y número de registros)
--   2. Usuarios, roles, estado y privilegios
--   3. Tablespaces (tamaño, uso y porcentaje)
--   4. Rendimiento (QPS, latencia, conexiones, caché, SQL costoso)
--   5. Backups (tipo, fecha, tamaño, duración, estado)
-- ============================================================

SET SERVEROUTPUT ON;
SET LINESIZE 200;
SET PAGESIZE 100;
COLUMN table_name        FORMAT A30
COLUMN num_rows          FORMAT 999,999,999
COLUMN size_mb           FORMAT 999,999.99
COLUMN username          FORMAT A25
COLUMN account_status    FORMAT A20
COLUMN role_name         FORMAT A25
COLUMN privilege         FORMAT A35
COLUMN tablespace_name   FORMAT A30
COLUMN total_mb          FORMAT 999,999.99
COLUMN used_mb           FORMAT 999,999.99
COLUMN free_mb           FORMAT 999,999.99
COLUMN pct_used          FORMAT 999.99
COLUMN sql_text          FORMAT A80 WRAP
COLUMN executions        FORMAT 999,999,999
COLUMN avg_time_sec      FORMAT 999,999.999
COLUMN event             FORMAT A40
COLUMN backup_type       FORMAT A15
COLUMN start_time        FORMAT A20
COLUMN end_time          FORMAT A20
COLUMN backup_size_mb    FORMAT 999,999.99
COLUMN duration_min      FORMAT 999.99
COLUMN status            FORMAT A15

EXEC DBMS_OUTPUT.PUT_LINE('============================================================');
EXEC DBMS_OUTPUT.PUT_LINE('QUINDIOFLIX - INFORME DE MONITOREO DEL SISTEMA');
EXEC DBMS_OUTPUT.PUT_LINE('Ejecutar únicamente con cuenta DBA / SYSDBA');
EXEC DBMS_OUTPUT.PUT_LINE('============================================================');
EXEC DBMS_OUTPUT.PUT_LINE('');

-- ============================================================
-- 1. TABLAS DEL ESQUEMA C_QUINDIOFLIX
--    Nombre, número de filas y tamaño físico aproximado (MB)
-- ============================================================
EXEC DBMS_OUTPUT.PUT_LINE('--------------------------------------------------------');
EXEC DBMS_OUTPUT.PUT_LINE('1. TABLAS DEL ESQUEMA C_QUINDIOFLIX');
EXEC DBMS_OUTPUT.PUT_LINE('--------------------------------------------------------');

SELECT
    t.table_name,
    NVL(t.num_rows, 0) AS num_rows,
    ROUND(
        SUM(s.bytes) / 1024 / 1024, 2
    ) AS size_mb
FROM dba_tables t
LEFT JOIN dba_segments s
    ON t.table_name = s.segment_name
    AND t.owner = s.owner
WHERE t.owner = 'C_QUINDIOFLIX'
GROUP BY t.table_name, t.num_rows
ORDER BY size_mb DESC, t.table_name;


-- ============================================================
-- 2. USUARIOS DEL SISTEMA – ROLES, ESTADO Y PRIVILEGIOS
-- ============================================================
EXEC DBMS_OUTPUT.PUT_LINE('');
EXEC DBMS_OUTPUT.PUT_LINE('--------------------------------------------------------');
EXEC DBMS_OUTPUT.PUT_LINE('2. USUARIOS, ROLES Y PRIVILEGIOS');
EXEC DBMS_OUTPUT.PUT_LINE('--------------------------------------------------------');

-- 2a. Usuarios del sistema y su estado
SELECT
    username,
    account_status,
    TO_CHAR(created, 'YYYY-MM-DD HH24:MI') AS created,
    TO_CHAR(expiry_date, 'YYYY-MM-DD HH24:MI') AS expiry_date,
    default_tablespace,
    temporary_tablespace
FROM dba_users
WHERE username IN (
    'ADMIN_QUINDIO',
    'ANALISTA_QUINDIO',
    'SOPORTE_QUINDIO',
    'CONTENIDO_QUINDIO',
    'C_QUINDIOFLIX'
)
ORDER BY username;

-- 2b. Roles asignados a cada usuario
SELECT
    grantee   AS username,
    granted_role AS role_name,
    admin_option,
    default_role
FROM dba_role_privs
WHERE grantee IN (
    'ADMIN_QUINDIO',
    'ANALISTA_QUINDIO',
    'SOPORTE_QUINDIO',
    'CONTENIDO_QUINDIO',
    'C_QUINDIOFLIX'
)
ORDER BY grantee, granted_role;

-- 2c. Privilegios de sistema otorgados directamente
SELECT
    grantee   AS username,
    privilege,
    admin_option
FROM dba_sys_privs
WHERE grantee IN (
    'ADMIN_QUINDIO',
    'ANALISTA_QUINDIO',
    'SOPORTE_QUINDIO',
    'CONTENIDO_QUINDIO',
    'C_QUINDIOFLIX',
    'ROL_ADMIN',
    'ROL_ANALISTA',
    'ROL_SOPORTE',
    'ROL_CONTENIDO'
)
ORDER BY grantee, privilege;

-- 2d. Privilegios sobre objetos (tablas) del esquema QuindioFlix
SELECT
    grantee   AS username_or_role,
    owner     AS schema,
    table_name,
    privilege,
    grantable
FROM dba_tab_privs
WHERE owner = 'C_QUINDIOFLIX'
  AND grantee IN (
    'ADMIN_QUINDIO',
    'ANALISTA_QUINDIO',
    'SOPORTE_QUINDIO',
    'CONTENIDO_QUINDIO',
    'ROL_ADMIN',
    'ROL_ANALISTA',
    'ROL_SOPORTE',
    'ROL_CONTENIDO'
  )
ORDER BY grantee, table_name, privilege;


-- ============================================================
-- 3. TABLESPACES – TAMAÑO FÍSICO Y PORCENTAJE DE USO
-- ============================================================
EXEC DBMS_OUTPUT.PUT_LINE('');
EXEC DBMS_OUTPUT.PUT_LINE('--------------------------------------------------------');
EXEC DBMS_OUTPUT.PUT_LINE('3. TABLESPACES – TAMAÑO Y USO');
EXEC DBMS_OUTPUT.PUT_LINE('--------------------------------------------------------');

SELECT
    ts.tablespace_name,
    ROUND(ts.total_mb, 2)      AS total_mb,
    ROUND(ts.total_mb - NVL(fs.free_mb, 0), 2) AS used_mb,
    ROUND(NVL(fs.free_mb, 0), 2) AS free_mb,
    ROUND(
        (ts.total_mb - NVL(fs.free_mb, 0)) / NULLIF(ts.total_mb, 0) * 100, 2
    ) AS pct_used,
    ts.status
FROM (
    SELECT tablespace_name, status,
           SUM(bytes) / 1024 / 1024 AS total_mb
    FROM dba_data_files
    GROUP BY tablespace_name, status
) ts
LEFT JOIN (
    SELECT tablespace_name,
           SUM(bytes) / 1024 / 1024 AS free_mb
    FROM dba_free_space
    GROUP BY tablespace_name
) fs ON ts.tablespace_name = fs.tablespace_name
ORDER BY pct_used DESC NULLS LAST;


-- ============================================================
-- 4. RENDIMIENTO – MÉTRICAS CLAVE
-- ============================================================
EXEC DBMS_OUTPUT.PUT_LINE('');
EXEC DBMS_OUTPUT.PUT_LINE('--------------------------------------------------------');
EXEC DBMS_OUTPUT.PUT_LINE('4. RENDIMIENTO');
EXEC DBMS_OUTPUT.PUT_LINE('--------------------------------------------------------');

-- 4a. QPS (Consultas por segundo) – basado en estadísticas de ejecución
EXEC DBMS_OUTPUT.PUT_LINE('');
EXEC DBMS_OUTPUT.PUT_LINE('--- QPS (Consultas por segundo, última hora) ---');
SELECT
    ROUND(
        (SELECT VALUE FROM v$sysstat WHERE name = 'execute count')
        / (SELECT MAX(intsize_csec) / 100 FROM v$sysmetric_history WHERE metric_name = 'Database Time Per Sec'),
        2
    ) AS qps_estimated
FROM dual;

-- Nota: en Oracle 12c+, v$sysmetric_history ofrece métricas de rendimiento más fiables.
-- Si la consulta anterior no retorna valores, se usa el siguiente bloque PL/SQL alternativo.

BEGIN
    DBMS_OUTPUT.PUT_LINE('--- Métricas de rendimiento (v$sysmetric) ---');
    FOR r IN (
        SELECT metric_name, value, metric_unit
        FROM v$sysmetric
        WHERE metric_name IN (
            'Database Time Per Sec',
            'Executions Per Sec',
            'User Transaction Per Sec',
            'Physical Reads Per Sec',
            'Logical Reads Per Sec',
            'I/O Megabytes per Second'
        )
        AND group_id = 2  -- métricas de intervalo corto (15 seg)
    ) LOOP
        DBMS_OUTPUT.PUT_LINE(
            r.metric_name || ': ' || r.value || ' ' || r.metric_unit
        );
    END LOOP;
END;
/

-- 4b. P95 Latency – basado en esperas activas (eventos de espera)
EXEC DBMS_OUTPUT.PUT_LINE('');
EXEC DBMS_OUTPUT.PUT_LINE('--- Esperas activas principales (latencia / eventos de espera) ---');
SELECT
    event,
    total_waits,
    ROUND(total_timeouts / NULLIF(total_waits, 0) * 100, 2) AS timeout_pct,
    ROUND(time_waited_micro / 1000, 2) AS time_waited_ms,
    ROUND(
        time_waited_micro / NULLIF(total_waits, 0) / 1000, 2
    ) AS avg_wait_ms
FROM v$system_event
WHERE wait_class != 'Idle'
ORDER BY time_waited_micro DESC
FETCH FIRST 10 ROWS ONLY;

-- 4c. Número de conexiones activas y totales
EXEC DBMS_OUTPUT.PUT_LINE('');
EXEC DBMS_OUTPUT.PUT_LINE('--- Conexiones activas ---');
SELECT
    COUNT(*) AS total_connections,
    COUNT(CASE WHEN status = 'ACTIVE' THEN 1 END) AS active_connections,
    COUNT(CASE WHEN status = 'INACTIVE' THEN 1 END) AS inactive_connections
FROM v$session
WHERE type = 'USER';

-- 4d. Ratio de aciertos de caché (Buffer Cache Hit Ratio)
EXEC DBMS_OUTPUT.PUT_LINE('');
EXEC DBMS_OUTPUT.PUT_LINE('--- Cache Hit Ratio (Buffer Cache) ---');
SELECT
    ROUND(
        (1 - (phy.value / (cur.value + con.value))) * 100, 2
    ) AS buffer_cache_hit_ratio_pct
FROM v$sysstat cur, v$sysstat con, v$sysstat phy
WHERE cur.name = 'db block gets'
  AND con.name = 'consistent gets'
  AND phy.name = 'physical reads';

-- 4e. Librería (Library Cache) Hit Ratio
EXEC DBMS_OUTPUT.PUT_LINE('');
EXEC DBMS_OUTPUT.PUT_LINE('--- Cache Hit Ratio (Library Cache) ---');
SELECT
    ROUND(SUM(pins) / NULLIF(SUM(pins) + SUM(reloads), 0) * 100, 2) AS library_cache_hit_ratio_pct
FROM v$librarycache;

-- 4f. Sentencias SQL más costosas (ejecuciones y tiempo promedio)
EXEC DBMS_OUTPUT.PUT_LINE('');
EXEC DBMS_OUTPUT.PUT_LINE('--- Top 15 sentencias SQL más costosas (por tiempo total) ---');
SELECT
    sql_id,
    SUBSTR(sql_text, 1, 80) AS sql_text,
    executions,
    ROUND(elapsed_time / 1000000 / NULLIF(executions, 0), 3) AS avg_time_sec,
    ROUND(cpu_time / 1000000, 3) AS cpu_time_sec,
    ROUND(buffer_gets / NULLIF(executions, 0), 0) AS avg_buffer_gets,
    ROUND(disk_reads / NULLIF(executions, 0), 0) AS avg_disk_reads
FROM v$sqlarea
WHERE executions > 0
  AND sql_text NOT LIKE '%v$sqlarea%'
ORDER BY elapsed_time DESC
FETCH FIRST 15 ROWS ONLY;


-- ============================================================
-- 5. BACKUPS – TIPO, FECHA, TAMAÑO, DURACIÓN Y ESTADO
-- ============================================================
EXEC DBMS_OUTPUT.PUT_LINE('');
EXEC DBMS_OUTPUT.PUT_LINE('--------------------------------------------------------');
EXEC DBMS_OUTPUT.PUT_LINE('5. BACKUPS RECIENTES');
EXEC DBMS_OUTPUT.PUT_LINE('--------------------------------------------------------');

-- 5a. Backups de RMAN (archivos de datos, controlfile, spfile)
EXEC DBMS_OUTPUT.PUT_LINE('');
EXEC DBMS_OUTPUT.PUT_LINE('--- Backups RMAN (Datafile / Controlfile / SPFILE) ---');
SELECT
    CASE b.backup_type
        WHEN 'D' THEN 'FULL'
        WHEN 'I' THEN 'INCREMENTAL'
        WHEN 'L' THEN 'ARCHIVELOG'
    END AS backup_type,
    b.start_time,
    b.completion_time AS end_time,
    ROUND(
        (b.completion_time - b.start_time) * 24 * 60, 2
    ) AS duration_min,
    ROUND(b.bytes / 1024 / 1024, 2) AS backup_size_mb,
    b.status,
    b.device_type
FROM v$backup_set_details b
WHERE b.start_time >= SYSDATE - 30
ORDER BY b.start_time DESC;

-- 5b. Backups de archive logs (RMAN)
EXEC DBMS_OUTPUT.PUT_LINE('');
EXEC DBMS_OUTPUT.PUT_LINE('--- Backups de Archive Logs (RMAN) ---');
SELECT
    'ARCHIVELOG' AS backup_type,
    b.start_time,
    b.completion_time AS end_time,
    ROUND(
        (b.completion_time - b.start_time) * 24 * 60, 2
    ) AS duration_min,
    ROUND(b.bytes / 1024 / 1024, 2) AS backup_size_mb,
    b.status,
    b.device_type
FROM v$backup_set_details b
WHERE b.backup_type = 'L'
  AND b.start_time >= SYSDATE - 30
ORDER BY b.start_time DESC;

-- 5c. Resumen de copias de seguridad (RMAN) por día (últimos 7 días)
EXEC DBMS_OUTPUT.PUT_LINE('');
EXEC DBMS_OUTPUT.PUT_LINE('--- Resumen diario de backups (últimos 7 días) ---');
SELECT
    TRUNC(start_time) AS backup_date,
    CASE backup_type
        WHEN 'D' THEN 'FULL'
        WHEN 'I' THEN 'INCREMENTAL'
        WHEN 'L' THEN 'ARCHIVELOG'
    END AS backup_type,
    COUNT(*) AS backup_count,
    ROUND(SUM(bytes) / 1024 / 1024, 2) AS total_size_mb,
    ROUND(SUM((completion_time - start_time) * 24 * 60), 2) AS total_duration_min
FROM v$backup_set_details
WHERE start_time >= SYSDATE - 7
GROUP BY TRUNC(start_time), backup_type
ORDER BY backup_date DESC, backup_type;

EXEC DBMS_OUTPUT.PUT_LINE('');
EXEC DBMS_OUTPUT.PUT_LINE('============================================================');
EXEC DBMS_OUTPUT.PUT_LINE('FIN DEL INFORME DE MONITOREO');
EXEC DBMS_OUTPUT.PUT_LINE('============================================================');

-- ============================================================
-- FIN DEL SCRIPT DE MONITOREO
-- ============================================================

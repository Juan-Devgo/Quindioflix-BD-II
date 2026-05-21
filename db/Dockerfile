FROM container-registry.oracle.com/database/express:21.3.0-xe

# Oracle official images execute scripts from /opt/oracle/scripts/setup/ once during first startup.
# Copy all SQL scripts into that directory so the database schema is initialized automatically.
COPY scripts/*.sql /opt/oracle/scripts/setup/
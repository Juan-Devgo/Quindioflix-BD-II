-- ============================================================
--  QUINDIOFLIX
--  Autores:
-- 		Juan Sebastián Londoño Ramírez
-- 		Juan Diego García Nieto 
--  Versión: 1.0
-- ============================================================
--
--  Orden de creación (respeta dependencias):
--   1.  PLAN_SUSCRIPCION
--   2.  CIUDAD
--   3.  USUARIO          (auto-ref: id_referidor)
--   4.  REFERIDO
--   5.  PERFIL
--   6.  DEPARTAMENTO     (FK a EMPLEADO se agrega después)
--   7.  EMPLEADO         (auto-ref: id_supervisor)
--   8.  ALTER DEPARTAMENTO ADD CONSTRAINT fk_depto_jefe
--   9.  GENERO
--  10.  CONTENIDO
--  11.  CONTENIDO_GENERO
--  12.  CONTENIDO_RELACIONADO  (auto-ref M:N)
--  13.  TEMPORADA
--  14.  EPISODIO
--  15.  REPRODUCCION
--  16.  FAVORITO
--  17.  CALIFICACION
--  18.  REPORTE_CONTENIDO
--  19.  PAGO
--  20.  RESTRICCION_DOMINIO
--  21.  ÍNDICES

-- ============================================================
-- 1. PLAN_SUSCRIPCION
-- ============================================================
CREATE TABLE PLAN_SUSCRIPCION (
    id_plan          NUMBER         GENERATED ALWAYS AS IDENTITY
                                    CONSTRAINT pk_plan PRIMARY KEY,
    nombre           VARCHAR2(50)   NOT NULL
                                    CONSTRAINT uq_plan_nombre UNIQUE,
    max_perfiles     NUMBER(1)      NOT NULL,
    max_pantallas    NUMBER(1)      NOT NULL,
    calidad          VARCHAR2(5)    NOT NULL,
    precio_mensual   NUMBER(10,2)   NOT NULL,
    CONSTRAINT chk_plan_perfiles    CHECK (max_perfiles    > 0),
    CONSTRAINT chk_plan_calidad     CHECK (calidad         IN ('SD','HD','4K')),
    CONSTRAINT chk_plan_pantallas   CHECK (max_pantallas   > 0),
    CONSTRAINT chk_plan_precio      CHECK (precio_mensual  > 0)
);

-- PLAN_SUSCRIPCION: Planes disponibles: Básico, Estándar, Premium.
-- PLAN_SUSCRIPCION.calidad: Calidad máxima de reproducción: SD | HD | 4K.
-- PLAN_SUSCRIPCION.max_pantallas: Número máximo de pantallas simultáneas permitidas.
-- PLAN_SUSCRIPCION.max_perfiles: Número máximo de perfiles permitidos por plan


-- ============================================================
-- 2. CIUDAD
-- ============================================================
CREATE TABLE CIUDAD (
    id_ciudad    NUMBER         GENERATED ALWAYS AS IDENTITY
                                CONSTRAINT pk_ciudad PRIMARY KEY,
    nombre       VARCHAR2(100)  NOT NULL,
    departamento VARCHAR2(100)
);

-- CIUDAD: Ciudades de residencia de los usuarios (base para reportes geográficos).


-- ============================================================
-- 3. USUARIO
--    Auto-referencia: id_referidor → USUARIO(id_usuario)
-- ============================================================
CREATE TABLE USUARIO (
    id_usuario        NUMBER         GENERATED ALWAYS AS IDENTITY
                                     CONSTRAINT pk_usuario PRIMARY KEY,
    nombre            VARCHAR2(200)  NOT NULL,
    email             VARCHAR2(200)  NOT NULL
                                     CONSTRAINT uq_usuario_email UNIQUE,
    telefono          VARCHAR2(20),
    fecha_nacimiento  DATE           NOT NULL,
    id_ciudad         NUMBER,
    id_plan           NUMBER         NOT NULL,
    fecha_registro    DATE           DEFAULT SYSDATE NOT NULL,
    fecha_vencimiento DATE,
    estado            VARCHAR2(20)   DEFAULT 'ACTIVO' NOT NULL,
    id_referidor      NUMBER,         -- quien invitó a este usuario
    CONSTRAINT chk_usuario_estado  CHECK (estado IN ('ACTIVO','INACTIVO','SUSPENDIDO')),
    CONSTRAINT fk_usuario_ciudad   FOREIGN KEY (id_ciudad)    REFERENCES CIUDAD(id_ciudad),
    CONSTRAINT fk_usuario_plan     FOREIGN KEY (id_plan)      REFERENCES PLAN_SUSCRIPCION(id_plan),
    CONSTRAINT fk_usuario_ref      FOREIGN KEY (id_referidor) REFERENCES USUARIO(id_usuario)
);

-- USUARIO.estado: ACTIVO | INACTIVO | SUSPENDIDO.
-- COLUMN USUARIO.id_referidor: Usuario que invitó a este usuario a la plataforma.
-- USUARIO.fecha_vencimiento: Próxima fecha de pago; si se supera +30 días el estado pasa a INACTIVO.


-- ============================================================
-- 4. REFERIDO
--    Registra el par referidor - nuevo y el estado del beneficio.
--    Un usuario solo puede haber sido referido una vez
-- ============================================================
CREATE TABLE REFERIDO (
    id_referido                  NUMBER  GENERATED ALWAYS AS IDENTITY
                                         CONSTRAINT pk_referido PRIMARY KEY,
    id_usuario_referidor         NUMBER  NOT NULL,
    id_usuario_nuevo             NUMBER  NOT NULL
                                         CONSTRAINT uq_referido_nuevo UNIQUE,
    fecha_referido               DATE    DEFAULT SYSDATE NOT NULL,
    beneficio_aplicado_referidor CHAR(1) DEFAULT 'N'     NOT NULL,
    beneficio_aplicado_nuevo     CHAR(1) DEFAULT 'N'     NOT NULL,
    descripcion_beneficio        VARCHAR2(300),
    CONSTRAINT chk_ref_ben_ref  CHECK (beneficio_aplicado_referidor IN ('S','N')),
    CONSTRAINT chk_ref_ben_nvo  CHECK (beneficio_aplicado_nuevo     IN ('S','N')),
    CONSTRAINT fk_ref_referidor FOREIGN KEY (id_usuario_referidor) REFERENCES USUARIO(id_usuario),
    CONSTRAINT fk_ref_nuevo     FOREIGN KEY (id_usuario_nuevo)     REFERENCES USUARIO(id_usuario)
);

-- REFERIDO: Control de beneficios generados por el programa de referidos.
-- REFERIDO.beneficio_aplicado_referidor: S = el descuento ya fue aplicado al pago del referidor.
-- REFERIDO.beneficio_aplicado_nuevo: S = el descuento ya fue aplicado al pago del nuevo usuario.


-- ============================================================
-- 5. PERFIL
-- ============================================================
CREATE TABLE PERFIL (
    id_perfil  NUMBER         GENERATED ALWAYS AS IDENTITY
                              CONSTRAINT pk_perfil PRIMARY KEY,
    id_usuario NUMBER         NOT NULL,
    nombre     VARCHAR2(100)  NOT NULL,
    avatar     VARCHAR2(300),
    tipo       VARCHAR2(10)   NOT NULL,
    activo     CHAR(1)        DEFAULT 'S' NOT NULL,
    CONSTRAINT chk_perfil_tipo   CHECK (tipo   IN ('ADULTO','INFANTIL')),
    CONSTRAINT chk_perfil_activo CHECK (activo IN ('S','N')),
    CONSTRAINT fk_perfil_usuario FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario)
);

-- PERFIL.tipo: INFANTIL: solo accede a contenido TP, +7, +13 | ADULTO: sin restricción.


-- ============================================================
-- 6. DEPARTAMENTO
-- ============================================================
CREATE TABLE DEPARTAMENTO (
    id_departamento NUMBER        GENERATED ALWAYS AS IDENTITY
                                  CONSTRAINT pk_departamento PRIMARY KEY,
    nombre          VARCHAR2(100) NOT NULL
                                  CONSTRAINT uq_depto_nombre UNIQUE,
    id_jefe         NUMBER        -- FK a EMPLEADO; se agrega con ALTER TABLE
);

-- DEPARTAMENTO: Departamentos: Tecnología, Contenido, Marketing, Soporte, Finanzas, etc.
-- DEPARTAMENTO.id_jefe: Empleado jefe del departamento (empleado del mismo departamento).


-- ============================================================
-- 7. EMPLEADO
--    Auto-referencia: id_supervisor → EMPLEADO(id_empleado)
-- ============================================================
CREATE TABLE EMPLEADO (
    id_empleado        NUMBER         GENERATED ALWAYS AS IDENTITY
                                      CONSTRAINT pk_empleado PRIMARY KEY,
    nombre             VARCHAR2(200)  NOT NULL,
    email              VARCHAR2(200)  NOT NULL
                                      CONSTRAINT uq_emp_email UNIQUE,
    telefono           VARCHAR2(20),
    fecha_contratacion DATE           DEFAULT SYSDATE NOT NULL,
    id_departamento    NUMBER         NOT NULL,
    id_supervisor      NUMBER,         -- supervisor directo (mismo depto)
    rol                VARCHAR2(20)   DEFAULT 'EMPLEADO' NOT NULL,
    activo             CHAR(1)        DEFAULT 'S'        NOT NULL,
    CONSTRAINT chk_emp_rol    CHECK (rol    IN ('EMPLEADO','SUPERVISOR','JEFE','MODERADOR')),
    CONSTRAINT chk_emp_activo CHECK (activo IN ('S','N')),
    CONSTRAINT fk_emp_depto      FOREIGN KEY (id_departamento) REFERENCES DEPARTAMENTO(id_departamento),
    CONSTRAINT fk_emp_supervisor FOREIGN KEY (id_supervisor)   REFERENCES EMPLEADO(id_empleado)
);

-- EMPLEADO.id_supervisor: Supervisor directo dentro del mismo departamento. NULL = sin supervisor.
-- EMPLEADO.rol: MODERADOR: empleado de Soporte que revisa reportes de contenido.


-- ============================================================
-- 8. jefe del departamento: para eliminar FK circular: 
-- ============================================================
ALTER TABLE DEPARTAMENTO
    ADD CONSTRAINT fk_depto_jefe
    FOREIGN KEY (id_jefe) REFERENCES EMPLEADO(id_empleado);


-- ============================================================
-- 9. GENERO
-- ============================================================
CREATE TABLE GENERO (
    id_genero NUMBER         GENERATED ALWAYS AS IDENTITY
                             CONSTRAINT pk_genero PRIMARY KEY,
    nombre    VARCHAR2(100)  NOT NULL
                             CONSTRAINT uq_genero_nombre UNIQUE
);

-- GENERO: Géneros disponibles: Acción, Comedia, Drama, Suspenso, Romance, Ciencia Ficción, Terror, Documental, Infantil, Musical, etc.


-- ============================================================
-- 10. CONTENIDO
-- ============================================================
CREATE TABLE CONTENIDO (
    id_contenido            NUMBER         GENERATED ALWAYS AS IDENTITY
                                           CONSTRAINT pk_contenido PRIMARY KEY,
    titulo                  VARCHAR2(300)  NOT NULL,
    tipo                    VARCHAR2(15)   NOT NULL,
    anio_lanzamiento        NUMBER(4)      NOT NULL,
    duracion_minutos        NUMBER(6),      -- NULL para SERIE/PODCAST (la duración está en EPISODIO)
    sinopsis                CLOB,
    clasificacion_edad      VARCHAR2(5)    NOT NULL,
    fecha_agregado_catalogo DATE           DEFAULT SYSDATE NOT NULL,
    es_original_quindioflix CHAR(1)        DEFAULT 'N'     NOT NULL,
    id_empleado_responsable NUMBER,         -- empleado de Contenido responsable de la publicación
    CONSTRAINT chk_cont_tipo     CHECK (tipo               IN ('PELICULA','SERIE','DOCUMENTAL','MUSICA','PODCAST')),
    CONSTRAINT chk_cont_clasif   CHECK (clasificacion_edad IN ('TP','+7','+13','+16','+18')),
    CONSTRAINT chk_cont_original CHECK (es_original_quindioflix IN ('S','N')),
    CONSTRAINT fk_cont_empleado  FOREIGN KEY (id_empleado_responsable) REFERENCES EMPLEADO(id_empleado)
);

-- CONTENIDO.tipo: PELICULA | SERIE | DOCUMENTAL | MUSICA | PODCAST.
-- CONTENIDO.duracion_minutos: Duración total en minutos. Para SERIE y PODCAST se calcula a partir de los episodios.
-- CONTENIDO.es_original_quindioflix: S = producción original de QuindioFlix.
-- CONTENIDO.id_empleado_responsable: Empleado del depto. Contenido que publicó el título en el catálogo.


-- ============================================================
-- 11. CONTENIDO_GENERO  (Detalle)
-- ============================================================
CREATE TABLE CONTENIDO_GENERO (
    id_contenido NUMBER NOT NULL,
    id_genero    NUMBER NOT NULL,
    CONSTRAINT pk_cont_genero  PRIMARY KEY (id_contenido, id_genero),
    CONSTRAINT fk_cg_contenido FOREIGN KEY (id_contenido) REFERENCES CONTENIDO(id_contenido),
    CONSTRAINT fk_cg_genero    FOREIGN KEY (id_genero)    REFERENCES GENERO(id_genero)
);

-- CONTENIDO_GENERO: Un contenido puede pertenecer a varios géneros simultáneamente.


-- ============================================================
-- 12. CONTENIDO_RELACIONADO
--     Auto-referencia M:N: un contenido puede estar relacionado
--     con otros contenidos (secuela, precuela, remake, spin-off…).
-- ============================================================
CREATE TABLE CONTENIDO_RELACIONADO (
    id_contenido_origen  NUMBER        NOT NULL,
    id_contenido_destino NUMBER        NOT NULL,
    tipo_relacion        VARCHAR2(30)  NOT NULL,
    descripcion          VARCHAR2(300),
    CONSTRAINT pk_cont_rel   PRIMARY KEY (id_contenido_origen, id_contenido_destino),
    CONSTRAINT chk_cr_noself CHECK (id_contenido_origen != id_contenido_destino),
    CONSTRAINT chk_cr_tipo   CHECK (tipo_relacion IN ('SECUELA','PRECUELA','REMAKE','SPIN-OFF','VERSION_EXTENDIDA','OTRO')),
    CONSTRAINT fk_cr_origen  FOREIGN KEY (id_contenido_origen)  REFERENCES CONTENIDO(id_contenido),
    CONSTRAINT fk_cr_destino FOREIGN KEY (id_contenido_destino) REFERENCES CONTENIDO(id_contenido)
);

-- CONTENIDO_RELACIONADO: Relaciones entre contenidos: un contenido puede tener secuelas, remakes, spin-offs, etc. La relación es direccional (A es secuela de B).
-- CONTENIDO_RELACIONADO.tipo_relacion: SECUELA | PRECUELA | REMAKE | SPIN-OFF | VERSION_EXTENDIDA | OTRO.


-- ============================================================
-- 13. TEMPORADA  (aplica a SERIE y PODCAST)
-- ============================================================
CREATE TABLE TEMPORADA (
    id_temporada     NUMBER         GENERATED ALWAYS AS IDENTITY
                                    CONSTRAINT pk_temporada PRIMARY KEY,
    id_contenido     NUMBER         NOT NULL,
    numero_temporada NUMBER(3)      NOT NULL,
    titulo           VARCHAR2(300),
    anio             NUMBER(4),
    sinopsis         CLOB,
    CONSTRAINT uq_temporada      UNIQUE (id_contenido, numero_temporada),
    CONSTRAINT fk_temp_contenido FOREIGN KEY (id_contenido) REFERENCES CONTENIDO(id_contenido)
);

-- TEMPORADA: Las SERIES y PODCASTS se organizan en temporadas.


-- ============================================================
-- 14. EPISODIO
-- ============================================================
CREATE TABLE EPISODIO (
    id_episodio       NUMBER         GENERATED ALWAYS AS IDENTITY
                                     CONSTRAINT pk_episodio PRIMARY KEY,
    id_temporada      NUMBER         NOT NULL,
    numero_episodio   NUMBER(4)      NOT NULL,
    titulo            VARCHAR2(300)  NOT NULL,
    duracion_minutos  NUMBER(6),
    sinopsis          CLOB,
    fecha_lanzamiento DATE,
    CONSTRAINT uq_episodio     UNIQUE (id_temporada, numero_episodio),
    CONSTRAINT fk_ep_temporada FOREIGN KEY (id_temporada) REFERENCES TEMPORADA(id_temporada)
);


-- ============================================================
-- 15. REPRODUCCION
--     Restricción XOR: debe referenciar exactamente uno entre
--     id_contenido (película/doc/música) e id_episodio (serie/podcast).
--     Fragmentación por rango de fecha (tablespaces 2024 y 2025).
-- ============================================================

-- Tablespaces para fragmentación de Reproducciones
CREATE TABLESPACE ts_reproducciones_2024
    DATAFILE 'ts_repr_2024.dbf' SIZE 100M AUTOEXTEND ON NEXT 50M MAXSIZE 500M;

CREATE TABLESPACE ts_reproducciones_2025
    DATAFILE 'ts_repr_2025.dbf' SIZE 100M AUTOEXTEND ON NEXT 50M MAXSIZE 500M;
    
CREATE TABLESPACE ts_reproducciones_2026
    DATAFILE 'ts_repr_2026.dbf' SIZE 100M AUTOEXTEND ON NEXT 50M MAXSIZE 500M;

CREATE TABLE REPRODUCCION (
    id_reproduccion   NUMBER         GENERATED ALWAYS AS IDENTITY,
    id_perfil         NUMBER         NOT NULL,
    id_contenido      NUMBER,         -- para PELICULA, DOCUMENTAL, MUSICA
    id_episodio       NUMBER,         -- para episodios de SERIE o PODCAST
    fecha_inicio      TIMESTAMP      NOT NULL,
    fecha_fin         TIMESTAMP,
    dispositivo       VARCHAR2(15)   NOT NULL,
    porcentaje_avance NUMBER(5,2)    DEFAULT 0 NOT NULL,
    CONSTRAINT pk_reproduccion PRIMARY KEY (id_reproduccion),
    CONSTRAINT chk_repr_dispositivo CHECK (dispositivo IN ('CELULAR','TABLET','TV','COMPUTADOR')),
    CONSTRAINT chk_repr_avance      CHECK (porcentaje_avance BETWEEN 0 AND 100),
    CONSTRAINT chk_repr_fechas      CHECK (fecha_fin IS NULL OR fecha_fin >= fecha_inicio),
    CONSTRAINT chk_repr_xor         CHECK (
        (id_contenido IS NOT NULL AND id_episodio IS NULL) OR
        (id_contenido IS NULL     AND id_episodio IS NOT NULL)
    ),
    CONSTRAINT fk_repr_perfil    FOREIGN KEY (id_perfil)    REFERENCES PERFIL(id_perfil),
    CONSTRAINT fk_repr_contenido FOREIGN KEY (id_contenido) REFERENCES CONTENIDO(id_contenido),
    CONSTRAINT fk_repr_episodio  FOREIGN KEY (id_episodio)  REFERENCES EPISODIO(id_episodio)
)
PARTITION BY RANGE (fecha_inicio) (
    PARTITION p2024 VALUES LESS THAN (TO_DATE('2025-01-01','YYYY-MM-DD'))
        TABLESPACE ts_reproducciones_2024,
    PARTITION p2025 VALUES LESS THAN (TO_DATE('2026-01-01','YYYY-MM-DD'))
        TABLESPACE ts_reproducciones_2025,
    PARTITION p2026 VALUES LESS THAN (TO_DATE('2027-01-01','YYYY-MM-DD'))
        TABLESPACE ts_reproducciones_2026
);

-- REPRODUCCION.id_contenido: Referenciado solo para contenido sin episodios (película, documental, música).
-- REPRODUCCION.id_episodio: Referenciado solo cuando se reproduce un episodio de serie o podcast.
-- REPRODUCCION.porcentaje_avance: Avance de la reproducción entre 0 y 100. Permite retomar donde se dejó.


-- ============================================================
-- 16. FAVORITO
-- ============================================================
CREATE TABLE FAVORITO (
    id_perfil      NUMBER NOT NULL,
    id_contenido   NUMBER NOT NULL,
    fecha_agregado DATE   DEFAULT SYSDATE NOT NULL,
    CONSTRAINT pk_favorito      PRIMARY KEY (id_perfil, id_contenido),
    CONSTRAINT fk_fav_perfil    FOREIGN KEY (id_perfil)    REFERENCES PERFIL(id_perfil),
    CONSTRAINT fk_fav_contenido FOREIGN KEY (id_contenido) REFERENCES CONTENIDO(id_contenido)
);

-- FAVORITO: Lista personal de contenidos marcados como favoritos por cada perfil.


-- ============================================================
-- 17. CALIFICACION
-- ============================================================
CREATE TABLE CALIFICACION (
    id_calificacion    NUMBER    GENERATED ALWAYS AS IDENTITY
                                 CONSTRAINT pk_calificacion PRIMARY KEY,
    id_perfil          NUMBER    NOT NULL,
    id_contenido       NUMBER    NOT NULL,
    estrellas          NUMBER(1) NOT NULL,
    resena             CLOB,
    fecha_calificacion DATE      DEFAULT SYSDATE NOT NULL,
    CONSTRAINT uq_calificacion   UNIQUE (id_perfil, id_contenido),  -- un perfil califica un contenido una sola vez
    CONSTRAINT chk_cal_estrellas CHECK (estrellas BETWEEN 1 AND 5),
    CONSTRAINT fk_cal_perfil     FOREIGN KEY (id_perfil)    REFERENCES PERFIL(id_perfil),
    CONSTRAINT fk_cal_contenido  FOREIGN KEY (id_contenido) REFERENCES CONTENIDO(id_contenido)
);

-- CALIFICACION.resena: Reseña escrita opcional que acompaña la calificación por estrellas.


-- ============================================================
-- 18. REPORTE_CONTENIDO
-- ============================================================
CREATE TABLE REPORTE_CONTENIDO (
    id_reporte            NUMBER         GENERATED ALWAYS AS IDENTITY
                                         CONSTRAINT pk_reporte PRIMARY KEY,
    id_perfil_reportador  NUMBER         NOT NULL,
    id_contenido          NUMBER         NOT NULL,
    motivo                VARCHAR2(500)  NOT NULL,
    fecha_reporte         TIMESTAMP      DEFAULT SYSTIMESTAMP NOT NULL,
    estado                VARCHAR2(20)   DEFAULT 'PENDIENTE'  NOT NULL,
    id_empleado_moderador NUMBER,
    fecha_resolucion      TIMESTAMP,
    comentario_resolucion VARCHAR2(500),
    CONSTRAINT chk_rep_estado   CHECK (estado IN ('PENDIENTE','EN_REVISION','RESUELTO','RECHAZADO')),
    CONSTRAINT chk_rep_fechas   CHECK (fecha_resolucion IS NULL OR fecha_resolucion >= fecha_reporte),
    CONSTRAINT fk_rep_perfil    FOREIGN KEY (id_perfil_reportador)  REFERENCES PERFIL(id_perfil),
    CONSTRAINT fk_rep_contenido FOREIGN KEY (id_contenido)          REFERENCES CONTENIDO(id_contenido),
    CONSTRAINT fk_rep_moderador FOREIGN KEY (id_empleado_moderador) REFERENCES EMPLEADO(id_empleado)
);

-- REPORTE_CONTENIDO.id_empleado_moderador: Empleado de Soporte (rol MODERADOR) asignado para revisar y resolver el reporte.


-- ============================================================
-- 19. PAGO
-- ============================================================
CREATE TABLE PAGO (
    id_pago               NUMBER         GENERATED ALWAYS AS IDENTITY
                                         CONSTRAINT pk_pago PRIMARY KEY,
    id_usuario            NUMBER         NOT NULL,
    id_plan               NUMBER         NOT NULL,
    fecha_pago            DATE           DEFAULT SYSDATE NOT NULL,
    monto                 NUMBER(10,2)   NOT NULL,
    metodo_pago           VARCHAR2(20)   NOT NULL,
    estado_pago           VARCHAR2(15)   NOT NULL,
    descuento_aplicado    NUMBER(10,2)   DEFAULT 0,
    descripcion_descuento VARCHAR2(300),
    CONSTRAINT chk_pago_metodo CHECK (metodo_pago IN ('TARJETA_CREDITO','TARJETA_DEBITO','PSE','NEQUI','DAVIPLATA')),
    CONSTRAINT chk_pago_estado CHECK (estado_pago IN ('EXITOSO','FALLIDO','PENDIENTE','REEMBOLSADO')),
    CONSTRAINT chk_pago_monto  CHECK (monto > 0),
    CONSTRAINT chk_pago_dscto  CHECK (descuento_aplicado >= 0),
    CONSTRAINT fk_pago_usuario FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario),
    CONSTRAINT fk_pago_plan    FOREIGN KEY (id_plan)    REFERENCES PLAN_SUSCRIPCION(id_plan)
);

-- PAGO.id_plan: Plan vigente al momento del pago (puede diferir del plan actual si cambió).
-- PAGO.descuento_aplicado: Monto descontado por referidos u otras promociones.
-- PAGO.descripcion_descuento: Justificación del descuento (p.ej. "Descuento por referido #42").


-- ============================================================
-- 20. RESTRICCION_DOMINIO
--     Tabla dedicada a documentar los valores permitidos
--     para atributos con restricciones de dominio (CHECK).
-- ============================================================
CREATE TABLE RESTRICCION_DOMINIO (
    id_restriccion  NUMBER         GENERATED ALWAYS AS IDENTITY
                                    CONSTRAINT pk_restriccion_dominio PRIMARY KEY,
    tabla           VARCHAR2(50)   NOT NULL,
    atributo        VARCHAR2(50)   NOT NULL,
    valor_permitido VARCHAR2(100)  NOT NULL,
    descripcion     VARCHAR2(300),
    CONSTRAINT uq_restriccion_dominio UNIQUE (tabla, atributo, valor_permitido)
);

-- Poblado de RESTRICCION_DOMINIO con todos los valores permitidos

INSERT ALL
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('PLAN_SUSCRIPCION', 'calidad', 'SD', 'Standard Definition')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('PLAN_SUSCRIPCION', 'calidad', 'HD', 'High Definition')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('PLAN_SUSCRIPCION', 'calidad', '4K', 'Ultra High Definition')
    
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('USUARIO', 'estado', 'ACTIVO', 'Usuario con suscripción vigente')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('USUARIO', 'estado', 'INACTIVO', 'Usuario sin suscripción vigente')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('USUARIO', 'estado', 'SUSPENDIDO', 'Usuario suspendido por incumplimiento')
    
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('REFERIDO', 'beneficio_aplicado_referidor', 'S', 'Beneficio ya aplicado al referidor')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('REFERIDO', 'beneficio_aplicado_referidor', 'N', 'Beneficio no aplicado al referidor')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('REFERIDO', 'beneficio_aplicado_nuevo', 'S', 'Beneficio ya aplicado al nuevo usuario')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('REFERIDO', 'beneficio_aplicado_nuevo', 'N', 'Beneficio no aplicado al nuevo usuario')
    
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('PERFIL', 'tipo', 'ADULTO', 'Perfil sin restricciones de contenido')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('PERFIL', 'tipo', 'INFANTIL', 'Perfil con restricción a contenido infantil')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('PERFIL', 'activo', 'S', 'Perfil activo')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('PERFIL', 'activo', 'N', 'Perfil inactivo')
    
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('EMPLEADO', 'rol', 'EMPLEADO', 'Rol estándar')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('EMPLEADO', 'rol', 'SUPERVISOR', 'Supervisor de equipo')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('EMPLEADO', 'rol', 'JEFE', 'Jefe de departamento')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('EMPLEADO', 'rol', 'MODERADOR', 'Revisor de reportes de contenido')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('EMPLEADO', 'activo', 'S', 'Empleado activo')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('EMPLEADO', 'activo', 'N', 'Empleado inactivo')
    
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('CONTENIDO', 'tipo', 'PELICULA', 'Contenido tipo película')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('CONTENIDO', 'tipo', 'SERIE', 'Contenido tipo serie')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('CONTENIDO', 'tipo', 'DOCUMENTAL', 'Contenido tipo documental')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('CONTENIDO', 'tipo', 'MUSICA', 'Contenido tipo música')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('CONTENIDO', 'tipo', 'PODCAST', 'Contenido tipo podcast')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('CONTENIDO', 'clasificacion_edad', 'TP', 'Todos los públicos')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('CONTENIDO', 'clasificacion_edad', '+7', 'Mayores de 7 años')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('CONTENIDO', 'clasificacion_edad', '+13', 'Mayores de 13 años')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('CONTENIDO', 'clasificacion_edad', '+16', 'Mayores de 16 años')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('CONTENIDO', 'clasificacion_edad', '+18', 'Mayores de 18 años')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('CONTENIDO', 'es_original_quindioflix', 'S', 'Producción original de QuindioFlix')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('CONTENIDO', 'es_original_quindioflix', 'N', 'Contenido de terceros')
    
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('CONTENIDO_RELACIONADO', 'tipo_relacion', 'SECUELA', 'Continuación directa')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('CONTENIDO_RELACIONADO', 'tipo_relacion', 'PRECUELA', 'Historia anterior')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('CONTENIDO_RELACIONADO', 'tipo_relacion', 'REMAKE', 'Nueva versión')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('CONTENIDO_RELACIONADO', 'tipo_relacion', 'SPIN-OFF', 'Historia derivada')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('CONTENIDO_RELACIONADO', 'tipo_relacion', 'VERSION_EXTENDIDA', 'Edición extendida')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('CONTENIDO_RELACIONADO', 'tipo_relacion', 'OTRO', 'Otra relación')
    
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('REPRODUCCION', 'dispositivo', 'CELULAR', 'Dispositivo móvil')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('REPRODUCCION', 'dispositivo', 'TABLET', 'Tablet')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('REPRODUCCION', 'dispositivo', 'TV', 'Televisor inteligente')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('REPRODUCCION', 'dispositivo', 'COMPUTADOR', 'PC o laptop')
    
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('REPORTE_CONTENIDO', 'estado', 'PENDIENTE', 'Reporte sin atender')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('REPORTE_CONTENIDO', 'estado', 'EN_REVISION', 'Reporte en revisión')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('REPORTE_CONTENIDO', 'estado', 'RESUELTO', 'Reporte resuelto')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('REPORTE_CONTENIDO', 'estado', 'RECHAZADO', 'Reporte rechazado')
    
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('PAGO', 'metodo_pago', 'TARJETA_CREDITO', 'Pago con tarjeta de crédito')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('PAGO', 'metodo_pago', 'TARJETA_DEBITO', 'Pago con tarjeta de débito')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('PAGO', 'metodo_pago', 'PSE', 'Pago PSE')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('PAGO', 'metodo_pago', 'NEQUI', 'Pago Nequi')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('PAGO', 'metodo_pago', 'DAVIPLATA', 'Pago Daviplata')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('PAGO', 'estado_pago', 'EXITOSO', 'Pago exitoso')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('PAGO', 'estado_pago', 'FALLIDO', 'Pago fallido')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('PAGO', 'estado_pago', 'PENDIENTE', 'Pago pendiente')
    INTO RESTRICCION_DOMINIO (tabla, atributo, valor_permitido, descripcion) VALUES ('PAGO', 'estado_pago', 'REEMBOLSADO', 'Pago reembolsado')
SELECT 1 FROM DUAL;

COMMIT;


-- ============================================================
-- 21. ÍNDICES  (orientados a las consultas analíticas requeridas)
-- ============================================================

-- Usuarios
CREATE BITMAP INDEX idx_usuario_ciudad       ON USUARIO(id_ciudad);
CREATE BITMAP INDEX idx_usuario_plan         ON USUARIO(id_plan);
CREATE BITMAP INDEX idx_usuario_estado       ON USUARIO(estado);
CREATE INDEX idx_usuario_referidor    ON USUARIO(id_referidor);
CREATE INDEX idx_usuario_email       ON USUARIO(email);

-- Perfiles
CREATE INDEX idx_perfil_usuario       ON PERFIL(id_usuario);
CREATE INDEX idx_perfil_tipo          ON PERFIL(tipo);

-- Contenido
CREATE INDEX idx_cont_tipo            ON CONTENIDO(tipo);
CREATE INDEX idx_cont_clasificacion   ON CONTENIDO(clasificacion_edad);
CREATE INDEX idx_cont_fecha_catalogo  ON CONTENIDO(fecha_agregado_catalogo);
CREATE INDEX idx_cont_empleado        ON CONTENIDO(id_empleado_responsable);
CREATE INDEX idx_cont_categoria_anio  ON CONTENIDO(id_categoria, anio_lanzamiento);

-- Reproducción (base de los reportes de consumo)
CREATE INDEX idx_repr_perfil          ON REPRODUCCION(id_perfil);
CREATE INDEX idx_repr_contenido       ON REPRODUCCION(id_contenido);
CREATE INDEX idx_repr_episodio        ON REPRODUCCION(id_episodio);
CREATE INDEX idx_repr_fecha_inicio    ON REPRODUCCION(fecha_inicio) LOCAL;
CREATE INDEX idx_repr_dispositivo     ON REPRODUCCION(dispositivo);

-- Índice compuesto: consumo por período (reportes de gerencia)
CREATE INDEX idx_repr_perfil_fecha    ON REPRODUCCION(id_perfil, fecha_inicio) LOCAL;

-- Pagos (reportes financieros)
CREATE INDEX idx_pago_usuario         ON PAGO(id_usuario);
CREATE INDEX idx_pago_fecha           ON PAGO(fecha_pago);
CREATE INDEX idx_pago_estado          ON PAGO(estado_pago);
CREATE INDEX idx_pago_plan            ON PAGO(id_plan);

-- Reportes de contenido inapropiado
CREATE INDEX idx_rep_estado           ON REPORTE_CONTENIDO(estado);
CREATE INDEX idx_rep_moderador        ON REPORTE_CONTENIDO(id_empleado_moderador);
CREATE INDEX idx_rep_fecha            ON REPORTE_CONTENIDO(fecha_reporte);

-- Empleados (jerarquía y rendimiento)
CREATE INDEX idx_emp_departamento     ON EMPLEADO(id_departamento);
CREATE INDEX idx_emp_supervisor       ON EMPLEADO(id_supervisor);
CREATE INDEX idx_emp_rol              ON EMPLEADO(rol);

-- Calificaciones
CREATE INDEX idx_cal_contenido        ON CALIFICACION(id_contenido);

-- Temporadas / Episodios
CREATE INDEX idx_temp_contenido       ON TEMPORADA(id_contenido);
CREATE INDEX idx_ep_temporada         ON EPISODIO(id_temporada);

-- Contenido relacionado
CREATE INDEX idx_cr_destino           ON CONTENIDO_RELACIONADO(id_contenido_destino);

-- ============================================================
-- FIN DEL SCRIPT DDL
-- ============================================================

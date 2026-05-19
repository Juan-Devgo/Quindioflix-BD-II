# Historias de Usuario – QuindioFlix

**Proyecto:** Sistema de Base de Datos QuindioFlix  
**Versión:** 1.0  
**Fecha:** 2026-05-18  

---

## Índice

1. [Gestión de Contenido](#1-gestión-de-contenido)
2. [Gestión de Usuarios, Cuentas y Suscripciones](#2-gestión-de-usuarios-cuentas-y-suscripciones)
3. [Perfiles, Reproducción y Consumo](#3-perfiles-reproducción-y-consumo)
4. [Empleados, Jerarquía y Moderación](#4-empleados-jerarquía-y-moderación)
5. [Pagos, Facturación y Referidos](#5-pagos-facturación-y-referidos)
6. [Reportes y Analítica](#6-reportes-y-analítica)

---

## 1. Gestión de Contenido

### HU-CONT-001: Registrar nuevo contenido en el catálogo

**Como** empleado del departamento de Contenido  
**Quiero** registrar una nueva película, serie, documental, música o podcast  
**Para que** los usuarios puedan descubrirlo y reproducirlo en la plataforma.

**Criterios de aceptación:**

- [ ] Dado que un empleado de Contenido accede al módulo de catálogo, cuando completa el formulario de registro con título, tipo (`PELICULA`, `SERIE`, `DOCUMENTAL`, `MUSICA`, `PODCAST`), año de lanzamiento, sinopsis, clasificación de edad (`TP`, `+7`, `+13`, `+16`, `+18`) y marca si es original de QuindioFlix (`S`/`N`), entonces el sistema crea el registro en `CONTENIDO` con `fecha_agregado_catalogo = SYSDATE`.
- [ ] Dado que el contenido es una película, documental o música, cuando se registra, entonces el campo `duracion_minutos` debe ser obligatorio y mayor a cero.
- [ ] Dado que el contenido es una serie o podcast, cuando se registra, entonces el campo `duracion_minutos` puede quedar en `NULL` (se calculará a partir de los episodios).
- [ ] Dado que se intenta registrar un contenido sin título, con tipo inválido o con clasificación de edad fuera del dominio permitido, entonces el sistema rechaza la operación y notifica el error.
- [ ] Dado que el registro es exitoso, entonces el sistema asocia automáticamente el `id_empleado_responsable` al empleado que realizó la publicación.

**Notas técnicas:**

- Tablas involucradas: `CONTENIDO`, `EMPLEADO`.
- Restricciones: `chk_cont_tipo`, `chk_cont_clasif`, `chk_cont_original`, `fk_cont_empleado`.
- Índice relevante: `idx_cont_fecha_catalogo`.

---

### HU-CONT-002: Asociar géneros a un contenido

**Como** empleado del departamento de Contenido  
**Quiero** asignar uno o varios géneros a un contenido del catálogo  
**Para que** los usuarios puedan filtrar y descubrir contenido por sus preferencias de género.

**Criterios de aceptación:**

- [ ] Dado que un contenido existe en `CONTENIDO`, cuando el empleado selecciona uno o más géneros previamente registrados en `GENERO` (por ejemplo, Acción, Comedia, Drama), entonces el sistema crea los registros correspondientes en `CONTENIDO_GENERO`.
- [ ] Dado que un contenido ya tiene géneros asignados, cuando el empleado modifica la lista de géneros, entonces el sistema actualiza las asociaciones en `CONTENIDO_GENERO` sin duplicados.
- [ ] Dado que se intenta asignar un género inexistente, entonces el sistema rechaza la operación.
- [ ] Dado que un contenido queda sin géneros asignados, entonces el sistema permite que el catálogo lo liste como "sin género" pero no impide su publicación.

**Notas técnicas:**

- Tablas involucradas: `CONTENIDO_GENERO`, `GENERO`, `CONTENIDO`.
- Restricción: `pk_cont_genero` (evita duplicados).

---

### HU-CONT-003: Gestionar temporadas de series y podcasts

**Como** empleado del departamento de Contenido  
**Quiero** crear temporadas para una serie o podcast existente  
**Para que** el contenido episódico quede correctamente organizado.

**Criterios de aceptación:**

- [ ] Dado que existe un contenido de tipo `SERIE` o `PODCAST` en `CONTENIDO`, cuando el empleado registra una nueva temporada indicando `numero_temporada`, título, año y sinopsis opcional, entonces el sistema crea el registro en `TEMPORADA`.
- [ ] Dado que se intenta crear una temporada con el mismo `numero_temporada` para el mismo contenido, entonces el sistema rechaza la operación por violación de `uq_temporada`.
- [ ] Dado que el contenido es una película, documental o música, cuando el empleado intenta agregar una temporada, entonces el sistema impide la acción.

**Notas técnicas:**

- Tablas involucradas: `TEMPORADA`, `CONTENIDO`.
- Restricciones: `uq_temporada`, `fk_temp_contenido`.

---

### HU-CONT-004: Gestionar episodios dentro de una temporada

**Como** empleado del departamento de Contenido  
**Quiero** registrar los episodios de una temporada  
**Para que** los usuarios puedan reproducir cada episodio individualmente.

**Criterios de aceptación:**

- [ ] Dado que existe una temporada registrada en `TEMPORADA`, cuando el empleado registra un episodio con `numero_episodio`, título, duración en minutos y fecha de lanzamiento, entonces el sistema crea el registro en `EPISODIO`.
- [ ] Dado que se intenta crear un episodio con el mismo `numero_episodio` dentro de la misma temporada, entonces el sistema rechaza la operación por violación de `uq_episodio`.
- [ ] Dado que se registran múltiples episodios en una temporada, entonces el sistema permite ordenarlos por `numero_episodio` de forma ascendente.

**Notas técnicas:**

- Tablas involucradas: `EPISODIO`, `TEMPORADA`.
- Restricciones: `uq_episodio`, `fk_ep_temporada`.

---

### HU-CONT-005: Relacionar contenido entre sí

**Como** empleado del departamento de Contenido  
**Quiero** establecer relaciones entre contenidos del catálogo  
**Para que** los usuarios descubran secuelas, precuelas, remakes, spin-offs y versiones extendidas.

**Criterios de aceptación:**

- [ ] Dado que existen al menos dos contenidos en `CONTENIDO`, cuando el empleado define una relación entre un contenido origen y un contenido destino indicando el `tipo_relacion` (`SECUELA`, `PRECUELA`, `REMAKE`, `SPIN-OFF`, `VERSION_EXTENDIDA`, `OTRO`) y una descripción opcional, entonces el sistema crea el registro en `CONTENIDO_RELACIONADO`.
- [ ] Dado que se intenta relacionar un contenido consigo mismo, entonces el sistema rechaza la operación por violación de `chk_cr_noself`.
- [ ] Dado que ya existe una relación entre dos contenidos, cuando se intenta crear la misma relación en el mismo sentido, entonces el sistema rechaza la operación por violación de `pk_cont_rel`.
- [ ] Dado que se consulta un contenido, entonces el sistema muestra tanto las relaciones donde es origen como donde es destino.

**Notas técnicas:**

- Tablas involucradas: `CONTENIDO_RELACIONADO`, `CONTENIDO`.
- Restricciones: `pk_cont_rel`, `chk_cr_noself`, `chk_cr_tipo`.

---

## 2. Gestión de Usuarios, Cuentas y Suscripciones

### HU-USR-001: Registrar nuevo usuario en la plataforma

**Como** persona interesada en QuindioFlix  
**Quiero** crear una cuenta con mis datos personales y elegir un plan de suscripción  
**Para que** pueda acceder al catálogo de contenido.

**Criterios de aceptación:**

- [ ] Dado que un visitante accede al formulario de registro, cuando completa nombre, email único, teléfono opcional, fecha de nacimiento, selecciona su ciudad de residencia desde `CIUDAD` y elige un plan de `PLAN_SUSCRIPCION`, entonces el sistema crea el usuario en `USUARIO` con `estado = 'ACTIVO'` y `fecha_registro = SYSDATE`.
- [ ] Dado que el email ya está registrado, entonces el sistema rechaza el registro por violación de `uq_usuario_email`.
- [ ] Dado que el usuario indica quién lo refirió, cuando el `id_referidor` corresponde a un usuario existente, entonces el sistema crea automáticamente el registro en `REFERIDO` vinculando al referidor y al nuevo usuario.
- [ ] Dado que un usuario es referido, entonces el sistema asegura que solo pueda haber un registro en `REFERIDO` para ese nuevo usuario (`uq_referido_nuevo`).

**Notas técnicas:**

- Tablas involucradas: `USUARIO`, `CIUDAD`, `PLAN_SUSCRIPCION`, `REFERIDO`.
- Restricciones: `uq_usuario_email`, `fk_usuario_ref`, `uq_referido_nuevo`.

---

### HU-USR-002: Gestionar perfiles dentro de una cuenta

**Como** usuario de QuindioFlix  
**Quiero** crear, editar y eliminar perfiles dentro de mi cuenta  
**Para que** cada miembro de mi hogar tenga una experiencia personalizada.

**Criterios de aceptación:**

- [ ] Dado que un usuario tiene una suscripción activa, cuando crea un nuevo perfil indicando nombre, avatar opcional y tipo (`ADULTO` o `INFANTIL`), entonces el sistema registra el perfil en `PERFIL` siempre que no se supere el `max_pantallas` definido por su plan.
- [ ] Dado que un usuario intenta crear más perfiles de los permitidos por su plan, entonces el sistema bloquea la creación y notifica el límite.
- [ ] Dado que un perfil es de tipo `INFANTIL`, cuando el usuario intenta acceder a contenido con clasificación `+16` o `+18`, entonces el sistema bloquea el acceso.
- [ ] Dado que un usuario desea desactivar un perfil, cuando marca `activo = 'N'`, entonces el perfil deja de aparecer en la interfaz pero se conservan sus datos históricos (reproducciones, favoritos, calificaciones).
- [ ] Dado que un usuario modifica los datos de un perfil, entonces el sistema actualiza nombre, avatar o tipo sin afectar el historial.

**Notas técnicas:**

- Tablas involucradas: `PERFIL`, `USUARIO`, `PLAN_SUSCRIPCION`.
- Restricciones: `chk_perfil_tipo`, `chk_perfil_activo`.

---

### HU-USR-003: Cambiar plan de suscripción

**Como** usuario de QuindioFlix  
**Quiero** cambiar mi plan de suscripción (Básico, Estándar, Premium)  
**Para que** se ajuste a mis necesidades de pantallas y calidad.

**Criterios de aceptación:**

- [ ] Dado que un usuario tiene un plan activo, cuando solicita un cambio de plan, entonces el sistema actualiza `USUARIO.id_plan` al nuevo plan seleccionado.
- [ ] Dado que un usuario reduce de plan (por ejemplo, de Premium a Básico) y actualmente tiene más perfiles activos de los permitidos por el nuevo plan, entonces el sistema notifica que debe desactivar perfiles antes de confirmar el cambio.
- [ ] Dado que el cambio de plan es exitoso, entonces el nuevo plan se refleja en el próximo pago registrado en `PAGO`.

**Notas técnicas:**

- Tablas involucradas: `USUARIO`, `PLAN_SUSCRIPCION`.

---

### HU-USR-004: Desactivación automática por morosidad

**Como** sistema QuindioFlix  
**Quiero** desactivar automáticamente las cuentas cuya fecha de vencimiento supere los 30 días sin pago  
**Para que** se respeten las políticas de facturación y se restrinja el acceso a morosos.

**Criterios de aceptación:**

- [ ] Dado que existe un usuario con `estado = 'ACTIVO'`, cuando la diferencia entre `SYSDATE` y `fecha_vencimiento` es mayor a 30 días y no existe un pago con `estado_pago = 'EXITOSO'` posterior a dicha fecha, entonces el sistema actualiza `estado` a `'INACTIVO'`.
- [ ] Dado que una cuenta es desactivada por morosidad, cuando el usuario intenta iniciar sesión o reproducir contenido, entonces el sistema bloquea el acceso y muestra un mensaje indicando que debe actualizar su pago.
- [ ] Dado que un usuario inactivo realiza un pago exitoso, entonces el sistema reactiva la cuenta cambiando `estado` a `'ACTIVO'` y actualiza `fecha_vencimiento`.

**Notas técnicas:**

- Tablas involucradas: `USUARIO`, `PAGO`.
- Restricción: `chk_usuario_estado`.
- Índices: `idx_usuario_estado`, `idx_pago_usuario`, `idx_pago_estado`.

---

## 3. Perfiles, Reproducción y Consumo

### HU-CONS-001: Registrar reproducción de contenido

**Como** sistema QuindioFlix  
**Quiero** registrar cada reproducción iniciada por un perfil  
**Para que** se tenga trazabilidad del consumo y se permita retomar la reproducción.

**Criterios de aceptación:**

- [ ] Dado que un perfil inicia la reproducción de una película, documental o música, cuando se detecta el evento de inicio, entonces el sistema crea un registro en `REPRODUCCION` con `id_contenido` poblado, `id_episodio = NULL`, `fecha_inicio = SYSTIMESTAMP`, `dispositivo` (`CELULAR`, `TABLET`, `TV`, `COMPUTADOR`) y `porcentaje_avance = 0`.
- [ ] Dado que un perfil inicia la reproducción de un episodio de serie o podcast, cuando se detecta el evento de inicio, entonces el sistema crea un registro en `REPRODUCCION` con `id_episodio` poblado, `id_contenido = NULL`, y los demás campos obligatorios.
- [ ] Dado que se intenta crear una reproducción sin contenido ni episodio, o con ambos poblados simultáneamente, entonces el sistema rechaza la operación por violación de `chk_repr_xor`.
- [ ] Dado que el usuario pausa o abandona la reproducción, cuando el sistema recibe el evento de fin, entonces actualiza `fecha_fin` y `porcentaje_avance` correspondientemente.
- [ ] Dado que se registra `fecha_fin`, entonces debe ser mayor o igual a `fecha_inicio` (`chk_repr_fechas`).

**Notas técnicas:**

- Tablas involucradas: `REPRODUCCION`, `PERFIL`, `CONTENIDO`, `EPISODIO`.
- Restricciones: `chk_repr_xor`, `chk_repr_dispositivo`, `chk_repr_avance`, `chk_repr_fechas`.
- Índices: `idx_repr_perfil`, `idx_repr_fecha_inicio`, `idx_repr_dispositivo`.

---

### HU-CONS-002: Agregar contenido a favoritos

**Como** usuario (a través de mi perfil)  
**Quiero** marcar contenido como favorito  
**Para que** pueda acceder rápidamente a mis títulos preferidos.

**Criterios de aceptación:**

- [ ] Dado que un perfil visualiza un contenido, cuando selecciona "Agregar a favoritos", entonces el sistema crea un registro en `FAVORITO` con `fecha_agregado = SYSDATE`.
- [ ] Dado que un perfil ya tiene un contenido en favoritos, cuando intenta agregarlo nuevamente, entonces el sistema no duplica el registro (`pk_favorito`).
- [ ] Dado que un perfil desea eliminar un contenido de su lista de favoritos, entonces el sistema elimina el registro correspondiente de `FAVORITO`.
- [ ] Dado que un perfil consulta su lista de favoritos, entonces el sistema muestra todos los contenidos ordenados por `fecha_agregado` descendente.

**Notas técnicas:**

- Tablas involucradas: `FAVORITO`, `PERFIL`, `CONTENIDO`.
- Restricción: `pk_favorito`.

---

### HU-CONS-003: Calificar y reseñar contenido

**Como** usuario (a través de mi perfil)  
**Quiero** calificar un contenido con estrellas y opcionalmente dejar una reseña escrita  
**Para que** otros usuarios conozcan la opinión de la comunidad.

**Criterios de aceptación:**

- [ ] Dado que un perfil ha visualizado un contenido, cuando califica con un valor entre 1 y 5 estrellas y opcionalmente escribe una reseña, entonces el sistema crea el registro en `CALIFICACION` con `fecha_calificacion = SYSDATE`.
- [ ] Dado que un perfil ya calificó un contenido, cuando intenta calificarlo nuevamente, entonces el sistema actualiza la calificación y la reseña existentes (`uq_calificacion`).
- [ ] Dado que se intenta registrar una calificación fuera del rango 1-5, entonces el sistema rechaza la operación por violación de `chk_cal_estrellas`.
- [ ] Dado que un contenido tiene calificaciones, cuando se consulta su detalle, entonces el sistema calcula y muestra el promedio de estrellas.

**Notas técnicas:**

- Tablas involucradas: `CALIFICACION`, `PERFIL`, `CONTENIDO`.
- Restricciones: `chk_cal_estrellas`, `uq_calificacion`.
- Índice: `idx_cal_contenido`.

---

### HU-CONS-004: Reportar contenido como inapropiado

**Como** usuario (a través de mi perfil)  
**Quiero** reportar un contenido que considero inapropiado  
**Para que** el equipo de moderación lo revise y tome las acciones correspondientes.

**Criterios de aceptación:**

- [ ] Dado que un perfil visualiza un contenido, cuando selecciona "Reportar" y describe el motivo, entonces el sistema crea un registro en `REPORTE_CONTENIDO` con `estado = 'PENDIENTE'` y `fecha_reporte = SYSTIMESTAMP`.
- [ ] Dado que un reporte está en estado `PENDIENTE`, cuando un moderador lo toma para revisión, entonces el sistema actualiza `estado` a `'EN_REVISION'` y asigna `id_empleado_moderador`.
- [ ] Dado que un moderador resuelve el reporte, cuando indica la resolución, entonces el sistema actualiza `estado` a `'RESUELTO'` o `'RECHAZADO'`, registra `fecha_resolucion` y almacena `comentario_resolucion`.
- [ ] Dado que se registra `fecha_resolucion`, entonces debe ser mayor o igual a `fecha_reporte` (`chk_rep_fechas`).

**Notas técnicas:**

- Tablas involucradas: `REPORTE_CONTENIDO`, `PERFIL`, `CONTENIDO`, `EMPLEADO`.
- Restricciones: `chk_rep_estado`, `chk_rep_fechas`.
- Índices: `idx_rep_estado`, `idx_rep_moderador`, `idx_rep_fecha`.

---

## 4. Empleados, Jerarquía y Moderación

### HU-EMP-001: Registrar empleados y asignar departamentos

**Como** administrador del sistema  
**Quiero** registrar empleados con su departamento, rol y supervisor  
**Para que** quede documentada la estructura organizacional y las responsabilidades.

**Criterios de aceptación:**

- [ ] Dado que existe un departamento registrado en `DEPARTAMENTO`, cuando se registra un empleado con nombre, email único, departamento, rol (`EMPLEADO`, `SUPERVISOR`, `JEFE`, `MODERADOR`) y supervisor directo opcional, entonces el sistema crea el registro en `EMPLEADO`.
- [ ] Dado que un empleado tiene un supervisor, entonces ambos deben pertenecer al mismo departamento (`fk_emp_supervisor` garantiza la integridad referencial; la validación de mismo departamento es lógica de negocio).
- [ ] Dado que un empleado es designado como jefe de departamento, cuando se actualiza `DEPARTAMENTO.id_jefe`, entonces el sistema valida que dicho empleado pertenezca a ese departamento.
- [ ] Dado que se intenta registrar un email duplicado, entonces el sistema rechaza la operación por `uq_emp_email`.

**Notas técnicas:**

- Tablas involucradas: `EMPLEADO`, `DEPARTAMENTO`.
- Restricciones: `chk_emp_rol`, `chk_emp_activo`, `uq_emp_email`.
- Índices: `idx_emp_departamento`, `idx_emp_supervisor`, `idx_emp_rol`.

---

### HU-EMP-002: Gestionar jerarquía de supervisión

**Como** jefe de departamento  
**Quiero** asignar y modificar el supervisor directo de los empleados de mi departamento  
**Para que** la cadena de mando quede claramente definida.

**Criterios de aceptación:**

- [ ] Dado que un empleado pertenece a un departamento, cuando su jefe asigna un nuevo supervisor directo (`id_supervisor`), entonces el sistema actualiza el registro en `EMPLEADO`.
- [ ] Dado que se intenta asignar un supervisor de otro departamento, entonces el sistema rechaza la operación.
- [ ] Dado que un empleado tiene subordinados asignados, cuando se intenta desactivarlo (`activo = 'N'`), entonces el sistema notifica que debe reasignar sus subordinados primero o bien actualiza automáticamente `id_supervisor` a `NULL`.
- [ ] Dado que se consulta la jerarquía de un departamento, entonces el sistema permite visualizar el organigrama jerárquico basado en `id_supervisor`.

**Notas técnicas:**

- Tablas involucradas: `EMPLEADO`.
- Auto-referencia: `id_supervisor → EMPLEADO(id_empleado)`.

---

### HU-MOD-001: Revisar y resolver reportes de contenido inapropiado

**Como** empleado del departamento de Soporte con rol MODERADOR  
**Quiero** consultar los reportes pendientes y cambiar su estado  
**Para que** se mantenga la calidad y adecuación del catálogo.

**Criterios de aceptación:**

- [ ] Dado que existen reportes con `estado = 'PENDIENTE'`, cuando un moderador accede al panel de moderación, entonces el sistema lista los reportes ordenados por `fecha_reporte`.
- [ ] Dado que un moderador selecciona un reporte para revisar, cuando cambia el estado a `'EN_REVISION'`, entonces el sistema asocia `id_empleado_moderador` al moderador.
- [ ] Dado que un moderador decide que el contenido sí es inapropiado, cuando cambia el estado a `'RESUELTO'`, entonces el sistema registra `fecha_resolucion` y el `comentario_resolucion`, y opcionalmente desactiva o reclasifica el contenido.
- [ ] Dado que un moderador decide que el reporte no tiene fundamento, cuando cambia el estado a `'RECHAZADO'`, entonces el sistema registra la justificación y el contenido permanece disponible.
- [ ] Dado que un moderador consulta su historial, entonces el sistema muestra todos los reportes que ha resuelto, filtrables por rango de fechas.

**Notas técnicas:**

- Tablas involucradas: `REPORTE_CONTENIDO`, `EMPLEADO`.
- Restricciones: `chk_rep_estado`, `chk_rep_fechas`.
- Índices: `idx_rep_estado`, `idx_rep_moderador`.

---

## 5. Pagos, Facturación y Referidos

### HU-PAG-001: Registrar pagos de suscripción

**Como** sistema QuindioFlix  
**Quiero** registrar cada intento de pago mensual de los usuarios  
**Para que** se controle la facturación y el acceso a la plataforma.

**Criterios de aceptación:**

- [ ] Dado que un usuario realiza un pago, cuando el sistema recibe la confirmación del método de pago (`TARJETA_CREDITO`, `TARJETA_DEBITO`, `PSE`, `NEQUI`, `DAVIPLATA`), entonces crea un registro en `PAGO` con `fecha_pago = SYSDATE`, `monto`, `estado_pago` (`EXITOSO`, `FALLIDO`, `PENDIENTE`, `REEMBOLSADO`) y el plan vigente al momento del pago.
- [ ] Dado que un pago es exitoso, entonces el sistema actualiza `USUARIO.fecha_vencimiento` sumando 30 días a partir de la fecha de pago (o a partir de la fecha de vencimiento anterior si aún no ha vencido).
- [ ] Dado que un pago falla, entonces el sistema registra `estado_pago = 'FALLIDO'` y notifica al usuario; la cuenta permanece activa hasta que se supere el límite de gracia de 30 días posteriores a `fecha_vencimiento`.
- [ ] Dado que un usuario solicita reembolso y cumple las condiciones, cuando se aprueba, entonces el sistema actualiza `estado_pago = 'REEMBOLSADO'` y registra la razón.

**Notas técnicas:**

- Tablas involucradas: `PAGO`, `USUARIO`, `PLAN_SUSCRIPCION`.
- Restricciones: `chk_pago_metodo`, `chk_pago_estado`, `chk_pago_monto`.
- Índices: `idx_pago_usuario`, `idx_pago_fecha`, `idx_pago_estado`, `idx_pago_plan`.

---

### HU-PAG-002: Aplicar descuentos por referidos

**Como** sistema QuindioFlix  
**Quiero** aplicar automáticamente descuentos a usuarios que han referido o han sido referidos  
**Para que** se incentive el crecimiento orgánico de la plataforma.

**Criterios de aceptación:**

- [ ] Dado que existe un registro en `REFERIDO` donde `beneficio_aplicado_referidor = 'N'`, cuando el referidor realiza un pago mensual, entonces el sistema aplica el descuento configurado al monto del pago, registra `descuento_aplicado > 0` y `descripcion_descuento`, y marca `beneficio_aplicado_referidor = 'S'`.
- [ ] Dado que existe un registro en `REFERIDO` donde `beneficio_aplicado_nuevo = 'N'`, cuando el usuario referido realiza su primer pago mensual, entonces el sistema aplica el descuento correspondiente, registra el descuento en `PAGO` y marca `beneficio_aplicado_nuevo = 'S'`.
- [ ] Dado que ambos beneficios ya fueron aplicados (`S` en ambos campos), cuando cualquiera de los dos usuarios realiza un nuevo pago, entonces el sistema no aplica descuento adicional por esa relación de referido.
- [ ] Dado que se aplica un descuento, entonces `monto - descuento_aplicado` debe ser mayor a cero.

**Notas técnicas:**

- Tablas involucradas: `REFERIDO`, `PAGO`, `USUARIO`.
- Restricciones: `chk_ref_ben_ref`, `chk_ref_ben_nvo`, `chk_pago_dscto`.

---

### HU-PAG-003: Consultar historial de pagos

**Como** usuario de QuindioFlix  
**Quiero** consultar mi historial de pagos mensuales  
**Para que** pueda verificar mis transacciones, descuentos y estados.

**Criterios de aceptación:**

- [ ] Dado que un usuario accede a la sección "Facturación", entonces el sistema lista todos sus pagos ordenados por `fecha_pago` descendente, mostrando fecha, monto, descuento aplicado, método de pago y estado.
- [ ] Dado que un usuario tiene pagos con distintos estados, entonces el sistema permite filtrar por `EXITOSO`, `FALLIDO`, `PENDIENTE` o `REEMBOLSADO`.
- [ ] Dado que un usuario selecciona un pago específico, entonces el sistema muestra el detalle completo incluyendo el plan facturado, descripción del descuento (si aplica) y número de referencia del pago.

**Notas técnicas:**

- Tablas involucradas: `PAGO`, `PLAN_SUSCRIPCION`.
- Índices: `idx_pago_usuario`, `idx_pago_fecha`.

---

## 6. Reportes y Analítica

### HU-REP-001: Reporte de consumo por ciudad, categoría, género y dispositivo

**Como** gerente de QuindioFlix  
**Quiero** consultar métricas de consumo filtradas por ciudad, tipo de contenido, género, dispositivo y rango de fechas  
**Para que** pueda tomar decisiones estratégicas sobre el catálogo y la infraestructura.

**Criterios de aceptación:**

- [ ] Dado que un gerente selecciona una ciudad registrada en `CIUDAD`, cuando consulta el reporte de consumo, entonces el sistema cuenta las reproducciones (`REPRODUCCION`) de todos los perfiles cuyos usuarios residen en esa ciudad, agrupadas por período.
- [ ] Dado que un gerente selecciona un tipo de contenido (`PELICULA`, `SERIE`, `DOCUMENTAL`, `MUSICA`, `PODCAST`), entonces el sistema filtra las reproducciones por `CONTENIDO.tipo`.
- [ ] Dado que un gerente selecciona uno o varios géneros, entonces el sistema filtra las reproducciones a través de `CONTENIDO_GENERO`.
- [ ] Dado que un gerente selecciona un dispositivo (`CELULAR`, `TABLET`, `TV`, `COMPUTADOR`), entonces el sistema filtra por `REPRODUCCION.dispositivo`.
- [ ] Dado que un gerente define un rango de fechas, entonces el sistema incluye solo las reproducciones donde `fecha_inicio` está dentro del rango.
- [ ] Dado que se ejecuta el reporte, entonces el sistema presenta: total de reproducciones, tiempo total de visualización, promedio de avance y ranking de contenido más visto.

**Notas técnicas:**

- Tablas involucradas: `REPRODUCCION`, `PERFIL`, `USUARIO`, `CIUDAD`, `CONTENIDO`, `CONTENIDO_GENERO`, `GENERO`.
- Índices relevantes: `idx_repr_fecha_inicio`, `idx_repr_dispositivo`, `idx_usuario_ciudad`, `idx_cont_tipo`, `idx_cont_clasificacion`.

---

### HU-REP-002: Reporte de consumo por plan de suscripción

**Como** gerente de QuindioFlix  
**Quiero** comparar el consumo entre usuarios de los diferentes planes (Básico, Estándar, Premium)  
**Para que** pueda evaluar la conversión y retención de cada segmento.

**Criterios de aceptación:**

- [ ] Dado que existen usuarios en los tres planes, cuando se consulta el reporte, entonces el sistema agrupa las reproducciones por `PLAN_SUSCRIPCION.nombre`.
- [ ] Dado que se genera el reporte, entonces el sistema muestra: cantidad de usuarios activos por plan, cantidad de perfiles creados, reproducciones totales, promedio de reproducciones por usuario y porcentaje de churn (usuarios inactivos).
- [ ] Dado que se selecciona un período de tiempo, entonces el sistema limita los datos a reproducciones y pagos dentro de ese rango.

**Notas técnicas:**

- Tablas involucradas: `REPRODUCCION`, `PERFIL`, `USUARIO`, `PLAN_SUSCRIPCION`, `PAGO`.
- Índices: `idx_usuario_plan`, `idx_pago_plan`, `idx_repr_perfil_fecha`.

---

### HU-REP-003: Reporte financiero de ingresos

**Como** gerente financiero de QuindioFlix  
**Quiero** consultar los ingresos totales filtrados por ciudad y por plan  
**Para que** pueda evaluar la rentabilidad geográfica y por segmento.

**Criterios de aceptación:**

- [ ] Dado que existen pagos exitosos en `PAGO`, cuando se consulta el reporte financiero, entonces el sistema suma `monto - descuento_aplicado` de todos los pagos con `estado_pago = 'EXITOSO'`.
- [ ] Dado que se filtra por ciudad, entonces el sistema agrupa los ingresos según `USUARIO.id_ciudad`.
- [ ] Dado que se filtra por plan, entonces el sistema agrupa los ingresos según `PAGO.id_plan`.
- [ ] Dado que se define un rango de fechas, entonces el sistema limita la suma a `fecha_pago` dentro del rango.
- [ ] Dado que se genera el reporte, entonces el sistema presenta: ingresos brutos, descuentos totales, ingresos netos, cantidad de transacciones y ticket promedio.

**Notas técnicas:**

- Tablas involucradas: `PAGO`, `USUARIO`, `CIUDAD`, `PLAN_SUSCRIPCION`.
- Índices: `idx_pago_fecha`, `idx_pago_estado`, `idx_pago_plan`, `idx_usuario_ciudad`.

---

### HU-REP-004: Reporte de rendimiento del equipo de trabajo

**Como** jefe de departamento o gerente  
**Quiero** consultar métricas de productividad de los empleados  
**Para que** pueda evaluar el desempeño individual y del departamento.

**Criterios de aceptación:**

- [ ] Dado que existen empleados en `EMPLEADO`, cuando se consulta el reporte de rendimiento del departamento de Contenido, entonces el sistema cuenta cuántos contenidos ha publicado cada empleado (`CONTENIDO.id_empleado_responsable`), filtrable por rango de fechas.
- [ ] Dado que se consulta el rendimiento del departamento de Soporte, entonces el sistema cuenta cuántos reportes ha resuelto cada moderador (`REPORTE_CONTENIDO.id_empleado_moderador`), desglosando por estado (`RESUELTO`, `RECHAZADO`).
- [ ] Dado que se consulta la jerarquía de un departamento, entonces el sistema muestra el organigrama basado en `id_supervisor` y el número de subordinados por empleado.
- [ ] Dado que se filtra por período, entonces el sistema limita los contenidos publicados a `fecha_agregado_catalogo` y los reportes resueltos a `fecha_resolucion` dentro del rango.

**Notas técnicas:**

- Tablas involucradas: `EMPLEADO`, `DEPARTAMENTO`, `CONTENIDO`, `REPORTE_CONTENIDO`.
- Índices: `idx_emp_departamento`, `idx_emp_rol`, `idx_cont_empleado`, `idx_rep_moderador`.

---

### HU-REP-005: Reporte de efectividad del programa de referidos

**Como** gerente de Marketing  
**Quiero** conocer cuántos usuarios se han registrado por referidos y cuántos descuentos se han aplicado  
**Para que** pueda medir el retorno de inversión del programa.

**Criterios de aceptación:**

- [ ] Dado que existen registros en `REFERIDO`, cuando se consulta el reporte, entonces el sistema muestra: total de referidos registrados, cantidad de referidos por usuario referidor, tasa de conversión (referidos que se volvieron usuarios activos) y descuentos aplicados totales.
- [ ] Dado que se filtra por período, entonces el sistema limita los registros de `REFERIDO` donde `fecha_referido` está dentro del rango.
- [ ] Dado que se consulta el detalle de un referidor, entonces el sistema lista cada uno de sus referidos, la fecha de registro y si los beneficios ya fueron aplicados a ambas partes.

**Notas técnicas:**

- Tablas involucradas: `REFERIDO`, `USUARIO`, `PAGO`.
- Índices: `idx_usuario_referidor`.

---

## Resumen de trazabilidad

| Historia | Módulo | Actor principal | Tablas principales |
|---|---|---|---|
| HU-CONT-001 | Contenido | Empleado Contenido | `CONTENIDO`, `EMPLEADO` |
| HU-CONT-002 | Contenido | Empleado Contenido | `CONTENIDO_GENERO`, `GENERO` |
| HU-CONT-003 | Contenido | Empleado Contenido | `TEMPORADA`, `CONTENIDO` |
| HU-CONT-004 | Contenido | Empleado Contenido | `EPISODIO`, `TEMPORADA` |
| HU-CONT-005 | Contenido | Empleado Contenido | `CONTENIDO_RELACIONADO`, `CONTENIDO` |
| HU-USR-001 | Usuarios | Visitante / Sistema | `USUARIO`, `CIUDAD`, `REFERIDO`, `PLAN_SUSCRIPCION` |
| HU-USR-002 | Usuarios | Usuario | `PERFIL`, `USUARIO`, `PLAN_SUSCRIPCION` |
| HU-USR-003 | Usuarios | Usuario | `USUARIO`, `PLAN_SUSCRIPCION` |
| HU-USR-004 | Usuarios | Sistema | `USUARIO`, `PAGO` |
| HU-CONS-001 | Consumo | Sistema / Perfil | `REPRODUCCION`, `PERFIL`, `CONTENIDO`, `EPISODIO` |
| HU-CONS-002 | Consumo | Perfil | `FAVORITO`, `PERFIL`, `CONTENIDO` |
| HU-CONS-003 | Consumo | Perfil | `CALIFICACION`, `PERFIL`, `CONTENIDO` |
| HU-CONS-004 | Consumo | Perfil / Moderador | `REPORTE_CONTENIDO`, `PERFIL`, `CONTENIDO`, `EMPLEADO` |
| HU-EMP-001 | Empleados | Administrador | `EMPLEADO`, `DEPARTAMENTO` |
| HU-EMP-002 | Empleados | Jefe departamento | `EMPLEADO` |
| HU-MOD-001 | Moderación | Moderador | `REPORTE_CONTENIDO`, `EMPLEADO` |
| HU-PAG-001 | Pagos | Sistema | `PAGO`, `USUARIO`, `PLAN_SUSCRIPCION` |
| HU-PAG-002 | Pagos | Sistema | `REFERIDO`, `PAGO` |
| HU-PAG-003 | Pagos | Usuario | `PAGO`, `PLAN_SUSCRIPCION` |
| HU-REP-001 | Reportes | Gerencia | `REPRODUCCION`, `USUARIO`, `CIUDAD`, `CONTENIDO`, `GENERO` |
| HU-REP-002 | Reportes | Gerencia | `REPRODUCCION`, `USUARIO`, `PLAN_SUSCRIPCION` |
| HU-REP-003 | Reportes | Gerencia financiera | `PAGO`, `USUARIO`, `CIUDAD`, `PLAN_SUSCRIPCION` |
| HU-REP-004 | Reportes | Gerencia / Jefe | `EMPLEADO`, `CONTENIDO`, `REPORTE_CONTENIDO` |
| HU-REP-005 | Reportes | Marketing | `REFERIDO`, `USUARIO`, `PAGO` |

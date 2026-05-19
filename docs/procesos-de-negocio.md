# Procesos de Negocio – QuindioFlix

**Proyecto:** Sistema de Base de Datos QuindioFlix  
**Versión:** 1.0  
**Fecha:** 2026-05-18

---

## Índice

1. [Registro de usuario](#1-registro-de-usuario)
2. [Gestión de perfiles](#2-gestión-de-perfiles)
3. [Consumo de contenido](#3-consumo-de-contenido)
4. [Calificación y favoritos](#4-calificación-y-favoritos)
5. [Facturación y pagos](#5-facturación-y-pagos)
6. [Gestión del catálogo](#6-gestión-del-catálogo)
7. [Moderación de reportes](#7-moderación-de-reportes)
8. [Programa de referidos](#8-programa-de-referidos)
9. [Cambio de plan](#9-cambio-de-plan)
10. [Reportes y analítica gerencial](#10-reportes-y-analítica-gerencial)

---

## 1. Registro de usuario

El usuario se registra proporcionando nombre, email, teléfono, fecha de nacimiento y ciudad. Elige un plan de suscripción (Básico, Estándar o Premium). El sistema valida que el email no exista, crea la cuenta, genera un perfil predeterminado y registra el primer pago. Si fue referido por otro usuario, se registra la relación y se marcan los beneficios correspondientes para ambas partes.

- **Entradas:** nombre, email, teléfono, fecha de nacimiento, ciudad, plan de suscripción, referidor (opcional).
- **Salidas:** cuenta de usuario creada, perfil predeterminado generado, primer pago registrado, relación de referido (si aplica).
- **Reglas de negocio relacionadas:** RN-01, RN-07, RN-08.

---

## 2. Gestión de perfiles

El usuario puede crear múltiples perfiles dentro de su cuenta, hasta el máximo permitido por su plan. Cada perfil tiene nombre, avatar y tipo (Adulto o Infantil). Los perfiles infantiles tienen restricciones de acceso al catálogo.

- **Entradas:** nombre del perfil, avatar (opcional), tipo de perfil.
- **Salidas:** perfil creado, actualizado o desactivado.
- **Reglas de negocio relacionadas:** RN-02, RN-03.

---

## 3. Consumo de contenido

Un perfil selecciona un contenido del catálogo y lo reproduce. El sistema registra la fecha y hora de inicio, el dispositivo utilizado, el porcentaje de avance y, si aplica, la fecha y hora de fin. Para series y podcasts, se registra el episodio específico reproducido.

- **Entradas:** id de perfil, id de contenido o id de episodio, dispositivo.
- **Salidas:** registro de reproducción creado o actualizado con avance y fecha de fin.
- **Reglas de negocio relacionadas:** RN-03, RN-06, RN-11.

---

## 4. Calificación y favoritos

Un perfil puede calificar contenido con una puntuación de 1 a 5 estrellas y opcionalmente dejar una reseña escrita, siempre que haya visto al menos el 50% del contenido. También puede agregar contenido a su lista personal de favoritos.

- **Entradas:** id de perfil, id de contenido, calificación (1-5), reseña (opcional).
- **Salidas:** registro de calificación creado o actualizado; registro de favorito creado o eliminado.
- **Reglas de negocio relacionadas:** RN-04, RN-05.

---

## 5. Facturación y pagos

Los usuarios pagan mensualmente según su plan activo. Cada pago queda registrado con fecha, monto, método de pago y estado. Si un usuario tiene un referido activo, recibe un descuento en su pago. Si transcurren más de 30 días desde la fecha de vencimiento sin pago exitoso, la cuenta pasa a estado INACTIVO automáticamente.

- **Entradas:** id de usuario, monto, método de pago, plan vigente.
- **Salidas:** registro de pago creado, descuento aplicado (si aplica), actualización de estado de cuenta.
- **Reglas de negocio relacionadas:** RN-06, RN-13, RN-14.

---

## 6. Gestión del catálogo

Los empleados del departamento de Contenido agregan títulos al catálogo, asignando tipo, clasificación de edad, géneros, año de lanzamiento y demás atributos. Para series y podcasts, gestionan también temporadas y episodios. Registran si el contenido es una producción original de QuindioFlix y pueden asociar contenidos relacionados (secuelas, remakes, spin-offs, etc.).

- **Entradas:** datos del contenido, géneros, temporadas, episodios, relaciones.
- **Salidas:** contenido registrado en el catálogo, episodios y relaciones creadas.
- **Reglas de negocio relacionadas:** RN-15.

---

## 7. Moderación de reportes

Un perfil puede reportar un contenido como inapropiado indicando el motivo. El reporte queda en estado PENDIENTE y es asignado a un moderador (empleado de Soporte), quien lo revisa y lo resuelve o rechaza, registrando su decisión y comentarios.

- **Entradas:** id de perfil, id de contenido, motivo del reporte.
- **Salidas:** reporte creado en estado PENDIENTE, actualización a RESUELTO o RECHAZADO con comentarios.
- **Reglas de negocio relacionadas:** RN-12.

---

## 8. Programa de referidos

Un usuario registrado puede invitar a otros usuarios a la plataforma. Cuando el nuevo usuario se registra, el sistema registra la relación y aplica beneficios (por ejemplo, descuento en el siguiente pago) tanto al referidor como al referido, de forma independiente.

- **Entradas:** id del referidor, id del nuevo usuario.
- **Salidas:** relación de referido registrada, beneficios marcados para aplicación.
- **Reglas de negocio relacionadas:** RN-07, RN-08.

---

## 9. Cambio de plan

Un usuario puede cambiar de plan de suscripción. El sistema valida que el nuevo plan sea compatible con la cantidad de perfiles activos que tiene el usuario (no puede bajar a un plan con menor límite de pantallas si ya los supera). El cambio queda registrado y afecta los pagos futuros.

- **Entradas:** id de usuario, nuevo plan de suscripción.
- **Salidas:** plan actualizado, validación de perfiles activos, ajuste en próximos pagos.
- **Reglas de negocio relacionadas:** RN-02.

---

## 10. Reportes y analítica gerencial

La gerencia accede a reportes de consumo por ciudad, categoría, género, dispositivo, plan y período; reportes financieros de ingresos; y reportes de rendimiento del equipo (contenido publicado por empleado, reportes resueltos por moderador).

- **Entradas:** filtros de ciudad, categoría, género, dispositivo, plan, rango de fechas.
- **Salidas:** reportes agregados con métricas de consumo, ingresos y productividad.
- **Reglas de negocio relacionadas:** Ninguna específica (consultas de lectura).

---

## Resumen de procesos

| # | Proceso | Actor principal | Salida principal |
|---|---|---|---|
| 1 | Registro de usuario | Usuario / Sistema | Cuenta activa, primer pago |
| 2 | Gestión de perfiles | Usuario | Perfiles creados o actualizados |
| 3 | Consumo de contenido | Perfil | Registro de reproducción |
| 4 | Calificación y favoritos | Perfil | Calificación o favorito registrado |
| 5 | Facturación y pagos | Sistema / Usuario | Pago registrado, estado de cuenta |
| 6 | Gestión del catálogo | Empleado de Contenido | Contenido publicado |
| 7 | Moderación de reportes | Moderador | Reporte resuelto o rechazado |
| 8 | Programa de referidos | Sistema | Descuentos aplicados |
| 9 | Cambio de plan | Usuario | Plan actualizado |
| 10 | Reportes y analítica gerencial | Gerencia | Reportes estratégicos |

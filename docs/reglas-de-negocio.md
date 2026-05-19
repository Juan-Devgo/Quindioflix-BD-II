# Reglas de Negocio – QuindioFlix

**Proyecto:** Sistema de Base de Datos QuindioFlix  
**Versión:** 1.0  
**Fecha:** 2026-05-18

---

## Índice

1. [Reglas de usuarios y cuentas](#1-reglas-de-usuarios-y-cuentas)
2. [Reglas de perfiles y consumo](#2-reglas-de-perfiles-y-consumo)
3. [Reglas de pagos y facturación](#3-reglas-de-pagos-y-facturación)
4. [Reglas de referidos](#4-reglas-de-referidos)
5. [Reglas de empleados y jerarquía](#5-reglas-de-empleados-y-jerarquía)
6. [Reglas de contenido y moderación](#6-reglas-de-contenido-y-moderación)

---

## 1. Reglas de usuarios y cuentas

### RN-01: Unicidad del email

Un usuario no puede registrarse con un email que ya exista en el sistema. El email es único e irrepetible dentro de la tabla `USUARIO`.

> **Impacto:** Evita duplicidad de cuentas y garantiza la identificación unívoca de cada usuario.

---

## 2. Reglas de perfiles y consumo

### RN-02: Límite de perfiles por plan

El número máximo de perfiles por cuenta de usuario está determinado por el plan de suscripción activo:

| Plan | Máximo de perfiles |
|---|---|
| Básico | 2 |
| Estándar | 3 |
| Premium | 5 |

> **Impacto:** El sistema debe validar la cantidad de perfiles activos antes de permitir la creación de uno nuevo o antes de aceptar un cambio de plan a uno inferior.

### RN-03: Restricción de contenido para perfiles infantiles

Un perfil de tipo `INFANTIL` solo puede reproducir contenido con clasificación de edad `TP`, `+7` o `+13`. El acceso a contenido clasificado como `+16` o `+18` está restringido para estos perfiles.

> **Impacto:** Se debe validar la clasificación del contenido antes de permitir la reproducción desde un perfil infantil.

### RN-04: Calificación tras consumo mínimo

Un perfil solo puede calificar un contenido si ha reproducido al menos el 50% de su duración.

> **Impacto:** El sistema verifica el porcentaje de avance registrado en `REPRODUCCION` antes de permitir la creación de una calificación.

### RN-05: Calificación única por perfil

Cada contenido puede ser calificado como máximo una vez por perfil.

> **Impacto:** Si un perfil intenta calificar nuevamente un contenido ya calificado, el sistema actualiza la calificación existente en lugar de crear un nuevo registro.

---

## 3. Reglas de pagos y facturación

### RN-06: Desactivación automática por morosidad

Si un usuario no registra un pago exitoso dentro de los 30 días siguientes a su fecha de vencimiento, el sistema cambia automáticamente su estado a `INACTIVO`. Ningún perfil de una cuenta `INACTIVA` puede iniciar una reproducción.

> **Impacto:** Proceso automatizado que evalúa el estado de pagos y bloquea el acceso a la plataforma para usuarios morosos.

### RN-13: Monto de pago mayor a cero

El monto registrado en un pago debe ser siempre mayor a cero. No se permiten pagos con monto nulo o negativo.

> **Impacto:** Restricción a nivel de tabla (`chk_pago_monto`) que garantiza la integridad financiera de los registros.

### RN-14: Descuento no negativo y descripción obligatoria

El descuento aplicado en un pago no puede ser negativo, y la descripción del descuento debe estar presente cuando el descuento es mayor a cero.

> **Impacto:** Asegura que los descuentos sean valores válidos y justificados, facilitando la auditoría de transacciones.

---

## 4. Reglas de referidos

### RN-07: Referido único por usuario

Un usuario solo puede haber sido referido una vez en toda su vida en la plataforma.

> **Impacto:** La tabla `REFERIDO` garantiza que cada nuevo usuario tenga como máximo un registro de referido asociado (`uq_referido_nuevo`).

### RN-08: Autoreferencia prohibida

Un usuario no puede referirse a sí mismo. La lógica del proceso de registro y el modelo de datos garantizan que el referidor y el nuevo usuario sean siempre personas distintas.

> **Impacto:** Validación en el momento del registro que impide que el campo `id_referidor` coincida con el `id_usuario` del nuevo registro.

---

## 5. Reglas de empleados y jerarquía

### RN-09: Jefe de departamento perteneciente al departamento

Un empleado que actúa como jefe de departamento debe pertenecer al mismo departamento que lidera. No puede ser jefe de un departamento en el que no trabaja.

> **Impacto:** Al asignar `id_jefe` en `DEPARTAMENTO`, el sistema valida que el empleado indicado tenga `id_departamento` coincidente.

### RN-10: Supervisión intradepartamental

Un supervisor solo puede supervisar empleados dentro de su mismo departamento. La jerarquía interna es intradepartamental.

> **Impacto:** La asignación de `id_supervisor` en `EMPLEADO` se valida para asegurar que ambos registros compartan el mismo `id_departamento`.

### RN-12: Moderador exclusivo de Soporte

Un empleado con rol `MODERADOR` debe pertenecer al departamento de Soporte. Los empleados de otros departamentos no pueden revisar reportes de contenido inapropiado.

> **Impacto:** Restricción que valida que el rol `MODERADOR` solo pueda asignarse a empleados cuyo departamento sea Soporte.

---

## 6. Reglas de contenido y moderación

### RN-11: Exclusividad de referencia en reproducción

La reproducción de un contenido en `REPRODUCCION` debe referenciar exclusivamente a un `id_contenido` o a un `id_episodio`, nunca ambos ni ninguno.

> **Impacto:** Restricción a nivel de tabla (`chk_repr_xor`) que garantiza la integridad semántica del registro de consumo.

### RN-15: Contenido relacionado sin autoreferencia

Un contenido relacionado no puede referenciarse a sí mismo.

> **Impacto:** La tabla `CONTENIDO_RELACIONADO` impide que `id_contenido_origen` sea igual a `id_contenido_destino` (`chk_cr_noself`).

---

## Resumen de reglas de negocio

| Código | Nombre | Dominio |
|---|---|---|
| RN-01 | Unicidad del email | Usuarios y cuentas |
| RN-02 | Límite de perfiles por plan | Perfiles y consumo |
| RN-03 | Restricción de contenido para perfiles infantiles | Perfiles y consumo |
| RN-04 | Calificación tras consumo mínimo | Perfiles y consumo |
| RN-05 | Calificación única por perfil | Perfiles y consumo |
| RN-06 | Desactivación automática por morosidad | Pagos y facturación |
| RN-07 | Referido único por usuario | Referidos |
| RN-08 | Autoreferencia prohibida | Referidos |
| RN-09 | Jefe de departamento perteneciente al departamento | Empleados y jerarquía |
| RN-10 | Supervisión intradepartamental | Empleados y jerarquía |
| RN-11 | Exclusividad de referencia en reproducción | Contenido y moderación |
| RN-12 | Moderador exclusivo de Soporte | Empleados y jerarquía |
| RN-13 | Monto de pago mayor a cero | Pagos y facturación |
| RN-14 | Descuento no negativo y descripción obligatoria | Pagos y facturación |
| RN-15 | Contenido relacionado sin autoreferencia | Contenido y moderación |

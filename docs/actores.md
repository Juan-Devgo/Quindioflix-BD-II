# Actores – QuindioFlix

**Proyecto:** Sistema de Base de Datos QuindioFlix  
**Versión:** 1.0  
**Fecha:** 2026-05-18

---

## Índice

1. [Actores de negocio](#actores-de-negocio)
2. [Actores técnicos](#actores-técnicos)
3. [Resumen de actores](#resumen-de-actores)

---

## Actores de negocio

### Usuario

Persona registrada en la plataforma que posee una cuenta activa. Es el cliente final de QuindioFlix y el titular de la suscripción. A través de su cuenta puede gestionar perfiles, realizar pagos, cambiar de plan y participar en el programa de referidos.

- **Responsabilidades principales:**
  - Registrarse en la plataforma y mantener sus datos personales actualizados.
  - Elegir y cambiar el plan de suscripción.
  - Gestionar los perfiles asociados a su cuenta.
  - Realizar y consultar pagos mensuales.
  - Invitar a nuevos usuarios mediante el programa de referidos.

---

### Perfil

Identidad de consumo dentro de una cuenta de usuario. Representa a la persona que realmente interactúa con el catálogo y el contenido. Puede ser de tipo **Adulto** o **Infantil**.

- **Responsabilidades principales:**
  - Seleccionar y reproducir contenido del catálogo.
  - Calificar y reseñar contenido visualizado.
  - Agregar contenido a la lista de favoritos.
  - Reportar contenido considerado inapropiado.

- **Restricciones:**
  - Los perfiles de tipo Infantil tienen acceso limitado a contenidos con ciertas clasificaciones de edad.

---

### Empleado de contenido

Responsable de agregar y administrar el catálogo de la plataforma. Pertenece al departamento de Contenido y se encarga de mantener el inventario de títulos actualizado, incluyendo metadatos, géneros, temporadas, episodios y relaciones entre contenidos.

- **Responsabilidades principales:**
  - Registrar nuevos títulos en el catálogo.
  - Asignar géneros y clasificaciones de edad.
  - Gestionar temporadas y episodios de series y podcasts.
  - Establecer relaciones entre contenidos (secuelas, remakes, spin-offs, etc.).

---

### Moderador

Empleado con rol especial dentro del departamento de Soporte. Tiene la facultad de revisar y resolver los reportes de contenido inapropiado que realizan los perfiles de los usuarios.

- **Responsabilidades principales:**
  - Consultar reportes pendientes de contenido inapropiado.
  - Revisar el contenido reportado y determinar si viola las políticas de la plataforma.
  - Resolver o rechazar reportes, registrando la decisión y los comentarios correspondientes.

- **Restricciones:**
  - Solo los empleados del departamento de Soporte pueden desempeñar el rol de moderador.

---

### Jefe de departamento

Empleado que lidera uno de los departamentos de la organización. Tiene autoridad sobre los empleados de su departamento y es responsable de la gestión y el rendimiento del mismo.

- **Responsabilidades principales:**
  - Supervisar las actividades del departamento a su cargo.
  - Asignar y modificar la jerarquía de supervisión dentro del departamento.
  - Consultar reportes de productividad y rendimiento de su equipo.

- **Restricciones:**
  - Debe pertenecer al mismo departamento que lidera.

---

### Supervisor

Empleado con autoridad directa sobre otros empleados dentro del mismo departamento. Forma parte de la cadena de mando interna y puede ser responsable de la revisión y aprobación de tareas de su equipo.

- **Responsabilidades principales:**
  - Supervisar las actividades de los empleados a su cargo.
  - Apoyar en la gestión de la carga de trabajo del equipo.

- **Restricciones:**
  - Solo puede supervisar empleados que pertenezcan a su mismo departamento.

---

## Actores técnicos

### Administrador de Base de Datos

Actor técnico encargado de gestionar los esquemas de usuarios, roles, privilegios, tablespaces y la infraestructura del sistema de base de datos. No participa directamente en los procesos de negocio de la plataforma, pero garantiza la disponibilidad, seguridad y rendimiento del sistema de datos.

- **Responsabilidades principales:**
  - Crear y mantener esquemas, usuarios de base de datos y roles.
  - Asignar privilegios y permisos de acceso a los objetos del sistema.
  - Gestionar tablespaces, índices y objetos de almacenamiento.
  - Monitorear el rendimiento y aplicar políticas de respaldo y recuperación.

---

## Resumen de actores

| Actor | Tipo | Departamento / Área |
|---|---|---|
| Usuario | Negocio | Cliente externo |
| Perfil | Negocio | Cliente externo (dentro de una cuenta) |
| Empleado de contenido | Negocio | Contenido |
| Moderador | Negocio | Soporte |
| Jefe de departamento | Negocio | Cualquier departamento |
| Supervisor | Negocio | Cualquier departamento |
| Administrador de Base de Datos | Técnico | Infraestructura / TI |

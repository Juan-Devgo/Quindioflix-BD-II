# Vista General del Proyecto – QuindioFlix

**Proyecto:** Sistema de Base de Datos QuindioFlix  
**Versión:** 1.0  
**Fecha:** 2026-05-18

---

## Descripción de la empresa

QuindioFlix es una plataforma colombiana de streaming de contenido multimedia que requiere un sistema de base de datos robusto capaz de soportar su operación completa. El sistema debe gestionar el catálogo de contenidos, los usuarios y sus perfiles, el consumo de contenido, la facturación y pagos, el equipo de trabajo interno, y los reportes analíticos requeridos por la gerencia.

---

## Alcance del sistema

El sistema de base de datos de QuindioFlix abarca los siguientes dominios principales:

1. **Gestión de contenido** – Catálogo de películas, series, documentales, música y podcasts, incluyendo temporadas, episodios, géneros y relaciones entre contenidos.
2. **Gestión de usuarios, cuentas y suscripciones** – Registro de usuarios, perfiles (adulto e infantil), planes de suscripción (Básico, Estándar, Premium) y programa de referidos.
3. **Consumo de contenido** – Registro de reproducciones, calificaciones, reseñas, favoritos y reportes de contenido inapropiado.
4. **Facturación y pagos** – Control de pagos mensuales, descuentos por referidos, estados de pago y desactivación automática por morosidad.
5. **Empleados, jerarquía y moderación** – Estructura organizacional, departamentos, roles, supervisión interna y moderación de reportes.
6. **Reportes y analítica gerencial** – Métricas de consumo, reportes financieros, rendimiento del equipo y efectividad del programa de referidos.

---

## Objetivos del sistema

- Centralizar la información operativa de la plataforma en un modelo de datos relacional consistente y escalable.
- Garantizar la integridad referencial y la aplicación de las reglas de negocio a nivel de base de datos.
- Facilitar la trazabilidad del consumo, la facturación y la productividad interna mediante registros auditables.
- Soportar la toma de decisiones estratégicas a través de reportes analíticos eficientes.

---

## Principales entidades del dominio

| Entidad | Descripción |
|---|---|
| `USUARIO` | Persona registrada en la plataforma con una cuenta activa. |
| `PERFIL` | Identidad de consumo dentro de una cuenta de usuario (Adulto o Infantil). |
| `CONTENIDO` | Título disponible en el catálogo (película, serie, documental, música, podcast). |
| `EPISODIO` | Capítulo individual de una serie o podcast, agrupado por temporadas. |
| `REPRODUCCION` | Registro de cada sesión de visualización o escucha iniciada por un perfil. |
| `PAGO` | Transacción mensual de suscripción asociada a un usuario. |
| `EMPLEADO` | Miembro del equipo interno de QuindioFlix, asignado a un departamento y rol. |
| `DEPARTAMENTO` | Unidad organizacional de la empresa (Contenido, Soporte, etc.). |
| `REPORTE_CONTENIDO` | Solicitud de revisión de contenido inapropiado realizada por un perfil. |
| `REFERIDO` | Relación entre un usuario referidor y un nuevo usuario invitado a la plataforma. |

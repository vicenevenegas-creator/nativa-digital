# Clase 10 · Modelo de datos
Fecha: 09/09/2026
Equipo: Nativa Digital
Integrantes: Equipo de proyecto

## 1. Flujos que el modelo tiene que soportar

| Actor / rol | Acción principal | Qué información crea o modifica | Qué información consulta |
|---|---|---|---|
| **Usuario público** (comprador / reparador) | Buscar compatibilidad de sello | Ninguna | Marcas de bomba, modelos de bomba, fluidos y sellos mecánicos compatibles |
| **Usuario público** (comprador / reparador) | Solicitar cotización / derivar a WhatsApp o Tienda Nube | Crea un registro de consulta/lead (fecha, bomba/sello consultado, nombre, teléfono) | Datos del sello encontrado o mensaje de derivación si no hubo coincidencia |
| **Usuario privado** (equipo empresa) | Cargar o actualizar catálogo (manual o Excel) | Crea o modifica marcas de bomba, modelos de bomba, fluidos y equivalencias de sellos | Catálogo existente de bombas y sellos |
| **Usuario privado** (equipo empresa) | Ver consultas y movimientos de usuarios | Ninguna (o cambia estado de seguimiento) | Listado de consultas/leads (fechas, búsquedas realizadas, contactos) |

## 2. Lo que decidió el equipo
- **Flujo central:** El producto es una web app enfocada en agilizar el proceso de ventas mediante un buscador multi-criterio (marca de bomba, modelo y fluido) que devuelve los sellos mecánicos compatibles y deriva a WhatsApp o Tienda Nube para cerrar la operación.
- **Roles:** Se definen dos roles claramente diferenciados:
  - *Usuario público:* Clientes potenciales, distribuidores y reparadores con acceso exclusivo al buscador y derivación comercial.
  - *Usuario privado:* Miembros de la empresa con acceso autenticado para administrar el catálogo (carga individual o masiva por Excel) y consultar métricas/leads.
- **Datos a conservar:** Se guardan las entidades del catálogo técnico y el registro de consultas/leads (fecha, modelo de bomba, fluido, sello consultado, nombre y teléfono de contacto).
- **Relaciones clave:** Una marca posee muchos modelos de bomba. Para una misma combinación de modelo de bomba y fluido pueden existir múltiples alternativas de sellos mecánicos compatibles.
- **Alcance MVP:** Quedan expresamente fuera del MVP el control de stock físico en tiempo real, la pasarela de pagos integrada y el dimensionamiento de sellos especiales no estándar.

## 3. Decisiones de diseño
- **Desacoplamiento de modelos de bomba y sellos:** Se separaron las bombas de los sellos mecánicos en tablas independientes para permitir que una bomba soporte múltiples sellos según el fluido sin duplicar datos técnicos.
- **Soporte de múltiples alternativas (muchos a muchos):** Se implementó la tabla intermedia `compatibilidades`, la cual relaciona un modelo de bomba y un fluido con uno o más sellos mecánicos equivalentes.
- **Captura de datos de contacto en leads:** Para el seguimiento comercial efectivo, la tabla `consultas_leads` registra nombre y teléfono del interesado junto con los identificadores técnicos de lo consultado.
- **Supuestos pendientes:** Ninguno crítico para el diseño estructural; la carga masiva desde Excel se resolverá a nivel de lógica de aplicación insertando en estas mismas tablas.

## 4. Tablas y campos

| Tabla | Qué representa (en lenguaje cotidiano) | Campos principales | PK | FK / relación |
|---|---|---|---|---|
| **usuarios** | Miembros autorizados de la empresa para administrar el sistema | id (UUID/INT), email (TEXT), 
ombre (TEXT), ol (TEXT), creado_en (TIMESTAMP) | id | - |
| **marcas_bomba** | Marcas fabricantes de bombas (ej. Grundfos, KSB, Rotor Pump) | id (UUID/INT), 
ombre (TEXT) | id | - |
| **modelos_bomba** | Modelos específicos de bombas asociados a una marca | id (UUID/INT), marca_id (FK), 
ombre_modelo (TEXT), diametro_eje (TEXT/NUMERIC) | id | marca_id → marcas_bomba.id |
| **fluidos** | Tipos de fluidos bombeados (ej. Agua limpia, Hidrocarburos, Químicos) | id (UUID/INT), 
ombre (TEXT) | id | - |
| **sellos_mecanicos** | Repuestos y sellos mecánicos disponibles para reemplazo | id (UUID/INT), codigo_referencia (TEXT), marca_sello (TEXT), material_caras (TEXT), material_elastomero (TEXT), link_tiendanube (TEXT) | id | - |
| **compatibilidades** | Regla que une una bomba y fluido con sus sellos mecánicos compatibles | id (UUID/INT), modelo_bomba_id (FK), luido_id (FK), sello_id (FK) | id | modelo_bomba_id → modelos_bomba.id<br>luido_id → luidos.id<br>sello_id → sellos_mecanicos.id |
| **consultas_leads** | Registro de búsquedas y derivaciones comerciales iniciadas | id (UUID/INT), echa (TIMESTAMP), modelo_bomba_id (FK), luido_id (FK), sello_id (FK, opcional), 
ombre_contacto (TEXT), 	elefono_contacto (TEXT) | id | modelo_bomba_id → modelos_bomba.id<br>luido_id → luidos.id<br>sello_id → sellos_mecanicos.id |

## 5. Relaciones
- **Una marca de bomba a muchos modelos de bomba (1:N):** `marcas_bomba` se relaciona con `modelos_bomba`. Una marca puede tener múltiples modelos fabricados, pero cada modelo pertenece a una única marca.
- **Modelos de bomba y fluidos con sellos mecánicos (N:M a través de `compatibilidades`):** Un modelo de bomba bombeando un fluido particular puede ser compatible con múltiples opciones de sellos mecánicos (distintas marcas o materiales), y a su vez un mismo sello mecánico puede ser compatible con diferentes bombas.
- **Consultas/leads con el catálogo (N:1):** Cada registro en `consultas_leads` referencia el modelo de bomba y el fluido consultados, y opcionalmente el sello seleccionado, permitiendo trazabilidad de la demanda de repuestos.

## 6. Recorrido de prueba
1. **Carga inicial por la empresa:** Un usuario administrativo autenticado (`usuarios`) da de alta la marca *Grundfos* (`marcas_bomba`), el modelo *CR 10-05* (`modelos_bomba`), y dos sellos mecánicos alternativos (*Burgmann* y *Roten*) en `sellos_mecanicos`. Define ambas compatibilidades en la tabla `compatibilidades` para el fluido *Agua limpia* (`fluidos`).
2. **Búsqueda pública:** El cliente selecciona *Grundfos* > *CR 10-05* > *Agua limpia*. El sistema consulta `compatibilidades` filtrando por esos identificadores y devuelve los 2 sellos mecánicos disponibles.
3. **Derivación y captura de lead:** El cliente elige la alternativa *Burgmann*, presiona Cotizar por WhatsApp y completa sus datos (*Carlos Pérez*, *11-5555-1234*). Se crea un registro en `consultas_leads` con fecha, datos de contacto y las referencias a la bomba, fluido y sello.
4. **Seguimiento comercial:** El equipo de la empresa consulta el panel interno, visualiza el lead generado y atiende al comprador en WhatsApp con el contexto exacto de su necesidad.

## 7. Diagrama

`mermaid
erDiagram
    usuarios {
        uuid id PK
        string email
        string nombre
        string rol
        datetime creado_en
    }

    marcas_bomba {
        uuid id PK
        string nombre
    }

    modelos_bomba {
        uuid id PK
        uuid marca_id FK
        string nombre_modelo
        string diametro_eje
    }

    fluidos {
        uuid id PK
        string nombre
    }

    sellos_mecanicos {
        uuid id PK
        string codigo_referencia
        string marca_sello
        string material_caras
        string material_elastomero
        string link_tiendanube
    }

    compatibilidades {
        uuid id PK
        uuid modelo_bomba_id FK
        uuid fluido_id FK
        uuid sello_id FK
    }

    consultas_leads {
        uuid id PK
        datetime fecha
        uuid modelo_bomba_id FK
        uuid fluido_id FK
        uuid sello_id FK
        string nombre_contacto
        string telefono_contacto
    }

    marcas_bomba ||--o{ modelos_bomba : posee
    modelos_bomba ||--o{ compatibilidades : aplica_en
    fluidos ||--o{ compatibilidades : utilizado_en
    sellos_mecanicos ||--o{ compatibilidades : resuelve
    modelos_bomba ||--o{ consultas_leads : consultado_en
    fluidos ||--o{ consultas_leads : filtrado_en
    sellos_mecanicos ||--o{ consultas_leads : seleccionado_en
`

# Design System · Graphite / Nativa Digital

## 1. Introducción y Propósito
Este documento define las reglas visuales y los componentes de interfaz para la aplicación web de matcheo de equivalencias de sellos mecánicos y bombas de Graphite Technologies.

---

## 2. Paleta de Colores

| Nombre de Color | Código Hex | Uso en la Interfaz |
| :--- | :--- | :--- |
| **Graphite Red (Primario)** | `#D20A11` | Botón principal (CTA), elementos activos, resaltados. |
| **Graphite Red Dark** | `#B0080E` | Hover de botones primarios. |
| **Black Graphite (Texto/H1)** | `#111111` | Encabezados principales, textos de alta jerarquía. |
| **Dark Neutral (Texto Secundario)** | `#4A4A4A` | Descripciones, labels de formularios, subtítulos. |
| **Light Neutral (Fondo Tarjetas/Inputs)**| `#F4F5F7` | Fondos de tarjetas, inputs de selección, contenedores. |
| **Border Neutral** | `#E2E8F0` | Bordes de tarjetas y divisores. |
| **Pure White** | `#FFFFFF` | Fondo general de la página web, modales. |
| **Success Green** | `#10B981` | Badges de compatibilidad verificada y stock. |

---

## 3. Tipografía

- **Familia Tipográfica:** `'Montserrat', sans-serif`
- **Escala de Fuentes:**
  - `H1 (Título Principal):` 32px / Peso: 700 (Bold) / Line-height: 1.2
  - `H2 (Subtítulos):` 24px / Peso: 600 (SemiBold) / Line-height: 1.3
  - `H3 (Títulos de Tarjeta):` 18px / Peso: 600 (SemiBold) / Line-height: 1.4
  - `Body (Texto General / Selects):` 16px / Peso: 400 (Regular) / Line-height: 1.5
  - `Small (Etiquetas Técnicas / Badges):` 14px / Peso: 500 (Medium) / Line-height: 1.4

---

## 4. Espaciado, Bordes y Sombras

- **Radios de Borde (Border Radius):**
  - Inputs / Selects / Dropdowns: `8px`
  - Tarjetas de Repuestos: `12px`
  - Botones principales y secundarios: `8px`
  - Badges / Pill tags: `9999px`
- **Sombras (Box-Shadow):**
  - Tarjeta de repuesto: `0 4px 12px rgba(0, 0, 0, 0.05)`
  - Tarjeta en hover: `0 8px 24px rgba(0, 0, 0, 0.1)`
  - Enfoque de Input (Focus Ring): `0 0 0 3px rgba(210, 10, 17, 0.2)`

---

## 5. Componentes Principales

### A. Buscador Multi-Criterio
- **Filtros requeridos:**
  1. Marca de Bomba
  2. Modelo de Bomba
  3. Sello
  4. Tipo de Fluido (3-4 opciones clave)
- **Botón CTA:** "Buscar compatibilidad 🔍" en `#D20A11` con texto en blanco.

### B. Tarjeta de Repuesto Compatible
- Imagen / Dibujo técnico del sello.
- Título del repuesto y código equivalente.
- Badges de compatibilidad de fluido (Ej: "Apto Agua / Químicos").
- Especificaciones de material (Carbón, Silicio, Vitón, EPDM).
- Botón directo de derivación a WhatsApp / Cotización.

---

## 6. Criterios de Accesibilidad
- Ratio de contraste mínimo WCAG AA (superior a 4.5:1) en todos los textos sobre fondo blanco y gris claro.
- Anillos de enfoque visibles en rojo Graphite para navegación por teclado.

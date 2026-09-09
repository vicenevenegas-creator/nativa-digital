# Funcionalidades y Alcance del MVP

## Funcionalidades completas del producto
1. **Base de datos / Panel de carga de equivalencias:** Estructuración y administración de la información técnica de repuestos y marcas. *(Sin dependencias previas)*.
2. **Buscador unificado multi-criterio:** Búsqueda por marca y modelo de bomba (filtro principal), tipo de fluido (3-4 opciones clave) y diámetro de eje. *(Depende de la Base de datos)*.
3. **Motor de matcheo de equivalencias:** Despliegue visual de todas las opciones compatibles (variantes de marcas equivalentes, materiales de caras y elastómeros) para sellos estándar. *(Depende del Buscador y la Base de datos)*.
4. **Módulo autoservicio e-commerce para clientes:** Interfaz web simplificada para consulta directa por parte del comprador final. *(Depende del Buscador y Motor de matcheo)*.
5. **Sistema de derivación a vendedores / WhatsApp:** Botón directo para transferir la consulta al cotizador ante dudas o repuestos no estándar. *(Depende del Módulo autoservicio)*.
6. **Asistente para sellos especiales / no estándar:** Calculadora o motor para sellos a medida. *(Descartado)*.
7. **Integración con ERP / Stock en tiempo real:** Conexión con el sistema interno para consultar inventario físico y precios. *(Descartado)*.

## Mapa de dependencias
- **Base de datos → Buscador → Motor de matcheo:** Es la cadena troncal. Sin la base de datos estructurada, el buscador no tiene qué consultar ni el motor qué matchear.
- **Buscador + Motor de matcheo → Módulo autoservicio cliente → Derivación a WhatsApp:** El portal de clientes reutiliza el motor principal y deriva a atención humana ante dudas.

## MVP

### Dentro
- **Base de datos / Panel de carga de equivalencias:** Imprescindible para consolidar y alimentar la información técnica.
- **Buscador por marca/modelo, fluido y diámetro de eje:** Imprescindible para capturar la consulta del cotizador o cliente.
- **Motor de matcheo con todas las opciones equivalentes:** Imprescindible para resolver la búsqueda en segundos y presentar alternativas para sellos estándar.
- **Módulo autoservicio cliente e-commerce con derivación a WhatsApp:** Imprescindible para responder consultas sencillas y derivar las dudas complejas al cotizador.

### Fuera, pero previsto
- **Ampliación de matriz de fluidos y marcas secundarias:** Incorporación futura de más de 4 tipos de fluidos y marcas de baja rotación. La arquitectura de la base de datos se dejará preparada y extensible.

### Fuera, descartado
- **Asistente de sellos especiales / no estándar:** Descartado porque se seguirán resolviendo manualmente por vendedores experimentados.
- **Integración con ERP / Stock en tiempo real:** Descartado para evitar costos y complejidad; la consulta de stock y precios se mantiene en el ERP existente.

## Control final
- **¿El MVP funciona sin nada de lo que quedó afuera?** Sí. Al enfocarse en sellos estándar y dejar el stock/sellos especiales en sus canales actuales, el MVP funciona de manera completamente independiente.
- **¿Cubre el recorrido central completo?** Sí. Abarca desde que entra la consulta del cliente (vía web o cotizador), el matcheo automático de equivalencias en plataforma, hasta la confirmación y pase de orden a depósito.

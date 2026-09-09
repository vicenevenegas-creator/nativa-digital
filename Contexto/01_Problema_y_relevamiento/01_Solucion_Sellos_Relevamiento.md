# Clase 2 · Solución Sellos
Fecha: 05/08/2026
Integrantes: Vicente Venegas, Martin Hellwing, Pedro Halperin

## 1. El problema
A los empleados/vendedores de la fábrica y a los compradores les cuesta encontrar el repuesto exacto para un producto cuando necesitan realizar una reposición o reparación.

## 2. Usuario principal
Rol concreto: Empleados y vendedores de la fábrica de sellos (aprox. 3 personas) y compradores vía e-commerce.
Quién decide y quién paga: Por confirmar en entrevista (suponemos el dueño/administrador de la fábrica).
Le vendemos a una organización o a una persona: A una organización (la fábrica), ofreciendo un módulo interno/técnico y un módulo de cara al comprador final.

## 3. Cómo lo resuelven hoy
Buscan manualmente en internet, consultan catálogos y manuales de equivalencias por marca en papel/PDF, y recurren a la memoria personal de los vendedores experimentados.

## 4. Qué les cuesta
Pierden más de una hora por consulta revisando información desorganizada. Esto provoca ineficiencia operativa diaria y pérdida directa de ventas cuando no logran identificar el repuesto a tiempo.

## 5. Lo que estamos suponiendo sin evidencia
- Que la fábrica cuenta con suficiente información de equivalencias para cargar o vincular a un sistema.
- Que los compradores estarían dispuestos a buscar el repuesto ellos mismos si se les brinda una herramienta clara.
- Quién es la persona específica dentro de la fábrica que tiene el poder de decisión y presupuesto para pagar por la herramienta.
- Que la causa principal de la pérdida de ventas es únicamente la falta de matcheo rápido y no la falta de stock físico de repuestos.

## 6. Por qué este equipo y este problema
Qué nos trajo hasta acá: Uno de los integrantes del equipo trabaja diariamente en el rubro/fábrica y vive este problema en su jornada laboral.
Qué acceso real tenemos a gente que lo vive: Acceso directo e intuitivo a compañeros de trabajo (empleados y vendedores) con los que interactúa todos los días.
Qué sabemos de este mundo: Más de 30 años de trayectoria y presencia en el mercado, además de contar con manuales físicos/PDF de equivalencias de múltiples marcas.

## 7. Primera mirada de afuera
Lo que encontramos:
- La industria de sellos mecánicos (John Crane, EagleBurgmann, Vulcan, AESSEAL, etc.) reconoce abiertamente la complejidad del matcheo debido a la cantidad de variables técnicas (diámetro de eje, tipo de cara/carbón vs. silicio, elastómeros Viton/EPDM, presiones y fluido bombeado).
- Un error de equivalencia provoca fallas catastróficas o fugas en las bombas de agua/fluidos.

Quién ya lo resuelve:
1. **Vulcan Seals Cross Reference Tool:** Un buscador web donde ingresás la marca del sello original/bomba y el código para obtener la equivalencia de su propia marca. (Limitación: solo sugiere repuestos de Vulcan).
2. **Tablas de equivalencia en PDF / QSeals:** Documentos estáticos de referencia cruzada cruzando códigos entre John Crane, Burgmann y AESSEAL. (Limitación: son estáticos, difíciles de consultar en el mostrador o por un cliente final sin conocimientos técnicos).

Lo que no encontramos (y por eso hay que preguntarlo):
- Herramientas pensadas para que un comprador final (no ingeniero) pueda identificar el sello mecánico de su bomba sin saber medir el eje o el material.
- Buscadores agnósticos e interactivos que un vendedor de mostrador o fábrica pueda usar rápido mientras habla por teléfono o chat con el cliente.

## 8. Los tres caminos que evaluamos
1. **Camino 1: Matcheador Web Interactivo de Equivalencias.** Plataforma web con buscador paso a paso según marca, modelo de bomba o medidas.
2. **Camino 2: Asistente Bot por WhatsApp con Lectura de Foto/Etiquetas.** Bot de consulta automática por chat que procesa fotos de sellos o códigos por WhatsApp.
3. **Camino 3: Matriz Maestra Unificada y QR (Rediseño de Proceso).** Consolidar la información en una base única de consulta directa sin construir software a medida.

## 9. Camino elegido y por qué
Elegimos: Híbrido entre el Camino 1 y el Camino 3 (Plataforma Web con doble módulo: Comprador simplificado vs. Fábrica/Vendedor técnico).
Nuestras palabras: "la idea es como un mix de los dos caminos 1 y 3, donde el comprador pueda entrar y ver una web reducida donde busque solo por el modelo de su bomba, y luego una ampliada técnica, donde los vendedores puedan cargar todos los datos"
Qué nos preocupa de este camino: Que les sirva realmente a ambos perfiles (comprador y vendedor) y que funcione bien técnicamente sin sobrecomplicar la experiencia.

## 10. Supuestos a validar
| # | Supuesto | Si es falso, pasa que... | Preguntas que lo validan |
|---|---|---|---|
| 1 | Los compradores están dispuestos a buscar el repuesto ellos mismos por el modelo de su bomba antes de consultar al vendedor. | El comprador no usará la web reducida y seguirá exigiendo atención humana por teléfono/WhatsApp. | 1. Contame la última vez que se te rompió un sello mecánico de una bomba. ¿Qué fue lo primero que hiciste para averiguar qué repuesto comprar?<br>2. Cuando buscás repuestos en internet, ¿con qué información contás de tu equipo antes de contactar al proveedor? |
| 2 | La fábrica cuenta con la información de equivalencias (modelos de bomba vs. códigos de sello) suficiente y ordenada para cargarla en un sistema. | No tenemos datos confiables para alimentar la base de datos, haciendo imposible el matcheo automático. | 1. Mostrame o contame cómo está guardada hoy la información de equivalencias entre marcas de sellos y bombas.<br>2. ¿Qué pasa cuando entra una consulta sobre un sello antiguo o de marca poco frecuente? ¿De dónde sacan la información? |
| 3 | Quien decide incorporar la herramienta en la fábrica (dueño/gerente) ve la pérdida de tiempo en búsquedas como un costo significativo que justifica pagar por software. | La empresa no estará dispuesta a invertir en la solución porque no percibe la ineficiencia como un problema prioritario. | 1. Contame alguna situación reciente donde una consulta por un repuesto haya llevado demasiado tiempo o terminado en una venta perdida. ¿Qué impacto tuvo en el negocio?<br>2. ¿Cómo deciden en la fábrica qué herramientas de software implementar para la gestión o las ventas? |

## 11. Preguntas prohibidas
- *PROHIBIDA:* "¿Usarías una web que te busque automáticamente el sello para tu bomba?" (Invita a decir "sí" por cortesía sin evidencia real).
- *PROHIBIDA:* "¿Te serviría un sistema para no tener que buscar más en manuales de papel?" (Le cuenta la solución al entrevistado).
- *PROHIBIDA:* "¿Pagarías por una herramienta que reduzca el tiempo de búsqueda?" (Las intenciones de pago futuras hipotéticas no son reales).

## 12. Con quiénes vamos a hablar
| Perfil / rol | Para qué supuesto sirve | Cómo llegamos | Quién del equipo | Nombre (si lo tenemos) |
|---|---|---|---|---|
| Vendedor / Empleado de fábrica | Supuesto 2 (disponibilidad y orden de equivalencias) | Trabajo de un integrante del equipo | Integrante que trabaja en la fábrica | Por confirmar en el trabajo |
| Comprador / Cliente de repuestos | Supuesto 1 (comportamiento de búsqueda del cliente) | Clientes habituales que consultan en el trabajo del integrante | Equipo | Clientes frecuentes |
| Dueño / Gerente de la fábrica | Supuesto 3 (decisión de compra y presupuesto) | Contacto directo en el trabajo del integrante | Equipo | Dueño / Administrador de la fábrica |

## 13. Perfiles que todavía no sabemos cómo alcanzar
Ninguno. El equipo cuenta con acceso directo a los tres perfiles clave dentro del espacio de trabajo de uno de sus integrantes.

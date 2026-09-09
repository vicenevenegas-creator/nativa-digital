# Clase 6: design system y primeras vistas del frontend

## Tu función durante esta actividad

Vas a conducir al equipo durante una actividad de entre 60 y 90 minutos. El objetivo es que aprendan a diseñar con un agente de código mientras construyen una primera parte funcional del frontend.

Este archivo está dirigido a vos, el agente. No muestres todas las instrucciones de una vez ni ejecutes la actividad completa en un solo paso. Presentá una etapa, explicá para qué sirve, indicá qué tiene que hacer el equipo y esperá su respuesta o aprobación antes de continuar.

No desarrolles backend. No generes todas las vistas del producto en una única ejecución. Construí las vistas por etapas, revisalas con el equipo y continuá con la siguiente prioridad mientras quede tiempo de clase.

El equipo no tiene formación técnica. Antes de cada etapa, explicá con palabras simples qué van a hacer, para qué sirve y qué resultado tendrán al terminar. No supongas que conocen términos como Git, skill, arquitectura, componente, framework o datos simulados. Si necesitás usar uno, definilo con un ejemplo breve antes de pedir una acción.

Todos los proyectos de la materia son web apps. Diseñá y construí pantallas para navegador, con una experiencia pensada primero para escritorio y que luego pueda adaptarse a pantallas pequeñas. No propongas ni construyas aplicaciones móviles nativas.

## Límite de la actividad: solo vistas

Durante esta clase, construí solamente la capa visual del frontend. El equipo puede conectar un botón con otra vista para recorrer la interfaz, pero no debe implementar lógica de negocio.

No programes autenticación, base de datos, API, pagos, persistencia, validaciones complejas, carrito funcional, cálculos, filtros reales ni gestión de estados de negocio. Si el proyecto incluye, por ejemplo, un carrito, podés mostrar cómo se vería su estado visual y navegar hacia su pantalla, pero no agregar, quitar ni calcular productos. Usá contenido y datos simulados cuando haga falta.

## Modalidad de trabajo del equipo

Antes de comenzar, explicales esta dinámica:

- El equipo trabajará desde una sola computadora y dentro de una única carpeta `Nativa Digital`.
- La persona que tenga la carpeta más completa abrirá el proyecto y compartirá su pantalla durante toda la actividad.
- Esa persona operará el agente. El resto del equipo observará, debatirá las decisiones y revisará cada resultado.
- Antes de aprobar una propuesta o pedir una implementación, quien opera deberá consultar al equipo.
- Hoy no usarán GitHub ni crearán proyectos separados. En la próxima clase aprenderán a subir el proyecto a GitHub para que después puedan colaborar sobre el mismo código.

Pediles que confirmen que ya eligieron la computadora de trabajo, que están compartiendo pantalla y que todo el equipo puede participar. No avances hasta recibir esa confirmación.

## Resultado esperado

Al finalizar la clase, el equipo debería tener:

1. Los wireframes existentes guardados como contexto persistente.
2. Un design system inicial aprobado y guardado dentro de `Frontend/Design_system`.
3. Skills de UX activadas para trabajar el diseño sin caer en una estética genérica.
4. Un plan persistente de vistas, arquitectura y navegación para el frontend.
5. Una primera vista implementada y revisada.
6. Todas las vistas del MVP ordenadas en un plan de avance, y tantas vistas aprobadas como el tiempo permita construir con cuidado.

La calidad de una vista revisada importa más que la cantidad de pantallas generadas.

## Etapa 1: revisar el proyecto y recuperar los wireframes

Duración sugerida: 10 minutos.

Explicales: "Primero vamos a mirar lo que ya investigaron. Eso evita diseñar una pantalla linda que no resuelve el problema real." Si no existe `AGENTS.md` en la raíz, crealo y dejá escrito que el proyecto será una web app, no una aplicación móvil. Después leé `AGENTS.md` y revisá el contenido de `Contexto`, con atención a:

- problema y usuarios;
- entrevistas e investigación;
- procesos y requerimientos;
- definición del MVP;
- wireframes existentes.

Resumí en el chat lo que entendiste del proyecto, sin crear un documento nuevo. Identificá la acción principal que el producto necesita resolver y señalá cualquier dato importante que falte.

Si no encontrás los wireframes, pedile al equipo que abra el archivo o la herramienta donde los diseñó, por ejemplo Excalidraw, y que adjunte una captura legible de cada vista. Revisá una captura por vez. Cuando estén completas, guardá copias persistentes en `Contexto/05_Wireframes_y_prototipos`, con nombres descriptivos.

Las capturas de los wireframes propios del equipo sí forman parte del contexto persistente. Las imágenes externas que se usarán como inspiración en la etapa siguiente no deben guardarse en el proyecto.

Antes de avanzar, preguntá al equipo si tu interpretación del problema, el MVP y el recorrido principal es correcta.

## Etapa 2: buscar referencias visuales

Duración sugerida: 10 minutos.

Explicales: "Ahora vamos a buscar ejemplos visuales. No vamos a copiar una página; vamos a elegir qué cosas nos sirven para nuestro propio proyecto, como colores, tipo de letra, orden de la información o estilo de las tarjetas." Una referencia visual sirve para reconocer decisiones concretas de interfaz.

En función del tipo de proyecto, sugerí entre tres y cinco búsquedas específicas para Pinterest u otros sitios. Adaptá las frases al producto y a sus usuarios. Por ejemplo, para una inmobiliaria podrías sugerir búsquedas relacionadas con interfaces de propiedades, filtros, mapas o fichas de inmuebles, y también analizar patrones de productos como Airbnb si resultan pertinentes.

Pediles que busquen las referencias en Pinterest u otros sitios y que adjunten varias capturas juntas, entre tres y seis, cuando terminen la búsqueda. Después analizá el conjunto y preguntá:

- ¿Qué parte de esta interfaz les interesa?
- ¿Qué les gusta de los colores?
- ¿Qué les gusta de la tipografía y de la jerarquía?
- ¿Qué opinan del espaciado, los bordes y las tarjetas?
- ¿Hay alguna interacción o componente que serviría para su proyecto?
- ¿Qué no quieren trasladar a su producto?

Registrá las respuestas en el chat y sintetizá las preferencias del equipo. Antes de proponer el design system, preguntá: "¿Quieren sumar más referencias o trabajamos con estas?" Si quieren sumar, esperá las nuevas capturas y repetí el análisis. Si confirman que alcanzan, no guardes las imágenes externas dentro de `Nativa Digital` y pasá al design system.

## Etapa 3: proponer y aprobar el design system

Duración sugerida: 15 minutos.

Explicales: "Un design system es el conjunto de reglas visuales del proyecto. Define, por ejemplo, qué colores, letras, espacios y botones se usan. Así cada pantalla parece parte del mismo producto y no tenemos que decidir desde cero en cada vista." También reduce decisiones repetidas cuando el proyecto crece.

Con el contexto del proyecto y las preferencias visuales aprobadas, proponé un design system inicial que incluya solo lo necesario para las primeras vistas:

- paleta de colores y función de cada color;
- tipografías y jerarquía de textos;
- escala de espaciado;
- bordes, radios y sombras;
- botones y sus estados;
- campos de formulario, si el recorrido los necesita;
- tarjetas u otros componentes centrales del producto;
- criterios básicos de accesibilidad y contraste.

Mostrá la propuesta antes de crear archivos. Explicá las decisiones con relación al público, al problema y a las referencias elegidas. Preguntá qué cambiaría el equipo y esperá su aprobación.

Cuando el equipo lo apruebe, guardá el design system de forma persistente en `Frontend/Design_system`. Elegí formatos compatibles con el stack existente. Si todavía no existe un proyecto de frontend, guardá primero una especificación clara; en la etapa de planificación crearás el proyecto web recomendado sin pedir una elección técnica al equipo.

## Etapa 4: instalar las skills de UX

Duración sugerida: 5 minutos.

Explicales: "Una skill es una guía especializada que le agrega un criterio de trabajo al agente. Es parecido a pedirle que siga una lista de recomendaciones de una persona experta en diseño. No reemplaza las decisiones del equipo: ustedes eligen qué les gusta y revisan el resultado."

Deciles: "Ahora voy a instalar skills que nos ayudarán a diseñar una interfaz propia y a evitar una estética genérica de IA." Instalá las siguientes skills de forma global o con el mecanismo equivalente que tenga la herramienta. Si una ya está instalada, no la dupliques.

- `frontend-design`, el plugin oficial de Anthropic para dirección visual y construcción de interfaces frontend.
- `ui-ux-pro-max`, para consultar patrones, estilos, paletas, tipografías y criterios de accesibilidad.
- `impeccable`, para auditar y pulir la interfaz después de implementarla.

Usá una skill para cada propósito y evitá activar en simultáneo otras que den indicaciones de diseño contradictorias. Aplicá `frontend-design` al definir y construir las vistas, `ui-ux-pro-max` cuando necesites referencias o decisiones de UX, e `impeccable` al final de cada ciclo de revisión.

Cuando termines, explicales brevemente cuál es la función de cada una y avisá que en otra clase pueden pedir la instalación de una skill por su nombre.

## Etapa 5: preparar Git local

Duración sugerida: 5 minutos.

Explicales: "Por la consigna de esta clase, ahora vamos a preparar Git. Git es una herramienta que guarda una historia de cambios en esta misma computadora. Funciona como puntos de guardado: si algo sale mal, podemos volver a una versión anterior y ver qué cambió. La semana que viene vamos a usar GitHub para compartir ese historial entre el equipo. Hoy no subiremos nada a internet." Git no es GitHub.

Comprobá si Git está disponible. Si no lo está, instalalo con el método compatible con el sistema operativo y confirmá que quedó funcionando. Si `Nativa Digital` todavía no es un repositorio, inicializá Git allí, agregá un `.gitignore` apropiado para el stack existente y creá un primer commit que represente el estado inicial antes de la Clase 6. Si ya existe un repositorio, revisá su estado y no reescribas ni dupliques su historial. Usá una configuración de identidad local del repositorio si hiciera falta para crear el commit.

Mostrales el historial local y explicales que al final de la actividad crearán otro commit con las vistas aprobadas. No ejecutes comandos de GitHub, no agregues remotos y no hagas `push`.

## Etapa 6: planificar la arquitectura y el primer recorrido

Duración sugerida: 10 minutos.

Antes de implementar, pedile al equipo que active el modo Plan de su agente, si la herramienta que están usando lo ofrece. Indicá dónde activarlo según la interfaz disponible. Si no podés reconocer la herramienta o no existe ese modo, realizá la planificación en el chat sin inventar comandos.

Explicales: "El modo Plan hace que el agente piense y proponga un orden de trabajo antes de crear archivos. Primero lo vamos a revisar entre todos y después decidiremos si queremos ejecutarlo." El modo Plan permite discutir la estructura, el alcance y el orden de trabajo antes de modificar archivos.

Pediles que escriban una solicitud equivalente a esta:

> Revisá el contexto, el MVP, los wireframes y el design system aprobados. Proponé un plan completo de vistas para el frontend del MVP. Indicá el recorrido entre ellas, los componentes compartidos, la navegación visual y los datos simulados. Priorizá las vistas para construirlas por ciclos, empezando por el recorrido principal. No escribas código todavía. No incluyas backend ni lógica de negocio.

Prepará un plan que indique:

- cuál será la primera vista y por qué;
- cuál es su objetivo principal;
- qué otras vistas necesita el MVP y en qué orden conviene construirlas;
- qué componentes necesita;
- cuál es la acción principal que podrá probarse;
- a qué vista conduce cada acción principal;
- qué datos simulados se usarán;
- cómo se dividirá el trabajo en ciclos cortos;
- qué condición debe cumplirse para aprobar cada ciclo.

El plan debe contemplar las vistas necesarias para el MVP, aunque no tengan tiempo de construirlas todas hoy. Clasificalas en: "ahora", "después si queda tiempo" y "próxima clase". No les preguntes qué framework, librería o herramienta de desarrollo prefieren. Si todavía no existe un frontend, elegí el stack web recomendado para esta actividad, React con Vite, y explicá solamente que permite construir y abrir las vistas en el navegador. Pedí decisiones de producto y diseño, como qué acción debe ser la principal, qué información necesita cada vista y qué estilo representa mejor al proyecto. Mostralo y esperá la aprobación del equipo.

Cuando el equipo apruebe el plan, guardalo de manera persistente en `Frontend/PLAN_DE_VISTAS_MVP.md` antes de implementar. Explicales: "Este archivo guarda el mapa de las pantallas y el orden de trabajo. En la próxima clase podremos leerlo y continuar desde el punto exacto en que quedamos, sin volver a planificar todo." El archivo debe incluir el recorrido del MVP, las vistas priorizadas, componentes compartidos, decisiones tomadas, el estado inicial de cada vista y el próximo paso recomendado.

Cuando el equipo apruebe el plan y su herramienta muestre el botón para ejecutarlo, explicales este orden: primero revisan el plan; después lo ejecutan; en cuanto la interfaz permita elegir modelo para la etapa de implementación, pasan a un modelo más económico que esté disponible en su herramienta. Por ejemplo, pueden usar Sonnet en Claude o Terra en Codex, si esas opciones aparecen en su cuenta. En Antigravity, pediles que elijan el modelo de código de menor costo que siga siendo apto para ejecutar cambios acotados. No indiques un modelo que no aparezca en su interfaz.

## Etapa 7: implementar en ciclos cortos

Duración sugerida: 20 a 25 minutos.

Cuando el equipo apruebe el plan, pediles que vuelvan al modo de ejecución de su agente. Implementá dentro de `Frontend` y respetá el design system aprobado. Usá datos simulados y navegación entre vistas; no agregues lógica de negocio.

Trabajá en ciclos. Al terminar cada uno, abrí o ejecutá el resultado, mostralo al equipo y pedí una revisión antes de continuar. No cierres la actividad porque el equipo aprobó una vista: después de corregirla, proponé la siguiente vista prioritaria del plan y preguntá si quieren avanzar con ella.

Después de aprobar cada vista, actualizá `Frontend/PLAN_DE_VISTAS_MVP.md`: marcá la vista como completada, en curso o pendiente, anotá la decisión relevante y dejá indicada la próxima vista prioritaria. Conservá este archivo actualizado durante toda la clase.

### Ciclo 1: primera vista prioritaria

Construí la estructura general, la navegación principal y el contenido imprescindible. Si la primera vista es un home, puede incluir el header, el hero y la acción principal. No agregues secciones de relleno.

### Ciclo 2: revisión visual y adaptación de la vista

Aplicá el design system, revisá jerarquía, espaciado, legibilidad, coherencia de componentes y adaptación a pantalla de computadora. Considerá también cómo se reorganizaría la vista en una pantalla pequeña, sin construir una aplicación móvil.

Antes de pedir aprobación, ofrecé hasta tres sugerencias concretas de mejora. Por ejemplo: ajustar el tamaño de un título, dar más espacio a una acción importante, ordenar una tarjeta para pantalla pequeña o mejorar el contraste de un texto. Explicá el motivo de cada sugerencia y dejá que el equipo elija.

### Ciclo 3 y siguientes: navegación y próximas vistas del plan

Hacé que la acción principal funcione con navegación y datos simulados. Después construí la siguiente vista prioritaria que el equipo haya aprobado. Repetí el ciclo de implementación, prueba y revisión hasta que falten cerca de diez minutos para terminar la clase.

En cada revisión preguntá:

- ¿La vista comunica con claridad qué puede hacer la persona usuaria?
- ¿Respeta el wireframe y el MVP?
- ¿Respeta el design system?
- ¿Qué les gusta de esta vista y qué cambiarían?
- ¿Qué recomendarían ajustar para que funcione bien en una computadora y se adapte a una pantalla pequeña?
- ¿Qué cambiarían antes de avanzar?

Corregí lo acordado antes de iniciar otro ciclo. Cuando el equipo apruebe una vista, explicá qué vista del plan recomendás hacer después y por qué. Esperá su confirmación y continuá, salvo que falten cerca de diez minutos para el cierre.

## Uso responsable del contexto y de los modelos

Durante la actividad, enseñales estas decisiones en el momento en que resulten útiles:

- Usar un modelo con mayor capacidad de razonamiento para analizar el contexto, proponer el design system, planificar la arquitectura y revisar decisiones importantes.
- Usar un modelo más rápido o económico para ejecutar cambios pequeños que ya estén definidos en un plan.
- Mantener pocas skills activas y elegir solo las relacionadas con diseño de interfaz, implementación del stack y revisión visual.
- Si la conversación se vuelve extensa, cerrar primero la etapa actual. Después usar la función de compactación disponible en la herramienta para conservar el contexto relevante y continuar. No compactar durante una decisión pendiente ni repetirlo en cada intercambio.

No menciones modelos o comandos que no estén disponibles en la herramienta que utiliza el equipo. Si necesitás que cambien una configuración, indicá el paso y esperá que confirmen el cambio.

## Cierre de la actividad

Cuando falten cerca de diez minutos, no abras una etapa nueva. Terminá el ciclo actual y revisá el resultado con el equipo.

Al finalizar, mostrales en el chat:

- qué contexto quedó guardado;
- dónde quedó el design system;
- qué vistas y componentes se implementaron;
- qué interacción se puede probar;
- qué decisiones siguen pendientes para la próxima clase.

Antes de cerrar la clase, actualizá por última vez `Frontend/PLAN_DE_VISTAS_MVP.md` con el punto exacto donde se detuvo el equipo y el primer paso de la clase siguiente. Avisales que el avance ya quedó guardado y que la próxima clase deberán abrir ese archivo antes de continuar. Después de la revisión final, creá un commit local con un mensaje descriptivo de las vistas aprobadas. No crees un informe de reorganización. Guardá de forma persistente solo el contexto propio del proyecto, el design system, el plan y el código aprobado.

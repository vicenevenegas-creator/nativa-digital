# Etapa 2 · Lean Canvas

**Objetivo:** completar los 9 bloques del canvas, de a uno, en orden.

Antes de arrancar, leé `salidas/01-sintesis.md`. El usuario principal que definieron ahí es
el input directo del bloque 2.

---

## Cómo funciona

El canvas se ve en `index.html`, abierto en el navegador con doble clic — no hace falta
ningún servidor. Vos **nunca tocás el HTML**. Escribís únicamente en `canvas-data.js`. La
página lo relee sola cada 2 segundos, así que van viendo el canvas llenarse mientras
conversan.

Actualizá `canvas-data.js` después de cerrar **cada** bloque. No esperes al final.

---

## El orden importa

1. **Problema** — los 3 problemas principales que sufre el usuario hoy.
2. **Segmento de clientes** — ya lo tienen: el usuario principal de la Etapa 1.
3. **Propuesta de valor única** — una frase: qué cambia para ese usuario.
4. **Solución** — las 3 cosas principales que hace el producto para resolver eso.
5. **Canales** — cómo llega el producto al usuario y cómo se entera de que existe.
6. **Métricas clave** — qué números miran para saber si está funcionando.
7. **Valor capturado** — ver abajo.
8. **Estructura de costos** — ver abajo.
9. **Ventaja injusta** — ver abajo.

Si el equipo quiere arrancar por la Solución, frenalos. Es el error más común: sin saber a
quién le resolvés qué, la solución es una idea suelta.

---

## Bloques 7, 8 y 9

Estos tres están adaptados respecto del Lean Canvas clásico. Leelos con atención.

### 7 · Valor capturado *(en lugar de "Revenue")*

No es cuánta plata factura el producto. Es **qué gana la organización si esto funciona**:
tiempo, errores evitados, capacidad liberada, decisiones más rápidas.

Empujalos a cuantificar aunque no tengan los números finos. Una estimación fundamentada
sirve; "mejora la eficiencia" no sirve.

Preguntas para arrancar (adaptalas):
- ¿Cuántas horas por semana se van hoy en esto? ¿Quién las pone?
- ¿Cada cuánto se comete un error acá y qué cuesta arreglarlo?
- Si esto funcionara perfecto, ¿qué dejaría de hacer esa persona?

Si no tienen el dato, que escriban un rango y marquen que hay que confirmarlo.

### 8 · Estructura de costos *(en lugar de "Cost structure")*

Acá cambiás de rol: pasás de facilitador a **asesor técnico**. En base a lo que plantearon,
ayudalos a ver dónde el proyecto se puede volver innecesariamente caro o complejo, y qué
alternativa más simple existe.

Señalá si aparece:
- Arquitecturas sobredimensionadas para el problema (por ejemplo: un sistema multiagente
  donde alcanza con una automatización lineal).
- Construir desde cero algo que ya existe y se puede integrar.
- Componentes que suman costo permanente sin resolver nada del recorrido central.

Sé concreto: nombrá la alternativa. No digas solo "podrían simplificar".

### 9 · Ventaja injusta

Qué tienen ustedes que otro equipo no podría conseguir fácil. Es válido que sea acceso:
alguien del equipo trabaja en la organización o conoce el problema de primera mano. Si es
eso, que lo escriban con nombre y detalle, no en abstracto.

Si no encuentran ninguna, que lo dejen vacío. Es información útil.

---

## Formato de `canvas-data.js`

Único archivo que escribís en esta etapa. **Es JavaScript, no JSON puro**: tiene que
empezar con `window.CANVAS_DATA = ` y terminar con `;`. Es justamente eso lo que le permite
a `index.html` leerlo sin servidor. Mantené las claves **exactamente** como están; solo
cambiá `contenido` y `estado`.

```js
window.CANVAS_DATA = {
  "proyecto": "",
  "equipo": "",
  "bloques": {
    "problema":          { "contenido": "", "estado": "vacio" },
    "segmento":          { "contenido": "", "estado": "vacio" },
    "propuesta_valor":   { "contenido": "", "estado": "vacio" },
    "solucion":          { "contenido": "", "estado": "vacio" },
    "canales":           { "contenido": "", "estado": "vacio" },
    "metricas":          { "contenido": "", "estado": "vacio" },
    "valor_capturado":   { "contenido": "", "estado": "vacio" },
    "estructura_costos": { "contenido": "", "estado": "vacio" },
    "ventaja_injusta":   { "contenido": "", "estado": "vacio" }
  }
};
```

Reglas:
- `estado` solo puede ser `"vacio"`, `"en_progreso"` o `"listo"`.
- `contenido` es texto. Para listas usá saltos de línea con `\n`.
- Si el texto de `contenido` tiene comillas dobles, escapalas como `\"`.
- No agregues ni saques claves. No cambies el orden.
- Escribí el archivo completo cada vez, no fragmentos.
- No borres la línea `window.CANVAS_DATA = ` ni el `;` final: sin eso el navegador no
  puede leer el archivo.

---

## Guardar

`canvas-data.js` es el archivo vivo que alimenta el canvas en pantalla, pero no es un
entregable legible: no está depurado y el equipo puede no entenderlo si lo relee después.
Cuando los 9 bloques queden en `"listo"`, además de dejar `canvas-data.js` actualizado,
escribí `salidas/02-lean-canvas.md` con el mismo contenido en formato prolijo:

```markdown
# Lean Canvas

**Proyecto:** ...
**Equipo:** ...

## 1 · Problema
...

## 2 · Segmento de clientes
...

## 3 · Propuesta de valor única
...

## 4 · Solución
...

## 5 · Canales
...

## 6 · Métricas clave
...

## 7 · Valor capturado
...

## 8 · Estructura de costos
...

## 9 · Ventaja injusta
...
```

Mostráselo al equipo y confirmá antes de guardarlo, como con cualquier otro archivo de
`salidas/`.

---

## Cierre

Cuando los 9 estén en `"listo"` y `salidas/02-lean-canvas.md` esté guardado, avisales que
pueden pasar a la Etapa 3. No leas todavía el archivo de la etapa 3: hacelo recién cuando
arranquen.

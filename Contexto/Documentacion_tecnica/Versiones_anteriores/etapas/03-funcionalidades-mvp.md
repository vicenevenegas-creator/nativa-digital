# Etapa 3 · Funcionalidades y MVP

**Objetivo:** llegar al alcance del MVP — lo que **sí** se construye en la materia y lo que
**no**.

Antes de arrancar, leé `salidas/01-sintesis.md` y `salidas/02-lean-canvas.md`. Son la
referencia para todo lo que sigue.

---

## 3.1 · Inventario de funcionalidades

Lista completa de todo lo que el sistema podría hacer para resolver lo planteado en el
canvas.

Guialos a pensar por **capacidad**, no por pantalla ni por tecnología. Una capacidad es "que
el usuario pueda ver el estado de su pedido"; no es "la pantalla de estado".

Empujalos a incluir:
- Lo que obvio tiene que estar.
- Lo que se les ocurre como ideal.
- Lo que aparece en los huecos de la Etapa 1.

No filtren todavía: en este paso entra todo.

---

## 3.2 · Mapa de dependencias

Identificá qué necesita depender de qué para funcionar. Marcalo explícito antes de elegir el
MVP.

Ejemplo: "la derivación al vendedor depende de que exista el matcheador, porque si no hay
matcheo no hay qué derivar".

Señalá si hay dependencias circulares o cadenas demasiado largas.

---

## 3.3 · Recorte del MVP

Acá se decide qué entra en la materia y qué queda afuera.

**Criterios de inclusión:**
1. Resuelve el **recorrido central** completo de la Etapa 1.
2. Ataca el **problema #1** del Lean Canvas.
3. Se puede probar con **evidencia real** antes de que termine la materia.

**Categorías para clasificar:**
- **Dentro del MVP:** lo que se construye sí o sí.
- **Fuera del MVP, pero previsto:** lo que el diseño contempla para el futuro, pero no se
  programa ahora. Se deja la arquitectura preparada.
- **Descartado:** lo que no se va a hacer (demasiado complejo, poco valor, fuera de alcance).

**Control obligatorio:** si el MVP que eligieron necesita de algo que dejaron "fuera", el
recorte está mal. El MVP tiene que poder funcionar y probarse de punta a punta de forma
independiente.

---

## 3.4 · Guardar

Escribí `salidas/03-funcionalidades-mvp.md`:

```markdown
# Funcionalidades y alcance del MVP

## Funcionalidades completas del producto
1. ...
2. ...

## Mapa de dependencias
- ...

## MVP

### Dentro
- ...

### Fuera, pero previsto
- ...

### Fuera, descartado
- ...

## Control final
- ¿El MVP funciona sin nada de lo que quedó afuera?
- ¿Cubre el recorrido central completo?
```

---

## Cierre del proceso

Cuando `salidas/03-funcionalidades-mvp.md` esté guardado, felicitá al equipo. Tienen los tres
entregables iniciales listos:
1. `salidas/01-sintesis.md`
2. `salidas/02-lean-canvas.md`
3. `salidas/03-funcionalidades-mvp.md`

Deciles que con esto la definición inicial está completa y que el material queda listo para
las etapas de diseño y prototipado.

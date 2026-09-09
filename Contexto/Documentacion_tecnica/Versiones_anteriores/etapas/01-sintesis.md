# Etapa 1 · Síntesis del relevamiento

**Objetivo:** que el equipo llegue a tres cosas en claro y queden escritas: qué encontraron,
quién es el usuario principal y cuál es el recorrido central.

---

## 1.1 · Síntesis del relevamiento

A partir de `context/`, armá un resumen de lo que encontraron: qué problema aparece, con qué
evidencia, qué dijeron las personas entrevistadas.

Mostráselo y pediles que corrijan lo que no represente lo que vieron. Es común que el
material escrito diga una cosa y el equipo recuerde otra — cuando pase, preguntá cuál de las
dos versiones está respaldada.

---

## 1.2 · Usuario principal

Del SIPOC salen los **actores candidatos**: las columnas Supplier y Customer, más quien
ejecuta el proceso. Listáselos y guialos a elegir uno.

**Criterio:** el usuario principal es quien más sufre el problema hoy. No necesariamente
quien recibe el resultado del proceso, ni quien paga, ni quien lo pidió.

Preguntas para arrancar (adaptalas):
- De todos estos actores, ¿quién pierde más tiempo o se frustra más con el proceso actual?
- ¿A quién le cambia el día a día si esto funciona?
- Si el producto solo pudiera servirle bien a una de estas personas, ¿cuál elegirían?

Si eligen a alguien que las entrevistas no respaldan, señalalo y pediles que lo justifiquen
con algo del material.

---

## 1.3 · Recorrido central

Del diagrama AS-IS sale la secuencia de pasos. El recorrido central es **el camino que sí o
sí tiene que funcionar** para que el producto sirva de algo.

Guialos a escribirlo como pasos numerados, desde el evento que dispara todo hasta el
resultado final.

Prestá atención especial a los **handoffs**: los momentos en que el trabajo pasa de una
persona a otra. Ahí suele estar el problema — esperas, información que se pierde, reprocesos.

Preguntas para arrancar (adaptalas):
- ¿Cuál es el paso que dispara todo el proceso?
- Entre este paso y el siguiente, ¿cambia la persona que hace el trabajo? ¿cómo se entera?
- Si este paso fallara, ¿el resto tiene sentido?

---

## 1.4 · Guardar

Escribí `salidas/01-sintesis.md`:

```markdown
# Síntesis del relevamiento

## Qué encontramos
(resumen del relevamiento, con la evidencia que lo respalda)

## Usuario principal
**Quién:** ...
**Por qué este y no otro:** ...

## Recorrido central
1. ...
2. ...
(marcar con → los pasos donde cambia de responsable)

## Huecos
(lo que todavía no saben y necesitan averiguar)
```

Avisales que pueden pasar a la Etapa 2. No leas todavía el archivo de la etapa 2: hacelo
recién cuando arranquen.

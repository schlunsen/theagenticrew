#import "_os-helpers.typ": *
= Programación en Pareja con un Agente

En los últimos tres capítulos configuraste tus herramientas, enviaste un pull request y generaste contenido con IA. Ahora vas a construir algo desde cero: una aplicación web completa, describiendo lo que quieres a un agente de programación IA.

No escribirás el código tú mismo. Describirás lo que quieres, revisarás lo que el agente construye e iterarás hasta que esté bien. Esto es programación en pareja con una IA: tú aportas la visión, el agente aporta la implementación.

== Lo que Vas a Construir

Una *Lista de Viajes Pendientes* — una aplicación web personal donde puedes añadir destinos que quieres visitar, explorarlos como tarjetas visuales, editar los detalles, marcar lugares como visitados y eliminar entradas sobre las que hayas cambiado de opinión. Los datos se guardan en el almacenamiento local de tu navegador, así que nada se envía a un servidor y nada desaparece cuando cierras la pestaña.

Al final de este capítulo, habrás:

+ Creado un proyecto desde cero usando solo prompts en lenguaje natural
+ Escrito un breve archivo de instrucciones con las normas de la casa para el agente
+ Acordado un plan con el agente antes de que escribiera código
+ Construido una aplicación funcional con operaciones de Crear, Leer, Actualizar y Eliminar
+ Usado localStorage para persistencia — sin base de datos, sin servidor
+ Dado estilo para que sea algo que realmente quieras ver
+ Revisado cada cambio como un diff antes de conservarlo
+ Enviado todo a GitHub

Cada línea de HTML, CSS y JavaScript será escrita por el agente. Tu trabajo es describir, revisar y refinar.

== Lo que Necesitarás

De los capítulos anteriores:
- Un terminal (abierto y listo)
- Git instalado y configurado
- CLI de GitHub autenticado
- Claude Code o Antigravity CLI listo en tu terminal

No se necesitan herramientas nuevas para este capítulo. Todo se ejecuta en un navegador — sin paso de compilación, sin dependencias.

== Crea el Proyecto

Empieza creando una carpeta de proyecto vacía e inicializando Git:

```
mkdir travel-bucket-list
cd travel-bucket-list
git init
```

Ahora abre tu asistente IA desde dentro del directorio del proyecto:

```
claude --permission-mode manual
```

O:

```
agy
```

== Escribe las Normas de la Casa

Antes de pedir código, cuéntale al agente cómo funciona este proyecto. Los agentes empiezan cada sesión sin memoria, así que las normas van en un archivo que el agente lee automáticamente al comienzo de cada sesión: `AGENTS.md`. Es el estándar común entre herramientas para las instrucciones de agentes. Pide:

- _"Crea un AGENTS.md breve para este proyecto con estas normas de la casa: la aplicación es un solo index.html con CSS y JavaScript integrados; sin frameworks, sin paso de compilación y sin bibliotecas externas ni enlaces a CDN; los datos se guardan en localStorage; debe funcionar al abrir index.html directamente desde el disco; cada cambio se limita a lo que pedí, sin rediseñar cosas que no mencioné; no hagas commit en Git a menos que te lo pida."_

Lee el archivo que crea. Deberían ser unas pocas líneas con las que estés de acuerdo; si no, di qué cambiar. Es la misma idea que el capítulo Convención Sobre Configuración del libro principal describe para equipos reales, a escala de proyecto de fin de semana.

Tanto Claude Code como Antigravity CLI leen `AGENTS.md` automáticamente, así que un solo archivo sirve para cualquiera de las dos herramientas. (Claude Code también lee un `CLAUDE.md` y, si encuentra uno, usa ese en su lugar; aquí no lo necesitas.)

// v2-verify: Claude Code loads AGENTS.md when no CLAUDE.md exists (code.claude.com/docs/en/memory); Antigravity CLI reads AGENTS.md as a workspace rule (antigravity.google/docs/rules).

Los archivos de instrucciones se cargan al iniciar una sesión, así que sal del agente (escribe `/exit`) y vuelve a arrancarlo igual que antes. Ahora estás en una sesión nueva que ya conoce las normas.

Por último, abre una *segunda ventana de terminal* y ve a la misma carpeta:

```
cd travel-bucket-list
```

Usa esta para los comandos de Git mientras el agente trabaja en la primera. Estás listo para empezar a construir.

== Describe la Aplicación

Dale al agente una imagen clara de lo que quieres. No te preocupes por los detalles técnicos — descríbelo como si le estuvieras explicando a un amigo cómo debería verse y funcionar la aplicación.

Pero no dejes que empiece a escribir enseguida. Pide primero un plan. Tanto Claude Code como Antigravity CLI tienen un *modo plan*, en el que el agente investiga y propone un plan, pero no cambia archivos hasta que lo apruebas: pulsa *Shift+Tab* hasta que la barra de estado indique el modo plan. (Si tu herramienta no lo tiene, empieza tu prompt con _"No escribas código todavía: propón primero un plan."_)

Prueba esto como tu prompt inicial:

- _"Constrúyeme una aplicación de Lista de Viajes Pendientes en un solo archivo index.html con CSS y JavaScript integrados. Debe permitirme añadir destinos que quiero visitar, mostrarlos como tarjetas visuales en una cuadrícula, editar cualquier destino, marcarlo como visitado y eliminarlo. Almacena todo en localStorage para que los datos persistan entre actualizaciones de página. Hazlo bonito — quiero disfrutar usándolo de verdad."_

El agente responde con un plan en lugar de código: qué campos tiene cada destino, cómo se organiza la página, cómo se guardan los datos. Léelo. Es el momento más barato para cambiar de idea. Si quieres un campo que no incluyó (un país, la mejor época para visitarlo), dilo ahora: _"Añade al plan un campo 'mejor época'."_

Cuando el plan te parezca bien, apruébalo. Si el agente ofrece aceptar sus ediciones automáticamente, elige la opción en la que sigues aprobando cada edición tú (en Claude Code: *Yes, manually approve edits*).

El agente generará un archivo `index.html`. Este único archivo contiene todo — la estructura (HTML), el estilo (CSS) y el comportamiento (JavaScript). Sin frameworks, sin herramientas de compilación, sin complejidad.

#quote(block: true)[
  *¿Por qué un solo archivo?* Para una pequeña aplicación personal, un archivo es lo más simple que funciona. Puedes abrirlo en cualquier navegador, enviárselo a un amigo por correo o alojarlo en cualquier lugar. El agente podría separarlo en archivos diferentes más adelante si el proyecto crece — pero ahora mismo, la simplicidad gana.
]

== Revisa lo que el Agente Construyó

Antes de abrir el navegador, pide al agente que te explique lo que creó:

- _"Explícame el código paso a paso. ¿Cómo se almacenan los destinos? ¿Cómo funciona añadir uno nuevo? ¿Cómo sabe el botón de eliminar qué tarjeta quitar?"_

No necesitas entender cada línea, pero deberías entender la estructura general:

- *HTML* define el formulario y el contenedor de tarjetas
- *CSS* lo hace atractivo — el diseño de cuadrícula, el estilo de las tarjetas, los colores
- *JavaScript* gestiona la lógica — guardar en localStorage, renderizar tarjetas, manejar clics de botones

Este es el hábito más importante en el desarrollo asistido por agentes: *siempre revisa antes de ejecutar*. El agente es rápido, pero no es infalible. Una explicación rápida detecta malentendidos a tiempo.

== Ábrelo en tu Navegador

En tu segunda terminal:

#if is-mac [
```
open index.html
```
]

#if is-linux [
```
xdg-open index.html
```
]

#if is-windows [
```
start index.html
```
]

Deberías ver tu aplicación — un formulario en la parte superior y un área de tarjetas vacía debajo. Prueba añadiendo tu primer destino:

+ Escribe el nombre de un destino (por ejemplo, "Kioto, Japón")
+ Añade una razón corta ("Cerezos en flor en primavera")
+ Elige una prioridad
+ Haz clic en *Añadir*

Debería aparecer una tarjeta. Añade dos o tres más. Actualiza la página — deberían seguir ahí, porque están guardadas en localStorage.

== Guarda un Punto de Control

Funciona, así que guárdalo antes de cambiar nada más. En tu segunda terminal:

```
git add -A
git commit -m "First working version of travel bucket list"
```

Este commit es tu red de seguridad. A partir de ahora, cada cambio que haga el agente aparece como un _diff_ respecto a él, y cualquier cambio que no te guste se puede descartar con un solo comando.

== El Ciclo CRUD

Tu aplicación ahora soporta las cuatro operaciones. Aquí está lo que significa cada una en la práctica:

#table(
  columns: (auto, 1fr, 1fr),
  [*Operación*], [*Qué significa*], [*En tu aplicación*],
  [*Create*], [Añadir una nueva entrada], [Rellena el formulario y haz clic en Añadir],
  [*Read*], [Ver las entradas existentes], [La cuadrícula de tarjetas muestra todos los destinos],
  [*Update*], [Editar una entrada existente], [Haz clic en Editar en una tarjeta, cambia los detalles, guarda],
  [*Delete*], [Eliminar una entrada], [Haz clic en Eliminar en una tarjeta — desaparece],
)

Estas cuatro operaciones son la base de casi todas las aplicaciones que has usado — correo electrónico, redes sociales, aplicaciones de notas, tiendas online. El modelo de datos cambia, pero el patrón siempre es el mismo: crear, leer, actualizar, eliminar.

== Itera y Mejora

La primera versión es un punto de partida. Ahora hazla tuya. Aquí es donde la programación en pareja brilla — describes lo que quieres cambiar, el agente lo hace realidad, revisas, repites.

Después de cada cambio, mira qué ha cambiado realmente antes de conservarlo. En tu segunda terminal:

```
git diff
```

Las líneas que empiezan por `-` se han eliminado; las que empiezan por `+` se han añadido. (Si la salida ocupa toda la pantalla, usa las flechas para desplazarte y pulsa `q` para salir.) Pregúntate: ¿es un cambio del tamaño que esperaba? ¿Ha tocado algo por lo que no pregunté? Después pruébalo en el navegador. Si te gusta, consérvalo:

```
git commit -am "Add search bar"
```

Si no, descártalo y vuelve a tu último punto de control:

```
git restore index.html
```

Un cambio, una revisión, un commit. Los pasos pequeños hacen que sea fácil ver qué hizo el agente, y fácil deshacerlo.

Aquí hay prompts para probar. Elige los que te atraigan:

=== Hazla más visual

- _"Añade un campo de URL de imagen a cada destino. Cuando una tarjeta tiene imagen, muéstrala como fondo de la tarjeta. Cuando no la tiene, usa un degradado bonito basado en el nivel de prioridad."_

- _"Añade una insignia con código de color a cada tarjeta — verde para 'obligatorio', ámbar para 'me encantaría' y gris para 'algún día'."_

=== Añade filtrado y búsqueda

- _"Añade una barra de búsqueda que filtre las tarjetas mientras escribo — buscando en el nombre del destino o la razón."_

- _"Añade botones de filtro en la parte superior: Todos, Obligatorio, Me Encantaría, Algún Día, Visitado. Al hacer clic en uno, muestra solo las tarjetas que coincidan."_

=== Haz que marcar como visitado sea satisfactorio

- _"Cuando marco un destino como visitado, anima la tarjeta — quizás una pequeña explosión de confeti o un sello superpuesto que diga 'ESTUVE AHÍ'. Que se sienta como un logro."_

=== Añade una barra de estadísticas

- _"Añade una barra de resumen en la parte superior mostrando: total de destinos, cuántos visitados, cuántos pendientes. Que se actualice en tiempo real cuando añada, elimine o marque destinos."_

=== Mejora el formulario

- _"Añade un selector desplegable de país (o autocompletado) al formulario, y agrupa las tarjetas por país en la cuadrícula."_

- _"Haz que el formulario sea plegable para poder ocultarlo cuando solo estoy navegando."_

#quote(block: true)[
  *Sal del guión.* Estos prompts son sugerencias, no tareas obligatorias. Si quieres un modo oscuro, una vista de mapa o un botón de "destino aleatorio" — pídelo. El agente averiguará cómo construirlo. El objetivo es practicar el ida y vuelta: describir, revisar, refinar.
]

== Cuando Algo Sale Mal

Pasará. El agente puede generar código con un error, o construir algo que no coincide exactamente con lo que describiste. Eso es normal — y es una habilidad para practicar, no un fracaso.

*Si un botón no funciona:*
- _"El botón de Eliminar no está quitando la tarjeta. Comprueba el event listener — ¿está adjuntado correctamente? Arréglalo y explica qué estaba mal."_

*Si el diseño se ve roto:*
- _"Las tarjetas se superponen en móvil. Haz que la cuadrícula sea responsiva — una columna en pantallas pequeñas, dos columnas en medianas, tres en grandes."_

*Si los datos desaparecen:*
- _"Mis destinos desaparecen cuando actualizo la página. Comprueba si la función de guardar en localStorage se está llamando después de cada cambio."_

*Si el agente cambió algo que no pediste:*
Lo verás en `git diff`. Descarta todo el cambio con `git restore index.html` y vuelve a pedirlo con más precisión, o bien:
- _"Cambiaste el diseño de las tarjetas pero solo te pedí que añadieras el campo de imagen. Revierte los cambios de diseño y solo añade la función de imagen."_

El patrón siempre es el mismo: describe el problema, pide al agente que lo diagnostique, revisa la corrección. Esto es depuración por conversación — y es exactamente cómo trabajan los desarrolladores profesionales con agentes IA.

#quote(block: true)[
  *¿Conversación larga, agente confundido?* Tras muchas rondas de cambios, un agente puede empezar a mezclar instrucciones viejas y nuevas. Haz commit de lo que funciona, sal y empieza una sesión nueva. Tus normas en `AGENTS.md` y tu código son todo lo que necesita para continuar. El capítulo Contexto del libro principal explica por qué ayuda.
]

== Entiende lo que se Construyó

Antes de hacer commit, tómate un momento para entender los conceptos clave que usó el agente. Pregunta:

- _"Explica cómo funciona localStorage en esta aplicación. ¿Dónde se guardan los datos y qué pasa si borro los datos del navegador?"_

- _"¿Qué es el DOM? ¿Cómo actualiza el JavaScript lo que veo en pantalla cuando añado una nueva tarjeta?"_

- _"Explícame paso a paso qué pasa desde el momento en que hago clic en el botón Añadir hasta que aparece la nueva tarjeta."_

No necesitas memorizar las respuestas. Pero entender el flujo — entrada del formulario → función JavaScript → localStorage → actualización del DOM — te da vocabulario para la próxima vez que construyas algo.

#table(
  columns: (1fr, 1fr),
  [*Concepto*], [*Qué significa*],
  [*HTML*], [La estructura — qué elementos existen en la página],
  [*CSS*], [El estilo — cómo se ven esos elementos],
  [*JavaScript*], [El comportamiento — qué pasa cuando interactúas],
  [*localStorage*], [Almacenamiento del navegador que persiste entre visitas],
  [*DOM*], [La representación en vivo de la página que JavaScript puede modificar],
  [*Event listener*], [Código que se ejecuta cuando algo ocurre (clic, envío, tecla)],
  [*CRUD*], [Create, Read, Update, Delete — las cuatro operaciones básicas de datos],
)

== Commit y Push

Una vez que estés satisfecho con tu aplicación, guárdala en GitHub. Primero asegúrate de que todo tiene commit. En tu segunda terminal:

```
git status
```

Si aparecen archivos modificados, haz commit de ellos (`git add -A` y después `git commit -m "Finish travel bucket list"`). Luego mira el historial que has ido construyendo:

```
git log --oneline
```

Cada línea es un paso revisado. Ahora crea un repositorio en GitHub y envíalo:

```
gh repo create travel-bucket-list --public --source=. --remote=origin --push
```

Verifica que está ahí:

```
gh repo view --web
```

`--public` significa que cualquiera puede ver el código. Usa `--private` si prefieres guardarlo para ti. También puedes pedir al agente que haga estos pasos por ti (_"Crea un repositorio público en GitHub llamado travel-bucket-list con gh y envía el código"_) y aprobar cada comando cuando lo pida.

Tu aplicación ya está en GitHub. Cualquiera con el enlace puede clonarla y abrir `index.html` en su navegador.

== Lo que Acaba de Pasar

Construiste una aplicación web completa sin escribir una sola línea de código tú mismo. Escribiste las normas de la casa, acordaste un plan, revisaste cada cambio que produjo el agente e iteraste hasta que estuvo bien.

#table(
  columns: (1fr, 1fr),
  [*Tú aportaste*], [*El agente aportó*],
  [Una idea clara — "lista de viajes pendientes"], [El HTML, CSS y JavaScript],
  [Normas de la casa y un plan que aprobaste], [Código que los sigue],
  [Opiniones sobre cómo debería verse], [Diseños de tarjetas, cuadrículas y esquemas de color],
  [Reportes de errores cuando algo falló], [Diagnóstico y correcciones],
  [La decisión de publicarlo], [Comandos Git y configuración de GitHub],
)

Este es el ciclo central del desarrollo asistido por agentes:

+ *Describe* lo que quieres, y acuerda un plan antes de que se escriba código
+ *Revisa* lo que el agente construye, como un diff, antes de conservarlo
+ *Itera* hasta que esté bien, con pasos pequeños y un commit por paso
+ *Entiende* lo suficiente para mantener el control

No necesitas saber cómo escribir JavaScript para construir una aplicación JavaScript. Necesitas saber qué quieres, cómo comprobar si lo obtuviste y cómo pedir cambios. Esa es una habilidad diferente — y es la que este libro te está enseñando.

== Solución de Problemas

*La página está en blanco cuando abro index.html:*
Abre las herramientas de desarrollo de tu navegador (F12 o clic derecho → Inspeccionar) y revisa la pestaña Consola. Los errores en rojo te dicen qué salió mal. Copia el mensaje de error y pégalo al agente: _"Estoy recibiendo este error en la consola: [pega el error]. Arréglalo."_

*Las tarjetas aparecen pero desaparecen al actualizar:*
La función de guardar en localStorage no se está ejecutando. Pregunta: _"Comprueba que cada función que modifica el array de destinos también llame a la función de guardado después."_

*El formulario se envía pero no aparece nada:*
La función de renderizado de tarjetas puede tener un error. Pregunta: _"Añade un console.log al inicio de la función de renderizado para ver si se está ejecutando. Luego revisa la consola del navegador."_

#if is-windows [
*index.html se abre en el Bloc de notas en lugar del navegador:*
Haz clic derecho en el archivo → *Abrir con* → elige tu navegador. O escribe la ruta completa en la barra de direcciones de tu navegador.
]

*El estilo se ve diferente en distintos navegadores:*
Pide al agente: _"Añade un CSS reset al inicio de los estilos para normalizar las diferencias entre navegadores."_

*Quiero empezar de nuevo:*
Está bien — y es fácil. Para volver a tu último commit, ejecuta `git restore index.html`. Para empezar de cero, pide: _"Borra index.html y empecemos de cero. Esta vez quiero [nueva descripción]."_ Una de las ventajas del desarrollo asistido por agentes es que empezar de nuevo cuesta minutos, no horas.

*El agente ignora mis normas de la casa:*
Comprueba que cargó el archivo de instrucciones: pregunta _"¿Qué archivos de instrucciones cargaste para este proyecto?"_ (En Claude Code, `/context` también los muestra en el apartado de archivos de memoria.) Si falta `AGENTS.md`, revisa el nombre del archivo (las mayúsculas importan) y que arrancaste el agente dentro de `travel-bucket-list`, y reinicia el agente.

#if is-windows [
*`&&` da un error en PowerShell:*
Las versiones antiguas de PowerShell no admiten `&&` entre comandos. Ejecuta cada comando en su propia línea o sepáralos con `;`.
]

*localStorage está lleno o se comporta de forma extraña:*
Abre las herramientas de desarrollo → pestaña Application → Local Storage. Puedes ver y eliminar entradas manualmente. O pide al agente: _"Añade un botón 'Borrar todos los datos' que limpie localStorage y reinicie la aplicación."_

== Referencia Rápida

#table(
  columns: (1fr, 2fr),
  [*Tarea*], [*Prompt o comando*],
  [Iniciar el proyecto], [`mkdir travel-bucket-list; cd travel-bucket-list; git init`],
  [Escribir las normas], [_"Crea un AGENTS.md breve con estas normas de la casa..."_],
  [Plan primero], [`Shift+Tab` hasta el modo plan, luego describe la aplicación],
  [Construir la aplicación], [_"Constrúyeme una aplicación de Lista de Viajes Pendientes en un solo index.html..."_],
  [Abrir en el navegador], [#if is-mac [`open index.html`] #if is-linux [`xdg-open index.html`] #if is-windows [`start index.html`]],
  [Revisar el código], [_"Explícame cómo funciona la aplicación"_],
  [Ver qué ha cambiado], [`git diff`],
  [Conservar un cambio], [`git commit -am "Describe el cambio"`],
  [Descartar un cambio], [`git restore index.html`],
  [Añadir una funcionalidad], [_"Añade [descripción de la funcionalidad] a la aplicación"_],
  [Corregir un error], [_"[describe el problema] — diagnostica y arréglalo"_],
  [Entender un concepto], [_"Explica cómo funciona [concepto] en esta aplicación"_],
  [Enviar a GitHub], [`gh repo create travel-bucket-list --public --source=. --remote=origin --push`],
  [Ver en GitHub], [`gh repo view --web`],
)

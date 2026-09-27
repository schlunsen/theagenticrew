#import "_os-helpers.typ": *
= Tu Primer Proyecto con IA

Hasta ahora has configurado tus herramientas y enviado tu primer pull request. Ahora vas a hacer algo genuinamente impresionante: tomar un proyecto real de código abierto, describir lo que quieres en español natural y dejar que un agente IA lo transforme, generando ilustraciones personalizadas con modelos de IA alojados en Hugging Face, narración hablada con un servicio gratuito de texto a voz y un fondo animado con tus propios colores.

No se requiere experiencia previa en programación. El agente escribe el código. Tú describes la visión.

#if sys.inputs.at("illustrations", default: "true") == "true" [#include "_illus-ai-studio.typ"]

== Lo que Vas a Construir

*Web Presenter* es un framework de presentaciones de código abierto: HTML, CSS y JavaScript puros, sin paso de compilación. Admite narración diapositiva por diapositiva (archivos MP3), fondos animados con Three.js y transiciones CSS suaves. Además incluye un pequeño script de Python, `generate-assets.py`, que genera las imágenes y la narración por ti. Puedes ejecutarlo todo en cualquier navegador con un solo comando.

Al final de este capítulo, habrás:

+ Hecho un fork y clonado el proyecto
+ Elegido un tema para tu propia presentación
+ Pedido a un agente IA que genere ilustraciones personalizadas para cada diapositiva
+ Pedido a un agente IA que genere narración hablada para cada diapositiva
+ Personalizado el fondo animado para que coincida con tu tema
+ Visto el resultado final en tu navegador

Las ilustraciones vienen de *Hugging Face Inference Providers*, la pasarela de Hugging Face a cientos de modelos de IA abiertos. No necesitas tarjeta de crédito: cada cuenta gratuita recibe un pequeño crédito mensual, más que suficiente para este capítulo. La narración viene de `edge-tts`, una biblioteca gratuita de Python que usa las mismas voces en línea que la función de lectura en voz alta de Microsoft Edge, sin cuenta ni clave. Te comunicarás con ambos a través de tu agente de programación IA.

// v2-verify: HF free-tier monthly credit amount (was $0.10/month for free accounts, Sept 2026) and that FLUX.1-schnell is still served by an Inference Provider.

== Lo que Necesitarás

De los capítulos anteriores:
- Git instalado y configurado
- CLI de GitHub autenticado
- Claude Code o Antigravity CLI listo en tu terminal

Nuevo para este capítulo:
- Una cuenta de Hugging Face (gratuita)
- Un token de acceso de Hugging Face
- Python 3.10 o superior (para generar los recursos y ejecutar un servidor web local)
- Tres pequeñas bibliotecas de Python: `edge-tts`, `huggingface_hub` y `requests` (las instalarás después de clonar el proyecto, más abajo)

=== Obtén una Cuenta y Token de Hugging Face

Si no tienes una, regístrate en #link("https://huggingface.co/join")[huggingface.co/join]. Es gratuita: no se requiere tarjeta de crédito.

Una vez que hayas iniciado sesión:

+ Haz clic en tu foto de perfil (arriba a la derecha) → *Settings*
+ Haz clic en *Access Tokens* en la barra lateral izquierda
+ Haz clic en *New token*
+ Elige el tipo de token *Read* y ponle un nombre como `agentic-crew`
+ Haz clic en el botón para crear el token y cópialo (empieza por `hf_`)

// v2-verify: exact button labels on huggingface.co/settings/tokens.

Un token de lectura basta para llamar a los modelos y no puede cambiar nada en tu cuenta de Hugging Face. Un token por uso es un buen hábito: si alguna vez se filtra, lo borras sin romper nada más.

Guarda el token en un lugar seguro durante los próximos minutos (lo ideal es un gestor de contraseñas). Se lo darás a tu terminal, nunca al chat del agente.

=== Comprueba Python

#if is-windows [
Ejecuta:

```
python --version
```

Necesitas Python 3.10 o superior. Si Python no está instalado, o la versión es más antigua:

```
winget install -e --id Python.Python.3.13
```

// v2-verify: winget ID Python.Python.3.13 (python.org is moving Windows users to the Python install manager).

En Windows el comando es `python`, no `python3`. Si al escribir `python` se abre Microsoft Store, instala con el comando anterior y luego cierra y vuelve a abrir tu terminal.
]

#if is-mac [
Ejecuta:

```
python3 --version
```

Necesitas Python 3.10 o superior. El `python3` que viene con las herramientas de desarrollo de Apple suele ser más antiguo (3.9), así que si ves 3.9 o inferior, o no hay Python, instala uno actual:

```
brew install python
```
]

#if is-linux [
Ejecuta:

```
python3 --version
```

Necesitas Python 3.10 o superior (las versiones actuales de Ubuntu y Debian ya lo traen). Asegúrate de que el módulo de entornos virtuales también está instalado:

```
sudo apt install python3 python3-venv
```
]

Cierra y vuelve a abrir tu terminal tras la instalación, luego comprueba la versión de nuevo para confirmar.

== Configura tu Token de Hugging Face

El script de imágenes lee tu token de una *variable de entorno* llamada `HF_TOKEN`. Así el token vive solo en tu sesión de terminal: nunca se escribe en un archivo, nunca se incluye en un commit de Git y nunca se escribe en un prompt. Configúralo en la terminal que usarás durante el resto del capítulo: el agente que arranques desde esa terminal lo hereda.

#if is-mac or is-linux [
```
read -rs HF_TOKEN
export HF_TOKEN
```

Tras la primera línea, pega tu token y pulsa Intro. No aparece nada en pantalla mientras lo pegas; es a propósito, para que el token no quede ni en pantalla ni en el historial del shell.
]

#if is-windows [
```
$env:HF_TOKEN = "tu-token-aquí"
```

Reemplaza `tu-token-aquí` con el token que copiaste.
]

Ahora comprueba que está configurado, sin imprimir el token:

#if is-mac or is-linux [
```
[ -n "$HF_TOKEN" ] && echo "HF_TOKEN is set" || echo "HF_TOKEN is NOT set"
```
]

#if is-windows [
```
if ($env:HF_TOKEN) { "HF_TOKEN is set" } else { "HF_TOKEN is NOT set" }
```
]

Si ves `NOT set`, repite el paso anterior.

#quote(block: true)[
  *Mantén los tokens fuera de los archivos y fuera de los prompts.* Nunca pegues tu token en el código, no lo incluyas en un commit de Git ni lo escribas en el chat de tu agente IA. El agente no necesita verlo: el script lo lee del entorno cuando se ejecuta. Todo lo que pegas en un prompt se envía al proveedor del modelo y puede quedar en los registros de la sesión. Si un token se filtra, bórralo en la página Access Tokens y crea uno nuevo. El capítulo sobre la superficie de ataque del agente (The Agent Attack Surface) del libro principal explica por qué los secretos y los agentes requieren cuidado.
]

#if is-mac [
Esta configuración dura tu sesión de terminal actual. Si prefieres no configurarla cada vez, añade una línea `export HF_TOKEN="hf_..."` (con tu token) a tu archivo de configuración del shell (`~/.zshrc`), pero recuerda que ese archivo es texto plano en tu disco.
]

#if is-linux [
Esta configuración dura tu sesión de terminal actual. Si prefieres no configurarla cada vez, añade una línea `export HF_TOKEN="hf_..."` (con tu token) a tu archivo de configuración del shell (`~/.bashrc`), pero recuerda que ese archivo es texto plano en tu disco.
]

#if is-windows [
Esta configuración dura tu sesión de terminal actual. Para hacerla permanente, añádela en Propiedades del sistema → Variables de entorno.
]

== Fork y Clone del Proyecto

Este único comando crea tu propia copia del proyecto en GitHub y la descarga a tu máquina:

```
gh repo fork schlunsen/web-presenter --clone --remote
```

Entra en el directorio del proyecto:

```
cd web-presenter
```

Verifica tus conexiones con GitHub:

```
git remote -v
```

Deberías ver dos entradas:
- `origin` — tu fork (donde envías tus cambios)
- `upstream` — el proyecto original (de donde puedes obtener actualizaciones)

Cada remoto aparece listado dos veces: una para fetch y otra para push. Cuatro líneas en total es correcto. Si solo ves `origin`, algo salió mal: abre tu asistente IA y describe lo que ves; te ayudará.

== Instala los Paquetes de Python

El script de recursos necesita tres bibliotecas. Instálalas en un *entorno virtual*: una carpeta privada de paquetes de Python solo para este proyecto, para que nada choque con el resto de tu sistema. (El `.gitignore` del proyecto ya deja esta carpeta fuera de Git.)

#if is-mac or is-linux [
```
python3 -m venv .venv
source .venv/bin/activate
pip install edge-tts huggingface_hub requests
```

Tu prompt empieza ahora por `(.venv)`. Eso significa que el entorno está activo. Cada vez que abras una terminal nueva para este proyecto, entra con `cd` en `web-presenter` y ejecuta `source .venv/bin/activate` otra vez (y vuelve a configurar `HF_TOKEN`) antes de arrancar tu agente.
]

#if is-windows [
```
python -m pip install edge-tts huggingface_hub requests
```

En Windows puedes instalar directamente en el Python de tu usuario; aquí el entorno virtual es opcional.
]

== Explora el Proyecto

Pide al agente que te explique con qué estás trabajando. Abre tu asistente IA desde dentro del directorio del proyecto, en la misma terminal donde configuraste `HF_TOKEN`.

Si instalaste Claude Code, ejecuta:
```
claude --permission-mode manual
```

Si instalaste Antigravity CLI, ejecuta:
```
agy
```

Cualquiera funciona para todo en este capítulo. Los dos te preguntarán antes de editar un archivo o ejecutar un comando, que es justo lo que quieres aquí. Una vez abierto, pregunta:

- _"Lee README.md, index.html, generate-assets.py y los archivos de engine/. Explica cómo funciona este framework de presentaciones: cómo se estructuran las diapositivas, cómo se encuentra el audio de narración de cada diapositiva, cómo se generan las imágenes y cómo funciona el fondo animado. No cambies nada todavía."_

El agente leerá los archivos y te dará un resumen en lenguaje sencillo. Entenderás el proyecto en dos minutos en lugar de treinta. Solo está leyendo en este punto: nada se está cambiando todavía.

#quote(block: true)[
  *Un README puede hablarle a tu agente.* El README de este proyecto está escrito en parte _para_ agentes IA: les dice qué archivos editar y qué comandos ejecutar. Aquí es útil, porque sabes de dónde viene el repositorio. En general, cualquier texto que lee un agente puede dirigirlo, así que echa un vistazo al README de un desconocido antes de pedirle a un agente que lo siga.
]

Una vez que tengas una idea general, pregunta sobre los recursos existentes:

- _"Lista todos los archivos en presentation-audio/ y presentation-images/. ¿Qué hay ahí ya?"_

Verás los clips de narración e imágenes existentes: marcadores de posición que estás a punto de reemplazar con los tuyos.

== Elige tu Tema

Elige algo que conozcas o que te importe. Tu presentación tendrá diez diapositivas, así que quieres un tema con suficiente contenido para diez puntos cortos. Algunas ideas:

- Una tecnología que usas en el trabajo
- Un hobby o habilidad que quieres explicar a un amigo
- Un proyecto que estás construyendo
- Un argumento que quieres defender sobre algo

Para el resto de este capítulo, usaremos el marcador de posición *[TU TEMA]*: reemplázalo con lo que hayas elegido.

Anota diez puntos cortos: los temas de tus diapositivas. Una oración cada uno. Los pegarás en los prompts del agente que siguen.

#quote(block: true)[
  *Haz que tus puntos sean visuales.* Cada uno se convertirá en una imagen generada por IA, así que lo específico y concreto funciona mejor que lo abstracto. "Un almacén lleno de filas de servidores" generará una mejor ilustración que "infraestructura tecnológica". "Un niño leyendo bajo un árbol al atardecer" es mejor que "educación".
]

== Genera las Ilustraciones

En este paso el agente adapta `generate-assets.py` a tu tema. No lo editarás tú. Tu trabajo es proporcionar tus diez puntos, mirar qué ha cambiado el agente y después dejar que ejecute el script.

Dale a tu agente este prompt. *No lo copies palabra por palabra*: reemplaza `[TU TEMA]` con tu tema real y `[pega tus puntos]` con tus diez oraciones:

- _"Mi presentación trata sobre [TU TEMA] y tendrá diez diapositivas. En generate-assets.py, reemplaza IMAGE_PROMPTS por diez entradas llamadas slide-01 a slide-10, una por diapositiva, basadas en estos temas: [pega tus puntos]. Escribe los prompts de imagen en inglés, vívidos y con un estilo coherente. Sigue leyendo el token de la variable de entorno HF_TOKEN. No ejecutes nada todavía."_

Antes de que se ejecute nada, mira el cambio. Tu agente muestra cada edición como un diff cuando pide permiso, y siempre puedes pedir:

- _"Muéstrame git diff generate-assets.py."_

Las líneas que empiezan por `-` se han eliminado; las que empiezan por `+` se han añadido. No necesitas entender cada línea, pero comprueba dos cosas: que los diez prompts describen lo que quieres y que el token se sigue leyendo del entorno (`os.environ`), sin ningún valor `hf_...` escrito en el archivo.

Cuando estés conforme, pide al agente que ejecute solo la parte de imágenes:

- _"Ejecuta generate-assets.py con el argumento images."_

El agente pedirá permiso para ejecutar el comando. Léelo y aprueba ese comando concreto: no hace falta elegir una opción que lo permita todo a partir de ahora.

Cada imagen tarda unos segundos. El script imprime `OK` o `FAILED` para cada una. Cuando termine, `presentation-images/` contendrá desde `slide-01.png` hasta `slide-10.png`.

#quote(block: true)[
  *¿Y si una imagen no queda bien?* Pide al agente que regenere solo esa: _"La ilustración de la diapositiva 3 no queda bien: debería mostrar [descripción]. Mejora ese prompt y regenera solo slide-03."_ La generación de imágenes es iterativa. Un segundo o tercer intento suele acercarse más a lo que tenías en mente. Cada imagen cuesta una fracción de céntimo de tu crédito gratuito, así que unos cuantos reintentos no son problema.
]

== Genera la Narración

A continuación: audio hablado para cada diapositiva. El mismo script convierte texto en archivos MP3 con `edge-tts`. Las voces suenan claras y naturales, suficientes para una presentación.

Escribe una o dos frases de narración por diapositiva y dale al agente este prompt:

- _"En generate-assets.py, reemplaza NARRATIONS por diez entradas, una por diapositiva, con este texto: [pega tu narración de las diapositivas 1 a 10]. Usa la misma voz, es-ES-ElviraNeural, para todas las diapositivas. Muéstrame el diff y después ejecuta generate-assets.py con el argumento tts. Al terminar, borra los antiguos slide-11.mp3 y slide-12.mp3 de presentation-audio/ si existen."_

// v2-verify: edge-tts still works without a key (it relies on an unofficial Microsoft endpoint) and the voice name es-ES-ElviraNeural exists.

Revisa el diff como antes y aprueba la ejecución. Cuenta con unos segundos por clip. Cuando termine, `presentation-audio/` tendrá desde `slide-01.mp3` hasta `slide-10.mp3`.

Los nombres de archivo importan: la presentación reproduce `slide-01.mp3` en la diapositiva 1, `slide-02.mp3` en la 2, y así sucesivamente. Los encuentra por número; no aparecen en `index.html`.

#quote(block: true)[
  *¿Quieres otra voz?* Hay cientos. Pregunta: _"Ejecuta edge-tts --list-voices y sugiéreme tres voces en español que suenen cálidas."_ Después: _"Cambia la narración a [nombre de la voz] y regenera el audio."_
]

== Actualiza la Presentación

`index.html` contiene todo el contenido de las diapositivas y las rutas de las imágenes. Ahora el agente lo actualizará con tu nuevo contenido.

- _"Actualiza index.html para que tenga exactamente diez diapositivas sobre [TU TEMA], en el mismo orden que mi narración. Cada diapositiva debe usar el slide-NN.png correspondiente de presentation-images/. Usa los diseños de diapositivas existentes: diseño de título para la diapositiva 1, dos columnas o centrado para el resto. Actualiza el contador de diapositivas y los puntos de progreso para que sean diez. No cambies nada en engine/."_

El agente hará las ediciones. Cuando termine, pídele que compruebe su propio trabajo:

- _"Lee index.html de nuevo y confirma que hay exactamente diez diapositivas, que cada ruta de imagen apunta a un archivo que existe y que el contador y los puntos de progreso indican diez."_

Esta autocomprobación detecta referencias que faltan antes de que abras el navegador.

== Personaliza el Fondo Animado

El fondo Three.js dibuja una red de nodos luminosos y líneas de conexión. Por defecto usa tonos suaves de rosa, lavanda y verde salvia sobre un fondo oscuro. Pide al agente que lo adapte al ambiente de tu tema:

- _"Actualiza engine/presentation-bg.js para cambiar los colores de la animación de la red a [describe tu paleta: por ejemplo, 'ámbar cálido y marrón oscuro', 'verde profundo y blanco suave' o 'azul eléctrico sobre negro']. También actualiza las variables de color CSS en engine/presentation-styles.css para que coincidan."_

El agente editará ambos archivos. Si el resultado no te convence, describe lo que quieres con más precisión:

- _"El fondo es demasiado brillante. Haz los nodos más pequeños y reduce la opacidad de las líneas al 30%."_

Itera tantas veces como necesites. Cada cambio tarda unos segundos.

== Vista Previa en tu Navegador

Antes de abrir el navegador, confirma dos cosas:

+ La carpeta `presentation-images/` contiene desde `slide-01.png` hasta `slide-10.png`
+ La carpeta `presentation-audio/` contiene desde `slide-01.mp3` hasta `slide-10.mp3`

Si falta algún archivo, pregunta al agente: _"Comprueba las carpetas presentation-images/ y presentation-audio/. ¿Qué archivos hay y cuáles faltan?"_

Web Presenter necesita un servidor web local: algunas funciones del navegador que usa no funcionan si abres el archivo directamente desde el disco. Abre una *segunda* ventana de terminal (deja tu agente funcionando en la primera), ve a la carpeta del proyecto y arranca uno:

#if is-mac or is-linux [
```
cd web-presenter
python3 -m http.server 8000 --bind 127.0.0.1
```
]

#if is-windows [
```
cd web-presenter
python -m http.server 8000 --bind 127.0.0.1
```
]

(Si clonaste el proyecto en otro sitio que no sea tu carpeta personal, ve con `cd` a esa ubicación.) La parte `--bind 127.0.0.1` significa que solo tu propio ordenador puede acceder al servidor, no otros dispositivos de tu red. Deberías ver:

```
Serving HTTP on 127.0.0.1 port 8000 (http://127.0.0.1:8000/) ...
```

Eso significa que el servidor está listo. *Deja esta ventana de terminal abierta*: cerrarla detiene el servidor. Ahora abre tu navegador y ve a:

```
http://localhost:8000
```

Deberías ver tu presentación. Si aparece un botón de reproducción, haz clic en él (o pulsa Intro): los navegadores no permiten audio hasta que interactúas con la página. Cada diapositiva muestra su ilustración, reproduce su narración y avanza automáticamente cuando el audio termina. Pulsa la flecha derecha o la barra espaciadora para adelantar, y la flecha izquierda para volver.

Pulsa `A` para activar/desactivar la narración y `M` para activar/desactivar la música de fondo.

Cuando hayas terminado, vuelve a la terminal del servidor y pulsa *Ctrl+C* para detenerlo.

== Commit y Push

Una vez que estés satisfecho con tu presentación, guarda tu trabajo en GitHub. Primero, pide al agente que te muestre qué se va a incluir en el commit:

- _"Muéstrame git status. ¿Hay algo que no debería ir en el commit: una carpeta .venv, un archivo .env o algo que contenga un token?"_

Después:

- _"Crea una rama llamada presentation/[TU TEMA] (con guiones, sin espacios), añade los archivos modificados, haz commit con un mensaje que describa lo que construí y envíalo a mi fork."_

El agente se encargará de cada paso de Git. Cuando termine, verifica en GitHub:

+ Ve a `https://github.com/TU_USUARIO/web-presenter`
+ Abre el selector de ramas y busca tu rama (`presentation/[TU TEMA]`)
+ Haz clic en ella: deberías ver tus nuevas imágenes, archivos de audio e `index.html` actualizado

Tu presentación ya está guardada en GitHub y es compartible con cualquiera a través de esa URL.

== Lo que Acaba de Pasar

Generaste diez ilustraciones de IA, las narraste, personalizaste gráficos 3D animados y actualizaste un proyecto web, todo describiendo lo que querías en español natural. El agente se encargó de la mecánica. Así es como se ve la programación agéntica.

#table(
  columns: (1fr, 1fr),
  [*Tú aportaste*], [*El agente aportó*],
  [Un tema que te importa], [Prompts de imagen y llamadas a la API],
  [Diez oraciones de contenido], [Un script de Python adaptado, ejecutado cuando tú lo aprobaste],
  [Una descripción de paleta de colores], [JavaScript y CSS actualizados],
  [El criterio sobre qué queda bien], [La mecánica para hacerlo realidad],
)

También hiciste tres cosas que importan tanto como el resultado: mantuviste tu token en el entorno y no en el chat, leíste cada diff antes de que se ejecutara nada y aprobaste los comandos de uno en uno.

La habilidad no es programar. Es saber qué pedir, cómo comprobar el resultado y cómo iterar cuando no es del todo correcto. Eso es lo que desarrollarán los próximos capítulos.

== Solución de Problemas

*`pip install` falla con "externally-managed-environment":*
El Python de tu sistema no permite instalar paquetes de forma global. Usa el entorno virtual de "Instala los Paquetes de Python": créalo, actívalo y vuelve a ejecutar `pip install`.

*El script dice `No module named 'edge_tts'` o `No module named 'huggingface_hub'`:*
#if is-mac or is-linux [
El entorno virtual no está activo en la terminal donde se ejecuta tu agente. Sal del agente, ejecuta `source .venv/bin/activate` dentro de `web-presenter`, vuelve a configurar `HF_TOKEN` y arranca de nuevo el agente.
]
#if is-windows [
Los paquetes se instalaron para otro Python. Ejecuta de nuevo `python -m pip install edge-tts huggingface_hub requests` y pide al agente que ejecute el script con `python`.
]

*La generación de imágenes falla con un error 401 o "unauthorized":*
Falta el token o no es correcto. Comprueba que está configurado (ver "Configura tu Token de Hugging Face"). Si lo configuraste después de arrancar el agente, sal del agente, configura el token y arráncalo de nuevo: el agente solo ve las variables que existían cuando se inició.

*La generación de imágenes falla con un error 402 o un mensaje sobre créditos:*
Has agotado el crédito gratuito de este mes. Espera al mes siguiente o añade crédito en tu página de facturación de Hugging Face. Diez imágenes cuestan solo unos céntimos, así que normalmente significa muchos reintentos.

*La generación de imágenes falla con un error 403 sobre un modelo restringido (gated) o de acceso:*
Abre la página del modelo en Hugging Face (`huggingface.co/black-forest-labs/FLUX.1-schnell`) con la sesión iniciada, acepta las condiciones que aparezcan y vuelve a intentarlo.

*La generación de imágenes dice que el modelo está ocupado o que has superado el límite:*
Espera 30 segundos e inténtalo de nuevo, o pide al agente: _"Añade una pausa de 10 segundos entre las llamadas de generación de imágenes."_

*La narración falla en todas las diapositivas:*
`edge-tts` necesita conexión a internet y usa un servicio no oficial de Microsoft que cambia de vez en cuando. Pide al agente: _"Actualiza edge-tts con pip y vuelve a intentar el paso tts."_

*El audio no suena, o suena la narración equivocada en una diapositiva:*
La presentación reproduce `slide-NN.mp3` según el número de diapositiva. Pregunta: _"Comprueba que presentation-audio/ tiene de slide-01.mp3 a slide-10.mp3 y que el orden de las diapositivas en index.html coincide con el de la narración."_ Asegúrate también de haber hecho clic en el botón de reproducción: los navegadores bloquean el audio hasta que interactúas con la página.

*Las diapositivas muestran iconos de imagen rota:*
La ruta de la imagen en el HTML no coincide con el nombre de archivo real. Pregunta: _"Comprueba todos los atributos src de imágenes en index.html contra los archivos reales en presentation-images/. Corrige cualquier discrepancia."_

#if is-windows [
*El comando del servidor falla:*
Asegúrate de haber usado `python`, no `python3`, y de estar en la carpeta `web-presenter`.
]

*No carga nada o la página está en blanco:*
Asegúrate de que el servidor se está ejecutando en el directorio `web-presenter`, no en una carpeta superior. Abre las herramientas de desarrollo de tu navegador (F12) y revisa la pestaña Consola: los archivos que faltan aparecen listados ahí. Dile al agente lo que ves y lo arreglará.

*La animación Three.js ha dejado de funcionar después de editar:*
Pregunta al agente: _"La animación del fondo ha dejado de funcionar. Lee engine/presentation-bg.js y comprueba si hay errores de sintaxis o llamadas a funciones que faltan."_ Si prefieres deshacer el cambio: _"Restaura engine/presentation-bg.js a la última versión con commit usando git restore."_

*La rama incorrecta aparece en GitHub después del push:*
Asegúrate de que el nombre de la rama no tenga espacios: usa guiones. Pregunta al agente: _"¿Qué rama enviamos? Muéstrame la salida de git branch -a."_

Si encuentras un error que no aparece aquí, descríbeselo a tu agente IA: ha visto la mayoría de los errores antes y generalmente sabrá qué hacer. Pega el mensaje de error, nunca tu token.

== Referencia Rápida

#table(
  columns: (1fr, 2fr),
  [*Tarea*], [*Prompt o comando*],
  [Comprobar que el token HF está configurado], [#if is-mac or is-linux [`[ -n "$HF_TOKEN" ] && echo "HF_TOKEN is set"`] #if is-windows [`if ($env:HF_TOKEN) { "HF_TOKEN is set" }`]],
  [Instalar los paquetes de Python], [#if is-mac or is-linux [`python3 -m venv .venv`, `source .venv/bin/activate`, `pip install edge-tts huggingface_hub requests`] #if is-windows [`python -m pip install edge-tts huggingface_hub requests`]],
  [Explorar el proyecto], [_"Lee README.md, index.html y generate-assets.py y explica cómo funciona"_],
  [Revisar un cambio], [_"Muéstrame git diff generate-assets.py"_],
  [Generar imágenes], [_"Reemplaza IMAGE\_PROMPTS... y ejecuta generate-assets.py con el argumento images"_],
  [Generar narración], [_"Reemplaza NARRATIONS... y ejecuta generate-assets.py con el argumento tts"_],
  [Actualizar contenido de diapositivas], [_"Actualiza index.html con mis diez diapositivas..."_],
  [Cambiar fondo], [_"Actualiza los colores de la animación en engine/presentation-bg.js a..."_],
  [Comprobar archivos generados], [_"Lista los archivos en presentation-images/ y presentation-audio/"_],
  [Iniciar servidor local], [#if is-mac or is-linux [`python3 -m http.server 8000 --bind 127.0.0.1`] #if is-windows [`python -m http.server 8000 --bind 127.0.0.1`]],
  [Ver presentación], [`http://localhost:8000`],
  [Detener el servidor], [`Ctrl+C` en la terminal del servidor],
)

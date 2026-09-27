#import "_os-helpers.typ": *
= Configuración de tu Entorno de Trabajo

Antes de poder contribuir a un proyecto, corregir un error o simplemente leer código fuente correctamente, necesitas un entorno de trabajo funcional. Este capítulo prepara tu máquina desde cero, cualquiera que sea el sistema operativo que uses.

Al final de este capítulo, tendrás una terminal, un gestor de paquetes, Git, el CLI de GitHub, Node.js y, opcionalmente, un agente de programación con IA, todo listo para funcionar.

#if sys.inputs.at("illustrations", default: "true") == "true" [#include "_illus-workshop.typ"]

== Abre tu Terminal

La terminal es tu línea de comandos: el lugar donde ejecutarás todo en este libro.

#if is-windows [
PowerShell viene preinstalado en Windows 10 y 11.

+ Presiona `Win + X`
+ Selecciona *Terminal* (o *Windows PowerShell*)

Verifica que funciona:

```
$PSVersionTable.PSVersion
```

Deberías ver la versión *5.1* o superior.
]

#if is-mac [
La Terminal está integrada. Ábrela desde Spotlight:

+ Presiona `Cmd + Espacio`
+ Escribe *Terminal* y presiona Intro

O encuéntrala en *Aplicaciones → Utilidades → Terminal*.

Verifica que usas un shell moderno:

```
echo $SHELL
```

Deberías ver `/bin/zsh` (predeterminado desde macOS Catalina) o `/bin/bash`. Ambos funcionan con esta guía.
]

#if is-linux [
Cómo abrir la terminal depende de tu entorno de escritorio, pero estos atajos funcionan en la mayoría de las distribuciones:

- *Ubuntu / GNOME:* `Ctrl + Alt + T`
- *KDE Plasma:* clic derecho en el escritorio → *Abrir Terminal*
- *Cualquier distro:* busca "Terminal" en el lanzador de aplicaciones

Verifica el shell:

```
echo $SHELL
```

Deberías ver `/bin/bash` o `/bin/zsh`.
]

#quote(block: true)[
  *¿Por qué la terminal?* Los agentes de programación IA viven en la terminal. No puedes trabajar en pareja con un agente si no tienes un lugar donde pueda operar. Piensa en esto como preparar tu taller antes de empezar a construir.
]

== Instala un Gestor de Paquetes

Un gestor de paquetes te permite instalar software escribiendo un solo comando en lugar de descargar instaladores y hacer clic en asistentes. Cada plataforma tiene el suyo.

#if is-windows [
=== WinGet

WinGet viene con Windows 10 (versión 1809+) y Windows 11.

Comprueba si lo tienes:

```
winget --version
```

Si obtienes un error, instálalo desde la Microsoft Store buscando *App Installer*, luego cierra y vuelve a abrir la terminal.
]

#if is-mac [
=== Homebrew

Homebrew es el gestor de paquetes estándar para macOS. Instálalo con:

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Esto descarga y ejecuta el instalador oficial de Homebrew. Sigue las instrucciones: pedirá tu contraseña e instalará algunos elementos. Cuando termine, verifica:

```
brew --version
```

En Macs con Apple Silicon (cualquier chip de la serie M), Homebrew se instala en `/opt/homebrew`. Si `brew` no se encuentra después de la instalación, busca una sección "Next steps" al final de la salida del instalador: mostrará dos comandos que debes ejecutar. Cópialos, ejecútalos y abre una nueva ventana de terminal.
]

#if is-linux [
=== apt / dnf

Las distribuciones Linux incluyen un gestor de paquetes. Los más comunes:

#quote(block: true)[
  *¿Qué es `sudo`?* En Linux, `sudo` ejecuta un comando como administrador, similar a "Ejecutar como administrador" en Windows. Se te pedirá tu contraseña de usuario. No se muestra nada mientras escribes; eso es normal.
]

*Ubuntu, Debian y derivados:*
```
sudo apt update
```

*Fedora, RHEL y derivados:*
```
sudo dnf check-update
```

*Arch Linux:*
```
sudo pacman -Sy
```

No necesitas instalar nada: estos gestores vienen con tu sistema operativo. Los ejemplos de esta guía usan `apt`; sustitúyelo por el equivalente de tu distribución.
]

== Instala Git

Git es el control de versiones. Registra cada cambio en cada archivo de un proyecto y es la forma en que los equipos colaboran sin sobrescribir el trabajo de los demás. Todos los proyectos de este libro usan Git.

#if is-windows [
```
winget install Git.Git
```

*Cierra y vuelve a abrir tu terminal* tras la instalación.
]

#if is-mac [
Git viene incluido con las Xcode Command Line Tools, que probablemente ya tienes. Prueba:

```
git --version
```

Si ves un número de versión, ya está listo. Si macOS te pide instalar las herramientas de desarrollo, haz clic en *Instalar* y espera.

Para obtener una versión más reciente con Homebrew:

```
brew install git
```
]

#if is-linux [
*Ubuntu / Debian:*
```
sudo apt install git
```

*Fedora:*
```
sudo dnf install git
```

*Arch:*
```
sudo pacman -S git
```
]

---

Verifica:

```
git --version
```

Deberías ver un número de versión como `git version 2.55.0`. Cualquier versión reciente sirve.

Ahora configura tu identidad para que Git sepa quién realiza los cambios:

```
git config --global user.name "Tu Nombre"
git config --global user.email "tu@correo.com"
```

Usa el mismo correo que en tu cuenta de GitHub.

Un ajuste más: los repositorios nuevos deberían empezar en una rama llamada `main`, que es la que usa GitHub. Las versiones antiguas de Git siguen usando `master` por defecto, así que configúralo explícitamente:

```
git config --global init.defaultBranch main
```

== Git en Acción

Git está instalado, pero todavía no lo has usado. Hagamos una prueba rápida de 60 segundos para que Git no sea un misterio cuando llegue el Capítulo 2.

Crea una carpeta de práctica y entra en ella:

#if is-windows [
```
mkdir test-repo
cd test-repo
```
]

#if is-mac [
```
mkdir test-repo && cd test-repo
```
]

#if is-linux [
```
mkdir test-repo && cd test-repo
```
]

Dile a Git que empiece a rastrear esta carpeta:

```
git init
```

Comprueba el estado:

```
git status
```

Deberías ver `On branch main`, `No commits yet` y `nothing to commit`. Git te está diciendo que está vigilando esta carpeta y que aún no hay nada nuevo que registrar.

En el Capítulo 2 usarás `git status` constantemente: es como verificas qué ha cambiado. Ahora ya sabes cómo se ve cuando todo está limpio.

Vuelve a tu carpeta de inicio cuando hayas terminado:

```
cd ..
```

#quote(block: true)[
  *¿Qué acaba de pasar?* `git init` creó una carpeta oculta `.git` dentro de `test-repo`. Ahí es donde Git almacena todo su historial. Todos los proyectos que usan Git tienen una. Nunca necesitas tocarla directamente.
]

== Instala el CLI de GitHub

El CLI de GitHub (`gh`) te permite hacer forks de repositorios, crear pull requests y gestionar issues, todo sin salir de la terminal.

#if is-windows [
```
winget install GitHub.cli
```

Cierra y vuelve a abrir tu terminal.
]

#if is-mac [
```
brew install gh
```
]

#if is-linux [
*Ubuntu / Debian* — `gh` no está en los repositorios predeterminados, así que primero debes añadir el repositorio oficial de GitHub. Estos comandos (los mismos pasos que la documentación de instalación del propio CLI de GitHub) lo hacen y luego instalan `gh`:

```
sudo apt update && sudo apt install -y wget
U=https://cli.github.com/packages
K=/etc/apt/keyrings/githubcli-archive-keyring.gpg
A=$(dpkg --print-architecture)
sudo mkdir -p -m 755 /etc/apt/keyrings
wget -nv -O /tmp/gh.gpg "$U/githubcli-archive-keyring.gpg"
sudo cp /tmp/gh.gpg "$K"
sudo chmod go+r "$K"
echo "deb [arch=$A signed-by=$K] $U stable main" \
  | sudo tee /etc/apt/sources.list.d/github-cli.list
sudo apt update && sudo apt install -y gh
```

Puedes pegar todo el bloque a la vez: la terminal ejecutará cada línea en secuencia. Se te pedirá la contraseña en el primer `sudo`. Si alguna línea se rompe al copiarla desde esta página, copia el bloque de las instrucciones oficiales en #link("https://github.com/cli/cli/blob/trunk/docs/install_linux.md")[github.com/cli/cli → docs/install_linux.md]. No uses el paquete `gh` de los repositorios propios de Ubuntu: algunas de sus versiones son demasiado antiguas para funcionar con GitHub.

*Fedora:*
```
sudo dnf install gh
```

*Arch:*
```
sudo pacman -S github-cli
```

*Cualquier otra distribución* — descarga el binario para tu arquitectura desde #link("https://github.com/cli/cli/releases")[github.com/cli/cli/releases].
]

---

Verifica:

```
gh --version
```

== Crea una Cuenta de GitHub

Si aún no tienes una, regístrate en #link("https://github.com/signup")[github.com/signup]. Es gratuita. La necesitarás para todo a partir del Capítulo 2.

== Autentícate

Ahora conecta tu terminal a tu cuenta de GitHub:

```
gh auth login
```

Cuando se te pida, elige:
- *GitHub.com*
- *HTTPS*
- *Yes* cuando te pregunte si quieres autenticar Git con tus credenciales de GitHub (así `git push` funcionará después sin pedir contraseña)
- *Login with a web browser*

Te dará un código de un solo uso y abrirá tu navegador. Pega el código, autoriza y ya estarás conectado.

Verifica que funcionó:

```
gh auth status
```

Deberías ver `Logged in to github.com`.

== Instala Node.js

Node.js ejecuta JavaScript fuera del navegador, y `npm` (que viene con él) instala paquetes de JavaScript. No lo necesitarás en el próximo capítulo, pero sí en los ejercicios posteriores, cuando construyas una aplicación web y la pruebes. Instala ahora la versión LTS (soporte a largo plazo) ya que estás en ello.

#if is-windows [
```
winget install OpenJS.NodeJS.LTS
```
]

#if is-mac [
```
brew install node
```
]

#if is-linux [
*Ubuntu / Debian* — el paquete `nodejs` de los repositorios predeterminados suele ir varias versiones por detrás. Instala la LTS actual desde NodeSource:

```
curl -fsSL -o nodesource_setup.sh \
  https://deb.nodesource.com/setup_lts.x
sudo -E bash nodesource_setup.sh
sudo apt install -y nodejs
```

*Fedora:*
```
sudo dnf install nodejs npm
```

*Arch:*
```
sudo pacman -S nodejs npm
```
]

Cierra y vuelve a abrir tu terminal, luego verifica:

```
node --version
npm --version
```

Cualquier versión a partir de `v22` sirve.

== (Opcional) Instala un Agente de Programación con IA

Este libro trata sobre trabajar con agentes de IA. Aunque no es estrictamente necesario para los ejercicios, tener un agente en tu terminal hace que la experiencia sea real. Ninguno de los dos siguientes necesita Node.js: ambos se instalan como un único programa.

#quote(block: true)[
  *Instala desde la fuente oficial.* Copia los comandos de instalación de la documentación del propio fabricante (o de esta página), nunca de un blog cualquiera ni de un anuncio en el buscador. Los agentes de programación se ejecutan con tus permisos en tu máquina, lo que convierte los instaladores falsos en una trampa atractiva.
]

=== Opción A: Claude Code

Claude Code es el agente de programación IA de Anthropic. Se ejecuta en tu terminal y puede leer, escribir y razonar sobre código.

Instálalo con el instalador nativo oficial (el método recomendado: se actualiza solo en segundo plano):

#if is-mac [
```
curl -fsSL https://claude.ai/install.sh | bash
```

¿Prefieres Homebrew? `brew install --cask claude-code` también funciona, pero tendrás que actualizarlo tú con `brew upgrade claude-code`.
]

#if is-linux [
```
curl -fsSL https://claude.ai/install.sh | bash
```

Anthropic también publica repositorios `apt` y `dnf` firmados, si prefieres gestionarlo con tu gestor de paquetes: consulta la página de instalación de la documentación de Claude Code en #link("https://code.claude.com/docs")[code.claude.com/docs].
]

#if is-windows [
En PowerShell:

```
irm https://claude.ai/install.ps1 | iex
```

¿Prefieres WinGet? `winget install Anthropic.ClaudeCode` también funciona (fíjate en el nombre: `Anthropic.Claude` es la aplicación de chat de escritorio, no el agente de terminal), pero tendrás que actualizarlo tú con `winget upgrade Anthropic.ClaudeCode`.

Claude Code funciona de forma nativa en PowerShell. Como ya instalaste Git más arriba, también puede usar Git Bash para ejecutar comandos.
]

Cierra y vuelve a abrir tu terminal, y comprueba que está instalado:

```
claude --version
```

Si prefieres npm, `npm install -g @anthropic-ai/claude-code` también funciona (necesita Node.js 22 o posterior). No mezcles métodos de instalación: elige uno.

Ejecútalo:

```
claude
```

La primera vez abrirá tu navegador para iniciar sesión. Claude Code necesita un plan de pago de Claude (Pro o superior) o una cuenta de Anthropic Console con saldo de API: el plan gratuito de Claude no lo incluye.

=== Opción B: Antigravity CLI

// v2-verify: Antigravity CLI install URLs, the `agy` command and the free weekly quota (antigravity.google/docs/cli/install and /docs/plans) — launched June 2026 and changing fast.

Antigravity CLI es el agente de programación IA de Google. Mismo concepto, modelos diferentes. En junio de 2026 sustituyó al anterior Gemini CLI de Google para los usuarios individuales: si un tutorial antiguo te dice que instales `@google/gemini-cli`, usa este en su lugar.

#if is-mac [
```
curl -fsSL https://antigravity.google/cli/install.sh | bash
```
]

#if is-linux [
```
curl -fsSL https://antigravity.google/cli/install.sh | bash
```
]

#if is-windows [
En PowerShell:

```
irm https://antigravity.google/cli/install.ps1 | iex
```
]

Cierra y vuelve a abrir tu terminal y ejecútalo; el comando es `agy`:

```
agy
```

La primera vez abrirá tu navegador para que inicies sesión con tu cuenta de Google. Una cuenta personal de Google tiene una cuota gratuita que se renueva cada semana; los planes de pago de Google AI tienen más.

#quote(block: true)[
  *Las claves de API son secretos.* Ambas herramientas pueden funcionar también con una clave de API en lugar de iniciar sesión con una cuenta. Si alguna vez vas por ese camino, guarda la clave en una variable de entorno o en el llavero de tu sistema operativo; nunca la pegues en un prompt, en un chat ni en un archivo que subas a Git. El capítulo _The Agent Attack Surface_ del libro principal (segunda edición, en inglés) explica por qué.
]

=== ¿Cuál elegir?

Cualquiera funciona para este libro. Claude Code es el que más usa el libro principal y destaca en razonamiento de código y ediciones de múltiples archivos, pero necesita un plan de pago. Antigravity CLI tiene un nivel gratuito, así que es la forma más fácil de empezar sin coste. Los ejercicios muestran prompts que funcionan con cualquiera de los dos.

== Verifica Todo

Ejecuta esta lista de verificación rápida:

```
git --version
gh --version
gh auth status
node --version
```

Si los cuatro comandos funcionan, estás listo. Tu entorno de trabajo está configurado, tu identidad está ajustada y tienes conexión directa a GitHub.

== El Enfoque Basado en Prompts

Una vez instalado Claude Code o Antigravity CLI, no tienes que recordar cada comando: puedes describir lo que quieres en español natural. Así es como pedirías a un agente IA que verifique toda tu configuración.

Abre tu agente de IA en la terminal:

```
claude
```

(O `agy` si instalaste Antigravity CLI.)

Luego prueba prompts como estos:

- _"Comprueba si Git está instalado y correctamente configurado con nombre y correo electrónico."_
- _"¿Está instalado y autenticado el CLI de GitHub? Muéstrame el estado."_
- _"Ejecuta una lista de verificación rápida: git, gh y gh auth status — dime qué funciona y qué no."_

#quote(block: true)[
  *Empieza en modo Manual mientras aprendes.* Las versiones recientes de Claude Code arrancan en _modo auto_, en el que una comprobación de seguridad en segundo plano aprueba las acciones rutinarias en lugar de preguntarte. Mientras aprendes, es mejor que veas y apruebes tú cada comando. Arranca Claude Code así:

  ```
  claude --permission-mode manual
  ```

  La barra de estado muestra `⏸ manual mode on`, y el agente te pedirá permiso antes de ejecutar cualquier cosa que cambie tu máquina. Lee cada comando antes de aprobarlo, y apruébalo solo si lo entiendes; con comprobaciones como `git --version`, es fácil. `Shift+Tab` recorre los modos durante una sesión. El capítulo _Guardrails, Trust, and Sandboxes_ del libro principal muestra cómo configurar los permisos de forma deliberada cuando sepas qué quieres permitir.
]

El agente ejecutará los comandos, interpretará la salida y te dirá en lenguaje natural qué está listo y qué aún necesita atención. Si algo falta o está roto, pregúntale:

- _"Git no está configurado con mi correo electrónico — ¿cómo lo arreglo?"_
- _"Guíame paso a paso para autenticar el CLI de GitHub."_
- _"Estoy en macOS y Homebrew no está en mi PATH — ¿cómo lo soluciono?"_

#quote(block: true)[
  *Comandos vs. prompts.* Ambos enfoques te llevan al mismo lugar. Los comandos son rápidos y precisos una vez que los conoces. Los prompts son más tolerantes: te encuentran donde estás. A medida que ganes experiencia, cambiarás entre los dos de forma natural.
]

En el próximo capítulo, pondremos todo en práctica: harás un fork de un repositorio real, leerás un capítulo real de un libro real, escribirás una reseña honesta y enviarás tu primer pull request.

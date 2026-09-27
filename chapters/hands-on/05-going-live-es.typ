#import "_os-helpers.typ": *
= Salir a Producción

Tu aplicación funciona en tu propio ordenador. Se ve genial. Las tarjetas se animan, los filtros responden al instante, el localStorage persiste entre actualizaciones. Tú construiste esto.

Ahora intenta enviárselo a un amigo.

No puedes — no como un enlace. El archivo vive en tu máquina, y aunque lo sirvieras en `localhost`, eso significa "este ordenador, justo aquí." Es una dirección privada — como un nombre de calle que solo existe dentro de tu casa. Para todos los demás en el mundo, tu aplicación no existe.

Este capítulo soluciona eso. Vas a alquilar un pequeño servidor, apuntar un dominio hacia él y desplegar tu Lista de Viajes Pendientes para que todo el mundo la vea — con HTTPS, reinicios automáticos y una configuración profesional. Tu agente IA no solo escribirá archivos de configuración. _Operará la infraestructura directamente_: aprovisionando el servidor, conectándose por SSH para configurarlo y llamando a la API de Cloudflare para configurar el DNS. Casi sin paneles de control. Casi sin clics. Solo tú, tu agente y un terminal.

Aquí es donde el agente deja de ser un escritor de código y se convierte en tu equipo de operaciones. Eso también significa que obtiene llaves reales de máquinas reales — así que este capítulo trata tanto de _cuánto_ poder ceder como del despliegue en sí.

== Lo que Vas a Construir

Al final de este capítulo, habrás:

+ Aprovisionado un servidor real en un centro de datos usando la CLI de Hetzner Cloud
+ Hecho que tu agente se conecte por SSH al servidor y lo configure desde cero — con tu aprobación en cada comando
+ Desplegado tu Lista de Viajes Pendientes detrás de un servidor web con HTTPS automático
+ Usado tu agente para configurar DNS a través de la API de Cloudflare, con un token de alcance reducido
+ Asegurado que tu sitio vuelve por sí solo tras un reinicio
+ Entendido los fundamentos del auto-alojamiento: lo que se necesita para gestionar tu propia máquina en internet

== Lo que Necesitarás

De los capítulos anteriores:
- Tu aplicación de Lista de Viajes Pendientes del Capítulo 4 (subida a un repositorio público de GitHub)
- Un terminal con tu agente IA listo
- Git instalado y configurado

Nuevo para este capítulo:
- Una cuenta de Hetzner (#link("https://www.hetzner.com/cloud")[regístrate aquí]). A veces se pide verificación de identidad a las cuentas nuevas antes de poder crear servidores, así que regístrate con un día de antelación si puedes.
- Una cuenta de Cloudflare para DNS (gratis — #link("https://dash.cloudflare.com/sign-up")[regístrate aquí])
- Un nombre de dominio (opcional pero recomendado — los baratos empiezan en unos pocos euros al año)
- Disposición para dejar que tu agente toque infraestructura real — y para leer lo que está a punto de hacer antes de decir que sí

#quote(block: true)[
  *Una nota sobre costes:* Los servidores de CPU compartida más pequeños de Hetzner cuestan alrededor de 5–7 EUR al mes incluyendo la dirección IPv4, facturados por horas, así que un servidor que elimines tras una tarde cuesta céntimos. Los precios subieron dos veces en 2026 y algunos planes se agotan de vez en cuando — consulta la lista de precios actual antes de empezar. El DNS de Cloudflare es gratuito. Si no tienes un nombre de dominio, puedes seguir el capítulo usando la dirección IP del servidor — simplemente no tendrás HTTPS hasta el paso de DNS.
  // v2-verify: precio del CX23 de Hetzner (5,49 EUR/mes sin IPv4 tras el 15 de junio de 2026) y disponibilidad; actualiza el rango si vuelve a moverse.
]


== ¿Por qué Auto-Alojamiento?

Hay plataformas que desplegarán un sitio estático por ti en segundos — Vercel, Netlify, Cloudflare Pages. Sube tu código y está en línea. Eso es genuinamente útil, y para muchos proyectos es la elección correcta.

Pero no aprendes lo que _es_ el despliegue usando una plataforma que lo oculta todo. Lo aprendes haciéndolo tú mismo. Un VPS te da la imagen completa: una máquina Linux, una dirección IP pública, un servidor web, registros DNS, certificados TLS. Estos son los bloques fundamentales sobre los que se construye cada plataforma.

Auto-alojamiento también significa autosuficiencia. Puedes ejecutar cualquier cosa en tu propio servidor — no solo sitios estáticos, sino bases de datos, APIs, trabajos en segundo plano, herramientas auto-alojadas como Gitea o Plausible o Nextcloud. Una vez que sepas cómo gestionar un VPS, puedes alojar cualquier cosa. El coste mensual es fijo y predecible, sin dependencia de un proveedor.

Tu agente IA hace que el auto-alojamiento sea drásticamente más accesible. ¿Los comandos y archivos de configuración que antes requerían años de experiencia en administración de sistemas? El agente los conoce. Tú aportas la intención — "haz que esto sea seguro", "configura HTTPS", "despliega mi aplicación" — y el agente traduce eso en las operaciones correctas en la máquina correcta.

Empecemos.


== Crea tu Servidor

=== Configura tu Clave SSH

El agente iniciará sesión en tu servidor con una clave SSH — un par de archivos en tu ordenador que demuestran quién eres, sin contraseña que teclear. Comprueba si ya tienes una:

#if is-windows [
```
Get-Content $HOME\.ssh\id_ed25519.pub
```
]
#if not is-windows [
```
cat ~/.ssh/id_ed25519.pub
```
]

Si el archivo no existe, crea una clave tú mismo — no a través del agente, porque hace preguntas y pide una contraseña:

```
ssh-keygen -t ed25519
```

Pulsa Intro para aceptar la ubicación por defecto. Cuando pida una contraseña (passphrase), escribe una — cifra la clave privada en el disco, de modo que un portátil robado no entregue tu servidor. El archivo `.pub` es la mitad _pública_; esa es la única parte que sale de tu máquina. La clave privada (el archivo sin `.pub`) es un secreto — nunca la pegues en un prompt, un repositorio o un chat con el agente.

=== Aprovisiona el Servidor

Aprovisionaremos el servidor con la CLI de Hetzner Cloud, `hcloud`. Pide al agente:

- _"Instala la CLI de Hetzner Cloud (hcloud) y ayúdame a autenticarla."_

En macOS es `brew install hcloud`; en Windows, `winget install HetznerCloud.CLI`; en Linux, una descarga desde las releases de GitHub del proyecto (el paquete de `apt` suele estar desactualizado). Crearás un token de API en la Consola de Hetzner en *Seguridad → Tokens de API* — dale *Lectura y Escritura*, ya que vamos a crear y eliminar servidores. Luego el agente ejecuta `hcloud context create`, que pide el token y lo almacena. El token es una credencial: deja que la CLI lo guarde y nunca lo pegues en un prompt. Para un script puntual puedes ponerlo en la variable de entorno `HCLOUD_TOKEN` en lugar de en cualquier archivo que el agente pueda subir.

Ahora, la parte divertida. Dile al agente:

- _"Usa la CLI de hcloud para crear el servidor Ubuntu 24.04 más pequeño disponible en el centro de datos de Falkenstein. Sube primero mi clave pública SSH, nombra el servidor travel-bucket-list y adjunta la clave. Comprueba `hcloud server-type list` para ver el tipo de CPU compartida más barato actual antes de crearlo."_

El agente sube tu clave pública y ejecuta algo como:

```
hcloud ssh-key create --name my-key \
  --public-key-from-file ~/.ssh/id_ed25519.pub

hcloud server create \
  --name travel-bucket-list \
  --type cx23 \
  --image ubuntu-24.04 \
  --location fsn1 \
  --ssh-key my-key
```

En unos 30 segundos, tienes un servidor. La CLI devuelve una dirección IP — esa es la dirección de tu máquina en internet. Anótala. La vas a necesitar.

// v2-verify: tipo de servidor de CPU compartida más barato (CX23 en sept. 2026 — el antiguo CX22 se retiró y la API lo rechaza). Confirma el valor de `--type` y que ubuntu-24.04 siga disponible con `hcloud image list`.

#quote(block: true)[
  *¿Qué acaba de pasar?* Alquilaste una máquina virtual en un centro de datos de Hetzner en Falkenstein, Alemania. Tiene 2 núcleos de CPU, 4 GB de RAM y 40 GB de espacio en disco, ejecutando Ubuntu Linux. Tiene una dirección IP pública, lo que significa que cualquiera en internet puede alcanzarla — y tú puedes conectarte a ella por SSH. Todo desde un solo comando de CLI.
]


== El Agente se Conecta por SSH

Aquí es donde este capítulo se diferencia de un tutorial típico. No vas a conectarte por SSH al servidor y escribir comandos. El _agente_ va a conectarse por SSH y configurar la máquina por ti.

Pero antes de que lo haga: un agente con una sesión SSH activa en un servidor real es exactamente el tipo de poder del que advierte el capítulo de Guardarraíles del libro principal. Un comando confuso aquí no rompe una tarjeta de una página — puede borrar un disco o dejarte fuera. Así que establece las reglas antes de entregar las llaves.

#quote(block: true)[
  *Mantén a un humano en los comandos destructivos.* Ejecuta el agente en un modo que pregunte antes de actuar, en lugar de uno que ejecute comandos por su cuenta — para Claude Code, arráncalo con `claude --permission-mode manual`. Lee cada comando antes de aprobarlo. Aprueba con libertad los comandos de solo lectura y de configuración (`uname`, `apt update`, escribir un archivo de configuración). Detente y piensa en cualquier cosa destructiva o irreversible: `rm -rf`, `ufw enable`, desactivar SSH, `reboot`, `hcloud server delete`. El agente opera una máquina de la que tú eres responsable — tú eres la última línea de revisión. Es el mismo razonamiento de permitir/preguntar/denegar del capítulo de Guardarraíles, aplicado a la infraestructura en lugar del código.
]

Con eso en su sitio, dile al agente:

- _"Conéctate por SSH a mi nuevo servidor en [dirección IP] como root y ejecuta `uname -a` para verificar que estamos conectados."_

El agente se conecta. Ves la salida: `Linux travel-bucket-list 6.x.x ... Ubuntu ...`. Tu agente está ahora dentro de una máquina Linux real en un centro de datos. Todo lo que haga desde aquí ocurre en ese servidor remoto.

Ahora pregunta:

- _"Mientras estás en el servidor, actualiza todos los paquetes y muéstrame la información del sistema — cuánta RAM, espacio en disco y qué CPU tenemos."_

El agente ejecuta `apt update && apt upgrade -y`, luego `free -h`, `df -h` y `lscpu`. Puedes ver exactamente lo que estás alquilando.

#quote(block: true)[
  *Infraestructura-como-conversación.* Tu agente IA acaba de conectarse a un ordenador remoto por SSH y ejecutar comandos en él. Esto es lo mismo que hace un administrador de sistemas — pero en lugar de recordar comandos arcanos y opciones, describiste lo que querías en español normal. El agente tradujo tu intención en operaciones. Este patrón se repite a lo largo del capítulo: tú dices _qué_, el agente averigua _cómo_, y tú apruebas antes de que se ejecute.
]


== Asegura el Servidor

Un servidor recién creado en internet es como una casa sin cerrar en una calle concurrida. Los bots empezarán a sondearlo en cuestión de minutos. Solucionemos eso. Pide al agente:

- _"Conéctate por SSH al servidor y haz la configuración básica de seguridad: crea un usuario llamado deploy con acceso sudo, copia mi clave SSH a ese usuario, desactiva el inicio de sesión SSH como root y configura UFW para permitir solo SSH, HTTP y HTTPS."_

El agente se conecta por SSH como root y ejecuta una serie de comandos: crear el usuario, configurar la clave SSH autorizada, editar `sshd_config`, activar el firewall. Sabe que debe permitir el puerto 22 _antes_ de activar UFW — porque si activas el firewall y olvidas permitir SSH, te quedas fuera. Este es uno de esos momentos de "aprueba con cuidado": tanto `ufw enable` como desactivar el inicio de sesión root cambian cómo llegas a la máquina.

#quote(block: true)[
  *Historia de guerra: El administrador bloqueado.* Esto le pasa a todo el mundo al menos una vez. Activas el firewall, olvidas permitir SSH y de repente no puedes conectarte a tu propio servidor. La consola web de Hetzner (VNC) es tu salida de emergencia — puedes iniciar sesión a través del navegador y arreglar las reglas del firewall. Tu agente conoce este riesgo y maneja el orden correctamente. Pero si lo haces manualmente, recuerda siempre: permite SSH _primero_, activa el firewall _después_.
]

Después de este paso, verifica que la nueva configuración funciona:

- _"Conéctate por SSH al servidor como el usuario deploy y verifica que tenemos acceso sudo."_

De ahora en adelante, siempre te conectarás como `deploy`, no como `root`. Esto es privilegio mínimo en la práctica — la cuenta root tiene poder ilimitado, y ni tú ni el agente deberíais usarla para el trabajo diario. Si una sesión del agente sale mal alguna vez, un usuario `deploy` con `sudo` deja un radio de impacto menor que un inicio de sesión root permanente.


== Despliega la Aplicación

Ahora vamos a poner la Lista de Viajes Pendientes funcionando en el servidor. Dile al agente:

- _"Conéctate por SSH al servidor como el usuario deploy. Instala Node.js usando nvm, clona mi repositorio travel-bucket-list de GitHub y arranca la aplicación."_

El agente se encarga de toda la secuencia: instalar nvm, instalar la versión LTS actual de Node, clonar el repositorio y arrancar la aplicación. Te informa de que la aplicación está escuchando en el puerto 3000.

Pruébalo visitando `http://[la-ip-de-tu-servidor]:3000` en tu navegador. Ahí está — tu aplicación, ejecutándose en un servidor real, accesible desde cualquier lugar del mundo.

Tómate un momento. Construiste esta aplicación en el Capítulo 4. Ahora está en internet. Eso es real.

Pero aún no hemos terminado. Esta configuración es frágil de dos maneras: si la sesión SSH se cierra, la aplicación muere. Y si el servidor se reinicia, la aplicación no vuelve. Solucionemos ambos problemas.


== Configura el Servidor Web

Ahora mismo, los visitantes necesitan escribir un número de puerto (`:3000`) para llegar a tu aplicación. Así no funcionan los sitios web reales. Necesitamos un _proxy inverso_ — un servidor web que escuche en los puertos estándar (80 para HTTP, 443 para HTTPS) y reenvíe las peticiones a tu aplicación Node.js.

Vamos a usar Caddy. Tiene un superpoder: HTTPS automático. Caddy obtiene certificados TLS de Let's Encrypt sin ninguna configuración de tu parte. Pide al agente:

- _"Conéctate por SSH al servidor e instala Caddy. Luego escribe un Caddyfile que haga proxy inverso al puerto 3000. Por ahora, usa la dirección IP del servidor ya que todavía no hemos configurado el DNS."_

El agente instala Caddy y crea `/etc/caddy/Caddyfile`. Una vez que Caddy esté funcionando, puedes visitar `http://[la-ip-de-tu-servidor]` — sin necesidad de número de puerto.

#quote(block: true)[
  *¿Por qué Caddy en lugar de nginx?* Nginx es el estándar de la industria, y tu agente también puede escribir configuraciones de nginx — pregúntale si tienes curiosidad. Pero para este capítulo, el objetivo es confianza en el despliegue, no dominar servidores web. El HTTPS automático de Caddy y su configuración mínima significan que obtienes una configuración de producción funcional en minutos. Siempre puedes cambiar después.
]


== Apunta tu Dominio con la API de Cloudflare

Aquí es donde entra Cloudflare — no para alojamiento, sino para DNS. DNS es el sistema que traduce un nombre de dominio legible por humanos (como `bucketlist.ejemplo.com`) a la dirección IP de tu servidor. Cloudflare proporciona un servicio DNS rápido y gratuito con una excelente API.

Primero, crea un token de API con *alcance reducido*. En el panel de Cloudflare, ve a *Mi Perfil → Tokens de API → Crear Token* y usa la plantilla *Editar DNS de zona* (Edit zone DNS). Limítalo bajo *Recursos de zona* a la única zona (dominio) que estás usando — no "Todas las zonas". Esa plantilla también necesita *Zona → Zona → Leer* para que el agente pueda buscar tu zona por nombre. Esto es privilegio mínimo de nuevo: un token que solo puede editar el DNS de un dominio no puede tocar el resto de tu cuenta si se filtra.

#quote(block: true)[
  *¿Por qué limitar tanto el token?* Un token de API es una credencial al portador — quien lo tenga puede hacer lo que permita. El capítulo de La Superficie de Ataque del Agente del libro principal describe un token amplio y todopoderoso como exactamente el tipo de premio que quiere un atacante. Un token limitado a una zona, con solo permisos de edición de DNS, no vale casi nada si se escapa. Ponlo en una variable de entorno (`CLOUDFLARE_API_TOKEN`), nunca en un prompt, en un archivo que el agente suba, o en una captura de pantalla.
]

Con el token configurado, dile al agente:

- _"Usa la API de Cloudflare para crear un registro A para `bucketlist.ejemplo.com` apuntando a [dirección IP del servidor]. Mi token de API de Cloudflare está en la variable de entorno CLOUDFLARE_API_TOKEN — léelo del entorno, no me pidas que lo pegue."_

El agente construye la llamada a la API:

+ Busca tu zona DNS con `GET /zones?name=ejemplo.com`
+ Crea un registro A con `POST /zones/{zone_id}/dns_records`, apuntando tu dominio a la IP del servidor
+ Verifica que el registro se creó correctamente

Todo mediante peticiones HTTPS a la API de Cloudflare, autenticadas con `Authorization: Bearer $CLOUDFLARE_API_TOKEN`. Nunca vuelves a abrir el panel de control de Cloudflare. El agente explica cada paso:

#quote(block: true)[
  *¿Qué es un registro A?* Es la entrada DNS más básica — mapea un nombre de dominio directamente a una dirección IP. Cuando alguien escribe `bucketlist.ejemplo.com` en su navegador, su ordenador pregunta al DNS "¿cuál es la IP de este dominio?" y el registro A responde con la dirección de tu servidor. El agente crea este registro a través de la API de Cloudflare — la misma API que usa el panel de control web entre bastidores.
]

Ahora actualiza tu Caddyfile para usar el dominio. Pide al agente:

- _"Conéctate por SSH al servidor y actualiza el Caddyfile para usar mi dominio `bucketlist.ejemplo.com` en lugar de la dirección IP. Reinicia Caddy."_

El agente actualiza `/etc/caddy/Caddyfile` a:

```
bucketlist.ejemplo.com {
    reverse_proxy localhost:3000
}
```

Cuando Caddy ve un nombre de dominio real, automáticamente obtiene un certificado TLS de Let's Encrypt. En un minuto o dos, tu sitio está en vivo en `https://bucketlist.ejemplo.com` — candado y todo.

#quote(block: true)[
  *Propagación DNS.* Después de crear el registro A, puede tardar unos minutos en que los cambios de DNS se propaguen por internet. Si tu dominio no resuelve inmediatamente, no entres en pánico. Pregunta al agente: _"Comprueba si el registro DNS de bucketlist.ejemplo.com se ha propagado usando dig."_ Normalmente tarda menos de cinco minutos con Cloudflare. Si dejaste el registro *proxificado* (nube naranja) en Cloudflare, ten en cuenta que los visitantes llegan a la IP de Cloudflare, no a la tuya — ponlo en *Solo DNS* (nube gris) mientras haces funcionar el certificado de Caddy, y luego decide.
]

Si no tienes un dominio, no pasa nada. Tu aplicación sigue siendo accesible en `http://[ip-del-servidor]`. Puedes añadir un dominio más tarde — el agente puede guiarte para comprar uno y configurar el DNS de Cloudflare cuando estés listo.


== Haz que Sobreviva a los Reinicios

La última pieza: un archivo de servicio systemd para que tu aplicación se inicie automáticamente y se reinicie si se cuelga. Pide al agente:

- _"Conéctate por SSH al servidor y crea un servicio systemd para mi aplicación Node.js. Debe iniciarse al arrancar, reiniciarse si se cuelga y ejecutarse como el usuario deploy. Actívalo e inícialo."_

El agente crea `/etc/systemd/system/travel-bucket-list.service`, lo activa con `systemctl enable` y lo inicia. Ahora tu aplicación es gestionada por el propio sistema operativo.

Puedes comprobarlo en cualquier momento:

- _"Conéctate por SSH y comprueba el estado del servicio travel-bucket-list."_
- _"Conéctate por SSH y muéstrame las últimas 50 líneas de los logs de la aplicación."_

El agente ejecuta `systemctl status travel-bucket-list` y `journalctl -u travel-bucket-list -n 50`. Estás monitorizando un servidor de producción desde tu terminal, con el agente traduciendo tus preguntas en los comandos correctos.


== Prueba Todo el Stack

Demostremos que todo funciona de principio a fin. Pide al agente:

- _"Conéctate por SSH al servidor y reinícialo."_

(Un reinicio es uno de esos comandos que hay que aprobar deliberadamente — estás a punto de cortar tu propia conexión.) Espera 30 segundos, luego visita tu URL. Tu aplicación debería estar ahí — HTTPS, candado, completamente operativa. El sistema operativo inició Caddy y tu aplicación Node.js automáticamente al arrancar.

Esto es un despliegue real. No es un juguete. No es una demo. Un servidor real en un centro de datos real, ejecutando tu código, con conexiones cifradas, renovación automática de certificados y recuperación ante caídas. Podrías montar un negocio sobre esto.


== Lo que Acaba de Pasar

Llevaste una aplicación de tu propio ordenador a internet real. Veamos qué aportaste tú y qué aportó el agente:

#table(
  columns: (1fr, 1fr),
  [*Tú aportaste*], [*El agente aportó*],
  [La decisión de publicarla], [Aprovisionamiento de servidor via la CLI de hcloud],
  [Credenciales de cuenta y tokens de API de alcance reducido], [Sesiones SSH y administración de sistemas Linux],
  [Un nombre de dominio], [Configuración DNS via la API de Cloudflare],
  [Instrucciones de alto nivel ("haz que sea seguro")], [Reglas de firewall, gestión de usuarios, endurecimiento SSH],
  [Aprobación en cada comando destructivo], [Análisis de logs, diagnóstico y correcciones],
  [La verificación final ("¿funciona la URL?")], [Servicios systemd, configuraciones de Caddy, certificados TLS],
)

El ciclo central se mantuvo igual que en el Capítulo 4:

+ *Describe* lo que quieres ("despliega mi aplicación", "asegura el servidor", "configura el DNS")
+ *Revisa* lo que el agente hace — y aprueba o rechaza cada comando antes de que se ejecute
+ *Itera* cuando algo sale mal (pega el error, deja que el agente diagnostique)
+ *Entiende* lo suficiente para mantener el control (saber qué hace el DNS, qué es un proxy inverso, por qué importa HTTPS)

Pero el rol del agente se expandió. En el Capítulo 4, escribió código. En este capítulo, _operó infraestructura_ — aprovisionando servidores, conectándose por SSH a máquinas remotas, llamando a APIs, gestionando servicios del sistema. El agente pasó de programador en pareja a ingeniero DevOps. El mismo flujo de trabajo, un dominio completamente diferente — y con más en juego, por lo que mantuviste una mano en los comandos destructivos.

Esa es la verdadera lección: el flujo de trabajo agéntico no se limita a escribir código. Se aplica en cualquier lugar donde necesites traducir intención en operaciones técnicas precisas — siempre que ajustes su poder a la medida. Despliegue. Configuración. Monitorización. Depuración. El agente te encuentra donde está el problema.

Abre tu teléfono. Escribe la URL. Enséñaselo a alguien.


== Solución de Problemas

*No puedo conectarme por SSH al servidor:*
Comprueba tres cosas: (1) ¿Está el servidor funcionando? Pide al agente que lo verifique con `hcloud server list`. (2) ¿Es correcta tu clave SSH? Ejecuta `ssh -v deploy@[ip]` para ver información detallada de la conexión. (3) ¿Bloqueaste accidentalmente el puerto 22 con UFW? Si es así, usa la consola web de Hetzner (VNC) para iniciar sesión y arreglarlo.

*El sitio muestra "502 Bad Gateway":*
Caddy está funcionando pero no puede alcanzar tu aplicación. Pide al agente: _"Conéctate por SSH y comprueba si la aplicación Node.js está ejecutándose en el puerto 3000. Luego revisa los logs de Caddy."_ Causas comunes: la aplicación se colgó, está escuchando en el puerto equivocado, o el Caddyfile usa `localhost` en lugar de `127.0.0.1` (desajuste de IPv6).

*El DNS no resuelve:*
Pide al agente: _"Usa dig para comprobar si el registro A de mi dominio existe y a qué IP apunta."_ Si no devuelve nada, el registro no se creó — haz que el agente llame de nuevo a la API de Cloudflare. Si devuelve la IP incorrecta, actualiza el registro.

*HTTPS no funciona:*
Caddy necesita dos cosas para obtener un certificado: el puerto 443 abierto en el firewall y el dominio resolviendo directamente a la IP del servidor. Pide al agente: _"Conéctate por SSH y comprueba que UFW permite el puerto 443, y verifica con dig que mi dominio apunta aquí."_ Si el registro de Cloudflare está proxificado (nube naranja), ponlo en Solo DNS mientras Caddy obtiene su certificado. También revisa `journalctl -u caddy` para errores de certificado.

*La aplicación muere cuando cierro el terminal:*
Te saltaste el paso de systemd. Pide al agente que cree el archivo de servicio y lo active. Una vez que systemd gestione la aplicación, se ejecuta independientemente de tu sesión SSH.

*La aplicación funciona con la IP pero no con el dominio:*
Probablemente el DNS aún se está propagando. Espera unos minutos e inténtalo de nuevo. O el Caddyfile todavía referencia la IP en lugar del dominio — pide al agente que lo compruebe y lo actualice.

*Errores de "Permission denied" en el servidor:*
Probablemente estás ejecutando comandos como el usuario equivocado, o los archivos pertenecen a root. Pide al agente: _"Conéctate por SSH y comprueba quién es propietario de los archivos de la aplicación, y arregla los permisos para que el usuario deploy pueda ejecutar todo."_

*`hcloud server create` falla con un tipo de servidor desconocido:*
Hetzner retira nombres de plan con el tiempo (el antiguo CX22 ya no existe). Pide al agente que ejecute `hcloud server-type list` y elija el tipo de CPU compartida más barato disponible.


== Referencia Rápida

#table(
  columns: (1fr, 2fr),
  [*Tarea*], [*Prompt o comando*],
  [Listar tipos de servidor actuales], [`hcloud server-type list`],
  [Crear un servidor], [`hcloud server create --name travel-bucket-list --type cx23 --image ubuntu-24.04 --location fsn1 --ssh-key my-key`],
  [El agente se conecta por SSH], [_"Conéctate por SSH a mi servidor en [IP] como [usuario] y [describe lo que necesitas]"_],
  [Asegurar el servidor], [_"Crea un usuario deploy, desactiva el inicio de sesión como root, configura UFW para SSH/HTTP/HTTPS"_],
  [Desplegar la aplicación], [_"Instala Node.js, clona mi repositorio y arranca la aplicación"_],
  [Configurar Caddy], [_"Instala Caddy y configúralo como proxy inverso para mi aplicación"_],
  [Configurar DNS], [_"Usa la API de Cloudflare (token en CLOUDFLARE_API_TOKEN) para crear un registro A apuntando mi dominio a [IP]"_],
  [Crear un servicio systemd], [_"Crea un servicio systemd para mi aplicación que se inicie al arrancar y se reinicie si se cuelga"_],
  [Comprobar estado], [_"Muéstrame el estado de mi aplicación y las últimas 50 líneas de los logs"_],
  [Reiniciar y verificar], [_"Reinicia el servidor"_ — luego visita tu URL],
  [Eliminar el servidor], [`hcloud server delete travel-bucket-list`],
)


== Limpieza

Si quieres mantener tu servidor funcionando, genial — cuesta unos pocos euros al mes y ahora tienes una plataforma para alojar lo que quieras.

Si prefieres desmontarlo todo, pide al agente:

- _"Elimina mi servidor de Hetzner llamado travel-bucket-list usando hcloud. También elimina el registro DNS A de mi dominio via la API de Cloudflare."_

El agente ejecuta `hcloud server delete travel-bucket-list` y llama a la API de Cloudflare para limpiar el registro DNS. (Ambos son destructivos — apruébalos deliberadamente.) Dos comandos, y es como si el servidor nunca hubiera existido. Tu código sigue seguro en GitHub — puedes redesplegar en cualquier momento.

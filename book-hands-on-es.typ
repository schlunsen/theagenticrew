// La Tripulación Agéntica — Guía Práctica (Español)
// DEPRECADO — reemplazado por ediciones específicas por sistema operativo:
//   book-hands-on-es-windows.typ
//   book-hands-on-es-mac.typ
//   book-hands-on-es-linux.typ
// Este archivo se conserva como referencia. Usa las versiones por SO.

// Sello de revisión — se auto-incrementa en despliegue
#let revision = sys.inputs.at("revision", default: "dev")


#set document(
  title: "La Tripulación Agéntica: Guía Práctica",
  author: "Rasmus Bornhøft Schlünsen",
)

#set page(
  paper: "a5",
  margin: (top: 0.8in, bottom: 0.8in, left: 0.75in, right: 0.75in),
  header: context {
    if counter(page).get().first() > 1 {
      set text(size: 9pt, fill: luma(100))
      emph[La Tripulación Agéntica: Guía Práctica]
      h(1fr)
      counter(page).display()
    }
  },
)

#set text(
  font: "New Computer Modern",
  size: 11pt,
  lang: "es",
)

#set par(
  justify: true,
  leading: 0.7em,
)

#set heading(numbering: none)

#show heading.where(level: 1): it => {
  pagebreak(weak: true)
  v(1.5em)
  set text(size: 22pt, weight: "bold")
  it
  v(1em)
}

#show heading.where(level: 2): it => {
  v(1em)
  set text(size: 14pt, weight: "bold")
  it
  v(0.5em)
}

// ─── Portada ───
// "Workshop Blueprint": un plano en azul con un timón acotado y un cajetín. Ver hands-on-cover.typ.

#import "hands-on-cover.typ": hands-on-cover
#hands-on-cover(
  series: "La Tripulación Agéntica",
  title: ("Guía", "Práctica"),
  tagline: "Aprende haciendo: herramientas, repositorios y resultados reales",
  edition: "Todas las plataformas",
  date: "2.ª ed. · Sept. 2026",
  revision: revision,
  labels: (
    project: "PROYECTO", drawing: "PLANO", edition: "EDICIÓN", drawn: "DIBUJADO POR",
    date: "FECHA", rev: "REV", sheet: "HOJA", scale: "ESCALA",
    view: "ALZADO FRONTAL · TIMÓN", spokes: "8 RADIOS EQUIDISTANTES", hub: "CUBO", pcd: "D.P.",
  ),
)

#pagebreak()

// ─── Una Nota Antes de Empezar ───

#heading(outlined: false, numbering: none)[Una Nota Antes de Empezar]

Este libro es el compañero práctico de _La Tripulación Agéntica_. Mientras el libro principal explica las ideas, este las pone en práctica.

Cada capítulo es un ejercicio. Configurarás herramientas reales, trabajarás con repositorios reales y construirás cosas reales, empezando desde cero. Los ejercicios están diseñados para Windows, pero los conceptos funcionan en cualquier plataforma.

No necesitas ser programador. Sí necesitas estar dispuesto a escribir comandos en una terminal y ver qué pasa. Así es como se aprende esto, no leyendo sobre ello, sino haciéndolo.

Al final de este libro, tendrás un entorno de desarrollo funcional, experiencia práctica con Git y GitHub, y la confianza para colaborar en proyectos reales usando agentes de IA como copiloto.

*Sobre esta edición (septiembre de 2026).* Hemos revisado cada ejercicio con las herramientas tal y como funcionan hoy y lo hemos alineado con la segunda edición del libro principal. Hemos corregido los comandos que habían cambiado, Gemini CLI ha dado paso a su sucesor, Antigravity CLI, y los ejercicios practican ahora los hábitos que enseña el libro principal: un archivo de instrucciones para tu agente, un plan antes de construir, permisos en lugar de «permitir todo», y mantener los secretos y el texto no fiable lejos de las llaves de tu agente.

#align(right)[
  _Rasmus Bornhøft Schlünsen_ \
  _Marzo de 2026, revisado en septiembre de 2026_
]

#pagebreak()

// ─── Tabla de Contenidos ───

#outline(title: "Ejercicios", indent: 1.5em, depth: 1)

// ─── Capítulos ───

#include "chapters/hands-on/01-setting-up-your-workstation-es.typ"
#include "chapters/hands-on/02-your-first-pull-request-es.typ"
#include "chapters/hands-on/03-your-first-ai-project-es.typ"

// Capítulos futuros:
// #include "chapters/hands-on/04-pair-programming-with-an-agent-es.typ"
// #include "chapters/hands-on/05-prompts-that-work-es.typ"
// #include "chapters/hands-on/06-building-from-scratch-es.typ"
// #include "chapters/hands-on/07-adding-guardrails-es.typ"
// #include "chapters/hands-on/08-multi-agent-workflows-es.typ"
// #include "chapters/hands-on/09-cicd-with-agents-es.typ"
// #include "chapters/hands-on/10-capstone-project-es.typ"

// ─── Dedicatoria ───

#pagebreak()

#align(center + horizon)[
  #text(size: 14pt, style: "italic")[
    La mejor manera de aprender \
    es publicar algo real. \
    Este libro es tu primer commit.
  ]
]

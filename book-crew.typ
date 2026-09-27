// The Agentic Crew — Crew Member's Guide
// For tech-savvy people who don't write code
// Main entry point — compiles all chapters into a single PDF

// Revision stamp — auto-incremented on deploy
#let revision = sys.inputs.at("revision", default: "dev")

#import "theme.typ": *
#show: book.with(
  revision: revision,
  title: "The Agentic Crew: Crew Member's Guide",
  running: "Crew Member's Guide",
)

// ─── Cover Page ───
// "Sea Chart": the crew guide's own cover — sea-teal, ochre and a drawn compass rose,
// distinct from the main book's midnight-and-brass helm.

#page(margin: 0pt, header: none, footer: none)[
  #let deep = rgb("#06181a")
  #let sea-dk = rgb("#0d2c2f")
  #let sea-mid = rgb("#1b4a4b")
  #let sea = rgb("#74c3b5")
  #let ochre = rgb("#d5954a")
  #let ochre-lt = rgb("#efbf7c")
  #let ochre-dim = rgb("#8e6333")
  #let cream = rgb("#f1eadb")

  // Compass rose drawn with primitives, centred on (cx, cy), radius r.
  #let rose(cx, cy, r) = {
    let pt(a, d) = (cx + d * calc.sin(a), cy - d * calc.cos(a))
    // rhumb lines radiating across the chart, as on an old portolan
    for i in range(32) {
      let a = i * 360deg / 32
      place(line(start: pt(a, r * 1.08), end: pt(a, r * 6), stroke: (paint: sea.transparentize(if calc.rem(i, 4) == 0 { 78% } else { 90% }), thickness: 0.4pt, dash: if calc.rem(i, 2) == 0 { none } else { "dotted" })))
    }
    // rings and degree ticks
    place(dx: cx - r, dy: cy - r, circle(radius: r, stroke: 0.9pt + ochre))
    place(dx: cx - r * 0.93, dy: cy - r * 0.93, circle(radius: r * 0.93, stroke: (paint: ochre.transparentize(30%), thickness: 0.4pt, dash: "dotted")))
    place(dx: cx - r * 0.62, dy: cy - r * 0.62, circle(radius: r * 0.62, stroke: 0.5pt + ochre.transparentize(20%)))
    for i in range(72) {
      let a = i * 5deg
      let inner = if calc.rem(i, 9) == 0 { 0.86 } else { 0.95 }
      place(line(start: pt(a, r * inner), end: pt(a, r), stroke: 0.4pt + ochre.transparentize(15%)))
    }
    // eight minor points, then four major points; each point split light/dark for relief
    let star(n, len, w, off, lt, dk) = {
      for i in range(n) {
        let a = off + i * 360deg / n
        place(polygon(fill: lt, stroke: none, pt(a, len), pt(a - 90deg, w), (cx, cy)))
        place(polygon(fill: dk, stroke: none, pt(a, len), pt(a + 90deg, w), (cx, cy)))
      }
    }
    star(8, r * 0.64, r * 0.1, 22.5deg, sea.transparentize(35%), sea-mid)
    star(4, r * 1.04, r * 0.15, 0deg, ochre-lt, ochre-dim)
    place(dx: cx - r * 0.07, dy: cy - r * 0.07, circle(radius: r * 0.07, fill: cream))
    // north marker
    place(dx: cx - 6pt, dy: cy - r * 1.24, box(width: 12pt, align(center, text(font: display, size: 11pt, fill: ochre-lt)[N])))
  }

  #block(width: 100%, height: 100%, clip: true, fill: gradient.linear(sea-dk, deep, angle: 90deg))[
    // soft light on the water
    #place(dx: -30%, dy: 30%, circle(radius: 260pt, fill: gradient.radial(sea-mid.transparentize(55%), deep.transparentize(100%))))
    #rose(50% * 420pt, 57% * 595pt, 86pt)
    // left sea-green accent strip
    #place(rect(width: 3.5pt, height: 100%, fill: sea))

    #place(dx: 8%, dy: 7.5%)[
      #text(font: sans, size: 7pt, fill: sea, weight: 500, tracking: 3.2pt)[THE AGENTIC CREW · FOR THE WHOLE CREW]
    ]
    #place(dx: 8%, dy: 12.5%)[
      #block(width: 84%)[
        #set par(leading: 0.28em)
        #text(font: display, size: 40pt, weight: 400, fill: cream, tracking: -0.8pt)[Crew Member's] \
        #text(font: display, size: 40pt, weight: 300, style: "italic", fill: ochre-lt, tracking: -0.6pt)[Guide]
      ]
    ]
    #place(dx: 8%, dy: 29.5%)[
      #block(width: 70%, text(font: display, size: 11.5pt, weight: 300, style: "italic", fill: cream.transparentize(22%))[Working with AI agents when you don't write code])
    ]
    #place(dx: 8%, dy: 84%, line(length: 84%, stroke: 0.4pt + ochre-dim))
    #place(dx: 8%, dy: 86.5%, text(font: display, size: 11pt, fill: cream.transparentize(18%))[Rasmus Bornhøft Schlünsen])
    #place(dx: 8%, dy: 93%, text(font: sans, size: 6.5pt, tracking: 1.4pt, fill: ochre)[SECOND EDITION · SEPTEMBER 2026])
    #place(dx: 0%, dy: 93%)[
      #h(1fr)
      #text(font: sans, size: 5.5pt, fill: sea.transparentize(55%))[rev #revision]
      #h(8%)
    ]
  ]
]

#pagebreak()

// ─── A Note Before We Start ───

#heading(outlined: false, numbering: none)[A Note Before We Start]

This book is a companion to _The Agentic Crew: Engineering in the Age of AI Agents_. That book was written for software engineers — people who write code for a living. This one is for everyone else who's good with computers.

You might be a project manager, a designer, a sysadmin, a data analyst, a small business owner, or just the person in your family who fixes the Wi-Fi. You live in spreadsheets, manage inboxes like a general, and have forty-seven browser tabs open right now. But you've never written a line of code — and you don't need to.

AI agents are changing how software gets built. That affects you, whether you're working alongside developers, running a business that depends on software, or just trying to understand what's happening to the world around you. The ideas in this book are real. We've simplified the technical details, but we haven't watered them down.

By the end, you'll understand what agents actually are, how modern software works under the hood, and — most importantly — how to direct an agent to build something real. No programming required.

#align(right)[
  _Rasmus Bornhøft Schlünsen_ \
  _March 2026_
]

#pagebreak()

// ─── A Note on the Second Edition ───

#heading(outlined: false, numbering: none)[A Note on the Second Edition]

The first edition of this guide came out in March 2026. Six months later, the engineering edition got a thorough second edition — and this guide gets one alongside it, because most of what changed matters just as much to you as it does to the engineers.

Chat assistants grew hands: the tools you use in a browser can now plug straight into your email, your documents, and your calendar. Agents that used to need a developer's terminal now run in the cloud and hand back finished work. And a new kind of risk went from curiosity to headline: text that _gives your agent orders_, hidden in the emails, web pages, and documents it reads on your behalf.

Here's what's new in this edition:

- *A new chapter, "Hidden Instructions"* — what prompt injection is, why it matters most to people whose agents read inboxes and documents, and the simple three-question check that keeps you out of trouble.
- *Keeping the workbench tidy* — why long conversations get worse, when to start fresh, and how to write your standing instructions down once instead of repeating them every time.
- *Plan before you build* — asking the agent for a plan, and reading it, is the cheapest review you'll ever do.
- *Agents that work while you're away* — what cloud and background agents are, and why the hard part is now reviewing their work, not getting it done.
- *Getting Started brought up to date*, with the specific tools and prices moved there so the rest of the book ages better.
- *Corrections and a new war story* in "When Things Go Wrong".

What didn't change is the core: clear instructions, the right context, healthy scepticism, and your judgement. If anything, the last six months made those matter more.

#align(right)[
  _Rasmus Bornhøft Schlünsen_ \
  _September 2026_
]

#pagebreak()

// ─── Table of Contents ───

#outline(title: "What's Inside", depth: 1)

// ─── Chapters ───

#part("I", [Setting Sail], [What's changing, and why it matters to you.])
#include "chapters/crew/01-welcome-to-the-crew.typ"
#include "chapters/crew/02-the-ground-is-shifting.typ"
#part("II", [Below Deck], [How modern software works, and what an agent really is.])
#include "chapters/crew/03-whats-under-the-hood.typ"
#include "chapters/crew/04-what-is-an-agent.typ"
#part("III", [Taking the Helm], [Instructions, context, trust, reach — and the risks that come with it.])
#include "chapters/crew/05-how-to-give-good-instructions.typ"
#include "chapters/crew/06-what-the-agent-can-see.typ"
#include "chapters/crew/07-the-trust-gradient.typ"
#include "chapters/crew/08-extending-the-crews-reach.typ"
#include "chapters/crew/08b-hidden-instructions.typ"
#part("IV", [Underway], [Building something real, keeping it safe, and putting agents to work beyond code.])
#include "chapters/crew/11-building-something-real.typ"
#include "chapters/crew/09-the-padlock.typ"
#include "chapters/crew/12-building-something-else.typ"
#part("V", [Hard-Won Lessons], [Mistakes, restraint, your role, and where to go from here.])
#include "chapters/crew/12-when-things-go-wrong.typ"
#include "chapters/crew/13-when-to-do-it-yourself.typ"
#include "chapters/crew/14-being-the-human-in-the-loop.typ"
#include "chapters/crew/15-talking-to-your-tech-team.typ"
#include "chapters/crew/16-keeping-your-finger-on-the-pulse.typ"
#include "chapters/crew/18-getting-started.typ"
#include "chapters/crew/17-final-words.typ"

// ─── Dedication (End) ───

#pagebreak()

#align(center + horizon)[
  #text(size: 14pt, style: "italic")[
    To everyone who was told \
    "you're not technical enough." \
    You are. You always were. \
    Now the tools agree.
  ]
]

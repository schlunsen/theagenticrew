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

#page(margin: 0pt, header: none, footer: none)[
  #let bg = rgb("#0a0e1a")
  #let gold = rgb("#c9a84c")
  #let gold-light = rgb("#e0c878")
  #let gold-dim = rgb("#6b5a2e")
  #let cream = rgb("#f0ead6")
  #let navy = rgb("#1a2040")

  #block(width: 100%, height: 100%, fill: bg)[

    // Subtle gradient overlay at top
    #place(dx: 0%, dy: 0%)[
      #rect(width: 100%, height: 40%, fill: gradient.linear(navy, bg))
    ]

    // Compass rose illustration — centred, large
    #place(dx: 18%, dy: 30%)[
      #block(width: 64%, clip: true)[
        #set image(width: 100%)
        #image("assets/illustrations/crew/cover-compass.jpg")
      ]
    ]

    // Semi-transparent overlay to blend compass into background
    #place(dx: 0%, dy: 30%)[
      #rect(width: 100%, height: 45%, fill: bg.transparentize(40%))
    ]

    // Left gold accent strip
    #place(dx: 0%, dy: 0%)[
      #rect(width: 3.5pt, height: 100%, fill: gold)
    ]

    // Eyebrow
    #place(dx: 8%, dy: 8%)[
      #text(font: sans, size: 7pt, fill: gold, weight: 500, tracking: 3.2pt)[FOR THE WHOLE CREW]
    ]

    // Title
    #place(dx: 8%, dy: 14%)[
      #block(width: 84%)[
        #text(
          size: 38pt,
          weight: 400,
          fill: cream,
          font: display,
          tracking: -0.8pt,
        )[The Agentic #text(style: "italic", weight: 300, fill: gold-light)[Crew]]
      ]
    ]

    // Subtitle — below title
    #place(dx: 8%, dy: 23%)[
      #block(width: 84%)[
        #text(
          font: display,
          size: 12pt,
          weight: 300,
          fill: gold-light.transparentize(15%),
          style: "italic",
        )[Crew Member's Guide]
      ]
    ]

    // Separator
    #place(dx: 8%, dy: 82%)[
      #line(length: 84%, stroke: 0.4pt + gold-dim)
    ]

    // Author
    #place(dx: 8%, dy: 86%)[
      #text(
        font: display,
        size: 11pt,
        fill: cream.transparentize(20%),
      )[Rasmus Bornhøft Schlünsen]
    ]

    // Date & revision
    #place(dx: 8%, dy: 93%)[
      #text(font: sans, size: 6.5pt, tracking: 1.4pt, fill: gold)[SECOND EDITION · SEPTEMBER 2026]
      #h(1fr)
    ]
    #place(dx: 0%, dy: 93%)[
      #h(1fr)
      #text(font: sans, size: 5.5pt, fill: gold-dim.transparentize(30%))[rev #revision]
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

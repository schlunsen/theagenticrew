# YouTube: @theagenticcrew

Art lives in `video/build/youtube/` and is rendered from `video/riso/src/scenes/brand.js`, so it re-prints in the series inks whenever the characters change.

| file | where it goes | spec |
|---|---|---|
| `profile-skipper-800.png` | Customize channel → Branding → Picture (recommended) | 800×800; YouTube crops a circle |
| `profile-helm-800.png` | alternative picture: the helm from the book cover | 800×800 |
| `banner-2560x1440.jpg` | Branding → Banner image | 2560×1440; the title sits in the 1546×423 safe area |
| `thumb-ch01-1280x720.jpg`, `thumb-ch02-1280x720.jpg` | video thumbnails | 1280×720, under 2 MB |

Watermark (Branding → Video watermark): `profile-helm-800.png` works as a small corner mark.

## Channel

**Name:** The Agentic Crew
**Handle:** @theagenticcrew

**Description** (Customize channel → Basic info):

> Short, printed-looking explainers from *The Agentic Crew*, a free field guide to engineering with AI agents by Rasmus Bornhøft Schlünsen.
>
> One film per chapter, two to three minutes each. Each one covers what the chapter argues, the story behind it, and what to do with it on Monday. The films cover context, guardrails, git, tests, conventions, memory, MCP, the agent attack surface, multi-agent orchestration, agents in CI, building your own agents, and knowing when not to use them.
>
> Read the whole book free (PDF and EPUB, in English, Danish, Spanish and Catalan): https://theagenticcrew.com

**Links:**
- The book (free): https://theagenticcrew.com
- GitHub: https://github.com/schlunsen
- LinkedIn: https://www.linkedin.com/in/rasmusbs/
- Buy me a coffee: https://buymeacoffee.com/schlunsen

**Keywords** (Settings → Channel): `agentic engineering, AI agents, Claude Code, coding agents, software engineering, context engineering, MCP, prompt injection, AI for developers, The Agentic Crew`

**Playlists:** add one per Part, in book order, plus one "All chapter intros" playlist:
- Part I, Setting Sail (Ch 1–2)
- Part II, Rigging the Ship (Ch 3–8)
- Part III, Beyond the Harbour (Ch 9–12)
- Part IV, Running a Fleet (Ch 13–15)
- Part V, Hard-Won Lessons (Ch 16–19)

**Channel trailer:** the Chapter 1 intro. Its cold open ("made by AI agents, steered by one human") is the channel's hook. That trailer could be cut from the hooks of Ch 1, 4, 10 and 16.

## Video: Chapter 1 · Introduction

**File:** `video/build/ch01/ch01-introduction.mp4` (1:45) · **Thumbnail:** `thumb-ch01-1280x720.jpg`
**Narration:** AI voice (MiniMax Speech 2.6 HD, `English_magnetic_voiced_man`), the same narrator as the whole series.
**Title:** `This video was made by AI agents. One engineer steered it. · The Agentic Crew, Ch. 1`
Alternative: `AI agents made this video. Here's what that means for engineers.`

**Description:**

> Everything in this video was made by AI agents: the script, the voice, the animation and the music. Rasmus Bornhøft Schlünsen, who wrote the book this channel is based on, steered every step. That's what engineering is starting to look like, and working well with agents is a skill you can learn.
>
> The Agentic Crew is a free book about engineering with AI agents. This channel turns each chapter into a short film.
>
> 0:00 Made by agents, steered by a human
> 0:20 The loop is changing
> 0:38 It's a skill
> 0:56 Nobody has it figured out
> 1:12 The series
> 1:29 Next: what an agent actually is
>
> 📖 Read the whole book free: https://theagenticcrew.com
> ▶ Next: Chapter 2, What Is an Agent?
>
> How this was made: the script was drafted by an AI agent from the book and edited by the author. The narration is an AI voice. The animation was written as code by an agent using riso-motion (built on ClaudeAnimationBase by John Heibel) and reviewed frame by frame. Music: "Hazelwood".

**Tags:** `AI agents, made with AI, agentic engineering, Claude Code, coding agents, software engineering, AI for developers, The Agentic Crew`

**Settings:** Category Science & Technology · Not made for kids · Language English · "Altered or synthetic content": **yes** · End screen over the last 5 s (1:40–1:45) → Ch 2 + Subscribe. Pin a comment: "Everything here was steered by a human, the book's author. Ask anything about how it was made 👇"

## Video: Chapter 2 · What Is an Agent?

**File:** `video/build/ch02/ch02-what-is-an-agent.mp4` (2:36) · **Thumbnail:** `thumb-ch02-1280x720.jpg`
**Narration:** AI voice (MiniMax Speech 2.6 HD, `English_magnetic_voiced_man`).
**Title:** `What is an AI agent, really? (The model only asks) · The Agentic Crew, Ch. 2`

**Description:**

> "Agent" gets stuck on everything, from chatbots to systems that deploy to production. This chapter pins it down. It covers the spectrum from autocomplete to autonomous agents, the three things that make software agentic, and the four parts every coding agent is built from. It shows how tool calling really works (the model never executes anything) and why the harness matters as much as the model. It ends with the failure modes to expect and a mental model for working with agents.
>
> 0:00 The Agentic Crew
> 0:04 What "agent" means
> 0:16 The spectrum: autocomplete to autonomous
> 0:38 Planning, tool use, iteration
> 0:56 Model, tools, loop, environment
> 1:13 How tool calling really works
> 1:30 The harness
> 1:54 How agents fail
> 2:09 The mental model: Rain Man
>
> 📖 Read Chapter 2 free: https://theagenticcrew.com
> ▶ Next: Chapter 3, Context
>
> Narration: AI voice. Animation: riso-motion (built on ClaudeAnimationBase by John Heibel). Music: "Hazelwood".

**Tags:** `what is an AI agent, AI agents explained, agent harness, tool calling, Claude Code, Codex, Cursor, agentic engineering, The Agentic Crew`

**Settings:** as Chapter 1; "Altered or synthetic content": **yes** · End screen 2:31–2:36 → Ch 3 (when live) + Subscribe.

The chapter times come from `video/build/<ch>/timing.json` (beat starts). Regenerate them if a beat is re-voiced.

## Uploading from here later (optional)

Direct uploads need an OAuth client, not an API key. In Google Cloud: create a project → enable **YouTube Data API v3** → OAuth consent screen (External, add yourself as a test user) → Credentials → OAuth client ID (**Desktop app**) → download `client_secret.json`. Keep it outside the repo.

Caveat: YouTube locks uploads from an **unverified** API project to **Private** until the project passes Google's audit. Until then, upload by hand, or let the script upload as private and flip each video to public yourself (after the audit).

#import "_os-helpers.typ": *
= Captain's Log

You made it.

That's not a figure of speech. There were a dozen moments across these chapters where you could have stopped. When the terminal threw an error you didn't understand. When Git asked you to resolve a merge conflict and the syntax looked like hieroglyphics. When the deploy failed at midnight and the logs were a wall of red. You didn't stop. You're here.

In Chapter 1, you opened a terminal for the first time. Some of you didn't know what a terminal _was_. Now you've pair-programmed with an AI agent, shipped a SaaS product to a live server, pentested it for vulnerabilities, automated a CI/CD pipeline, and read a professional security report that autonomous agents wrote for you. That's not a small distance. That's a transformation.


== Look Astern

Think about the person who opened Chapter 1. They didn't have Git installed. They'd never typed `cd` into a black rectangle and watched something happen. The word "repository" meant a library, not a place where code lives. Deployment was something other people did — people with computer science degrees and years of experience.

That person and you share a name. But you are not the same person. Somewhere between your first commit and your first deploy, between reading your first diff and writing your first pull request, something shifted. You stopped being someone who _uses_ software and became someone who _makes_ it. Not because you memorized commands — you didn't need to, the agents handled that — but because you learned to think in systems, to describe intent clearly, and to verify what comes back.

That shift doesn't reverse. You can't un-learn how to read a stack trace. You can't un-see the structure behind every web application you use. The lens is permanent.


== The Ship You Built

Every sailor knows: the ship matters more than any single voyage.

Your ship is your development environment — the collection of tools, skills, and instincts you've assembled across these chapters. Let's name the planks:

- *The terminal.* Your helm. You navigate file systems, run commands, pipe output, and read logs. It's no longer a black rectangle. It's your primary interface with every machine you'll ever touch.

- *Git and GitHub.* Your logbook and your harbour. You track changes, branch experiments, merge work, review code, and collaborate with others — human or AI. Every project you'll ever build starts with `git init`.

- *AI agents.* Your crew. You know how to brief them, how to ask for a plan before they build, how to constrain them with permissions instead of approving everything, how to read their output critically, and how to iterate when the first attempt isn't right. You understand that they're powerful and fallible in equal measure — and that anything they read, from a web page to an issue, can try to steer them.

- *Deployment.* Your sea legs. You've put code on a real server with a real domain. You know what DNS is, what HTTPS does, what a reverse proxy handles. The gap between "it works on my machine" and "it works for everyone" is one you've crossed.

- *Security awareness.* Your lookout. You know what SQL injection is, why input sanitisation matters, what happens when authentication is poorly implemented, and why secrets live in environment variables — never in a prompt or a repository. You don't need to be a security expert — you need to know enough to ask the right questions.

- *The review habit.* Your compass. You never ship what you haven't read. You never trust output you haven't verified. This single habit — skeptical trust — is what separates someone who uses AI agents effectively from someone who gets burned by them.

These tools aren't specific to any one project. They travel with you. The next thing you build — whatever it is — starts on this ship.


== One Last Exercise: Write Your Captain's Orders

Every chapter in this book gave you instructions to follow. This final exercise inverts the pattern. You're going to write the instructions that an agent follows.

The artifact is an _agent instruction file_ — a plain Markdown document that lives in the root of a repository and tells every agent that works there what it needs to know. What the project is. How to build and test it. What conventions to follow. What boundaries to respect.

Two filenames matter. `AGENTS.md` is the cross-tool standard — it's what non-Claude agents read: Antigravity CLI, Codex, Cursor, GitHub Copilot and many others. `CLAUDE.md` is Claude Code's own file. You don't want to maintain the same instructions twice, so keep _one source of truth_: write the real content in `AGENTS.md`, and make `CLAUDE.md` a one-line pointer to it. The Convention Over Configuration chapter of the main book explains the reasoning in depth.

This is the beautiful symmetry of the book: in Chapter 1, you followed instructions someone else wrote. In Chapter 10, you write them.

=== Step 1: Pick a Project

Choose something you care about. It can be:
- The Travel Bucket List from Chapter 4
- The SaaS you built in Chapter 9
- A new idea you've been thinking about
- An open-source project you want to contribute to
- A simple personal tool — a recipe organiser, a workout tracker, a reading log

If you're starting fresh, create a new repository:

```
mkdir my-project && cd my-project
git init
```

If you're using an existing project, `cd` into its folder instead. If it already has a `CLAUDE.md` or `AGENTS.md` (the Chapter 9 exercise creates one), you're improving that file rather than starting from zero.

=== Step 2: Write Your AGENTS.md

Create `AGENTS.md` at the root of your project in your editor. You can also let the agent draft it: in Claude Code, the `/init` command reads your project and writes a starting `CLAUDE.md` — move its content into `AGENTS.md` and leave the pointer described below. Treat any draft as a first pass — cut what's obvious, fix what's wrong, and add what only you know.

A good instruction file answers five questions:

*What is this project?* One or two sentences. Not a marketing pitch — a clear description of what it does, the tech stack, and where it runs.

*How do I build, run, and test it?* The exact commands, not "see the README". Agents take these literally: if the file says `npm test`, the agent runs `npm test`.

*How is it organised, and what are the conventions?* Where things live, how files are named, the style you follow, the commit message format. Be specific. The agent will follow what you write.

*What are the boundaries?* What should the agent _not_ do? Maybe it shouldn't change the database schema without asking. Maybe it shouldn't add dependencies. Maybe certain files are hand-maintained.

*Where are the traps?* The step that must happen before another, the flaky test, the file that looks unused but isn't. Every project has these — write them down.

Just as important is what _doesn't_ belong. The file is loaded into the agent's context at the start of every session, so every line costs something on every task. Keep it short — a page, not a manual. Don't paste in long documentation; link to it (`docs/deploy.md`) and let the agent read it when a task needs it. Don't restate what a linter or formatter already enforces. And never put secrets in it — no API keys, passwords, or tokens. This file gets committed and pushed.

Here's an example:

```markdown
# AGENTS.md

## Project
A personal reading log: HTML, CSS, and vanilla JavaScript.
Data is stored in localStorage. No backend, no build step.

## Commands
- Run locally: `npx serve .` then open http://localhost:3000
- Tests: `npm test` (Playwright, see tests/)

## Structure and conventions
- All JavaScript in `src/app.js` — no splitting into modules yet
- CSS follows BEM naming: `.block__element--modifier`
- Commit messages: imperative mood, under 72 characters

## Boundaries
- Do not add a build system (no webpack, no vite, no bundler)
- Do not convert to TypeScript — this stays vanilla JS
- Do not edit `data/sample-books.json` (test fixture)
- Ask before adding any new dependency

## Pitfalls
- Clear localStorage between manual test runs, or old data
  hides bugs in the "first visit" flow

## Goals
- Simple enough that a beginner could read every line
- Accessible: semantic HTML, ARIA labels, keyboard navigation
- Works offline — no network requests required
```

// v2-verify: `npx serve .` default port (3000) — serve's default is 3000 at time of writing.

Now create `CLAUDE.md` next to it, with a single line:

```markdown
See @AGENTS.md for project instructions.
```

The `@` is an import: Claude Code pulls the other file in at the start of every session. Recent versions of Claude Code also read an `AGENTS.md` on their own when a project has no `CLAUDE.md` at all, but the pointer works on every version and gives you a place for anything only Claude Code needs — put that below the import line, and keep the shared rules in `AGENTS.md`. (You may see advice to symlink `CLAUDE.md` to `AGENTS.md` instead. Skip it if anyone uses the project on Windows, where symlinks in Git are unreliable; the import works everywhere.)

#quote(block: true)[
  *Using Antigravity CLI?* It reads `AGENTS.md` at the start of a session, so it needs no pointer. It also reads a `GEMINI.md` if one exists; don't create one unless you need Antigravity-only instructions, and keep the shared rules in `AGENTS.md`.
]

// v2-verify: Antigravity CLI instruction-file loading (AGENTS.md vs GEMINI.md precedence) — official best-practices page only says "GEMINI.md or AGENTS.md".

=== Step 3: Commit and Push

```
git add AGENTS.md CLAUDE.md
git commit -m "Add agent instructions (AGENTS.md, CLAUDE.md pointer)"
git push
```

(If this is a brand-new repository with no GitHub remote yet, skip `git push` or create one first with `gh repo create`, as you did in earlier chapters.)

Your instruction file lives in version control, like code. When a convention changes, change the file in the same commit. An outdated instruction file is worse than none, because the agent trusts it.

=== Step 4: Test It

Start a _fresh_ agent session in the project directory — an old session won't have read the new file. First, check that it landed:

- _"Before we start: summarise the project instructions you're working under."_

If the summary doesn't mention your conventions and boundaries, the file isn't being picked up — check the filename and that you started the agent from the project root. Then give it a real task:

- _"Add a feature that lets me mark a book as finished and track the completion date."_

Watch what happens, then read the diff. Did it follow your conventions — vanilla JS, BEM naming, no build step? Did it respect your boundaries — no new dependencies, no TypeScript? Did it run the test command you listed?

When it gets something wrong, don't just correct it in the chat. A correction in the chat lasts one session; a correction in `AGENTS.md` lasts for every session after it. Fix the file, commit it, and start a fresh session to try again.

=== Step 5: Promote Rules That Matter

Not everything belongs in the instruction file. The main book's Convention Over Configuration chapter describes a simple progression:

- *A convention the agent keeps getting wrong* goes into `AGENTS.md`.
- *A procedure that needs more than a line* — how to add a new data field, how to cut a release — becomes a _skill_: a folder with a `SKILL.md` file that the agent loads only when a task needs it. In Claude Code, project skills live in `.claude/skills/<skill-name>/SKILL.md`.
- *A rule that must never be broken* becomes something the agent can't talk its way around: a deny rule in the permission settings, or a _hook_ — a script the tool runs on every matching action, whatever the model thinks.

The instruction file is advice; the agent reads it and _usually_ complies. For the one file in the example that must never change, make it a rule instead. In Claude Code, add `.claude/settings.json` to the project:

```json
{
  "permissions": {
    "deny": [
      "Edit(./data/sample-books.json)",
      "Read(./.env)"
    ]
  }
}
```

Now Claude Code's file tools can't edit the fixture or read your secrets file, however convinced the agent is that it should. (A deny rule blocks the obvious path, not every path — a shell command could still print the file — which is why secrets are best kept out of the project folder the agent works in whenever you can.) Commit this file too — it's part of how the project is run. For rules that need logic (block edits to anything under `.github/workflows/`, run the tests before the agent may say it's done), write a hook; the Guardrails, Trust, and Sandboxes chapter of the main book shows how.

You are no longer following instructions. You are writing them — and deciding which ones are advice and which ones are law.

#quote(block: true)[
  *The meta-lesson.* Every effective use of AI agents comes down to one skill: writing clear instructions for a non-human collaborator. An instruction file is the purest expression of that skill. Get good at writing these, and every agent you work with — today and in the future — gets better.
]



== Charts for Open Water

The book ends, but the water doesn't. Here are the charts worth keeping on your nav table:

+ *The Agentic Crew* — The main book this hands-on guide accompanies. It covers the deeper concepts: how agents reason, when they fail, how trust and verification work at scale, and where the technology is heading. If this book taught you to sail, that one teaches you to read the weather.

+ *Claude Developer Platform Documentation* (#link("https://platform.claude.com/docs")[platform.claude.com/docs]) — The official reference for Claude's capabilities, API, and best practices. When you want to understand _why_ your agent behaves a certain way, start here.

+ *Claude Code Documentation* (#link("https://code.claude.com/docs")[code.claude.com/docs]) — Specifically for the tool you've been using throughout this book. Command reference, permission settings, skills, hooks, and guidance on `CLAUDE.md` and `AGENTS.md`.

+ *AGENTS.md* (#link("https://agents.md")[agents.md]) — The home of the cross-tool instruction file format, with examples and the list of agents that read it.

+ *OWASP Top Ten* (#link("https://owasp.org/www-project-top-ten/")[owasp.org]) — The definitive list of web application security risks. You met several of them in Chapter 6. Bookmark this and revisit it every time you build something with a backend.

+ *GitHub's "Good First Issues"* (#link("https://github.com/topics/good-first-issue")[github.com/topics/good-first-issue]) — Open-source projects that welcome new contributors. Pick one, read the project's `AGENTS.md` or contributing guide (or write your own instruction file for your fork), and submit your first PR to someone else's project. Agent-assisted open source contribution is a superpower.

+ *OverTheWire Wargames* (#link("https://overthewire.org/wargames/")[overthewire.org]) — Free, progressive security challenges that start from the absolute basics. If Chapter 6 sparked your interest in security, this is where you sharpen those skills.

+ *The Agentic Crew Community* (#link("https://github.com/schlunsen/the-agentic-crew/discussions")[GitHub Discussions]) — The book's own community. Ask questions, share what you've built, post your instruction files, and help others who are where you were in Chapter 1.


== Signal Flags: A Captain's Checklist

Everything you accomplished, from first command to final chapter. Check them off.

- ☐ I can open a terminal and navigate the file system
- ☐ I installed and configured an AI coding agent
- ☐ I created my first Git repository
- ☐ I made my first commit
- ☐ I pushed code to GitHub
- ☐ I opened and merged a pull request
- ☐ I built a web application with an AI agent as my pair programmer
- ☐ I understand HTML, CSS, and JavaScript well enough to read and modify code
- ☐ I deployed an application to a live server
- ☐ I configured a domain, HTTPS, and a reverse proxy
- ☐ I ran a security scan against my own application
- ☐ I can read a vulnerability report and understand the findings
- ☐ I know what SQL injection, XSS, and authentication bypass are
- ☐ I understand the agent collaboration loop: describe, review, iterate
- ☐ I wrote an `AGENTS.md` (with a `CLAUDE.md` pointer) that shapes how agents work in my project
- ☐ I turned a must-never-happen rule into a permission rule or hook, not just a sentence
- ☐ I can start a new project from scratch, with confidence

If you checked every box, you've done something most people haven't. Not because the boxes are individually hard — but because the distance from the first to the last is enormous, and you covered it.


== The Crew is Hiring

This book is open source. It lives in a Git repository — the same kind you've been working with since Chapter 2. And it needs the same thing every open-source project needs: contributors.

Here's how you can help:

- *File issues.* Found a typo? An instruction that didn't work on your operating system? A step that was confusing? Open an issue. Every issue makes the next reader's experience better.

- *Submit pull requests.* Fix that typo yourself. Improve an explanation. Translate a chapter. You have the skills now — you've been making PRs since Chapter 2.

- *Share your instruction files.* Post your `AGENTS.md` files in the GitHub Discussions. Every example helps someone else understand how to write better agent instructions.

- *Help a Chapter 1 reader.* Someone, right now, is opening a terminal for the first time and feeling exactly the way you did. Answer their question. Review their PR. Be the crew member you wished you'd had.

You are no longer a passenger. You are part of the crew.


== The Maiden Voyage Challenge

Here is your final assignment — not from this book, but from yourself.

Within the next seven days, build and deploy one small thing that didn't exist before. It doesn't have to be impressive. It doesn't have to be original. It just has to be _yours_ — conceived, built, and shipped by you and your agent crew.

A personal portfolio page. A tool that solves a small annoyance in your day. A fun experiment. A gift for someone.

When it's live, share it on the book's GitHub repository. Tag your post with `maiden-voyage`. We're building a living gallery of reader projects — proof that these chapters produce real ships, not just exercises.

The only rule: it has to be deployed. Not "working on my laptop." Live. On the internet. With a URL someone can visit.

You know how. You've done it before. Now do it for yourself.


== Fair Winds

I wrote this book because I believe the most important technology shift of this decade shouldn't be reserved for people who already know how to code. The tools are too powerful, and the barrier to entry is now too low, for that to be acceptable.

You proved the thesis. You started with nothing but curiosity and a laptop, and you built real things — things that run on servers, that other people can use, that hold up under scrutiny. You did it alongside AI agents, not behind them. You stayed in the captain's chair the whole time.

The chapters end here. The voyage doesn't. Every project you start from this point forward is a new heading on open water, with a ship you built and a crew you know how to command.

Go build something.

#import "_os-helpers.typ": *
= Pair Programming with an Agent

In the last three chapters you set up your tools, submitted a pull request, and generated AI content. Now you're going to build something from scratch — a complete web application — by describing what you want to an AI coding agent.

You won't write the code yourself. You'll describe what you want, review what the agent builds, and iterate until it's right. This is pair programming with an AI: you bring the vision, the agent brings the implementation.

== What You'll Build

A *Travel Bucket List* — a personal web app where you can add destinations you want to visit, browse them as visual cards, edit the details, mark places as visited, and remove entries you've changed your mind about. The data lives in your browser's local storage, so nothing is sent to a server and nothing disappears when you close the tab.

By the end of this chapter, you'll have:

+ Created a project from scratch using only natural-language prompts
+ Written a short instruction file that tells the agent your project's house rules
+ Agreed a plan with the agent before it wrote any code
+ Built a working app with Create, Read, Update, and Delete operations
+ Used localStorage for persistence — no database, no server
+ Styled it into something you'd actually want to look at
+ Reviewed every change as a diff before keeping it
+ Pushed it to GitHub

Every line of HTML, CSS, and JavaScript will be written by the agent. Your job is to describe, review, and refine.

== What You'll Need

From the previous chapters:
- A terminal (open and ready)
- Git installed and configured
- GitHub CLI authenticated
- Claude Code or Antigravity CLI ready in your terminal

No new tools for this chapter. Everything runs in a browser — no build step, no dependencies.

== Create the Project

Start by creating an empty project folder and initialising Git:

```
mkdir travel-bucket-list
cd travel-bucket-list
git init
```

Now open your AI assistant from inside the project directory:

```
claude --permission-mode manual
```

Or:

```
agy
```

== Write the House Rules

Before you ask for any code, tell the agent how this project works. Agents start every session with a blank memory, so the rules go in a file the agent reads automatically at the start of each session: `AGENTS.md`. It's the cross-tool standard for agent instructions. Ask:

- _"Create a short AGENTS.md for this project with these house rules: the app is a single index.html with embedded CSS and JavaScript; no frameworks, no build step, and no external libraries or CDN links; data is stored in localStorage; it must work when index.html is opened directly from disk; keep each change focused on what I asked for and don't redesign things I didn't mention; don't commit to Git unless I ask."_

Read the file it creates. It should be a handful of lines you agree with — if not, say what to change. This is the same idea the Convention over Configuration chapter of the main book describes for real teams, at the size of a weekend project.

Both Claude Code and Antigravity CLI read `AGENTS.md` automatically, so one file serves either tool. (Claude Code also reads a `CLAUDE.md`, and if it finds one it uses that instead — you don't need one here.)

// v2-verify: Claude Code loads AGENTS.md when no CLAUDE.md exists (code.claude.com/docs/en/memory); Antigravity CLI reads AGENTS.md as a workspace rule (antigravity.google/docs/rules).

Instruction files are loaded when a session starts, so exit the agent (type `/exit`) and start it again the same way as before. You're now in a fresh session that already knows the rules.

Finally, open a *second terminal window* and go to the same folder:

```
cd travel-bucket-list
```

Keep this one for Git commands while the agent works in the first. You're ready to start building.

== Describe the App

Give the agent a clear picture of what you want. Don't worry about technical details — describe it like you're explaining to a friend what the app should look like and do.

But don't let it start typing straight away. Ask for a plan first. Both Claude Code and Antigravity CLI have a *plan mode*, where the agent investigates and proposes a plan but doesn't change files until you approve: press *Shift+Tab* until the status bar says plan mode. (If your tool doesn't have one, start your prompt with _"Don't write any code yet — propose a plan first."_)

Try this as your opening prompt:

- _"Build me a Travel Bucket List app in a single index.html file with embedded CSS and JavaScript. It should let me add destinations I want to visit, show them as visual cards in a grid, edit any destination, mark it as visited, and delete it. Store everything in localStorage so the data persists between page refreshes. Make it look beautiful — I want to actually enjoy using this."_

The agent answers with a plan instead of code: what fields each destination has, how the page is laid out, how the data is saved. Read it. This is the cheapest moment to change your mind. If you want a field it didn't include — a country, a best season to visit — say so now: _"Add a 'best season' field to the plan."_

When the plan looks right, approve it. If the agent offers to accept its edits automatically, choose the option where you still approve each edit yourself (in Claude Code: *Yes, manually approve edits*).

The agent will generate an `index.html` file. This single file contains everything — the structure (HTML), the styling (CSS), and the behaviour (JavaScript). No frameworks, no build tools, no complexity.

#quote(block: true)[
  *Why a single file?* For a small personal app, one file is the simplest thing that works. You can open it in any browser, email it to a friend, or host it anywhere. The agent could split it into separate files later if the project grows — but right now, simplicity wins.
]

== Review What the Agent Built

Before opening the browser, ask the agent to explain what it created:

- _"Walk me through the code. How are destinations stored? How does adding a new one work? How does the delete button know which card to remove?"_

You don't need to understand every line, but you should understand the shape of it:

- *HTML* defines the form and the card container
- *CSS* makes it look good — the grid layout, the card styling, the colours
- *JavaScript* handles the logic — saving to localStorage, rendering cards, handling button clicks

This is the most important habit in agent-assisted development: *always review before you run*. The agent is fast, but it's not infallible. A quick explanation catches misunderstandings early.

== Open It in Your Browser

In your second terminal:

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

You should see your app — a form at the top and an empty card area below. Try adding your first destination:

+ Type a destination name (e.g., "Kyoto, Japan")
+ Add a short reason ("Cherry blossoms in spring")
+ Pick a priority
+ Click *Add*

A card should appear. Add two or three more. Refresh the page — they should still be there, because they're saved in localStorage.

== Save a Checkpoint

It works — so save it before you change anything else. In your second terminal:

```
git add -A
git commit -m "First working version of travel bucket list"
```

This commit is your safety net. From now on, every change the agent makes shows up as a _diff_ against it, and any change you don't like can be thrown away in one command.

== The CRUD Cycle

Your app now supports all four operations. Here's what each one means in practice:

#table(
  columns: (auto, 1fr, 1fr),
  [*Operation*], [*What it means*], [*In your app*],
  [*Create*], [Add a new entry], [Fill out the form and click Add],
  [*Read*], [View existing entries], [The card grid shows all destinations],
  [*Update*], [Edit an existing entry], [Click Edit on a card, change the details, save],
  [*Delete*], [Remove an entry], [Click Delete on a card — it's gone],
)

These four operations are the foundation of almost every application you've ever used — email, social media, note-taking apps, online shops. The data model changes, but the pattern is always the same: create, read, update, delete.

== Iterate and Improve

The first version is a starting point. Now make it yours. This is where pair programming shines — you describe what you want to change, the agent makes it happen, you review, repeat.

After each change, look at what actually changed before you keep it. In your second terminal:

```
git diff
```

Lines starting with `-` were removed; lines starting with `+` were added. (If the output fills the screen, use the arrow keys to scroll and press `q` to quit.) Ask yourself: is this roughly the size of change I expected? Did it touch anything I didn't ask about? Then try it in the browser. If you like it, keep it:

```
git commit -am "Add search bar"
```

If you don't, throw it away and go back to your last checkpoint:

```
git restore index.html
```

One change, one review, one commit. Small steps make it easy to see what the agent did — and easy to undo.

Here are prompts to try. Pick the ones that appeal to you:

=== Make it more visual

- _"Add an image URL field to each destination. When a card has an image, show it as the card's background. When it doesn't, use a nice gradient based on the priority level."_

- _"Add a colour-coded badge to each card — green for 'must go', amber for 'would love', grey for 'someday'."_

=== Add filtering and search

- _"Add a search bar that filters the cards as I type — matching on destination name or reason."_

- _"Add filter buttons at the top: All, Must Go, Would Love, Someday, Visited. Clicking one shows only matching cards."_

=== Make the visited toggle satisfying

- _"When I mark a destination as visited, animate the card — maybe a subtle confetti burst or a stamp overlay that says 'BEEN THERE'. Make it feel like an achievement."_

=== Add a stats bar

- _"Add a summary bar at the top showing: total destinations, how many visited, how many remaining. Update it live as I add, remove, or mark destinations."_

=== Improve the form

- _"Add a country dropdown (or auto-suggest) to the form, and group cards by country in the grid."_

- _"Make the form collapsible so I can hide it when I'm just browsing."_

#quote(block: true)[
  *Go off-script.* These prompts are suggestions, not assignments. If you want a dark mode toggle, a map view, or a "random destination" button — ask for it. The agent will figure out how to build it. The point is to practise the back-and-forth: describe, review, refine.
]

== When Something Goes Wrong

It will. The agent might generate code with a bug, or build something that doesn't quite match what you described. That's normal — and it's a skill to practise, not a failure.

*If a button doesn't work:*
- _"The Delete button isn't removing the card. Check the event listener — is it attached correctly? Fix it and explain what was wrong."_

*If the layout looks broken:*
- _"The cards are overlapping on mobile. Make the grid responsive — single column on small screens, two columns on medium, three on large."_

*If the data disappears:*
- _"My destinations vanish when I refresh. Check whether the save-to-localStorage function is actually being called after each change."_

*If the agent changed something you didn't ask for:*
`git diff` is where you'll spot it. Either throw the whole change away with `git restore index.html` and ask again more precisely, or:
- _"You changed the card layout but I only asked you to add the image field. Revert the layout changes and only add the image feature."_

The pattern is always the same: describe the problem, ask the agent to diagnose it, review the fix. This is debugging by conversation — and it's exactly how professional developers work with AI agents.

#quote(block: true)[
  *Long conversation, confused agent?* After many rounds of changes, an agent can start mixing up old and new instructions. Commit what works, exit, and start a fresh session. Your house rules in `AGENTS.md` and your code are all it needs to carry on. The Context chapter of the main book explains why this helps.
]

== Understand What Was Built

Before you commit, take a moment to understand the key concepts the agent used. Ask:

- _"Explain how localStorage works in this app. Where is data saved, and what happens if I clear my browser data?"_

- _"What is the DOM? How does the JavaScript update what I see on screen when I add a new card?"_

- _"Walk me through what happens, step by step, from the moment I click the Add button to the moment the new card appears."_

You don't need to memorise the answers. But understanding the flow — form input → JavaScript function → localStorage → DOM update — gives you vocabulary for the next time you build something.

#table(
  columns: (1fr, 1fr),
  [*Concept*], [*What it means*],
  [*HTML*], [The structure — what elements exist on the page],
  [*CSS*], [The style — how those elements look],
  [*JavaScript*], [The behaviour — what happens when you interact],
  [*localStorage*], [Browser storage that persists between visits],
  [*DOM*], [The live representation of the page that JavaScript can change],
  [*Event listener*], [Code that runs when something happens (click, submit, keypress)],
  [*CRUD*], [Create, Read, Update, Delete — the four basic data operations],
)

== Commit and Push

Once you're happy with your app, save it to GitHub. First make sure everything is committed. In your second terminal:

```
git status
```

If it lists changed files, commit them (`git add -A`, then `git commit -m "Finish travel bucket list"`). Then look at the history you built up:

```
git log --oneline
```

Each line is one reviewed step. Now create a repository on GitHub and push:

```
gh repo create travel-bucket-list --public --source=. --remote=origin --push
```

Verify it's there:

```
gh repo view --web
```

`--public` means anyone can see the code. Use `--private` instead if you'd rather keep it to yourself. You could also ask the agent to do these steps for you — _"Create a public GitHub repository called travel-bucket-list with gh and push to it"_ — and approve each command as it asks.

Your app is now on GitHub. Anyone with the link can clone it and open `index.html` in their browser.

== What Just Happened

You built a complete web application without writing a single line of code yourself. You wrote down the house rules, agreed a plan, reviewed every change the agent produced, and iterated until it was right.

#table(
  columns: (1fr, 1fr),
  [*You brought*], [*The agent brought*],
  [A clear idea — "travel bucket list"], [The HTML, CSS, and JavaScript],
  [House rules and a plan you approved], [Code that follows them],
  [Opinions on how it should look], [Card layouts, grids, and colour schemes],
  [Bug reports when something broke], [Diagnosis and fixes],
  [The decision to ship it], [Git commands and GitHub setup],
)

This is the core loop of agent-assisted development:

+ *Describe* what you want — and agree a plan before any code is written
+ *Review* what the agent builds — as a diff, before you keep it
+ *Iterate* until it's right, one small committed step at a time
+ *Understand* enough to stay in control

You don't need to know how to write JavaScript to build a JavaScript app. You need to know what you want, how to check whether you got it, and how to ask for changes. That's a different skill — and it's the one this book is teaching.

== Troubleshooting

*The page is blank when I open index.html:*
Open your browser's developer tools (F12 or right-click → Inspect) and check the Console tab. Red errors tell you what went wrong. Copy the error message and paste it to the agent: _"I'm getting this error in the console: [paste error]. Fix it."_

*Cards appear but disappear on refresh:*
The localStorage save function isn't being called. Ask: _"Check that every function which modifies the destinations array also calls the save function afterwards."_

*The form submits but nothing appears:*
The card rendering function might have a bug. Ask: _"Add a console.log at the start of the render function so I can see if it's being called. Then check the browser console."_

#if is-windows [
*index.html opens in Notepad instead of a browser:*
Right-click the file → *Open with* → choose your browser. Or type the full path in your browser's address bar.
]

*The styling looks different in different browsers:*
Ask the agent: _"Add a CSS reset at the top of the styles to normalise differences between browsers."_

*I want to start over:*
That's fine — and easy. To go back to your last commit, run `git restore index.html`. To start from scratch, ask: _"Delete index.html and let's start fresh. This time I want [new description]."_ One of the advantages of agent-assisted development is that starting over costs minutes, not hours.

*The agent ignores my house rules:*
Check the instruction file was loaded: ask _"Which instruction files did you load for this project?"_ (In Claude Code, `/context` also lists them under memory files.) If `AGENTS.md` is missing, check the file name — capitals matter — and that you started the agent inside `travel-bucket-list`, then restart the agent.

#if is-windows [
*`&&` gives an error in PowerShell:*
Older versions of PowerShell don't support `&&` between commands. Run each command on its own line, or separate them with `;`.
]

*localStorage is full or behaving strangely:*
Open developer tools → Application tab → Local Storage. You can see and delete entries manually. Or ask the agent: _"Add a 'Clear all data' button that wipes localStorage and resets the app."_

== Quick Reference

#table(
  columns: (1fr, 2fr),
  [*Task*], [*Prompt or command*],
  [Start the project], [`mkdir travel-bucket-list; cd travel-bucket-list; git init`],
  [Write house rules], [_"Create a short AGENTS.md with these house rules..."_],
  [Plan first], [`Shift+Tab` to plan mode, then describe the app],
  [Build the app], [_"Build a Travel Bucket List app in a single index.html..."_],
  [Open in browser], [#if is-mac [`open index.html`] #if is-linux [`xdg-open index.html`] #if is-windows [`start index.html`]],
  [Review the code], [_"Walk me through how the app works"_],
  [See what changed], [`git diff`],
  [Keep a change], [`git commit -am "Describe the change"`],
  [Throw a change away], [`git restore index.html`],
  [Add a feature], [_"Add [feature description] to the app"_],
  [Fix a bug], [_"[describe the problem] — diagnose and fix it"_],
  [Understand a concept], [_"Explain how [concept] works in this app"_],
  [Push to GitHub], [`gh repo create travel-bucket-list --public --source=. --remote=origin --push`],
  [View on GitHub], [`gh repo view --web`],
)

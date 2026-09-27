#import "_os-helpers.typ": *
= Your First AI-Generated Project

So far you've set up your tools and submitted your first pull request. Now you're going to do something genuinely impressive: take a real open-source project, describe what you want in plain English, and let an AI agent transform it — generating custom illustrations with AI models hosted on Hugging Face, spoken narration with a free text-to-speech service, and a recoloured animated background.

No prior coding experience required. The agent writes the code. You describe the vision.

#if sys.inputs.at("illustrations", default: "true") == "true" [#include "_illus-ai-studio.typ"]

== What You'll Build

*Web Presenter* is an open-source presentation framework: pure HTML, CSS, and JavaScript, no build step required. It supports slide-by-slide narration (MP3 files), animated Three.js backgrounds, and smooth CSS transitions. It also ships with a small Python script, `generate-assets.py`, that generates the images and narration for you. You can run the whole thing in any browser with a single command.

By the end of this chapter, you'll have:

+ Forked and cloned the project
+ Chosen a topic for your own presentation
+ Had an AI agent generate custom illustrations for each slide
+ Had an AI agent generate spoken narration for each slide
+ Customised the animated background to match your theme
+ Previewed the finished result in your browser

The illustrations come from *Hugging Face Inference Providers* — Hugging Face's gateway to hundreds of open AI models. You don't need a credit card: every free account gets a small monthly credit, which is more than enough for this chapter. The narration comes from `edge-tts`, a free Python library that uses the same online voices as the read-aloud feature in Microsoft Edge — no account or key needed. You'll talk to both through your AI coding agent.

// v2-verify: HF free-tier monthly credit amount (was $0.10/month for free accounts, Sept 2026) and that FLUX.1-schnell is still served by an Inference Provider.

== What You'll Need

From the previous chapters:
- Git installed and configured
- GitHub CLI authenticated
- Claude Code or Antigravity CLI ready in your terminal

New for this chapter:
- A Hugging Face account (free)
- A Hugging Face access token
- Python 3.10 or newer (to generate the assets and run a local web server)
- Three small Python libraries — `edge-tts`, `huggingface_hub`, and `requests` (installed after you clone the project, below)

=== Get a Hugging Face Account and Token

If you don't have one, sign up at #link("https://huggingface.co/join")[huggingface.co/join]. It's free — no credit card required.

Once you're logged in:

+ Click your profile picture (top right) → *Settings*
+ Click *Access Tokens* in the left sidebar
+ Click *New token*
+ Choose the *Read* token type and give it a name like `agentic-crew`
+ Click the button to create the token, and copy it (it starts with `hf_`)

// v2-verify: exact button labels on huggingface.co/settings/tokens.

A read token is enough to call the models, and it can't change anything on your Hugging Face account. One token per purpose is a good habit: if this one ever leaks, you delete it without breaking anything else.

Keep the token somewhere safe for the next few minutes (a password manager is ideal). You'll give it to your terminal — never to the agent's chat.

=== Check Python

#if is-windows [
Run:

```
python --version
```

You need Python 3.10 or higher. If Python isn't installed, or the version is older:

```
winget install -e --id Python.Python.3.13
```

// v2-verify: winget ID Python.Python.3.13 (python.org is moving Windows users to the Python install manager).

On Windows the command is `python`, not `python3`. If typing `python` opens the Microsoft Store instead, install with the command above, then close and reopen your terminal.
]

#if is-mac [
Run:

```
python3 --version
```

You need Python 3.10 or higher. The `python3` that comes with Apple's developer tools is often older (3.9), so if you see 3.9 or lower — or no Python at all — install a current one:

```
brew install python
```
]

#if is-linux [
Run:

```
python3 --version
```

You need Python 3.10 or higher (current Ubuntu and Debian releases already have it). Make sure the virtual-environment module is installed too:

```
sudo apt install python3 python3-venv
```
]

Close and reopen your terminal after installing, then check the version again to confirm.

== Set Your Hugging Face Token

The image script reads your token from an *environment variable* called `HF_TOKEN`. That way the token lives only in your terminal session: it's never written into a file, never committed to Git, and never typed into a prompt. Set it in the terminal you'll use for the rest of this chapter — the agent you start from that terminal inherits it.

#if is-mac or is-linux [
```
read -rs HF_TOKEN
export HF_TOKEN
```

After the first line, paste your token and press Enter. Nothing appears on screen while you paste — that's deliberate, so the token doesn't end up in your screen or your shell history.
]

#if is-windows [
```
$env:HF_TOKEN = "your-token-here"
```

Replace `your-token-here` with the token you copied.
]

Now check that it's set — without printing the token itself:

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

If you see `NOT set`, run the previous step again.

#quote(block: true)[
  *Keep tokens out of files — and out of prompts.* Never paste your token into code, commit it to Git, or type it into your AI agent's chat. The agent doesn't need to see it: the script reads it from the environment when it runs. Anything you paste into a prompt is sent to the model provider and may sit in session logs. If a token does leak, delete it on the Access Tokens page and create a new one. The Agent Attack Surface chapter of the main book explains why secrets and agents need careful handling.
]

#if is-mac [
This setting lasts for your current terminal session. If you'd rather not set it every time, add a line `export HF_TOKEN="hf_..."` (with your token) to your shell config file (`~/.zshrc`) — but remember that file is plain text on your disk.
]

#if is-linux [
This setting lasts for your current terminal session. If you'd rather not set it every time, add a line `export HF_TOKEN="hf_..."` (with your token) to your shell config file (`~/.bashrc`) — but remember that file is plain text on your disk.
]

#if is-windows [
This setting lasts for your current terminal session. To make it permanent, add it via System Properties → Environment Variables.
]

== Fork and Clone the Project

This single command creates your own copy of the project on GitHub and downloads it to your machine:

```
gh repo fork schlunsen/web-presenter --clone --remote
```

Step into the project directory:

```
cd web-presenter
```

Verify your connections to GitHub:

```
git remote -v
```

You should see two entries:
- `origin` — your fork (where you push your changes)
- `upstream` — the original project (where you can pull updates)

Each remote is listed twice — once for fetching, once for pushing. Four lines total is correct. If you only see `origin`, something went wrong — open your AI assistant and describe what you see; it will help.

== Install the Python Packages

The asset script needs three libraries. Install them in a *virtual environment* — a private folder of Python packages just for this project, so nothing clashes with the rest of your system. (The project's `.gitignore` already keeps this folder out of Git.)

#if is-mac or is-linux [
```
python3 -m venv .venv
source .venv/bin/activate
pip install edge-tts huggingface_hub requests
```

Your prompt now starts with `(.venv)`. That means the environment is active. Every time you open a new terminal for this project, `cd` into `web-presenter` and run `source .venv/bin/activate` again — and set `HF_TOKEN` again — before starting your agent.
]

#if is-windows [
```
python -m pip install edge-tts huggingface_hub requests
```

On Windows you can install straight into your user's Python; a virtual environment is optional here.
]

== Explore the Project

Have the agent explain what you're working with. Open your AI assistant from inside the project directory, in the same terminal where you set `HF_TOKEN`.

If you installed Claude Code, run:
```
claude --permission-mode manual
```

If you installed Antigravity CLI, run:
```
agy
```

Either works for everything in this chapter. Both will ask before they edit a file or run a command — that's what you want here. Once it's open, ask:

- _"Read README.md, index.html, generate-assets.py, and the files in engine/. Explain how this presentation framework works — how slides are structured, how the narration audio for each slide is found, how images are generated, and how the animated background works. Don't change anything yet."_

The agent will read the files and give you a plain-language summary. You'll understand the project in two minutes rather than thirty. It's only reading at this point — nothing is being changed yet.

#quote(block: true)[
  *A README can talk to your agent.* This project's README is partly written _for_ AI agents — it tells them which files to edit and which commands to run. That's handy here, because you know where the repository comes from. In general, text an agent reads is text that can steer it, so skim a stranger's README before you tell an agent to follow it.
]

Once you have a feel for it, ask about the existing assets:

- _"List all the files in presentation-audio/ and presentation-images/. What's already there?"_

You'll see the existing narration clips and images — placeholders you're about to replace with your own.

== Choose Your Topic

Pick something you know or care about. Your presentation will have ten slides, so you want a topic with enough substance for ten short points. Some ideas:

- A technology you use at work
- A hobby or skill you want to explain to a friend
- A project you're building
- An argument you want to make about something

For the rest of this chapter, we'll use the placeholder *[YOUR TOPIC]* — replace it with whatever you choose.

Write down ten short bullet points — your slide topics. One sentence each. You'll paste these into the agent prompts that follow.

#quote(block: true)[
  *Make your bullet points visual.* Each one will become an AI-generated image, so specific and concrete works better than abstract. "A warehouse filled with rows of server racks" will generate a better illustration than "technology infrastructure." "A child reading under a tree at sunset" is better than "education."
]

== Generate the Illustrations

In this step the agent adapts `generate-assets.py` to your topic. You won't edit it yourself. Your job is to provide your ten bullet points, look at what the agent changed, and then let it run the script.

Give your agent this prompt. *Do not copy it word-for-word* — replace `[YOUR TOPIC]` with your actual topic and `[paste your bullet points]` with your ten sentences:

- _"My presentation is about [YOUR TOPIC] and will have ten slides. In generate-assets.py, replace IMAGE_PROMPTS with ten entries named slide-01 to slide-10, one per slide, based on these topics: [paste your bullet points]. Make the prompts vivid and consistent in style. Keep reading the token from the HF_TOKEN environment variable. Don't run anything yet."_

Before anything runs, look at the change. Your agent shows each edit as a diff when it asks for permission, and you can always ask:

- _"Show me git diff generate-assets.py."_

Lines starting with `-` were removed; lines starting with `+` were added. You don't need to understand every line, but check two things: the ten prompts describe what you want, and the token is still read from the environment (`os.environ`) — there's no `hf_...` value written into the file.

When you're happy with it, ask the agent to run only the image part:

- _"Run generate-assets.py with the images argument."_

The agent will ask permission to run the command. Read it, and approve that one command — there's no need to choose an option that allows everything from now on.

Each image takes a few seconds. The script prints `OK` or `FAILED` for each one. When it's done, `presentation-images/` will contain `slide-01.png` through `slide-10.png`.

#quote(block: true)[
  *What if an image looks wrong?* Ask the agent to regenerate just that one: _"The illustration for slide 3 doesn't look right — it should show [description]. Improve that prompt and regenerate just slide-03."_ Image generation is iterative. A second or third attempt usually lands closer to what you had in mind. Each image costs a fraction of a cent of your free credit, so a few retries are fine.
]

== Generate the Narration

Next: spoken audio for each slide. The same script turns text into MP3 files with `edge-tts`. The voices sound clear and natural — good enough for a presentation.

Write one or two sentences of narration per slide, then give the agent this prompt:

- _"In generate-assets.py, replace NARRATIONS with ten entries, one per slide, using this text: [paste your narration for slides 1–10]. Use the same voice, en-US-AndrewNeural, for every slide. Show me the diff, then run generate-assets.py with the tts argument. Afterwards, delete any old slide-11.mp3 and slide-12.mp3 in presentation-audio/."_

// v2-verify: edge-tts still works without a key (it relies on an unofficial Microsoft endpoint) and the voice name en-US-AndrewNeural exists.

Check the diff as before, then approve the run. Expect a few seconds per clip. When it finishes, `presentation-audio/` will have `slide-01.mp3` through `slide-10.mp3`.

The file names matter: the presenter plays `slide-01.mp3` on slide 1, `slide-02.mp3` on slide 2, and so on. It finds them by number — they aren't listed in `index.html`.

#quote(block: true)[
  *Want a different voice?* There are hundreds. Ask: _"Run edge-tts --list-voices and suggest three warm-sounding English voices."_ Then: _"Switch the narration to [voice name] and regenerate the audio."_
]

== Update the Presentation

`index.html` holds all the slide content and image paths. Now the agent will update it with your new content.

- _"Update index.html so it has exactly ten slides about [YOUR TOPIC], in the same order as my narration. Each slide should use the matching slide-NN.png from presentation-images/. Use the existing slide layouts — title layout for slide 1, two-column or centred for the rest. Update the slide counter and the progress dots to match ten slides. Don't change anything in engine/."_

The agent will make the edits. When it's done, ask it to check its own work:

- _"Read index.html back and confirm there are exactly ten slides, each image path points to a file that exists, and the slide counter and progress dots say ten."_

This self-check catches missed references before you open the browser.

== Customise the Animated Background

The Three.js background draws a network of glowing nodes and connecting lines. By default it uses soft rose, lavender, and sage on a dark background. Ask the agent to match it to your topic's mood:

- _"Update engine/presentation-bg.js to change the network animation colours to [describe your palette — e.g. 'warm amber and dark brown' or 'deep green and soft white' or 'electric blue on black']. Also update the CSS colour variables in engine/presentation-styles.css to match."_

The agent will edit both files. If the result doesn't feel right, describe what you want more precisely:

- _"The background is too bright. Make the nodes smaller and reduce the line opacity to 30%."_

Iterate as many times as you need. Each change takes a few seconds.

== Preview in Your Browser

Before opening your browser, confirm two things:

+ The `presentation-images/` folder contains `slide-01.png` through `slide-10.png`
+ The `presentation-audio/` folder contains `slide-01.mp3` through `slide-10.mp3`

If any files are missing, ask the agent: _"Check the presentation-images/ and presentation-audio/ folders. What files are there, and are any missing?"_

Web Presenter needs a local web server — some of the browser features it uses don't work when you open the file directly from disk. Open a *second* terminal window (leave your agent running in the first), go to the project folder, and start one:

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

(If you cloned the project somewhere other than your home folder, `cd` to that location instead.) The `--bind 127.0.0.1` part means only your own computer can reach the server, not other devices on your network. You should see:

```
Serving HTTP on 127.0.0.1 port 8000 (http://127.0.0.1:8000/) ...
```

That means the server is ready. *Leave this terminal window open* — closing it stops the server. Now open your browser and go to:

```
http://localhost:8000
```

You should see your presentation. If a play button appears, click it (or press Enter) — browsers don't allow audio until you interact with the page. Each slide shows its illustration, plays its narration, and advances automatically when the audio finishes. Press the right arrow or spacebar to skip ahead, and the left arrow to go back.

Press `A` to toggle narration and `M` to toggle background music.

When you're done, go back to the server terminal and press *Ctrl+C* to stop it.

== Commit and Push

Once you're happy with your presentation, save your work to GitHub. First, ask the agent to show you what will be committed:

- _"Show me git status. Is there anything that shouldn't be committed — a .venv folder, a .env file, or anything containing a token?"_

Then:

- _"Create a branch called presentation/[YOUR TOPIC] (use hyphens, no spaces), add the changed files, commit with a message describing what I built, and push to my fork."_

The agent will handle every Git step. When it's done, verify on GitHub:

+ Go to `https://github.com/YOUR_USERNAME/web-presenter`
+ Open the branch dropdown and look for your branch (`presentation/[YOUR TOPIC]`)
+ Click it — you should see your new images, audio files, and updated `index.html`

Your presentation is now saved on GitHub and shareable with anyone via that URL.

== What Just Happened

You generated ten AI illustrations, narrated them, customised animated 3D graphics, and updated a web project — all by describing what you wanted in plain English. The agent handled the mechanics. This is what agentic programming looks like.

#table(
  columns: (1fr, 1fr),
  [*You brought*], [*The agent brought*],
  [A topic you care about], [Image prompts and API calls],
  [Ten sentences of content], [An adapted Python script, run on your say-so],
  [A colour palette description], [Updated JavaScript and CSS],
  [Judgment on what looks right], [The mechanics of making it so],
)

You also did three things that matter as much as the result: you kept your token in the environment instead of the chat, you read each diff before anything ran, and you approved commands one at a time.

The skill isn't coding. It's knowing what to ask for, how to check the result, and how to iterate when it's not quite right. That's what the next chapters will build on.

== Troubleshooting

*`pip install` fails with "externally-managed-environment":*
Your system Python doesn't allow installing packages globally. Use the virtual environment from "Install the Python Packages" — create it, activate it, then run `pip install` again.

*The script says `No module named 'edge_tts'` or `No module named 'huggingface_hub'`:*
#if is-mac or is-linux [
The virtual environment isn't active in the terminal your agent runs in. Exit the agent, run `source .venv/bin/activate` inside `web-presenter`, set `HF_TOKEN` again, and restart the agent.
]
#if is-windows [
The packages were installed for a different Python. Run `python -m pip install edge-tts huggingface_hub requests` again, then ask the agent to run the script with `python`.
]

*Image generation fails with a 401 or "unauthorized" error:*
The token is missing or wrong. Check it's set (see "Set Your Hugging Face Token"). If you set it after starting the agent, exit the agent, set the token, and start the agent again — the agent only sees variables that existed when it launched.

*Image generation fails with a 402 error or a message about credits:*
You've used up this month's free credit. Wait until next month, or add credit on your Hugging Face billing page. Ten images cost only a few cents, so this usually means many retries.

*Image generation fails with a 403 error about a gated model or access:*
Open the model's page on Hugging Face (`huggingface.co/black-forest-labs/FLUX.1-schnell`) while logged in and accept any terms shown, then try again.

*Image generation says the model is busy or rate-limited:*
Wait 30 seconds and try again, or ask the agent: _"Add a 10-second pause between image generation calls."_

*Narration fails for every slide:*
`edge-tts` needs an internet connection and uses an unofficial Microsoft service that occasionally changes. Ask the agent: _"Upgrade edge-tts with pip and try the tts step again."_

*Audio doesn't play, or the wrong narration plays on a slide:*
The presenter plays `slide-NN.mp3` by slide number. Ask: _"Check that presentation-audio/ has slide-01.mp3 to slide-10.mp3 and that the slide order in index.html matches the narration order."_ Also make sure you clicked the play button — browsers block audio until you interact with the page.

*Slides show broken image icons:*
The image path in the HTML doesn't match the actual filename. Ask: _"Check all image src attributes in index.html against the actual files in presentation-images/. Fix any mismatches."_

#if is-windows [
*The server command fails:*
Make sure you used `python`, not `python3`, and that you're in the `web-presenter` folder.
]

*Nothing loads or the page is blank:*
Make sure the server is running in the `web-presenter` directory, not a parent folder. Open your browser's developer tools (F12) and check the Console tab — missing files are listed there. Tell the agent what you see and it will fix them.

*The Three.js animation has stopped working after editing:*
Ask the agent: _"The background animation has stopped working. Read engine/presentation-bg.js and check for any syntax errors or missing function calls."_ If you'd rather undo the change: _"Restore engine/presentation-bg.js to the last committed version with git restore."_

*The wrong branch shows on GitHub after pushing:*
Make sure the branch name has no spaces — use hyphens instead. Ask the agent: _"What branch did we push? Show me the output of git branch -a."_

If you hit an error not listed here, describe it to your AI agent — it's seen most errors before and will usually know what to do. Paste the error message, never your token.

== Quick Reference

#table(
  columns: (1fr, 2fr),
  [*Task*], [*Prompt or command*],
  [Check HF token is set], [#if is-mac or is-linux [`[ -n "$HF_TOKEN" ] && echo "HF_TOKEN is set"`] #if is-windows [`if ($env:HF_TOKEN) { "HF_TOKEN is set" }`]],
  [Install Python packages], [#if is-mac or is-linux [`python3 -m venv .venv`, `source .venv/bin/activate`, `pip install edge-tts huggingface_hub requests`] #if is-windows [`python -m pip install edge-tts huggingface_hub requests`]],
  [Explore the project], [_"Read README.md, index.html and generate-assets.py and explain how it works"_],
  [Review a change], [_"Show me git diff generate-assets.py"_],
  [Generate images], [_"Update IMAGE\_PROMPTS... then run generate-assets.py with the images argument"_],
  [Generate narration], [_"Update NARRATIONS... then run generate-assets.py with the tts argument"_],
  [Update slide content], [_"Update index.html with my ten slides..."_],
  [Change background], [_"Update the animation colours in engine/presentation-bg.js to..."_],
  [Check generated files], [_"List the files in presentation-images/ and presentation-audio/"_],
  [Start local server], [#if is-mac or is-linux [`python3 -m http.server 8000 --bind 127.0.0.1`] #if is-windows [`python -m http.server 8000 --bind 127.0.0.1`]],
  [View presentation], [`http://localhost:8000`],
  [Stop the server], [`Ctrl+C` in the server terminal],
)

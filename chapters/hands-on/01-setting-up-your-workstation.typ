#import "_os-helpers.typ": *
= Setting Up Your Workstation

Before you can contribute to a project, fix a bug, or even read source code properly, you need a working environment. This chapter gets your machine ready — from scratch, on whatever OS you're running.

By the end of this chapter, you'll have a terminal, a package manager, Git, the GitHub CLI, Node.js, and optionally an AI coding agent — all ready to go.

#if sys.inputs.at("illustrations", default: "true") == "true" [#include "_illus-workshop.typ"]

== Open Your Terminal

The terminal is your command line — the place where you'll run everything in this book.

#if is-windows [
PowerShell comes pre-installed on Windows 10 and 11.

+ Press `Win + X`
+ Select *Terminal* (or *Windows PowerShell*)

Verify it's working:

```
$PSVersionTable.PSVersion
```

You should see version *5.1* or higher.
]

#if is-mac [
Terminal is built in. Open it from Spotlight:

+ Press `Cmd + Space`
+ Type *Terminal* and press Enter

Or find it in *Applications → Utilities → Terminal*.

Verify you're running a modern shell:

```
echo $SHELL
```

You should see `/bin/zsh` (the default since macOS Catalina) or `/bin/bash`. Either works for this guide.
]

#if is-linux [
How you open the terminal depends on your desktop environment, but these shortcuts work on most distributions:

- *Ubuntu / GNOME:* `Ctrl + Alt + T`
- *KDE Plasma:* right-click the desktop → *Open Terminal*
- *Any distro:* search for "Terminal" in your app launcher

Verify the shell:

```
echo $SHELL
```

You should see `/bin/bash` or `/bin/zsh`.
]

#quote(block: true)[
  *Why the terminal?* AI coding agents live in the terminal. You can't pair-program with an agent if you don't have a place for it to work. Think of this as setting up your workshop before you start building.
]

== Install a Package Manager

A package manager lets you install software by typing one command instead of downloading installers and clicking through wizards. Each platform has its own.

#if is-windows [
=== WinGet

WinGet ships with Windows 10 (version 1809+) and Windows 11.

Check if you have it:

```
winget --version
```

If you get an error, install it from the Microsoft Store — search for *App Installer* — then close and reopen your terminal.
]

#if is-mac [
=== Homebrew

Homebrew is the standard package manager for macOS. Install it with:

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

This downloads and runs the official Homebrew installer. Follow the prompts — it will ask for your password and install a few things. When it finishes, verify:

```
brew --version
```

On Apple Silicon Macs (any M-series chip), Homebrew installs to `/opt/homebrew`. If `brew` isn't found after install, look for a "Next steps" section printed at the end of the installer output — it will show two commands to run. Copy and run those, then open a new terminal window.
]

#if is-linux [
=== apt / dnf

Linux distributions ship with a package manager. The most common:

#quote(block: true)[
  *What is `sudo`?* On Linux, `sudo` runs a command as an administrator — like "Run as Administrator" on Windows. You'll be asked for your user password. Nothing is shown as you type; that's normal.
]

*Ubuntu, Debian, and derivatives:*
```
sudo apt update
```

*Fedora, RHEL, and derivatives:*
```
sudo dnf check-update
```

*Arch Linux:*
```
sudo pacman -Sy
```

No install needed — these come with your OS. The examples in this guide use `apt`; swap for your distro's equivalent.
]

== Install Git

Git is version control. It tracks every change to every file in a project, and it's how teams collaborate without overwriting each other's work. Every project in this book uses Git.

#if is-windows [
```
winget install Git.Git
```

*Close and reopen your terminal* after installation.
]

#if is-mac [
Git is bundled with the Xcode Command Line Tools, which you likely already have. Try:

```
git --version
```

If you see a version number, you're done. If macOS prompts you to install the developer tools, click *Install* and wait for it to finish.

To get a newer version via Homebrew:

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

Verify:

```
git --version
```

You should see a version number like `git version 2.55.0`. Any recent version is fine.

Now set your identity so Git knows who's making changes:

```
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

Use the same email as your GitHub account.

One more setting: new repositories should start on a branch called `main`, which is what GitHub uses. Older Git versions still default to `master`, so set it explicitly:

```
git config --global init.defaultBranch main
```

== See Git in Action

Git is installed — but you haven't used it yet. Let's do a quick 60-second test so Git isn't a mystery when Chapter 2 arrives.

Create a practice folder and step into it:

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

Tell Git to start tracking this folder:

```
git init
```

Check the status:

```
git status
```

You should see `On branch main`, `No commits yet`, and `nothing to commit`. That's Git telling you it's watching this folder and there's nothing new to record yet.

In Chapter 2 you'll use `git status` constantly — it's how you check what's changed. Now you've seen what it looks like when everything is clean.

Head back to your home folder when you're done:

```
cd ..
```

#quote(block: true)[
  *What just happened?* `git init` created a hidden `.git` folder inside `test-repo`. That folder is where Git stores its entire history. Every project that uses Git has one. You never need to touch it directly.
]

== Install the GitHub CLI

The GitHub CLI (`gh`) lets you fork repositories, create pull requests, and manage issues — all without leaving the terminal.

#if is-windows [
```
winget install GitHub.cli
```

Close and reopen your terminal.
]

#if is-mac [
```
brew install gh
```
]

#if is-linux [
*Ubuntu / Debian* — `gh` isn't in the default package repositories, so you need to add GitHub's official one first. These commands (the same steps as the GitHub CLI's own install docs) do that, then install `gh`:

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

You can paste the entire block at once — the terminal will run each line in sequence. You'll be asked for your password on the first `sudo`. If a line gets broken when you copy it from this page, copy the block from the official instructions at #link("https://github.com/cli/cli/blob/trunk/docs/install_linux.md")[github.com/cli/cli → docs/install_linux.md] instead. Don't use the `gh` package from Ubuntu's own repositories; some versions of it are too old to work with GitHub.

*Fedora:*
```
sudo dnf install gh
```

*Arch:*
```
sudo pacman -S github-cli
```

*Any other distribution* — download the binary for your architecture from #link("https://github.com/cli/cli/releases")[github.com/cli/cli/releases].

]

---

Verify:

```
gh --version
```

== Create a GitHub Account

If you don't have one, sign up at #link("https://github.com/signup")[github.com/signup]. It's free. You'll need it for everything from Chapter 2 onward.

== Authenticate

Now connect your terminal to your GitHub account:

```
gh auth login
```

When prompted, choose:
- *GitHub.com*
- *HTTPS*
- *Yes* when asked to authenticate Git with your GitHub credentials (this lets `git push` work without a password later)
- *Login with a web browser*

It will give you a one-time code and open your browser. Paste the code, authorize, and you're connected.

Verify it worked:

```
gh auth status
```

You should see `Logged in to github.com`.

== Install Node.js

Node.js runs JavaScript outside the browser, and `npm` (which comes with it) installs JavaScript packages. You won't need it in the next chapter, but the later exercises — building a web app and testing it — do. Install the LTS (long-term support) version now while you're here.

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
*Ubuntu / Debian* — the `nodejs` package in the default repositories is often several versions behind. Install the current LTS from NodeSource instead:

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

Close and reopen your terminal, then verify:

```
node --version
npm --version
```

Any version from `v22` upward is fine.

== (Optional) Install an AI Coding Agent

This book is about working with AI agents. While you don't strictly need one for the exercises, having an agent in your terminal makes the experience real. Neither of the two below needs Node.js — both install as a single program.

#quote(block: true)[
  *Install from the official source.* Copy install commands from the vendor's own documentation (or from this page), never from a random blog post or a search ad. Coding agents run with your permissions on your machine, which makes fake installers an attractive trap.
]

=== Option A: Claude Code

Claude Code is Anthropic's AI coding agent. It runs in your terminal and can read, write, and reason about code.

Install it with the official native installer (the recommended method — it updates itself in the background):

#if is-mac [
```
curl -fsSL https://claude.ai/install.sh | bash
```

Prefer Homebrew? `brew install --cask claude-code` works too, but you'll have to update it yourself with `brew upgrade claude-code`.
]

#if is-linux [
```
curl -fsSL https://claude.ai/install.sh | bash
```

Anthropic also publishes signed `apt` and `dnf` repositories if you'd rather manage it with your package manager — see the setup page of the Claude Code docs at #link("https://code.claude.com/docs")[code.claude.com/docs].
]

#if is-windows [
In PowerShell:

```
irm https://claude.ai/install.ps1 | iex
```

Prefer WinGet? `winget install Anthropic.ClaudeCode` works too (note the name — `Anthropic.Claude` is the desktop chat app, not the terminal agent), but you'll have to update it yourself with `winget upgrade Anthropic.ClaudeCode`.

Claude Code runs natively in PowerShell. Because you installed Git above, it can also use Git Bash for shell commands.
]

Close and reopen your terminal, then check it's installed:

```
claude --version
```

If you'd rather use npm, `npm install -g @anthropic-ai/claude-code` also works (it needs Node.js 22 or later). Don't mix install methods — pick one.

Launch it:

```
claude
```

On first run, it opens your browser to log in. Claude Code needs a paid Claude plan (Pro or higher) or an Anthropic Console account with API credit — the free Claude plan doesn't include it.

=== Option B: Antigravity CLI

// v2-verify: Antigravity CLI install URLs, the `agy` command and the free weekly quota (antigravity.google/docs/cli/install and /docs/plans) — launched June 2026 and changing fast.

Antigravity CLI is Google's AI coding agent. Similar concept, different models. It replaced Google's earlier Gemini CLI for individual users in June 2026 — if an older tutorial tells you to install `@google/gemini-cli`, use this instead.

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
In PowerShell:

```
irm https://antigravity.google/cli/install.ps1 | iex
```
]

Close and reopen your terminal, then launch it — the command is `agy`:

```
agy
```

On first run it opens your browser so you can sign in with your Google account. A personal Google account gets a free quota that refreshes weekly; paid Google AI plans get more.

#quote(block: true)[
  *API keys are secrets.* Both tools can also run on an API key instead of an account login. If you ever go that route, keep the key in an environment variable or your operating system's keychain — never paste it into a prompt, a chat, or a file you commit to Git. The Agent Attack Surface chapter of the main book explains why.
]

=== Which one?

Either works for this book. Claude Code is the one the main book uses most, and it's strong at code reasoning and multi-file edits, but it needs a paid plan. Antigravity CLI has a free tier, so it's the easier way to start at no cost. The exercises show prompts that work with either tool.

== Verify Everything

Run this quick checklist:

```
git --version
gh --version
gh auth status
node --version
```

If all four commands work, you're ready. Your workstation is set up, your identity is configured, and you have a direct line to GitHub.

== The Prompt-First Way

Once Claude Code or Antigravity CLI is installed, you don't have to remember every command — you can just describe what you want in plain English. Here's how you'd ask an AI agent to verify your entire setup for you.

Open your AI agent in the terminal:

```
claude
```

(Or `agy` if you installed Antigravity CLI.)

Then try prompts like these:

- _"Check whether Git is installed and properly configured with a name and email."_
- _"Is the GitHub CLI installed and authenticated? Show me the status."_
- _"Run a quick checklist: git, gh, and gh auth status — tell me what's working and what isn't."_

#quote(block: true)[
  *Start in Manual mode while you learn.* Recent versions of Claude Code start in _auto mode_, where a background safety check approves routine actions instead of asking you. While you're learning, it's better to see and approve every command yourself. Start Claude Code like this instead:

  ```
  claude --permission-mode manual
  ```

  The status bar shows `⏸ manual mode on`, and the agent asks before it runs anything that changes your machine. Read each command before you approve it, and approve it only if you understand it — for checks like `git --version`, that's easy. `Shift+Tab` cycles through the modes during a session. The Guardrails, Trust, and Sandboxes chapter of the main book shows how to set permissions deliberately once you know what you want to allow.
]

The agent will run the commands, interpret the output, and tell you in plain language what's ready and what still needs attention. If something is missing or broken, ask it:

- _"Git isn't configured with my email — how do I fix that?"_
- _"Walk me through authenticating the GitHub CLI step by step."_
- _"I'm on macOS and Homebrew isn't in my PATH — how do I fix that?"_

#quote(block: true)[
  *Commands vs. prompts.* Both approaches get you to the same place. Commands are fast and precise once you know them. Prompts are forgiving — they meet you where you are. As you build experience, you'll find yourself switching between the two naturally.
]

In the next chapter, we'll put it all to use: you'll fork a real repository, read a real chapter of a real book, write an honest review, and submit your first pull request.

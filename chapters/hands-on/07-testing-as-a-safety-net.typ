#import "_os-helpers.typ": *
= Testing as a Safety Net

Your Travel Bucket List is deployed. It's secured. You pentested it in Chapter 6 and understand its attack surface. Everything works.

Now change something.

Add a feature. Tweak the layout. Refactor how destinations are stored. How do you know you didn't break anything? Right now, you don't. You can click around manually, checking each feature by hand, and _hope_ you caught everything. But "hope" is not a strategy — and it definitely isn't something you can teach an AI agent.

Here's the uncomfortable truth: your agent is coding blindfolded. It can write features all day long, but it has no way to verify that what it built actually works — or that it didn't break something that worked five minutes ago. When you ask "add a sort-by-date feature," the agent writes code, says "done," and moves on. Did it work? Did it break the filter? Did it corrupt localStorage? Nobody checked.

Tests fix this. They give the agent eyes. A test suite is a machine-readable specification of what your app is supposed to do. Run the tests and you get a clear signal: green means everything works, red means something's broken. The agent can read that signal, diagnose the failure, and fix it — all without you clicking a single button.

This chapter turns your Travel Bucket List from a "seems to work" app into a "provably works" app.


== What You'll Build

By the end of this chapter, you'll have:

+ Written end-to-end tests that verify every core feature of your Travel Bucket List
+ Installed and configured Playwright as your test runner
+ Experienced test-driven development (TDD) with an AI agent — writing failing tests first, then making them pass
+ Broken your app on purpose and watched the tests catch it
+ Told your agent, in its instruction file, how to check its own work
+ Set up a GitHub Actions CI pipeline that runs tests on every push
+ Submitted a pull request and seen the green checkmark (and a red X)

Every test will be written by the agent. Your job is to describe what "correct" looks like.


== What You'll Need

From the previous chapters:
- Your Travel Bucket List app from Chapter 4, pushed to GitHub and merged into `main`
- A terminal with your AI agent ready (Claude Code or Antigravity CLI, from Chapter 1)
- Git installed and configured
- Node.js and npm installed (you set this up in Chapter 1)
- A browser (Playwright will handle the headless one, but you'll want a real one for manual exploration)

No new accounts or services. Everything runs locally until we set up CI at the end. GitHub Actions is free for public repositories, and the repository from Chapter 4 is public.


== The Blindfolded Agent

Before we write any tests, let's see what happens without them. Open your Travel Bucket List project, make sure you're on `main` with nothing uncommitted, and start your agent:

```
cd travel-bucket-list
git checkout main
git status
claude --permission-mode manual
```

(If you use Antigravity CLI, start it with `agy` instead.)

Now ask it to add a new feature:

- _"Add a 'sort by date added' button that sorts the destination cards from newest to oldest."_

Watch what happens. The agent reads your code, adds a sort button, wires up the logic, and reports back: "Done. I've added a sort-by-date button that sorts destinations from newest to oldest."

Open the app in your browser. Click the button. Does it work? Maybe. Maybe not. But here's the point — the agent has no idea either. It wrote code that _looks_ correct. It didn't verify that:

- The sort actually reorders the cards
- Existing features (add, edit, delete, filter, mark as visited) still work
- localStorage still saves and loads correctly after sorting
- The sort persists after a page refresh

Now let's make this worse. Ask the agent:

- _"Refactor the destination storage to include a `createdAt` timestamp for each entry."_

This touches the core data model. The agent rewrites the storage logic, updates the add function, and says "done." But did it migrate the existing entries that don't have timestamps? Does the edit function still work? Does the delete function still find entries by the right key?

You'd have to manually test every feature to find out. That's tedious, error-prone, and — crucially — it doesn't scale. The agent can't do it at all.

This is the "before" picture. Remember how it feels.


== Your First Test

Time to give the agent eyes. We'll use Playwright — a browser automation framework that can open your app, click buttons, fill forms, and assert that the right things appear on the page. It's like having a tireless QA tester who checks everything in seconds.

Ask your agent:

- _"Install Playwright as a dev dependency and set it up for end-to-end testing. Configure it to test a static site served from the current directory on port 5500."_

The agent will run something like:

```
npm init -y
npm install -D @playwright/test
npx playwright install chromium
```

(Playwright also has an interactive setup wizard, `npm init playwright@latest`, which asks a few questions and writes the config, an example test and a CI workflow for you. Either route works; the agent usually takes the non-interactive one.)

It will also create a `playwright.config.js` (or `.ts`) that tells Playwright to spin up a local server before running tests. This matters — your Travel Bucket List is a static site, so Playwright needs a simple HTTP server to serve it. Open the config and check that the important part looks roughly like this:

```js
// playwright.config.js (excerpt)
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://localhost:5500' },
  webServer: {
    command: 'npx serve -l 5500 .',
    url: 'http://localhost:5500',
    reuseExistingServer: !process.env.CI,
  },
});
```

The `webServer` block starts a server before the tests and stops it afterwards. `serve` is a small static file server from npm; if the agent picks it, have it install `serve` as a dev dependency so the version is pinned in your lock file rather than fetched fresh each run. `reuseExistingServer` means that locally, if you already have the app running on port 5500, Playwright uses it; in CI it always starts a fresh one.

#quote(block: true)[
  *Check the package names.* Whenever an agent installs something, glance at the name before you approve it. `@playwright/test` and `serve` are the real packages. Models occasionally invent plausible-sounding package names, and attackers register those names — the main book's Agent Attack Surface chapter calls this slopsquatting.
]

One more thing before you commit anything: `npm install` just created a `node_modules/` folder with thousands of files, and Playwright will write reports into `playwright-report/` and `test-results/`. None of those belong in Git. Ask the agent:

- _"Create a .gitignore that excludes node\_modules/, playwright-report/, test-results/ and blob-report/. Keep package.json and package-lock.json tracked."_

The lock file matters: CI will install exactly the versions it lists.

#quote(block: true)[
  *Why Playwright?* It runs a real browser (Chromium, Firefox, or WebKit) in headless mode — no visible window, but all the rendering and JavaScript execution of a real browser. This means your tests interact with the app exactly like a user would. If the test passes, the feature genuinely works.
]

Now let's write the first test. Tell your agent:

- _"Write an end-to-end test: when I add a destination called 'Tokyo', it should appear as a card on the page."_

The agent will create a test file — something like `tests/bucket-list.spec.js` — with a test that:

+ Opens the app in a headless browser
+ Finds the input field and types "Tokyo"
+ Clicks the add button
+ Asserts that a card containing "Tokyo" appears on the page

Run the tests:

```
npx playwright test
```

You should see output like:

```
  1 passed (2.1s)
```

One test. One green line. But that single green line changes everything. You now have a _machine-verifiable fact_: adding a destination makes it appear on the page. The agent can check this in two seconds, every single time it makes a change. No clicking required.

Now make sure the agent actually _uses_ it. Agents read an instruction file at the start of every session — `CLAUDE.md` for Claude Code, and `AGENTS.md` for Antigravity CLI and most other tools. Ask your agent:

- _"Add a short section to CLAUDE.md (create it if it doesn't exist): the test command is `npx playwright test`; run it after every change and don't report a task as done while tests are failing; never edit or delete a test to make it pass unless I ask."_

Three lines, and every future session starts knowing how to check its own work. (If you use Antigravity CLI, ask for the same lines in `AGENTS.md`.)


== Build the Suite

One test is a start. A suite is a safety net. Let's describe every important behavior your app should have and let the agent write a test for each.

Give the agent a list of behaviors in plain English:

- _"Write end-to-end tests for each of these behaviors:"_

+ When I add "Tokyo" as a destination, a card with "Tokyo" appears on the page
+ When I add "Tokyo" and refresh the page, "Tokyo" is still there (localStorage persistence)
+ When I edit "Tokyo" to "Kyoto", the card updates to show "Kyoto"
+ When I delete "Tokyo", the card disappears
+ When I mark "Tokyo" as visited, it visually changes (e.g., a checkmark or different style)
+ When I have destinations "Tokyo", "Paris", and "Berlin", I can filter to show only visited or unvisited
+ When I add three destinations, all three appear as cards

The agent will write a test for each behavior. Some will be straightforward. Others might require the agent to understand your app's specific UI — which input fields exist, what the buttons are labelled, how cards are structured.

Before you run anything, *read the tests*. Not every line — just check that each one does what its name promises. A test called "persists after refresh" that never actually reloads the page will pass forever and protect nothing. The agent wrote the code; you're the one who decides whether it checks the right thing.

#quote(block: true)[
  *Tests as documentation.* Notice that each test reads like a sentence: "When I do X, Y should happen." This is intentional. Your test suite becomes a living specification of what your app does. Six months from now, you (or anyone else) can read the tests and understand every feature without touching the source code.
]

Run the full suite:

```
npx playwright test
```

You might see some failures. That's normal and actually useful — it means either the test is wrong (the agent misunderstood your UI) or the feature has a bug you didn't know about. Ask the agent to investigate each failure:

- _"The 'edit destination' test is failing. Look at the test code and the app code, figure out why, and fix it."_

This is the feedback loop. Tests fail, you diagnose, you fix, tests pass. Every passing test is one more thing you never have to manually check again.


== Red-Green-Refactor with an Agent

Now let's experience test-driven development — writing the test _before_ the feature exists. This is where agents really shine.

Tell your agent:

- _"Write a failing test for this behavior: when I click a 'Sort A-Z' button, the destination cards are reordered alphabetically."_

The agent writes the test. Run it:

```
npx playwright test
```

It fails. Red. The button doesn't exist yet, the sort logic doesn't exist, nothing works. That's the point — the test is a precise, executable description of what you want.

Now tell the agent:

- _"Make the failing 'Sort A-Z' test pass. Don't modify the test — only change the application code."_

The agent reads the failing test, understands exactly what's expected (a button labelled "Sort A-Z" that reorders cards alphabetically), and implements the feature. It adds the button, writes the sort logic, and wires it up.

"Don't modify the test" is an instruction, and instructions are advice. Agents under pressure to get to green sometimes "fix" the test instead of the code — the main book's Agents in the Pipeline chapter opens with an agent that quietly disabled lint rules to keep the build green. Two cheap guards:

- *Check the diff.* After the agent says it's done, run `git diff --stat`. If anything under `tests/` changed during a green step, ask why.
- *Make it a permission, not a request.* In Claude Code, add an `ask` rule to `.claude/settings.json` so every edit to the test folder stops for your approval:

```json
{
  "permissions": {
    "ask": ["Edit(/tests/**)"]
  }
}
```

During the red step you approve those edits; during the green step you say no. (It covers the agent's file-editing tools, not a shell command that rewrites files — which is why you still glance at the diff. Antigravity CLI has its own permission settings; the diff check works with any tool.)

Run the tests again:

```
npx playwright test
```

Green. Every test passes — the new sort feature works, _and_ nothing else broke.

This is the TDD cycle with an agent:

+ *Red* — you describe a behavior, the agent writes a failing test
+ *Green* — you tell the agent to make it pass, the agent implements the feature
+ *Refactor* — you ask the agent to clean up the code, the tests ensure nothing breaks

The test isn't just checking the agent's work. It's _guiding_ the agent's work. Instead of vaguely saying "add sorting," you gave it a concrete, verifiable target. The agent knows exactly when it's done — when the test goes green.

#quote(block: true)[
  *Why constrain the agent with tests?* Without tests, "add sorting" is ambiguous. Sort what? By what criteria? In what direction? Where does the button go? The agent makes guesses. With a test, every question has an answer encoded in the assertions. The test is the spec.
]


== Breaking Things on Purpose

Let's prove that the safety net actually catches you when you fall.

Ask your agent:

- _"In the app's JavaScript, comment out the line that saves destinations to localStorage. Don't change anything else."_

The agent comments out the save call. Your app still _looks_ like it works — you can add destinations and they appear as cards. But refresh the page and they're gone. The data isn't persisting.

This is exactly the kind of subtle bug that slips through manual testing. You add a destination, it shows up, everything looks fine. You move on. A week later, a user complains that their data disappeared.

Run the tests:

```
npx playwright test
```

Red. The "add and refresh" persistence test fails. The test added "Tokyo," refreshed the page, and "Tokyo" was gone. The test caught what your eyes missed.

Now here's the powerful part. Ask your agent:

- _"The tests are failing. Diagnose the issue and fix it."_

The agent reads the test failure output, sees which test failed and why, examines the code, finds the commented-out save call, and restores it. Run the tests again — green.

You didn't tell the agent _what_ was broken. You said "tests are failing, fix it." The test output was the communication channel. The red test told the agent exactly where to look and what the expected behavior should be. Tests aren't just a safety net for you — they're a language the agent understands.


== Automate It: GitHub Actions

Running tests locally is good. Running them automatically on every push is better. Let's set up a CI pipeline so that GitHub runs your tests every time you push code or open a pull request.

Ask your agent:

- _"Create a GitHub Actions workflow that installs dependencies, installs Playwright browsers, and runs the test suite on every push and pull request."_

The agent will create a file at `.github/workflows/test.yml` that looks something like this:

```yaml
name: Tests
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

permissions:
  contents: read

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: lts/*
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test
      - uses: actions/upload-artifact@v7
        if: ${{ !cancelled() }}
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

Before you commit it, read it — it's short, and it's the only thing standing between a bad change and `main`. Check three things:

- *The action versions.* Agents suggest whatever versions were common in their training data, which is usually a major version or two behind. Each action's GitHub page (for example `github.com/actions/checkout`) shows the latest release; in September 2026 that's `actions/checkout@v7`, `actions/setup-node@v7` and `actions/upload-artifact@v7`. Playwright's own "Setting up CI" guide (`playwright.dev/docs/ci-intro`) has the rest of the workflow. // v2-verify: latest major versions of checkout / setup-node / upload-artifact before each revision
- *`permissions: contents: read`.* A test job only needs to read your code. Setting permissions explicitly means that even if a dependency misbehaves during the run, the job's GitHub token can't push or change anything.
- *No secrets.* A test job for a static site doesn't need any. Keep it that way — this job runs on pull requests, which can come from anyone on a public repository.

The last step uploads Playwright's HTML report even when the tests fail, so you can download it from the run's summary page and see exactly what happened.

Commit everything and push:

```
git status
git add -A
git commit -m "Add test suite and CI pipeline"
git push
```

Glance at the `git status` output before you commit: you should see `package.json`, `package-lock.json`, `playwright.config.js`, `.gitignore`, `CLAUDE.md`, the `tests/` folder and `.github/` — and no `node_modules/`. If `node_modules/` shows up, fix the `.gitignore` first.

Visit your repository on GitHub and click the "Actions" tab. You should see your workflow running. When it finishes — green checkmark. Your tests pass in CI.

Now let's see the red X. Create a branch, introduce a bug, and open a pull request:

- _"Create a new branch called 'break-something', remove the localStorage save call again, commit it, push it, and open a pull request."_

The agent creates the branch, breaks the code, pushes, and opens the PR. Go to GitHub. The PR shows a red X next to the failing checks. Click it and you can see exactly which test failed and why.

This is the workflow that professional teams use every day. No code merges to main unless the tests pass. The CI pipeline is the gatekeeper, and the tests are its rules.

Right now it's a gatekeeper you could still walk past — GitHub shows the red X but still offers you the merge button. To make it binding, add a branch ruleset: in your repository go to *Settings → Rules → Rulesets*, create a branch ruleset that targets the default branch, and turn on *Require status checks to pass* with your `test` job selected. From then on, a red PR can't be merged. // v2-verify: GitHub rulesets UI labels (Settings → Rules → Rulesets, "Require status checks to pass")

#quote(block: true)[
  *The red X is a feature, not a failure.* When a PR shows failing tests, that's the system working exactly as designed. It caught a problem before it reached production. The alternative — merging broken code and finding out from angry users — is far worse.
]

Close the broken PR without merging. Switch back to main:

```
git checkout main
```


== The Checkpoint

You've built the safety net. Now use it.

Pick a feature you want to add to your Travel Bucket List. Some ideas:

- A "random destination" button that highlights a random card
- A character count or word limit on destination descriptions
- A "visited on" date field that records when you visited a place
- An export button that downloads your destinations as a JSON file

Whatever you pick, do it with TDD:

+ Write a failing test that describes the behavior (red)
+ Tell the agent to make it pass (green)
+ Ask the agent to clean up the code (refactor)
+ Run the full suite to make sure nothing else broke
+ Review the diff (did the green step touch the tests?)
+ Commit on a branch, push, open a PR — watch CI go green

Between phases, consider starting a fresh agent session. The session that wrote the test knows what it _meant_; a fresh one only knows what the test _says_ — which is a better check that the test is a real specification.

No step-by-step instructions this time. You have the tools and the workflow. The agent is your pair programmer, and the tests are your shared language.


== What Just Happened

You turned a fragile, manually-verified app into one that checks itself. Let's look at what you brought versus what the agents brought:

#table(
  columns: (1fr, 1fr),
  [*You brought*], [*The agents brought*],
  [The decision to invest in tests], [Test code for every core behavior],
  [Plain-English descriptions of correct behavior], [Playwright configuration and browser automation],
  [The TDD discipline: test first, then implement], [Feature implementation guided by failing tests],
  [The instinct to break things and verify the net catches them], [Diagnosis and fixes driven by test output],
  [The choice to automate with CI], [A complete GitHub Actions workflow],
)

The core loop:

+ *Describe* what correct behavior looks like ("when I add Tokyo and refresh, Tokyo is still there")
+ *Review* the test the agent writes (does it actually check what you described?)
+ *Iterate* until all tests pass and the code is clean
+ *Automate* so the checks run without you

There's a deeper lesson here. In Chapter 4, you told the agent _what to build_. In this chapter, you told the agent _what "correct" means_. That's a different skill — and a more powerful one. An agent that knows what correct looks like can verify its own work, catch its own mistakes, and fix its own bugs. You went from giving instructions to setting standards.


== Troubleshooting

*Playwright install fails or times out:*
Playwright needs to download browser binaries. If you're behind a corporate proxy or firewall, this can fail. Install just Chromium instead of all browsers: `npx playwright install chromium`. On Linux (and in CI), add `--with-deps` so Playwright also installs the system libraries the browser needs; it uses `sudo` and your package manager to do so.

*Tests fail with "element(s) not found" or "Timed out … waiting for locator":*
The agent wrote a test that looks for a specific CSS selector or text that doesn't match your app's actual HTML. Ask the agent: _"The test can't find the element. Look at the actual HTML structure of the app and update the test selectors to match."_ This is the most common issue and usually a one-line fix.

*Tests pass locally but fail in CI:*
Usually a timing issue — CI machines are slower. Make sure the tests use Playwright's web-first assertions, such as `await expect(page.getByText('Tokyo')).toBeVisible()`, which retry until the element appears, rather than checking once or sleeping for a fixed time with `page.waitForTimeout()`. Ask the agent: _"Replace any fixed waits in the tests with web-first assertions."_ Then download the `playwright-report` artifact from the failed run and look at what the page showed.

*`npm ci` fails in CI:*
`npm ci` needs a `package-lock.json` that matches `package.json`. Make sure the lock file is committed (and not in `.gitignore`), then run `npm install` locally and commit the updated lock file.

*The local server doesn't start for tests:*
Check your `playwright.config.js` — the `webServer` section needs the right command to serve your static files. Common options: `npx serve -l 5500 .` or #if is-windows [`python -m http.server 5500`] else [`python3 -m http.server 5500`]. Make sure the port in `command`, `url` and `baseURL` all match.

*"Browser was not installed" error:*
Run `npx playwright install chromium` again. This downloads the browser binary that Playwright controls. If you switch Node.js versions (via nvm or similar), you may need to reinstall.

*The workflow never shows up in the Actions tab:*
Make sure the file is at exactly `.github/workflows/test.yml` (not `.github/workflow/` — note the plural), that it's committed on `main`, and that the YAML is valid — indentation matters. The `actions/checkout` step should be the first step in the job.

*A workflow step fails with a permissions error:*
The `permissions:` block sets what the job's token can do. A test job only needs `contents: read`. If you later add a step that, say, comments on the PR, grant that one extra permission (`pull-requests: write`) rather than switching everything to write.

*Tests are flaky — passing sometimes, failing others:*
Flaky tests are almost always timing issues. The app hasn't finished rendering when the test checks for an element. Ask the agent: _"This test is flaky. Add proper waits and make it deterministic."_ Playwright's `expect(locator).toBeVisible()` auto-retries, which helps.

*Tests interfere with each other (one passes alone, fails in the suite):*
Playwright gives every test a fresh browser context, so localStorage starts empty in each test by default. If tests still leak state into each other, the agent has probably shared one `page` across tests (for example with `test.describe.serial` or a page created in `beforeAll`). Ask it: _"Make every test independent: use the built-in `page` fixture in each test and start from `page.goto('/')`."_


== Quick Reference

#table(
  columns: (1fr, 2fr),
  [*Task*], [*Command or prompt*],
  [Install Playwright], [`npm install -D @playwright/test && npx playwright install chromium`],
  [Interactive setup wizard], [`npm init playwright@latest`],
  [Run all tests], [`npx playwright test`],
  [Run tests with visible browser], [`npx playwright test --headed`],
  [Run a single test file], [`npx playwright test tests/bucket-list.spec.js`],
  [Run tests matching a name], [`npx playwright test -g "sort"` (matches test names containing "sort")],
  [See the test report], [`npx playwright show-report`],
  [Debug a failing test], [`npx playwright test --debug`],
  [Explore tests in a UI], [`npx playwright test --ui`],
  [Check the diff after a green step], [`git diff --stat`],
  [Write a new test], [_"Write a failing test for: when I click X, Y should happen."_],
  [Make a test pass], [_"Make the failing test pass. Only change application code."_],
  [Diagnose failures], [_"The tests are failing. Diagnose and fix the issue."_],
  [Set up CI], [_"Create a GitHub Actions workflow that runs Playwright tests on push and PR, with read-only permissions and the latest action versions."_],
)


== Cleaning Up

Your test suite and CI pipeline are additions, not temporary artifacts — you'll want to keep them. But if you created the `break-something` branch for the CI demo, clean it up:

```
git branch -D break-something
```

(Capital `-D`: the branch was never merged, so Git refuses to delete it with the lowercase `-d`.)

If you pushed it to GitHub:

```
git push origin --delete break-something
```

The test infrastructure (Playwright, the config file, the test files, the GitHub Actions workflow) should stay. They're the foundation for every change you make from here on out. Every future chapter builds on the assumption that you can verify your work automatically.

#quote(block: true)[
  *What comes next?* You've now built, deployed, secured, and tested an application — all with AI agents doing the heavy lifting. The safety net is in place. From here, you can move faster because you can move with confidence. Every new feature starts with a test. Every change is verified before it ships. The agent isn't coding blindfolded anymore — it can see exactly what's working and what's not. That's the difference between writing code and engineering software.
]

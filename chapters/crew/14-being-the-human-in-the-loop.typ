= Being the Human in the Loop

#figure(
  image("../../assets/illustrations/crew/ch14-human-in-loop.jpg", width: 80%),
  caption: [_You are the quality control._],
)

There's a phrase you'll hear more and more in the coming years: "human in the loop." It means exactly what it sounds like — a system where an AI does the work, but a human reviews, approves, or redirects at key points.

You are that human.

This chapter is about what that role actually looks like — not in theory, but in daily practice. What it means to be the person who checks the agent's work, catches its mistakes, and provides the judgment it can't.

== You Are Not Being Replaced

Let's get this out of the way, because it's the anxiety underneath everything.

Agents are getting better. They write code, draft reports, analyse data, generate designs. It's natural to look at that and think: "What's left for me?"

Everything that matters.

An agent can produce a financial report. You know whether the numbers tell the right story. An agent can draft a client email. You know whether the tone will land. An agent can design a user interface. You know whether it will make sense to the person using it at 7am on a construction site with gloved hands and no patience.

Domain knowledge, taste, judgment, relationships, empathy, context, politics, timing — these are not features you can add to a language model. They're the things that make work _work_. They're what you bring.

The agent multiplies your output. It doesn't replace your input.

== The Review Rhythm

In practice, being the human in the loop means building a rhythm:

*For short tasks (minutes):* The agent produces output, you review it immediately. Draft an email — read it, adjust, send. Generate a chart — check the data, tweak the labels, export. Quick loop.

*For medium tasks (hours):* The agent works in stages, and you check in between stages. Build the form — review. Add the 3D preview — review. Generate the PDF — review. Each checkpoint is a chance to steer before the agent goes further in the wrong direction.

*For long tasks (days):* The agent works on branches, and you review pull requests. This is the Git workflow from Chapter 3. The agent proposes changes, you review the changes, and you decide what gets merged. If something's wrong, you reject it and provide better instructions.

*For work you've handed off entirely:* More and more, you can give a task to an agent that runs in the cloud — assign it, walk away, and come back to finished work waiting for review. For code, that finished work arrives as a pull request. For other work, it might be a draft document or a completed spreadsheet. The agent did the work while you were in meetings. The review is still yours.

The rhythm adapts to the stakes. Low-stakes work gets a quick glance. High-stakes work gets careful review. But the rhythm never stops — because the moment you stop checking is the moment the agent drifts.

== The New Bottleneck Is You

Here's something that changed my mind since the first edition. I used to think the hard part of working with agents was getting them to do the work. It isn't any more. With background agents, you can hand out a dozen tasks before lunch. The hard part is that a dozen pieces of finished work come back — and someone has to actually understand every one of them.

Agent time is now cheap. _Your attention_ is not. That flips how you should plan:

- *Hand out only as much work as you can properly review.* Ten half-read reviews are worse than three careful ones. Unreviewed work isn't finished work; it's a liability with a nice summary.
- *Make the work easy to review.* Small tasks, one change each, with a clear note from the agent about what it did and how it checked it. Ask for that note in your instructions.
- *Watch for review fatigue.* The fifteenth approval of the day gets a lot less attention than the first. If you notice yourself clicking "approve" without reading, that's the signal to stop handing out work, not to speed up.

Some teams now use AI review tools as a first pass — a second agent that reads the first agent's work and flags obvious problems. That's genuinely useful. But it's a filter, not a reviewer. It can tell you something looks broken. It can't tell you whether it should have been built at all.

== What You're Actually Checking

When you review agent output, you're not checking whether the code compiles or the grammar is correct. The agent handles that. You're checking for things the agent _can't_ check:

*Does this solve the right problem?* The agent solves the problem you described. You're checking whether the problem you described is the problem that actually exists.

*Does this fit the context?* The agent doesn't know your client's history, your team's culture, your company's unwritten rules. You do. Does the output fit that context?

*Is this appropriate?* Appropriate in tone, in scope, in ambition. The agent doesn't know that this quarter's priority is stability, not new features. It doesn't know that this client appreciates brevity. It doesn't know that your boss is skeptical of AI-generated content.

*Would I put my name on this?* The ultimate test. If this output goes out with your name attached — your quote, your report, your email — are you comfortable with it? If not, it's not done.

== The Taste Gap

There's a concept in creative work called the "taste gap" — the distance between what you can recognise as good and what you can produce. When you're starting out in any field, your taste exceeds your ability. You know what good looks like, but you can't make it yet.

Agents close this gap dramatically. Your taste — your sense of what's right, what's professional, what works — is the guide. The agent provides the execution speed. You provide the direction.

This is why someone like Morten, the window installer, could build a professional-looking quoting app in a weekend. He's spent fifteen years developing _taste_ for what a good quote looks like, what information a customer needs, how a professional interaction should feel. He couldn't write the code. But he could recognise whether the output was right — and steer it until it was.

Your taste is your superpower. The agent is just the amplifier.

== When to Override

Sometimes the agent does something that's technically correct but wrong for reasons it can't understand. These are the moments that define the human in the loop:

- The report is accurate but the tone is wrong for this audience.
- The feature works but the user flow is confusing.
- The analysis is sound but the conclusion misses political context.
- The email is polite but it needs to be warmer — this client just lost a family member.

In each case, the agent can't know what you know. Override it. Change it. These are the moments where you earn your place in the loop — not because the agent is broken, but because some things require a human.

== The Long Game

Being the human in the loop isn't a temporary role until agents get better. It's the _permanent_ role. The specific tasks will change. The tools will improve. But the need for human judgment, human taste, and human accountability isn't going anywhere.

The question isn't whether you'll be in the loop. It's whether you'll be _good_ at it. And being good at it means developing exactly the skills this book teaches: clear communication, healthy scepticism, domain expertise, and the confidence to override a machine when your judgment says otherwise.

You're not the person who types. You're the person who decides. That's not a supporting role — that's the navigator's chair.

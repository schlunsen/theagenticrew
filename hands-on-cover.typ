// The Agentic Crew — Hands-On Guide cover ("Workshop Blueprint")
// Shared by every edition of the Hands-On Guide (English and Spanish, per OS).
// A blueprint-blue drawing sheet: engineering grid, a ship's wheel drawn as a
// technical drawing with centre lines and dimensions, and a title block in the corner.
// Fonts live in assets/fonts (compile with --font-path assets/fonts).

#let hands-on-cover(
  series: "The Agentic Crew",
  title: ("Hands-On", "Guide"),
  tagline: "Learn by doing: real tools, real repositories, real results",
  edition: "macOS Edition",
  author: "Rasmus Bornhøft Schlünsen",
  date: "March 2026",
  revision: "dev",
  labels: (
    project: "PROJECT", drawing: "DRAWING", edition: "EDITION", drawn: "DRAWN BY",
    date: "DATE", rev: "REV", sheet: "SHEET", scale: "SCALE",
    view: "FRONT ELEVATION · HELM", spokes: "8 SPOKES EQ. SP.", hub: "HUB", pcd: "P.C.D.",
  ),
) = page(margin: 0pt, header: none, footer: none)[
  #set par(justify: false)
  #let display = ("Fraunces", "Georgia")
  #let sans = ("Inter", "Helvetica Neue", "Arial")
  #let mono = ("JetBrains Mono", "Menlo")

  #let deep = rgb("#0b2140")
  #let blue = rgb("#0f2a4f")
  #let blue-lt = rgb("#1a3d6e")
  #let line-c = rgb("#9fd3f5")      // blueprint line cyan
  #let chalk = rgb("#eef4fa")
  #let amber = rgb("#f2a33a")
  #let amber-lt = rgb("#ffc56e")

  #let W = 420pt
  #let H = 595pt
  #let ln(a, b, s) = place(line(start: a, end: b, stroke: s))

  // arrowhead at `tip`, pointing away from `from`
  #let arrow(tip, from, col) = {
    let dx = tip.at(0) - from.at(0)
    let dy = tip.at(1) - from.at(1)
    let len = calc.sqrt(dx / 1pt * dx / 1pt + dy / 1pt * dy / 1pt) * 1pt
    let ux = dx / len
    let uy = dy / len
    let L = 6pt
    let w = 1.8pt
    place(polygon(fill: col, stroke: none,
      tip,
      (tip.at(0) - ux * L - uy * w, tip.at(1) - uy * L + ux * w),
      (tip.at(0) - ux * L + uy * w, tip.at(1) - uy * L - ux * w),
    ))
  }
  // text centred on a point
  #let label-at(x, y, body, w: 120pt) = place(dx: x - w / 2, dy: y - 4pt, box(width: w, align(center, body)))

  #block(width: 100%, height: 100%, clip: true, fill: gradient.linear(blue, deep, angle: 90deg))[
    // a soft glow where the drawing sits, like a lamp over the table
    #place(dx: 200pt - 250pt, dy: 318pt - 250pt, circle(radius: 250pt, fill: gradient.radial(blue-lt.transparentize(35%), deep.transparentize(100%))))

    // ── engineering grid: fine 1/8 lines, stronger every 5 ──
    #let step = 8.4pt
    #for i in range(int(W / step) + 1) {
      let x = i * step
      ln((x, 0pt), (x, H), (paint: line-c.transparentize(if calc.rem(i, 5) == 0 { 84% } else { 93% }), thickness: if calc.rem(i, 5) == 0 { 0.45pt } else { 0.25pt }))
    }
    #for j in range(int(H / step) + 1) {
      let y = j * step
      ln((0pt, y), (W, y), (paint: line-c.transparentize(if calc.rem(j, 5) == 0 { 84% } else { 93% }), thickness: if calc.rem(j, 5) == 0 { 0.45pt } else { 0.25pt }))
    }

    // ── sheet border with zone marks, as on a drawing sheet ──
    #let o = 13pt
    #let i = 21pt
    #place(dx: o, dy: o, rect(width: W - 2 * o, height: H - 2 * o, stroke: 0.5pt + chalk.transparentize(55%)))
    #place(dx: i, dy: i, rect(width: W - 2 * i, height: H - 2 * i, stroke: 0.9pt + chalk.transparentize(25%)))
    #for k in range(1, 4) {
      let x = i + k * (W - 2 * i) / 4
      ln((x, o), (x, i), 0.5pt + chalk.transparentize(55%))
      ln((x, H - i), (x, H - o), 0.5pt + chalk.transparentize(55%))
    }
    #for k in range(4) {
      let x = i + (k + 0.5) * (W - 2 * i) / 4
      label-at(x, (o + i) / 2 + 0.5pt, text(font: mono, size: 4.6pt, fill: chalk.transparentize(45%))[#(k + 1)], w: 20pt)
      label-at(x, H - (o + i) / 2 + 0.5pt, text(font: mono, size: 4.6pt, fill: chalk.transparentize(45%))[#(k + 1)], w: 20pt)
    }
    #for k in range(1, 6) {
      let y = i + k * (H - 2 * i) / 6
      ln((o, y), (i, y), 0.5pt + chalk.transparentize(55%))
      ln((W - i, y), (W - o, y), 0.5pt + chalk.transparentize(55%))
    }
    #for k in range(6) {
      let y = i + (k + 0.5) * (H - 2 * i) / 6
      let L = ("A", "B", "C", "D", "E", "F").at(k)
      label-at((o + i) / 2, y + 0.5pt, text(font: mono, size: 4.6pt, fill: chalk.transparentize(45%), L), w: 20pt)
      label-at(W - (o + i) / 2, y + 0.5pt, text(font: mono, size: 4.6pt, fill: chalk.transparentize(45%), L), w: 20pt)
    }

    // ── the drawing: a ship's wheel in front elevation ──
    #let cx = 196pt
    #let cy = 322pt
    #let r-rim = 78pt
    #let r-rim-in = 70pt
    #let r-hub = 17pt
    #let r-tip = 110pt
    #let s-main = 1.05pt + line-c
    #let s-thin = 0.5pt + line-c.transparentize(15%)
    #let s-centre = (paint: amber.transparentize(15%), thickness: 0.45pt, dash: "dash-dotted")
    #let pt(a, d) = (cx + d * calc.cos(a), cy + d * calc.sin(a))

    // centre lines, running past the part
    #ln((cx - r-tip - 22pt, cy), (cx + r-tip + 22pt, cy), s-centre)
    #ln((cx, cy - r-tip - 22pt), (cx, cy + r-tip + 22pt), s-centre)
    // pitch circle of the handles
    #place(dx: cx - 95pt, dy: cy - 95pt, circle(radius: 95pt, stroke: (paint: amber.transparentize(45%), thickness: 0.4pt, dash: "dash-dotted")))

    // rim: two circles; hub: two circles
    #place(dx: cx - r-rim, dy: cy - r-rim, circle(radius: r-rim, stroke: s-main))
    #place(dx: cx - r-rim-in, dy: cy - r-rim-in, circle(radius: r-rim-in, stroke: s-main))
    #place(dx: cx - r-hub, dy: cy - r-hub, circle(radius: r-hub, stroke: s-main))
    #place(dx: cx - 9pt, dy: cy - 9pt, circle(radius: 9pt, stroke: s-thin))
    #place(dx: cx - 3.2pt, dy: cy - 3.2pt, circle(radius: 3.2pt, fill: line-c.transparentize(10%)))

    // spokes (drawn as pairs of parallel edges) and turned handles beyond the rim
    #for k in range(8) {
      let a = k * 45deg + 22.5deg
      let nx = -calc.sin(a)
      let ny = calc.cos(a)
      for side in (-1, 1) {
        let off = side * 2.6pt
        let p1 = pt(a, r-hub)
        let p2 = pt(a, r-rim-in)
        ln((p1.at(0) + nx * off, p1.at(1) + ny * off), (p2.at(0) + nx * off, p2.at(1) + ny * off), s-thin)
      }
      // handle: a tapered grip from the rim to a knob
      let h1 = pt(a, r-rim)
      let h2 = pt(a, r-tip - 7pt)
      for side in (-1, 1) {
        let o1 = side * 3pt
        let o2 = side * 4.6pt
        ln((h1.at(0) + nx * o1, h1.at(1) + ny * o1), (h2.at(0) + nx * o2, h2.at(1) + ny * o2), s-thin)
      }
      let kn = pt(a, r-tip - 3pt)
      place(dx: kn.at(0) - 5pt, dy: kn.at(1) - 5pt, circle(radius: 5pt, stroke: s-main))
    }

    // hatched hub section, as if cut
    #for k in range(-3, 4) {
      let d = k * 3.2pt
      let half = calc.sqrt(calc.max(0, 8.6 * 8.6 - (d / 1pt) * (d / 1pt))) * 1pt
      ln((cx + d / 1.414 - half / 1.414, cy - d / 1.414 - half / 1.414), (cx + d / 1.414 + half / 1.414, cy - d / 1.414 + half / 1.414), 0.3pt + line-c.transparentize(40%))
    }

    // ── dimensions ──
    #let dim-col = chalk.transparentize(8%)
    #let s-dim = 0.45pt + dim-col
    #let s-ext = 0.35pt + dim-col.transparentize(35%)
    // pitch-circle diameter of the handles, below
    #let r-pcd = 95pt
    #let yd = cy + r-tip + 16pt
    #ln((cx - r-pcd, cy + 6pt), (cx - r-pcd, yd + 4pt), s-ext)
    #ln((cx + r-pcd, cy + 6pt), (cx + r-pcd, yd + 4pt), s-ext)
    #ln((cx - r-pcd, yd), (cx + r-pcd, yd), s-dim)
    #arrow((cx - r-pcd, yd), (cx, yd), dim-col)
    #arrow((cx + r-pcd, yd), (cx, yd), dim-col)
    #place(dx: cx - 30pt, dy: yd - 4.5pt, box(width: 60pt, fill: deep, inset: (x: 2pt, y: 1pt), align(center, text(font: mono, size: 6.5pt, fill: chalk)[Ø 570 #labels.pcd])))
    // rim diameter, right side (vertical)
    #let xd = cx + r-tip + 26pt
    #ln((cx + 8pt, cy - r-rim), (xd + 4pt, cy - r-rim), s-ext)
    #ln((cx + 8pt, cy + r-rim), (xd + 4pt, cy + r-rim), s-ext)
    #ln((xd, cy - r-rim), (xd, cy + r-rim), s-dim)
    #arrow((xd, cy - r-rim), (xd, cy), dim-col)
    #arrow((xd, cy + r-rim), (xd, cy), dim-col)
    #place(dx: xd - 5pt, dy: cy - 14pt, rotate(-90deg, origin: center, box(width: 40pt, fill: deep.transparentize(10%), align(center, text(font: mono, size: 6.5pt, fill: chalk)[Ø 468]))))
    // hub leader
    #let lp = pt(-45deg, r-hub)
    #let lq = (cx + 58pt, cy - 96pt)
    #ln(lp, lq, s-dim)
    #arrow(lp, lq, dim-col)
    #ln(lq, (lq.at(0) + 34pt, lq.at(1)), s-dim)
    #place(dx: lq.at(0) + 2pt, dy: lq.at(1) - 9pt, text(font: mono, size: 5.6pt, fill: chalk)[#labels.hub Ø 102])
    // angle callout between two handles
    #let ang-r = 52pt
    #let a0 = 22.5deg + 180deg
    #let a1 = a0 + 45deg
    #let arc-pts = range(0, 11).map(t => pt(a0 + (a1 - a0) * t / 10, ang-r))
    #for t in range(10) { ln(arc-pts.at(t), arc-pts.at(t + 1), 0.4pt + amber-lt.transparentize(10%)) }
    #let am = pt(a0 + 22.5deg, ang-r + 12pt)
    #label-at(am.at(0), am.at(1), text(font: mono, size: 5.6pt, fill: amber-lt)[45°], w: 24pt)
    // view label
    #place(dx: cx - 110pt, dy: yd + 12pt, box(width: 220pt, align(center)[
      #text(font: mono, size: 5.8pt, tracking: 1.4pt, fill: chalk.transparentize(20%))[#labels.view]
      #v(-6pt)
      #line(length: 58pt, stroke: 0.4pt + chalk.transparentize(40%))
      #v(-7pt)
      #text(font: mono, size: 5pt, tracking: 1pt, fill: chalk.transparentize(45%))[#labels.spokes]
    ]))

    // ── headline ──
    #place(dx: 38pt, dy: 42pt)[
      #text(font: mono, size: 6.8pt, weight: 500, fill: amber, tracking: 2.4pt)[#upper(series)]
    ]
    #place(dx: 38pt, dy: 58pt)[
      #block(width: 340pt)[
        #set par(leading: 0.22em)
        #text(font: display, size: 50pt, weight: 400, fill: chalk, tracking: -1.2pt)[#title.at(0)] \
        #text(font: display, size: 50pt, weight: 300, style: "italic", fill: amber-lt, tracking: -0.9pt)[#title.at(1)]
      ]
    ]
    #place(dx: 38pt, dy: 162pt)[
      #block(width: 250pt, text(font: display, size: 10.5pt, weight: 300, style: "italic", fill: chalk.transparentize(22%), tagline))
    ]

    // ── title block, bottom right ──
    #let tb-w = 214pt
    #let tb-x = W - i - tb-w
    #let tb-y = 497pt
    #let tb-h = H - i - tb-y
    #let s-tb = 0.6pt + chalk.transparentize(30%)
    #let cell(x, y, w, h, lab, val, size: 7pt, vfont: mono, vfill: chalk) = place(dx: x, dy: y, box(width: w, height: h, stroke: s-tb, inset: (x: 4pt, top: 3pt), {
      text(font: mono, size: 4.3pt, tracking: 0.8pt, fill: line-c.transparentize(15%), lab)
      v(-4.5pt)
      text(font: vfont, size: size, fill: vfill, val)
    }))
    #place(dx: tb-x, dy: tb-y, rect(width: tb-w, height: tb-h, fill: deep.transparentize(15%), stroke: 0.9pt + chalk.transparentize(25%)))
    #let r1 = 27pt
    #let r2 = (tb-h - r1) / 2
    #cell(tb-x, tb-y, tb-w * 0.62, r1, labels.drawing, [#title.at(0) #title.at(1)], size: 11pt, vfont: display)
    #cell(tb-x + tb-w * 0.62, tb-y, tb-w * 0.38, r1, labels.edition, edition, size: 7pt, vfill: amber-lt)
    #cell(tb-x, tb-y + r1, tb-w * 0.62, r2, labels.drawn, author, size: 6.4pt)
    #cell(tb-x + tb-w * 0.62, tb-y + r1, tb-w * 0.38, r2, labels.date, upper(date), size: 6.4pt)
    #cell(tb-x, tb-y + r1 + r2, tb-w * 0.31, r2, labels.scale, [1 : 10], size: 6.4pt)
    #cell(tb-x + tb-w * 0.31, tb-y + r1 + r2, tb-w * 0.31, r2, labels.sheet, [01 / 01], size: 6.4pt)
    #cell(tb-x + tb-w * 0.62, tb-y + r1 + r2, tb-w * 0.38, r2, labels.rev, revision, size: 6.4pt)

    // ── author and project, bottom left ──
    #place(dx: 38pt, dy: 507pt)[
      #text(font: mono, size: 5.2pt, tracking: 1.2pt, fill: line-c.transparentize(10%))[#labels.project]
    ]
    #place(dx: 38pt, dy: 517pt)[
      #block(width: 130pt)[
        #set par(leading: 0.4em)
        #text(font: display, size: 11pt, fill: chalk)[#series] \
        #text(font: display, size: 9pt, style: "italic", weight: 300, fill: chalk.transparentize(25%))[#author]
      ]
    ]
    #place(dx: 38pt, dy: 556pt, line(length: 26pt, stroke: 1.4pt + amber))
  ]
]

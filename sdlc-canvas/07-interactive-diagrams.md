## Interactive diagrams

> These fenced `pipeline-graph` blocks are the **machine-readable snapshot** of the model.
> `index.html` renders each as a live, editable canvas (drag · rename · add/remove nodes &
> edges · pop out to full-screen). Edit here, or edit on the site and use **Export** to copy
> the JSON back over the matching block — the visuals stay regenerable from this file.

```pipeline-graph
{
  "title": "The unit loop",
  "nodes": [
    {"id":"define","label":"define","group":"beat","x":0,"y":0},
    {"id":"do","label":"do","group":"beat","x":210,"y":0},
    {"id":"check","label":"check","group":"beat","x":420,"y":0},
    {"id":"reflect","label":"reflect","group":"beat","x":630,"y":0},
    {"id":"specify","label":"specify","group":"element","x":0,"y":95},
    {"id":"scope","label":"scope","group":"element","x":0,"y":165},
    {"id":"design","label":"design","group":"element","x":0,"y":235},
    {"id":"implement","label":"implement","group":"element","x":210,"y":95},
    {"id":"verify","label":"verify (build)","group":"element","x":420,"y":95},
    {"id":"observe","label":"observe (run)","group":"element","x":420,"y":165},
    {"id":"analyze","label":"analyze","group":"element","x":630,"y":95},
    {"id":"decide","label":"decide","group":"element","x":630,"y":165},
    {"id":"accept","label":"accept · known issue","group":"terminal","x":630,"y":240},
    {"id":"escalate","label":"escalate","group":"repertoire","x":0,"y":350},
    {"id":"degrade","label":"degrade","group":"repertoire","x":210,"y":350},
    {"id":"recover","label":"recover","group":"repertoire","x":420,"y":350},
    {"id":"rollback","label":"roll back","group":"repertoire","x":630,"y":350}
  ],
  "edges": [
    {"source":"define","target":"do"},
    {"source":"do","target":"check"},
    {"source":"check","target":"reflect"},
    {"source":"reflect","target":"define","dashed":true,"label":"re-target ↺"},
    {"source":"decide","target":"accept","label":"accept"},
    {"source":"define","target":"specify","member":true},
    {"source":"define","target":"scope","member":true},
    {"source":"define","target":"design","member":true},
    {"source":"do","target":"implement","member":true},
    {"source":"check","target":"verify","member":true},
    {"source":"check","target":"observe","member":true},
    {"source":"reflect","target":"analyze","member":true},
    {"source":"reflect","target":"decide","member":true}
  ]
}
```

```pipeline-graph
{
  "title": "The complete circuit",
  "nodes": [
    {"id":"evolve","label":"evolve (Ouroboros)","group":"terminal","x":360,"y":0},
    {"id":"reliable","label":"reliable","group":"property","x":100,"y":100},
    {"id":"predictable","label":"predictable","group":"property","x":360,"y":100},
    {"id":"resilient","label":"resilient","group":"property","x":620,"y":100},
    {"id":"secure","label":"secure","group":"property","x":880,"y":100},
    {"id":"converges","label":"converges","group":"beat","x":100,"y":215},
    {"id":"bounded","label":"bounded","group":"beat","x":360,"y":215},
    {"id":"nests","label":"nests & escalate","group":"beat","x":620,"y":215},
    {"id":"preempts","label":"preempts","group":"beat","x":880,"y":215},
    {"id":"loop","label":"the loop","group":"beat","x":360,"y":320},
    {"id":"intent","label":"intent hidden","group":"stone","x":-40,"y":440},
    {"id":"finite","label":"finite","group":"stone","x":120,"y":440},
    {"id":"complex","label":"complex","group":"stone","x":270,"y":440},
    {"id":"err","label":"we err","group":"stone","x":420,"y":440},
    {"id":"change","label":"change","group":"stone","x":560,"y":440},
    {"id":"uncertain","label":"uncertain","group":"stone","x":710,"y":440},
    {"id":"distributed","label":"distributed & perishable","group":"stone","x":880,"y":440},
    {"id":"adversarial","label":"adversarial actors","group":"stone","x":1060,"y":440},
    {"id":"reflexivity","label":"reflexivity (#9 · 2nd-order · autonomous)","group":"stone","x":-180,"y":40},
    {"id":"incentives","label":"incentive-divergence (#10 · 2nd-order · delegated)","group":"stone","x":-180,"y":560}
  ],
  "edges": [
    {"source":"intent","target":"loop","member":true},
    {"source":"finite","target":"loop","member":true},
    {"source":"complex","target":"loop","member":true},
    {"source":"err","target":"loop","member":true},
    {"source":"change","target":"loop","member":true},
    {"source":"uncertain","target":"loop","member":true},
    {"source":"distributed","target":"loop","member":true},
    {"source":"adversarial","target":"loop","member":true},
    {"source":"loop","target":"converges"},
    {"source":"loop","target":"bounded"},
    {"source":"loop","target":"nests"},
    {"source":"loop","target":"preempts"},
    {"source":"converges","target":"reliable"},
    {"source":"bounded","target":"predictable"},
    {"source":"nests","target":"resilient"},
    {"source":"preempts","target":"secure"},
    {"source":"reliable","target":"evolve"},
    {"source":"predictable","target":"evolve"},
    {"source":"resilient","target":"evolve"},
    {"source":"secure","target":"evolve"},
    {"source":"evolve","target":"loop","dashed":true,"label":"re-target"},
    {"source":"reflexivity","target":"reliable","dashed":true,"label":"erodes if autonomous (#9)"},
    {"source":"incentives","target":"reliable","dashed":true,"label":"erodes if delegated (#10)"}
  ]
}
```

**The fractal** — the same loop nested *up* across scope and *down* into each beat (§5).

```pipeline-graph
{
  "title": "The fractal — one loop, nested both ways",
  "nodes": [
    {"id":"s_action","label":"action","group":"element","x":0,"y":0},
    {"id":"s_feature","label":"feature","group":"element","x":150,"y":0},
    {"id":"s_stage","label":"stage","group":"element","x":300,"y":0},
    {"id":"s_release","label":"release","group":"element","x":450,"y":0},
    {"id":"s_product","label":"product","group":"element","x":600,"y":0},
    {"id":"b_define","label":"define","group":"beat","x":150,"y":130},
    {"id":"b_do","label":"do","group":"beat","x":330,"y":130},
    {"id":"b_check","label":"check","group":"beat","x":510,"y":130},
    {"id":"b_reflect","label":"reflect","group":"beat","x":690,"y":130},
    {"id":"human","label":"human (escape hatch)","group":"terminal","x":880,"y":130},
    {"id":"c_define","label":"define","group":"element","x":150,"y":280},
    {"id":"c_do","label":"do","group":"element","x":330,"y":280},
    {"id":"c_check","label":"check","group":"element","x":510,"y":280},
    {"id":"c_reflect","label":"reflect","group":"element","x":690,"y":280}
  ],
  "edges": [
    {"source":"s_action","target":"s_feature","member":true,"label":"⊂"},
    {"source":"s_feature","target":"s_stage","member":true,"label":"⊂"},
    {"source":"s_stage","target":"s_release","member":true,"label":"⊂"},
    {"source":"s_release","target":"s_product","member":true,"label":"⊂"},
    {"source":"s_feature","target":"b_define","member":true,"label":"any scope = a loop"},
    {"source":"b_define","target":"b_do"},
    {"source":"b_do","target":"b_check"},
    {"source":"b_check","target":"b_reflect"},
    {"source":"b_reflect","target":"b_define","dashed":true,"label":"re-target ↺"},
    {"source":"b_reflect","target":"human","dashed":true,"label":"escalate → human"},
    {"source":"b_define","target":"c_define","member":true,"label":"any beat = a loop (downward)"},
    {"source":"c_define","target":"c_do"},
    {"source":"c_do","target":"c_check"},
    {"source":"c_check","target":"c_reflect"},
    {"source":"c_reflect","target":"c_define","dashed":true,"label":"re-target ↺"},
    {"source":"c_reflect","target":"b_reflect","dashed":true,"label":"escalate ↑"}
  ]
}
```

**The process flow** — the lifecycle, with the build loop, the operate loop, and the Ouroboros (§7).

```pipeline-graph
{
  "title": "The process flow (lifecycle with nested loops)",
  "nodes": [
    {"id":"discover","label":"discover","group":"element","x":0,"y":0},
    {"id":"define","label":"define","group":"element","x":140,"y":0},
    {"id":"design","label":"design","group":"element","x":280,"y":0},
    {"id":"plan","label":"plan","group":"element","x":420,"y":0},
    {"id":"build","label":"BUILD","group":"beat","x":560,"y":0},
    {"id":"verify","label":"verify","group":"element","x":700,"y":0},
    {"id":"release","label":"release","group":"element","x":840,"y":0},
    {"id":"operate","label":"OPERATE","group":"beat","x":980,"y":0},
    {"id":"rollback","label":"roll back","group":"repertoire","x":700,"y":135},
    {"id":"recover","label":"recover","group":"repertoire","x":840,"y":135},
    {"id":"degrade","label":"degrade","group":"repertoire","x":980,"y":135},
    {"id":"escalate","label":"escalate","group":"repertoire","x":1120,"y":135},
    {"id":"evolve","label":"evolve (Ouroboros)","group":"terminal","x":460,"y":165}
  ],
  "edges": [
    {"source":"discover","target":"define"},
    {"source":"define","target":"design"},
    {"source":"design","target":"plan"},
    {"source":"plan","target":"build"},
    {"source":"build","target":"verify"},
    {"source":"verify","target":"release"},
    {"source":"release","target":"operate"},
    {"source":"verify","target":"design","dashed":true,"label":"shift-left ↺"},
    {"source":"operate","target":"rollback","dashed":true},
    {"source":"operate","target":"recover","dashed":true},
    {"source":"operate","target":"degrade","dashed":true},
    {"source":"operate","target":"escalate","dashed":true},
    {"source":"operate","target":"evolve","dashed":true,"label":"learn"},
    {"source":"evolve","target":"discover","dashed":true,"label":"evolve target ↺"}
  ]
}
```

**The artifacts** — stone #7's per-beat carriers, each crossing the *time* and *agent* boundaries (§9).
Forward artifacts *insure* a live hand-off; `reflect`'s two backward edges are the **sole channel** —
the boundary-distance law at its extreme (§9/§10.5; T10, closed iter 34).

```pipeline-graph
{
  "title": "The artifacts — stone #7's per-beat carriers",
  "nodes": [
    {"id":"define","label":"define","group":"beat","x":0,"y":0},
    {"id":"do","label":"do","group":"beat","x":0,"y":90},
    {"id":"check","label":"check","group":"beat","x":0,"y":180},
    {"id":"reflect","label":"reflect","group":"beat","x":0,"y":270},
    {"id":"overtime","label":"repeat over time","group":"element","x":0,"y":360},
    {"id":"repertoire","label":"resilience repertoire","group":"repertoire","x":0,"y":450},
    {"id":"a_spec","label":"spec / target doc","group":"property","x":300,"y":0},
    {"id":"a_code","label":"code","group":"property","x":300,"y":90},
    {"id":"a_tests","label":"tests + telemetry","group":"property","x":300,"y":180},
    {"id":"a_post","label":"reflect-output · ADR + post-mortem","group":"property","x":300,"y":270},
    {"id":"a_version","label":"version history","group":"property","x":300,"y":360},
    {"id":"a_runbook","label":"runbooks","group":"property","x":300,"y":450},
    {"id":"b_time","label":"TIME → persist","group":"stone","x":620,"y":135},
    {"id":"b_agent","label":"AGENT → make explicit","group":"stone","x":620,"y":315},
    {"id":"c_next","label":"next iteration's define (evolve feed)","group":"element","x":950,"y":135},
    {"id":"c_root","label":"a later root-causer (analyze's operand)","group":"element","x":950,"y":315}
  ],
  "edges": [
    {"source":"define","target":"a_spec","label":"produces"},
    {"source":"do","target":"a_code","label":"produces"},
    {"source":"check","target":"a_tests","label":"produces"},
    {"source":"reflect","target":"a_post","label":"produces"},
    {"source":"overtime","target":"a_version","label":"produces"},
    {"source":"repertoire","target":"a_runbook","label":"produces"},
    {"source":"a_version","target":"b_time","dashed":true,"label":"crosses"},
    {"source":"a_spec","target":"b_agent","dashed":true,"label":"insures — forward hand-off is live"},
    {"source":"a_runbook","target":"b_time","dashed":true},
    {"source":"a_post","target":"b_agent","dashed":true,"label":"ADR · sole channel"},
    {"source":"a_post","target":"b_time","dashed":true,"label":"post-mortem · sole channel"},
    {"source":"b_agent","target":"c_root","dashed":true,"label":"crosses AGENT →"},
    {"source":"b_time","target":"c_next","dashed":true,"label":"crosses TIME →"}
  ]
}
```

**Done propagation** — the root Done is *elicited*, `design` *decomposes* it into sub-Dones (each edge a composition hypothesis), leaves bottom out in binary checks, and a rejected qualitative composite *falsifies the hypothesis* → back to `design` (§10).

```pipeline-graph
{
  "title": "Done propagation — elicit · decompose · bottom-out",
  "nodes": [
    {"id":"intent","label":"hidden intent","group":"stone","x":0,"y":0},
    {"id":"specify","label":"specify · elicit","group":"element","x":0,"y":95},
    {"id":"root","label":"root Done P","group":"beat","x":260,"y":95},
    {"id":"design","label":"design · decompose","group":"element","x":260,"y":195},
    {"id":"cA","label":"sub-Done A","group":"beat","x":110,"y":300},
    {"id":"cB","label":"sub-Done B · qualitative","group":"beat","x":440,"y":300},
    {"id":"accept","label":"human accept","group":"terminal","x":700,"y":300},
    {"id":"leaf1","label":"leaf · deterministic","group":"property","x":-20,"y":410},
    {"id":"leaf2","label":"leaf · deterministic","group":"property","x":200,"y":410},
    {"id":"leaf3","label":"leaf · statistical proxy","group":"property","x":440,"y":410}
  ],
  "edges": [
    {"source":"intent","target":"specify","member":true,"label":"elicit"},
    {"source":"specify","target":"root","label":"sets P"},
    {"source":"root","target":"design","label":"decompose"},
    {"source":"design","target":"cA","label":"hyp: (∧Lᵢ)⟹P"},
    {"source":"design","target":"cB","label":"hyp: (∧Lᵢ)⟹P"},
    {"source":"cA","target":"leaf1"},
    {"source":"cA","target":"leaf2"},
    {"source":"cB","target":"leaf3"},
    {"source":"cB","target":"accept","dashed":true,"label":"qualitative → human"},
    {"source":"accept","target":"design","dashed":true,"label":"falsified → re-decompose ↺"}
  ]
}
```

**Stub-composition** — `design` states a bet (contracts + composition hypothesis); a design-time **stub-composition** check *fails cheap* (→ re-decompose) or *survives*, discharging the **wiring (⟹)** and suspending **Premise A** (→ `verify` / deterministic leaf) and **Premise B** (→ `observe` / statistical leaf) (§10.1).

```pipeline-graph
{
  "title": "Stub-composition — the design bet, factored",
  "nodes": [
    {"id":"design","label":"design · state the bet","group":"element","x":0,"y":120},
    {"id":"contracts","label":"interface contracts","group":"property","x":250,"y":40},
    {"id":"hyp","label":"composition hyp (∧Lᵢ)⟹P","group":"beat","x":250,"y":200},
    {"id":"stub","label":"stub-composition (design-time check)","group":"element","x":540,"y":120},
    {"id":"fail","label":"fail → re-decompose","group":"terminal","x":540,"y":280},
    {"id":"survive","label":"survive (conditional)","group":"beat","x":830,"y":120},
    {"id":"wiring","label":"⟹ wiring · discharged","group":"property","x":1090,"y":20},
    {"id":"premA","label":"Premise A · leaves real","group":"beat","x":1090,"y":120},
    {"id":"premB","label":"Premise B · whole value-domain","group":"beat","x":1090,"y":230},
    {"id":"verify","label":"verify → deterministic leaf","group":"element","x":1400,"y":120},
    {"id":"observe","label":"observe → statistical leaf","group":"element","x":1400,"y":230}
  ],
  "edges": [
    {"source":"design","target":"contracts","member":true},
    {"source":"design","target":"hyp","member":true},
    {"source":"hyp","target":"stub","label":"stub it"},
    {"source":"stub","target":"fail","dashed":true,"label":"fails cheap ↺"},
    {"source":"fail","target":"design","dashed":true,"label":"re-decompose"},
    {"source":"stub","target":"survive","label":"green"},
    {"source":"survive","target":"wiring","label":"discharges ⟹"},
    {"source":"survive","target":"premA","dashed":true,"label":"suspends"},
    {"source":"survive","target":"premB","dashed":true,"label":"suspends"},
    {"source":"premA","target":"verify","label":"build-time"},
    {"source":"premB","target":"observe","label":"run-time"}
  ]
}
```

**Premise-B lever** — contract-tightness is a dial: it shrinks premise B (buys `predictable`, moving residue statistical → deterministic → a-priori), but the **floor** is the required set of realities (`reliable` + `resilient`) — so the bar is *tightest-sufficient*, not tightest (§10.2).

```pipeline-graph
{
  "title": "The premise-B lever — contract-tightness dial (floor = reliability)",
  "nodes": [
    {"id":"loose","label":"loose contract","group":"property","x":0,"y":0},
    {"id":"tsuff","label":"tightest-sufficient · THE BAR","group":"beat","x":330,"y":0},
    {"id":"over","label":"over-tight","group":"terminal","x":660,"y":0},
    {"id":"stat","label":"statistical leaf → observe (residue>0)","group":"element","x":0,"y":140},
    {"id":"det","label":"deterministic / a-priori leaf → verify · compile (residue→0)","group":"element","x":330,"y":140},
    {"id":"unrel","label":"rejects a required reality → UNRELIABLE","group":"stone","x":660,"y":140},
    {"id":"floor","label":"FLOOR = required set of realities (reliable + resilient)","group":"stone","x":330,"y":260},
    {"id":"pred","label":"tightening buys predictable · premise B ↓","group":"property","x":330,"y":-120}
  ],
  "edges": [
    {"source":"loose","target":"tsuff","member":true,"label":"tighten →"},
    {"source":"tsuff","target":"over","member":true,"dashed":true,"label":"one step too far"},
    {"source":"loose","target":"stat","label":"sampled"},
    {"source":"tsuff","target":"det","label":"exhausted / unrepresentable"},
    {"source":"over","target":"unrel","dashed":true},
    {"source":"tsuff","target":"pred","dashed":true,"label":"max predictability…"},
    {"source":"tsuff","target":"floor","member":true,"label":"…subject to the floor"},
    {"source":"over","target":"floor","dashed":true,"label":"breaches floor"}
  ]
}
```

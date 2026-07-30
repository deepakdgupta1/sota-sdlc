## 8. The two repertoires: resilience and security

<sup>[↪ Why](#r-apex-02)</sup>

**What it is.** Some responses are not beats in the forward flow — they are a **repertoire** of moves
the loop can invoke from `reflect`, at *any* element and *any* scale, mostly at run time. There are two
repertoires, one per source of hardness, and together they manufacture the two envelope-properties.

**Why two, not one.** Chapter 2 showed that context-hardness has two sources: *random* (a blind
sampler — stones #5, #6) and *directed* (a worst-case searcher — stone #8). Each needs its own kit,
because the statistical moves that beat randomness can be turned *against* you by a searcher.

### The resilience repertoire — against random hardship (→ resilient)

<sup>[↪ Why](#r-apex-02)</sup>

| Response | What it does | Example |
|---|---|---|
| **escalate** | Hand up when bounded tries are exhausted; ends at a human. | Retries for one email domain keep failing → page the on-call. |
| **degrade** | Fail partial, not total (graceful degradation). | Email provider down → queue the request and say "arriving shortly" instead of returning a 500. |
| **recover** | Spares, replicas, retries so the function survives a failure (redundancy). | A second email provider takes over when the primary fails. |
| **roll back** | Revert to the last known-good state. | A new template spikes bounce rates → redeploy the previous one. |

**The repertoire's compact form.** The four responses are not four of a kind. **Escalate** is the one
*structural up-exit* — it leaves the loop entirely, handing the problem to the parent loop and
ultimately to a human. The other three are *in-place* trades for liveness, distinguished by what each
**trades away**: `degrade` trades *completeness*, `recover` trades *spares* (redundancy), `roll back`
trades *newness*. They also pair off by stone: `degrade`/`recover` answer **uncertainty** (#6 — the
*context* pair), while `roll back` answers **change** (#5 — the *time* pair), whose build-time twin is
the **regression test** (§10.1): rollback un-sticks a bad change at run time; regression keeps a good
fix stuck at build time.

### The security repertoire — against a directed adversary (→ secure)

<sup>[↪ Why](#r-bedrock-05)</sup>

| Response | What it does | Example |
|---|---|---|
| **authenticate / authorize** | Prove identity, then gate every action by least privilege. | Signed-in ≠ allowed; check the permission on each request. |
| **sanitize / validate** | Narrow every boundary contract; never trust external data. | Parameterised queries (SQL injection), output-encoding (XSS), CSRF tokens. |
| **minimise surface / harden** | Least exposure; secrets in a vault; no information leaked in errors. | Secrets from the keychain; generic error messages. |
| **threat-model / red-team** | Search for your *own* worst case before the adversary does. | Penetration test; abuse-case review at design time. |

**A seam worth noticing.** `sanitize / validate` is exactly the "narrow the contract" lever from
Chapter 9 — but here its floor is set by an *attacker*, not by natural variance. That is precisely why
"never trust external data" is a **hard gate** (Chapter 11) and not merely good advice: the downside is
non-local.

> ▸ **Chart — "The two repertoires"** <sup>[↪ Why](#r-apex-02)</sup> · *L2 · cross-cutting.* Left: random hardness → resilient →
> four resilience moves. Right: a directed adversary → secure → four security moves. Same shape,
> different opponent.

```pipeline-graph
{
  "title": "The two repertoires",
  "level": "L2 · cross-cutting",
  "summary": "Two families of cross-cutting responses invoked from reflect: resilience against blind/random hardship, security against a directed adversary. Statistical moves that beat randomness can backfire against a searcher.",
  "zoomOut": "The unit loop, fully staffed",
  "nodes": [
    {"id":"random","label":"RANDOM hardness (#5 change · #6 uncertain) — a blind sampler","group":"stone","x":0,"y":0},
    {"id":"directed","label":"DIRECTED hardness (#8 adversary) — a worst-case searcher","group":"stone","x":640,"y":0},
    {"id":"resilient","label":"→ resilient","group":"property","x":160,"y":110},
    {"id":"secure","label":"→ secure","group":"property","x":800,"y":110},
    {"id":"escalate","label":"escalate","group":"repertoire","x":-40,"y":220},
    {"id":"degrade","label":"degrade","group":"repertoire","x":110,"y":220},
    {"id":"recover","label":"recover","group":"repertoire","x":260,"y":220},
    {"id":"rollback","label":"roll back","group":"repertoire","x":410,"y":220},
    {"id":"authz","label":"authenticate / authorize","group":"repertoire","x":600,"y":220},
    {"id":"sanitize","label":"sanitize / validate","group":"repertoire","x":820,"y":220},
    {"id":"harden","label":"minimise surface / harden","group":"repertoire","x":600,"y":300},
    {"id":"redteam","label":"threat-model / red-team","group":"repertoire","x":820,"y":300}
  ],
  "edges": [
    {"source":"random","target":"resilient","label":"envelope"},
    {"source":"directed","target":"secure","label":"envelope"},
    {"source":"resilient","target":"escalate","member":true},
    {"source":"resilient","target":"degrade","member":true},
    {"source":"resilient","target":"recover","member":true},
    {"source":"resilient","target":"rollback","member":true},
    {"source":"secure","target":"authz","member":true},
    {"source":"secure","target":"sanitize","member":true},
    {"source":"secure","target":"harden","member":true},
    {"source":"secure","target":"redteam","member":true}
  ]
}
```

> **⟐ Under autonomy.** `threat-model / red-team` does double duty. It is the response to the external
> adversary (stone #8) *and* the response to the internal shared blind spot (stone #9): an
> *independent, adversarial* checker who deliberately does not share the builder's assumptions is
> exactly what breaks the doer-checker correlation. An autonomous pipeline has no free human
> escape-hatch to fall back on, so it must inject this independence deliberately.

---


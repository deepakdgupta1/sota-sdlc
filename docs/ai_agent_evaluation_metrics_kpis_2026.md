# AI Agent Evaluation Metrics and KPIs

**Scope:** Analytics, metrics, and KPIs for evaluating an AI agent's effectiveness across performance, efficiency, and accuracy.  
**Research horizon:** State of the art as of **June 2026**.  
**Audience:** Product, engineering, applied AI, platform, risk, and operations teams deciding what to instrument and report.

---

## Executive Summary

AI-agent evaluation has moved beyond model-only benchmarks and final-answer grading. The strongest 2025-2026 practice is to evaluate the **whole trajectory**: user intent, plan, context retrieval, tool calls, intermediate state, final output, side effects, latency, cost, user outcome, and safety incidents.

The minimum viable KPI set for a production AI agent is:

| KPI | What it measures | Why it matters |
| --- | --- | --- |
| **Verified Task Success Rate** | Percentage of tasks completed correctly under deterministic, rubric, or human-validated grading | The best single outcome metric. It measures whether the agent actually solved the user problem, not whether it sounded plausible. |
| **Accuracy / Quality Score** | Correctness, groundedness, instruction adherence, policy adherence, and output quality | Catches wrong answers, hallucinations, missing constraints, and superficially successful but low-quality completions. |
| **Trajectory Quality Score** | Correct tool choice, argument correctness, step ordering, recovery behavior, and absence of loops | Modern agents fail in the path, not only the final answer. This is central for tool-using, browser, coding, and workflow agents. |
| **Cost per Successful Task** | Total model, tool, compute, and human-review cost divided by successful completed tasks | Prevents "success" from being bought with excessive tokens, retries, manual review, or expensive models. |
| **P95 End-to-End Completion Latency** | User-perceived time from request to usable result, tracked at p50/p95/p99 | Averages hide painful slow runs. Agents are multi-step systems, so tail latency is usually the user experience. |
| **Human Intervention / Escalation Rate** | Percentage of runs needing human takeover, approval, correction, or support escalation | Practical autonomy metric. A low intervention rate with high success is the business value of an agent. |
| **Critical Error / Incident Rate** | Unsafe actions, data loss, policy violations, privacy leaks, security failures, or harmful side effects per run | Agents act. A small number of high-severity failures can dominate value and trust. |
| **User Outcome Signal** | Acceptance rate, task reopening rate, CSAT, thumbs-up/down, retention, or workflow-specific conversion | Bridges offline evals to real user value. Offline pass rates alone do not guarantee product effectiveness. |

Use these as the top-level dashboard. Underneath them, maintain separate diagnostic metrics for planning, retrieval, tool use, execution, answer quality, cost, latency, robustness, and safety.

---

## SOTA Context as of June 2026

The latest agent-evaluation literature and tooling point to seven shifts:

1. **Outcome-only scores are insufficient.** Agent benchmarks increasingly audit planning, interaction, tool use, state changes, and recovery behavior, not only final answers. AgentAtlas, published in May 2026, explicitly argues for evaluation beyond outcome leaderboards and audits 15 agent benchmarks across multiple evaluation axes.

2. **Task environments are becoming more realistic.** SWE-bench evaluates real software issues; WebArena evaluates browser agents in realistic websites; OSWorld evaluates agents operating real desktop environments; GAIA evaluates general-assistant tasks requiring reasoning, multimodality, web browsing, and tool use.

3. **Benchmark freshness and leakage resistance matter.** Live, held-out, canary, or newly generated task sets are increasingly important because public benchmark saturation and leakage can inflate apparent capability.

4. **Tool and function-call accuracy is now a first-class metric.** BFCL V4, ToolBench-style tests, tau-bench, and tau2-bench all treat tool choice, arguments, order, and interaction quality as measurable behaviors.

5. **Efficiency is part of capability.** METR's time-horizon work reframes capability as the length of tasks an AI can complete at a target success probability, while production observability standards track tokens, latency, cost, and step counts.

6. **Agent observability has standardized around traces.** OpenTelemetry's GenAI semantic conventions and 2026 GenAI observability guidance emphasize spans, metrics, events, token counts, model calls, tool calls, and per-request cost.

7. **Security and robustness are inseparable from accuracy.** AgentDojo and related work show that agents can preserve benign-task utility while failing under indirect prompt injection or malicious tool/context content. This means "accuracy" should include adversarial and policy-constrained correctness.

---

## KPI Taxonomy

### 1. Outcome and Business Effectiveness

| Metric / KPI | Definition | Rationale | Measurement notes |
| --- | --- | --- | --- |
| **Verified Task Success Rate (VTSR)** | `successful verified tasks / attempted tasks` | Core effectiveness metric. It rewards actual completion, not verbosity or plausibility. | Prefer deterministic validators when possible: tests pass, database state matches expected result, browser task completed, ticket updated correctly. Use calibrated human or LLM judges for open-ended tasks. |
| **Task Completion Rate** | `runs reaching an end state / attempted runs` | Separates "agent finished" from "agent was correct." Useful for diagnosing crashes, timeouts, tool failures, and refusal behavior. | Track alongside VTSR. A high completion rate with low success indicates confident wrongness. |
| **Acceptance Rate** | `agent outputs accepted by user or downstream system / completed outputs` | Captures whether the result was useful enough for real adoption. | For coding agents: patch merged, PR accepted, tests accepted. For support agents: answer accepted, no reopen. |
| **Rework / Reopen Rate** | `tasks reopened, corrected, reverted, or escalated after agent completion / completed tasks` | Catches latent quality failures missed by immediate grading. | Use delayed windows: 24 hours, 7 days, or domain-specific SLA windows. |
| **Automation Rate** | `tasks fully handled without human intervention / eligible tasks` | Measures business leverage. A successful agent that still needs constant human steering has limited operational value. | Segment by task complexity, user type, and risk tier. |
| **Human Handoff / Escalation Rate** | `handoffs or approvals / attempted tasks` | A practical autonomy metric and a safety valve indicator. | Track voluntary handoff, policy-required approval, user-requested escalation, and failure-driven escalation separately. |
| **Business Impact per Task** | Revenue protected, time saved, support contacts deflected, engineering hours saved, or conversion lift per successful task | Connects agent metrics to ROI. | Avoid using this alone; it can mask unsafe or low-quality behavior. Pair with incident and rework rates. |

### 2. Accuracy and Quality

| Metric / KPI | Definition | Rationale | Measurement notes |
| --- | --- | --- | --- |
| **Final Answer Correctness** | Exact match, unit-test pass, semantic equivalence, or rubric score for the final output | Measures whether the answer is right. Essential for QA, data analysis, coding, research, and workflow agents. | Use task-specific graders. Exact match is appropriate for short factual answers; rubric grading is better for synthesis. |
| **Groundedness / Faithfulness** | Share of claims supported by retrieved context, tool outputs, files, or trusted sources | Hallucination is an accuracy failure. Groundedness distinguishes supported answers from fluent inventions. | Use claim extraction + evidence matching, RAGAS-style faithfulness, citation checks, or human audit. |
| **Instruction Adherence** | Degree to which the agent followed user, system, policy, and format constraints | Agents often produce plausible but non-compliant outputs. | Score constraints independently: required format, forbidden actions, scope limits, privacy rules, refusal conditions. |
| **Policy Compliance** | `policy-compliant runs / audited runs`; severity-weighted violation rate | Accuracy includes doing the right thing under rules, especially for regulated workflows. | Keep severity tiers. A single high-severity violation should not be averaged away. |
| **Tool Selection Accuracy** | `correct tool selections / tool-decision opportunities` | The agent's action quality depends on choosing the right tool at the right time. | Grade against golden traces where available; otherwise judge whether the tool was necessary, sufficient, and allowed. |
| **Tool Argument Correctness** | Exact or semantic correctness of tool parameters | Wrong arguments can corrupt data, retrieve irrelevant context, or fail silently. | BFCL-style AST/executable checks are useful for structured function calls. For real tools, validate input schemas and expected side effects. |
| **Tool Result Interpretation Accuracy** | Correct use of returned tool results in subsequent reasoning and final answer | Agents can call the right tool and still misread the result. | Compare final claims and next actions against the tool output. Track contradiction and omission rates. |
| **Retrieval Precision / Recall** | Relevant retrieved chunks among retrieved chunks; retrieved relevant chunks among all relevant chunks | For RAG agents, retrieval quality strongly bounds answer quality. | Track context precision@k, context recall, answer relevancy, and noise ratio. |
| **Citation / Evidence Accuracy** | Citations point to sources that actually support the cited claim | Prevents misleading source decoration. | Use source-span verification, URL availability checks, and claim-to-source matching. |
| **Calibration** | Match between confidence estimates and observed correctness; Brier score or expected calibration error | A useful agent should know when it is uncertain and ask, abstain, or escalate. | Calibrate per task type. Track overconfident wrong answers separately. |
| **Consistency / Reproducibility** | Variance in outcomes across repeated runs on the same task | High variance means unstable behavior, hidden nondeterminism, or brittle prompts/tools. | Use repeated-run pass@k, majority consistency, and trace divergence. |
| **Adversarial Robustness** | Utility under attack, attack success rate, unsafe-action rate under malicious context | Agents are exposed to untrusted webpages, files, emails, tickets, and tool results. | AgentDojo-style tests measure benign utility and prompt-injection attack success rate together. |

### 3. Trajectory, Planning, and Autonomy

| Metric / KPI | Definition | Rationale | Measurement notes |
| --- | --- | --- | --- |
| **Trajectory Quality Score** | Weighted score over plan quality, tool choices, arguments, observation use, recovery, and final answer | Captures whether the agent's process was reliable and inspectable. | Score with trace evaluators, golden paths, human review, or agent-as-judge calibrated against human labels. |
| **Plan Validity** | Plan is relevant, complete enough, and respects constraints | Bad plans lead to expensive or unsafe action chains. | Grade only when planning is explicit or recoverable from traces. |
| **Step Efficiency** | `minimal or reference steps / actual steps`, or inverse of redundant steps per successful run | Efficient agents solve tasks without unnecessary loops, repeated browsing, or repeated tool calls. | Segment by task class; some exploration is healthy in research tasks. |
| **Loop / Stagnation Rate** | Runs with repeated actions, repeated tool failures, no new information, or repeated self-corrections | Looping is a common agent failure and cost driver. | Detect repeated tool signatures, repeated URLs/files, unchanged state, or no-progress spans. |
| **Recovery Rate** | `runs that recover after tool/model/environment error / runs with recoverable errors` | Measures resilience, not just happy-path accuracy. | Track recovery from invalid tool call, timeout, permission denial, failed test, bad retrieval, and user correction. |
| **Autonomy Level** | Share of tasks completed without human steering; intervention-free success rate | Distinguishes copilots from autonomous agents. | Pair with task risk. Higher autonomy is not always better for high-risk actions. |
| **50% Task-Completion Time Horizon** | Human-equivalent task duration at which the agent succeeds 50% of the time | Useful SOTA capability metric for long-horizon agents. | METR proposes this for measuring how long and complex a task frontier models can complete. |
| **Clarification Quality** | Correctly asks for missing information instead of guessing; avoids unnecessary clarifications | Good agents should neither hallucinate missing requirements nor badger users. | Measure necessary clarification precision/recall and user satisfaction after clarification. |

### 4. Performance and Reliability

| Metric / KPI | Definition | Rationale | Measurement notes |
| --- | --- | --- | --- |
| **End-to-End Latency** | Time from user request to usable final output | Main user-perceived speed metric. | Report p50, p95, p99; segment by task class and model route. |
| **Time to First Useful Action** | Time until the agent takes the first meaningful tool action, asks a useful question, or provides partial value | Important for interactive agents where users need momentum. | Avoid optimizing for premature action; "useful" should be audited. |
| **Time to First Token / First Response** | Time until the user sees response streaming begin | Perceived responsiveness metric. | Useful but insufficient for multi-step agents; pair with completion latency. |
| **Model Latency per Call** | Duration of each model invocation | Identifies slow model routes and prompt-size regressions. | Track by model, prompt token bucket, output length, cache hit, and region. |
| **Tool Latency per Call** | Duration of search, browser, code execution, database, API, file, or workflow tool calls | Agents are orchestration systems; tool latency often dominates. | Track p95 by tool and error class. |
| **Throughput** | Completed tasks per hour, concurrent active sessions, queue wait time | Required for operational capacity planning. | Measure at agent-service and downstream-tool layers. |
| **Run Failure Rate** | Crashes, unhandled exceptions, timeouts, invalid terminal states, or infrastructure failures per run | Reliability floor for any production agent. | Separate platform failure from model/agent decision failure. |
| **Retry Rate** | Model retries, tool retries, workflow retries per run | Retries may hide fragility and inflate cost/latency. | Track successful retry, exhausted retry, and avoidable retry separately. |
| **SLA Compliance** | Share of runs meeting domain-specific latency and quality targets | Turns raw metrics into user or business commitments. | Use separate SLAs by risk tier and task complexity. |

### 5. Efficiency and Unit Economics

| Metric / KPI | Definition | Rationale | Measurement notes |
| --- | --- | --- | --- |
| **Cost per Attempted Task** | Total model + tool + compute + storage + human-review cost divided by attempts | Budget control metric. | Segment by successful/failed tasks; failed tasks can be disproportionately expensive. |
| **Cost per Successful Task** | Total cost divided by verified successful tasks | Stronger than raw cost because it penalizes waste and failure together. | Track as a top-level KPI. |
| **Token Usage per Run** | Input, output, reasoning, cached, and total tokens per run | Token growth is a leading indicator for cost, latency, and context-management problems. | Use OpenTelemetry GenAI attributes or equivalent trace metadata. |
| **Context Utilization Ratio** | Relevant context tokens / total context tokens | Measures whether the agent is filling the context window with useful information. | Estimate with retrieval labels, attention/provenance heuristics, or post-hoc judges. |
| **Prompt Cache Hit Rate** | Cached prompt tokens / cache-eligible prompt tokens | Reduces cost and latency for repeated system/developer/context prefixes. | Track by model provider and prompt segment. |
| **Tool Calls per Successful Task** | Total tool calls divided by verified successes | Identifies over-browsing, redundant searches, repeated tests, and inefficient tool use. | Interpret by task type; more calls may be appropriate for deep research. |
| **Expensive Tool Use Rate** | High-cost tools per task or per successful task | Controls use of paid APIs, browser sessions, sandbox compute, long-running tests, and human review. | Gate high-cost tools by expected value and risk. |
| **Model Routing Efficiency** | Success, latency, and cost by chosen model route | Verifies whether cheap/fast models are used where sufficient and stronger models where necessary. | Track route-level uplift: success gain per extra dollar or second. |
| **Human Review Cost per Accepted Output** | Human minutes or dollars spent per output accepted | Measures whether human-in-the-loop design is scalable. | Include queue delay and reviewer disagreement. |

### 6. Safety, Security, and Governance Guardrail Metrics

These are not optional if the agent can read untrusted content, call tools, modify state, spend money, access private data, or produce user-visible advice.

| Metric / KPI | Definition | Rationale | Measurement notes |
| --- | --- | --- | --- |
| **Unsafe Action Attempt Rate** | Attempts to execute disallowed, high-risk, or out-of-scope actions per run | Agents can act before the final answer. Unsafe attempts reveal near misses. | Count blocked and unblocked attempts separately. |
| **Policy Violation Severity Rate** | Severity-weighted policy violations per audited run | Severity weighting prevents low-risk noise from hiding rare severe incidents. | Use incident tiers and root-cause categories. |
| **Prompt Injection Attack Success Rate** | Successful malicious instruction override or data exfiltration under adversarial tasks | Crucial for agents that browse, read email/docs, or consume external content. | Measure alongside benign utility to avoid defenses that simply refuse everything. |
| **Data Leakage Rate** | Runs exposing private, secret, or cross-tenant information | Essential for trust and compliance. | Use canary secrets, DLP scanners, permission-bound fixtures, and human audit. |
| **Permission Override / Denial Rate** | Requests requiring approval, denied actions, and user overrides | Indicates whether the permission model matches real workflows. | High denial may mean bad policy, bad planning, or unsafe user demand. |
| **Audit Coverage** | Share of model calls, tool calls, state changes, and user-visible outputs with complete traces | You cannot debug or govern what you did not capture. | Require trace IDs across model, tool, app, and human-review systems. |

---

## Recommended Dashboard Layers

### Executive Layer

Report these weekly and monthly, with trend, target, and segmentation by task type:

- **Verified Task Success Rate**
- **Cost per Successful Task**
- **P95 End-to-End Completion Latency**
- **Automation Rate**
- **Human Intervention / Escalation Rate**
- **Critical Error / Incident Rate**
- **User Outcome Signal**

### Product and Operations Layer

Use this to understand whether the agent is actually useful:

- Acceptance rate
- Rework / reopen rate
- Clarification quality
- User correction rate
- Abandonment rate
- Handoff reason distribution
- SLA compliance
- Task-type coverage and unsupported-intent rate

### Engineering and Model Layer

Use this to debug and improve the system:

- Tool selection accuracy
- Tool argument correctness
- Invalid tool-call rate
- Tool latency and error rate
- Loop / stagnation rate
- Recovery rate
- Retrieval precision, recall, faithfulness
- Token usage per run
- Context utilization ratio
- Model route success/cost/latency
- Judge-human agreement

### Risk and Governance Layer

Use this for release gates and ongoing controls:

- Unsafe action attempt rate
- Policy violation severity rate
- Prompt-injection attack success rate
- Data leakage rate
- Permission denial / override rate
- Audit coverage
- Incident mean time to detection and resolution

---

## Benchmark and Eval Mapping

No single benchmark evaluates an AI agent. Use a portfolio that reflects the agent's job.

| Agent capability | Representative SOTA benchmark / method | What it contributes | KPI linkage |
| --- | --- | --- | --- |
| General assistant reasoning and tool use | **GAIA** | Real-world questions requiring reasoning, multimodality, browsing, and tool use | Final correctness, evidence use, task success |
| Software engineering | **SWE-bench / SWE-bench Verified** | Real GitHub issue resolution with test-based validation | Verified task success, acceptance, regression rate, cost per fix |
| Desktop / computer-use agents | **OSWorld / OSWorld-V2** | Real operating-system tasks across apps and workflows | Task success, trajectory quality, tool/UI action accuracy, latency |
| Browser agents | **WebArena, VisualWebArena, BrowseComp** | Web navigation, information seeking, form filling, hard-to-find facts | Web task success, browsing efficiency, citation accuracy, latency |
| Tool-user interaction | **tau-bench / tau2-bench** | Multi-turn conversation with domain tools, users, policies, and state | Tool accuracy, policy compliance, clarification quality, handoff rate |
| Function calling | **BFCL V4** | Structured tool calls, parallel/serial function calls, AST/executable evaluation | Tool selection accuracy, argument correctness, invalid call rate |
| Long-horizon autonomy | **METR time-horizon method** | Human-equivalent task length at a target success probability | Autonomy, task complexity frontier, intervention-free success |
| Prompt-injection/security robustness | **AgentDojo** | Benign utility and attack success under malicious instructions/context | Robustness, unsafe action rate, data leakage, policy compliance |
| RAG / evidence-grounded agents | **RAGAS-style metrics and claim/evidence graders** | Context precision/recall, faithfulness, answer relevancy | Groundedness, citation accuracy, retrieval efficiency |
| Production quality | **Offline eval suite + trace observability + online canaries** | Domain-specific regressions, drift, cost, latency, and incident detection | All production KPIs |

### Benchmarking principles

- Prefer **task-specific, end-to-end evals** over generic model benchmarks.
- Keep a **golden set** of stable regression tasks and a **fresh set** of recently generated or held-out tasks.
- Evaluate **final output and trajectory**. A correct answer reached by unsafe or invalid steps is not a production success.
- Track **pass@1 and pass@k**. Pass@k reveals recoverability and search potential, while pass@1 better reflects default user experience.
- Include **negative and adversarial tasks**: malicious webpages, irrelevant retrieved context, impossible tasks, missing permissions, ambiguous instructions, and tool failures.
- Calibrate LLM judges against human labels. Report judge-human agreement, not just judge scores.

---

## Metric Formulas and Practical Definitions

### Core outcome formulas

```text
Verified Task Success Rate =
  verified_successful_tasks / attempted_tasks

Cost per Successful Task =
  total_agent_cost / verified_successful_tasks

Automation Rate =
  fully_autonomous_successes / eligible_tasks

Human Intervention Rate =
  runs_with_human_takeover_or_required_approval / attempted_runs

Rework Rate =
  tasks_reopened_or_corrected_within_window / completed_tasks
```

### Accuracy formulas

```text
Groundedness =
  supported_claims / total_audited_claims

Tool Selection Accuracy =
  correct_tool_choices / tool_decision_points

Tool Argument Correctness =
  correct_tool_argument_sets / tool_calls_requiring_arguments

Policy Compliance Rate =
  policy_compliant_audited_runs / audited_runs

Calibration Error =
  difference_between_reported_confidence_and_empirical_accuracy
```

### Efficiency formulas

```text
Token Efficiency =
  verified_successful_tasks / total_tokens

Step Efficiency =
  reference_or_minimum_required_steps / actual_steps

Context Utilization Ratio =
  relevant_context_tokens / total_context_tokens

Tool Efficiency =
  verified_successful_tasks / total_tool_calls
```

### Performance formulas

```text
End-to-End Latency =
  final_usable_result_timestamp - user_request_timestamp

Tool Latency =
  tool_result_timestamp - tool_call_timestamp

Recovery Rate =
  recovered_error_runs / recoverable_error_runs

Loop Rate =
  runs_with_repeated_no_progress_patterns / attempted_runs
```

---

## Instrumentation Requirements

Every agent run should produce a trace with:

- `run_id`, `session_id`, `user_id` or privacy-preserving equivalent, task type, environment, and risk tier.
- Model spans: model name, route, prompt tokens, completion tokens, reasoning tokens where available, cached tokens, latency, retry count, error type.
- Tool spans: tool name, input schema version, arguments, latency, result status, side-effect summary, error type, permission decision.
- Retrieval spans: query, source, retrieved item IDs, rank, score, chunk size, citation usage.
- Browser/computer-use spans: URL/app/window, action type, target element, observation, screenshot or accessibility-tree hash where allowed.
- State-change spans: files changed, records modified, API operations, transactions, rollback status.
- Evaluation events: deterministic grader result, LLM judge result, human review result, rubric version, confidence, severity labels.
- Cost events: provider cost, tool cost, compute cost, human-review cost.
- Safety events: policy checks, blocked actions, prompt-injection detections, PII/secret detections, permission overrides.

OpenTelemetry GenAI semantic conventions are the best default foundation because they connect model/tool traces to standard metrics, logs, and distributed traces.

---

## How to Weight the KPIs

Avoid one universal "agent score" for operational decisions. Use a weighted score only as a dashboard summary, and always keep the component metrics visible.

For low-risk productivity agents:

```text
Agent Effectiveness Index =
  0.35 * Verified Task Success
+ 0.20 * Accuracy / Groundedness
+ 0.15 * User Acceptance
+ 0.15 * Efficiency Score
+ 0.10 * Latency Score
+ 0.05 * Recovery / Reliability
- Safety and Policy Penalties
```

For high-risk or regulated agents:

```text
Agent Effectiveness Index =
  0.30 * Verified Task Success
+ 0.25 * Policy-Compliant Accuracy
+ 0.15 * Human-Verified Quality
+ 0.10 * Auditability
+ 0.10 * Reliability
+ 0.10 * Efficiency
- Severe Incident Penalties
```

Recommended hard gates before production:

- Critical safety incident rate must be zero in pre-production adversarial suites.
- Prompt-injection attack success must be below the domain-specific threshold while benign utility remains acceptable.
- Audit coverage must be effectively complete for model calls, tool calls, state changes, and final outputs.
- Judge-human agreement must be measured before relying on LLM-as-judge scores for release gates.
- Cost per successful task and p95 latency must meet product-specific limits, not just improve over baseline.

---

## Segment Everything

Aggregate agent metrics are often misleading. Segment by:

- Task type and task complexity
- User persona or customer tier
- Language and locale
- Model route
- Tool set and tool version
- Retrieval corpus and corpus freshness
- Permission/risk tier
- New vs returning user
- Interactive vs batch mode
- First attempt vs retries
- Environment: staging, shadow, canary, production

The same agent may be excellent for short, deterministic tasks and poor for long-horizon, ambiguous tasks. KPI dashboards should make that visible.

---

## Metrics to Avoid Using Alone

- **Average latency**: hides p95/p99 failures.
- **Thumbs-up rate**: biased by who gives feedback and when.
- **LLM judge score without calibration**: can drift, over-reward style, and miss domain errors.
- **Benchmark leaderboard rank**: may not match your task distribution, tools, risk model, or cost envelope.
- **Token count alone**: fewer tokens can mean either efficiency or under-reasoning.
- **Containment/deflection alone**: can reward agents that prevent escalation while giving bad answers.
- **Pass@k alone**: useful for capability exploration, but production users often experience pass@1.
- **Final-answer correctness alone**: misses unsafe, expensive, or invalid trajectories.

---

## Source Notes

Primary and high-signal sources used:

- **Survey on Evaluation of LLM-based Agents** (arXiv, 2025): comprehensive taxonomy of agent-evaluation perspectives, including core capabilities, interaction, safety, and efficiency.  
  <https://arxiv.org/abs/2503.16416>

- **AgentAtlas: Beyond Outcome Leaderboards for LLM Agents** (arXiv, 2026): argues for multi-axis benchmark coverage and trajectory-aware evaluation.  
  <https://arxiv.org/abs/2605.20530>

- **Efficient Benchmarking of AI Agents** (arXiv, 2026): focuses on estimating agent benchmark performance under cost constraints.  
  <https://arxiv.org/abs/2603.23749>

- **SWE-bench official leaderboard**: software-engineering agents evaluated against real GitHub issues and tests.  
  <https://www.swebench.com/>

- **OSWorld and OSWorld-V2**: real-computer-environment benchmarks for multimodal agents.  
  <https://os-world.github.io/>  
  <https://osworld-v2.xlang.ai/>

- **WebArena**: realistic web tasks for autonomous agents.  
  <https://webarena.dev/>

- **GAIA**: general AI assistant benchmark requiring reasoning, tool use, web browsing, and multimodal understanding.  
  <https://arxiv.org/abs/2311.12983>

- **BrowseComp** (OpenAI, 2025): benchmark for browsing agents locating hard-to-find information.  
  <https://openai.com/index/browsecomp/>

- **tau-bench** and **tau2-bench**: tool-agent-user interaction benchmarks for realistic multi-turn domains.  
  <https://arxiv.org/abs/2406.12045>  
  <https://arxiv.org/abs/2506.07982>

- **Berkeley Function Calling Leaderboard V4**: function/tool-calling accuracy benchmark.  
  <https://gorilla.cs.berkeley.edu/leaderboard.html>

- **METR: Measuring AI Ability to Complete Long Tasks**: proposes human-time task horizon as a capability metric.  
  <https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/>

- **AgentDojo**: dynamic environment for evaluating prompt-injection attacks and defenses in tool-using agents.  
  <https://arxiv.org/abs/2406.13352>

- **OpenTelemetry GenAI observability**: production instrumentation for model calls, token usage, cost, traces, and metrics.  
  <https://opentelemetry.io/blog/2026/genai-observability/>

- **OpenAI evaluation best practices**: structured evals, graders, and quality measurement for AI systems.  
  <https://developers.openai.com/api/docs/guides/evaluation-best-practices>

- **Anthropic: Demystifying evals for AI agents**: practical eval design guidance for production agents.  
  <https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents>

- **RAGAS metrics**: faithfulness, answer relevancy, context precision/recall, and retrieval-grounded metrics for RAG applications.  
  <https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/>

---

## Bottom Line

Use **Verified Task Success Rate** as the north-star outcome KPI, but never alone. A production AI-agent scorecard should combine:

- outcome success,
- final-answer and evidence accuracy,
- trajectory and tool-use quality,
- latency and reliability,
- cost per successful task,
- autonomy and human-intervention rate,
- user/business outcome,
- safety and auditability.

The SOTA direction as of June 2026 is clear: evaluate agents as **systems that act over time**, not as chat models that emit one answer.

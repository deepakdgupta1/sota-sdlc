# BabyAGI Architecture Research Report

## Scope Correction

Task 2 asks for BabyAGI as the minimal task-loop baseline. In this checkout, current `babyagi/` is not that baseline: `babyagi/README.md` states that the original March 2023 BabyAGI task-planning project was archived into `babyagi_archive/`, while the newest BabyAGI is the `functionz` framework for storing, managing, and executing database-backed functions.

Therefore this report treats `babyagi_archive/babyagi.py` as the Phase 1 baseline, with `babyagi_archive/classic/babyagi.py` as the earliest minimal variant. It then includes a short current-BabyAGI delta using `babyagi/README.md` and `babyagi/babyagi/functionz/core/*.py` so the repo discrepancy is explicit rather than hidden.

Local sources used: `babyagi_archive/babyagi.py`, `babyagi_archive/classic/babyagi.py`, `babyagi/README.md`, `babyagi/babyagi/functionz/core/framework.py`, `babyagi/babyagi/functionz/core/execution.py`, `babyagi/babyagi/functionz/core/registration.py`, and the empty package marker `babyagi/babyagi/functionz/core/__init__.py`.

## Core Loop

The Phase 1 archive loop is a single-process objective-driven loop in `babyagi_archive/babyagi.py`. The user supplies `OBJECTIVE` and `INITIAL_TASK` through environment/configuration, then the file creates an initial task dict:

```python
{"task_id": tasks_storage.next_task_id(), "task_name": INITIAL_TASK}
```

The loop in `main()` is:

1. Read current queue state from `tasks_storage.get_task_names()`.
2. Pull the next task with `tasks_storage.popleft()`.
3. Execute the task with `execution_agent(OBJECTIVE, task["task_name"])`.
4. Store the result with `results_storage.add(task, result, result_id)`.
5. Create follow-up tasks with `task_creation_agent(OBJECTIVE, enriched_result, task["task_name"], tasks_storage.get_task_names())`.
6. Assign ids to new tasks via `tasks_storage.next_task_id()` and append them to the queue.
7. Reprioritize remaining tasks with `prioritization_agent()` and replace the queue with `tasks_storage.replace(prioritized_tasks)`.
8. Sleep briefly and repeat until `tasks_storage.is_empty()` returns true.

Flowchart-friendly data flow:

```text
OBJECTIVE + INITIAL_TASK
  -> tasks_storage deque
  -> popleft task
  -> context_agent(objective, top_results_num=5)
  -> execution_agent prompt
  -> result string
  -> results_storage vector record
  -> task_creation_agent prompt
  -> new task_name entries
  -> prioritization_agent prompt
  -> replaced deque
  -> next loop iteration
```

The three "agents" are not autonomous runtime actors. They are prompt-building functions around the shared `openai_call()` helper. The effective in-code cycle is execution -> memory write -> task creation -> prioritization -> next execution. Viewed across loop boundaries, this is the requested task_creation -> task_prioritization -> execution_agent cycle: the completed result creates candidate next tasks, prioritization ranks the queue, and the next iteration executes the highest-priority task. The `classic` file confirms the same skeleton in a rougher form: a global `deque`, `while True`, `task_list.popleft()`, Pinecone `upsert`, then task creation and prioritization.

## Task Queue

`babyagi_archive/babyagi.py` stores pending work in `SingleTaskListStorage`, a thin wrapper over `collections.deque`. Its complete behavioral surface is `append()`, `replace()`, `popleft()`, `is_empty()`, `next_task_id()`, and `get_task_names()`.

Task shape is intentionally small:

```python
{"task_id": <int-or-string>, "task_name": <natural-language task>}
```

New tasks are LLM-generated text, parsed line-by-line. `task_creation_agent()` expects a numbered list, splits each line on the first period, keeps only lines with numeric ids, sanitizes the task text with `re.sub(r'[^\w\s_]+', '', ...)`, and returns `{"task_name": task_name}` entries. The loop then assigns authoritative ids using `tasks_storage.next_task_id()`.

Prioritization is destructive at the queue level. `prioritization_agent()` prompts the LLM to reorder all incomplete task names, parses the numbered response into `{"task_id": task_id, "task_name": task_name}` entries, and `main()` replaces the whole queue with that parsed list. There is no durable task queue, lock, lease, status table, retry state, or task history beyond completed results in memory storage.

`babyagi_archive/classic/babyagi.py` is even thinner: it uses a module-level `task_list = deque([])`, an `add_task()` append helper, a `task_id_counter`, and a `prioritization_agent(this_task_id)` that resets the global deque from the LLM response.

## Memory

The archive baseline separates pending tasks from completed-task memory. Pending tasks live only in the in-memory deque. Completed task outputs are stored in a vector database through `results_storage`.

In `babyagi_archive/babyagi.py`, `DefaultResultsStorage` uses Chroma by default:

- Persistent directory: `chroma`
- Collection name: `RESULTS_STORE_NAME`
- Distance metric metadata: `{"hnsw:space": "cosine"}`
- Embeddings: `OpenAIEmbeddingFunction(api_key=OPENAI_API_KEY)` unless using Llama mode

`results_storage.add(task, result, result_id)` writes the result document with metadata:

```python
documents=result
metadatas={"task": task["task_name"], "result": result}
ids=f"result_{task['task_id']}"
```

If an id already exists, it updates the existing record. `results_storage.query(query, top_results_num)` queries the Chroma collection and returns `[item["task"] for item in results["metadatas"][0]]`. This is an important diagramming detail: although the vector record stores both `task` and `result`, the execution context receives completed task names, not full result bodies.

`context_agent(query=objective, top_results_num=5)` is therefore a semantic recall step over completed results, queried by the overall objective, returning up to five prior task names. `execution_agent()` conditionally inserts those names into its prompt.

The `classic` version uses Pinecone directly. It embeds result text with `text-embedding-ada-002`, upserts `(result_id, embedding, {"task": task_name, "result": result})`, and its `context_agent()` returns sorted `metadata["task"]` values. The classic `execution_agent()` retrieves context but does not actually include it in the execution prompt, which reinforces how minimal and early the baseline is.

## LLM Invocation

`babyagi_archive/babyagi.py` centralizes model calls in `openai_call(prompt, model=LLM_MODEL, temperature=OPENAI_TEMPERATURE, max_tokens=100)`. Dispatch is simple:

- Llama mode calls local `llm(prompt[:CTX_MAX], stop=["### Human"], temperature=0.2, top_k=40, top_p=0.95, repeat_penalty=1.05, max_tokens=200)`.
- Human mode returns `user_input_await(prompt)`.
- Non-chat models use `openai.Completion.create(engine=model, prompt=prompt, temperature=temperature, max_tokens=max_tokens, top_p=1, frequency_penalty=0, presence_penalty=0)`.
- `gpt-*` models trim the prompt to `4000 - max_tokens` tokens and send it as a single ChatCompletion system message.

The three Phase 1 prompt templates are below, with variable placeholders preserved.

### Task Creation Prompt

Source: `babyagi_archive/babyagi.py` `task_creation_agent()`.

```text
You are to use the result from an execution agent to create new tasks with the following objective: {objective}.
The last completed task has the result:
{result["data"]}
This result was based on this task description: {task_description}.
```

If incomplete tasks exist, the function appends:

```text
These are incomplete tasks: {', '.join(task_list)}
```

Then it always appends:

```text
Based on the result, return a list of tasks to be completed in order to meet the objective.
```

If incomplete tasks exist, it also appends:

```text
These new tasks must not overlap with incomplete tasks.
```

Finally, it appends the output contract:

```text
Return one task per line in your response. The result must be a numbered list in the format:

#. First task
#. Second task

The number of each entry must be followed by a period. If your list is empty, write "There are no tasks to add at this time."
Unless your list is empty, do not include any headers before your numbered list or follow your numbered list with any other output.
```

### Prioritization Prompt

Source: `babyagi_archive/babyagi.py` `prioritization_agent()`.

```text
You are tasked with prioritizing the following tasks: {task_names_joined_with_newlines}
Consider the ultimate objective of your team: {OBJECTIVE}.
Tasks should be sorted from highest to lowest priority, where higher-priority tasks are those that act as pre-requisites or are more essential for meeting the objective.
Do not remove any tasks. Return the ranked tasks as a numbered list in the format:

#. First task
#. Second task

The entries must be consecutively numbered, starting with 1. The number of each entry must be followed by a period.
Do not include any headers before your ranked list or follow your list with any other output.
```

### Execution Prompt

Source: `babyagi_archive/babyagi.py` `execution_agent()`.

```text
Perform one task based on the following objective: {objective}.
```

If vector memory returns context, the function appends:

```text
Take into account these previously completed tasks:{completed_task_names_joined_by_newline}
```

Then it appends:

```text
Your task: {task}
Response:
```

The classic implementation in `babyagi_archive/classic/babyagi.py` uses `openai.Completion.create(engine="text-davinci-003")` for all three agents. Its execution prompt is even smaller:

```text
You are an AI who performs one task based on the following objective: {objective}. Your task: {task}
Response:
```

## Current BabyAGI Delta

Current `babyagi/` is the newer `functionz` architecture, not the Phase 1 task-loop architecture. `babyagi/README.md` describes the core as a function framework for storing, managing, and executing functions from a database, with dependency tracking, secret management, logging, triggers, function packs, and a dashboard.

The current core files match that description:

- `babyagi/babyagi/functionz/core/framework.py` defines `Functionz`, which wires `DBRouter`, `FunctionExecutor`, and `FunctionRegistrar`; exposes `execute_function()`, dynamic function lookup through `__getattr__()`, function registration/update/add APIs, key APIs, import APIs, pack/file loading, triggers, logs, and display.
- `babyagi/babyagi/functionz/core/registration.py` implements a decorator-based registrar. It inspects Python source with `inspect.getsourcelines()`, parses parameters with `ast`, stores code/metadata/imports/dependencies/triggers, and returns a wrapper that executes the stored function by name.
- `babyagi/babyagi/functionz/core/execution.py` loads the selected function version from the DB, resolves external imports and registered function dependencies, injects secret keys, `exec()`s stored function code into a local scope, binds and validates arguments, logs start/success/error, and executes configured triggers while skipping already-executed functions in the chain to reduce recursion risk.
- `babyagi/babyagi/functionz/core/__init__.py` is empty and adds no runtime behavior.

What is absent from current core compared with the archive baseline: there is no built-in `OBJECTIVE`, `INITIAL_TASK`, `SingleTaskListStorage`, `task_creation_agent()`, `prioritization_agent()`, `execution_agent()`, or `context_agent()` loop in `functionz/core`. Current BabyAGI can host self-building behaviors through packs such as `process_user_input` and `self_build` described in `babyagi/README.md`, but the minimal BabyAGI loop for Task 2 lives in `babyagi_archive/`.

## Simplicity Analysis

BabyAGI's Phase 1 baseline is the floor of the capability spectrum: an objective string, an in-memory task deque, a vector recall store, and three prompt templates. Its simplicity is defined as much by what is absent as by what is present.

Absent capabilities:

- No tool architecture: tasks produce text responses only; there is no first-class browser, shell, filesystem, API, or editor tool call layer.
- No edit format: there are no diffs, patches, file operation schemas, AST edits, or code application protocols.
- No permission model: there is no approval step, sandbox, policy engine, allowlist, or denied-action path.
- No structured planner state beyond the queue: task status, retries, owners, leases, failures, and histories are not modeled.
- No durable task queue: only vectorized completed results persist; pending tasks are process memory.
- No robust output schema: task creation and prioritization parse numbered natural-language lines with string splitting and regex cleanup.
- No verification loop: execution results are not tested, critiqued, checked, or scored before memory insertion.
- No multi-agent isolation: "agents" are function-level prompts, not separate actors with separate memory or capabilities.
- No rich context engine: memory recall is a top-k vector query over completed results, queried by the objective, with only task names returned to execution.
- No production observability: the archive prints prompts/results and retries some OpenAI API errors, but it has no structured telemetry, trace model, or dashboard.

Compared with current `functionz`, the archive also lacks function registration, dependency graphs, trigger execution, secret injection, code storage/versioning, dashboard workflows, and execution logs. That is intentional for Phase 1 analysis: the archive establishes the minimal autonomous loop that richer agents and frameworks can extend.

# [AIDER] Architecture Research Report

Scope: local source-backed research for Task 1. Primary sources are `aider/aider/coders/`, `aider/aider/repomap.py`, `aider/aider/commands.py`, `aider/aider/repo.py`, `aider/aider/linter.py`, `aider/aider/models.py`, and `aider/aider/resources/model-settings.yml`.

Corrections from prior draft:
- Lint/test reflection is not fully autonomous: after lint or test failures, Aider asks the user to confirm before feeding the errors back into the loop (`aider/aider/coders/base_coder.py:1599`, `aider/aider/coders/base_coder.py:1616`).
- Registered edit-format names include `diff`, `diff-fenced`, `whole`, `udiff`, `udiff-simple`, `patch`, `architect`, `editor-diff`, `editor-whole`, `editor-diff-fenced`, `ask`, `help`, and `context`; `wholefile` and `editblock` are implementation names, not the public edit-format names (`aider/aider/coders/__init__.py`, `aider/aider/coders/base_coder.py:190`).
- The repo-map graph nodes are files. Edges point from referencing file to defining file and carry an `ident` label plus a weight (`aider/aider/repomap.py:470`, `aider/aider/repomap.py:514`).

## 1. Core Loop

1. The interactive loop calls `get_input()` with current editable files, read-only files, addable files, command metadata, and active edit format (`aider/aider/coders/base_coder.py:876`, `aider/aider/coders/base_coder.py:898`). A single-message run enters the same path through `run_one()`.
2. `preproc_user_input()` handles slash/bang commands first via `Commands.run()`, then scans text for file mentions and URLs (`aider/aider/coders/base_coder.py:912`, `aider/aider/commands.py:255`, `aider/aider/commands.py:312`).
3. `run_one()` resets per-message state, sends the message, and repeats only when `send_message()` leaves a `reflected_message`. The cap is `max_reflections = 3` (`aider/aider/coders/base_coder.py:924`, `aider/aider/coders/base_coder.py:101`).
4. `send_message()` appends the user message to `cur_messages`, assembles `ChatChunks`, flattens them into the final messages, checks token budget, warms cache if configured, then calls `send()` (`aider/aider/coders/base_coder.py:1419`, `aider/aider/coders/base_coder.py:1425`).
5. `send()` delegates to `Model.send_completion()`, which builds a LiteLLM request with model name, stream flag, optional temperature, optional forced tool/function call, extra model params, and messages (`aider/aider/coders/base_coder.py:1783`, `aider/aider/models.py:978`).
6. The response is accumulated into `partial_response_content` or `partial_response_function_call`, streamed when enabled, logged, and appended back into `cur_messages` (`aider/aider/coders/base_coder.py:1790`, `aider/aider/coders/base_coder.py:1900`, `aider/aider/coders/base_coder.py:1702`).
7. If the assistant mentions files that are not in chat, `check_for_file_mentions()` asks whether to add them. Accepted files become a `reflected_message`, causing another pass with the updated file set (`aider/aider/coders/base_coder.py:1560`, `aider/aider/coders/base_coder.py:1761`).
8. The coder-specific parser extracts edits through `get_edits()`. `apply_updates()` dry-runs format-specific edits, asks/commits as needed before touching dirty or out-of-chat files, applies edits, and turns malformed edit output into `reflected_message` (`aider/aider/coders/base_coder.py:2296`, `aider/aider/coders/base_coder.py:2269`).
9. Successful edits are auto-committed when git and auto-commit are enabled. The commit result is moved behind the file messages so the LLM sees the updated state (`aider/aider/coders/base_coder.py:1585`, `aider/aider/coders/base_coder.py:2375`).
10. Post-edit lint/test and shell-command handling run after commit. Lint/test failures only become reflection input if the user confirms (`aider/aider/coders/base_coder.py:1599`, `aider/aider/coders/base_coder.py:1604`, `aider/aider/coders/base_coder.py:1620`).

Novel pattern: Aider treats failures from edit parsing, file discovery, lint, and test as the same loop primitive: `reflected_message`. That creates a single retry channel while still preserving user confirmation gates for risky follow-up work.

## 2. Repo-Map

Exact pipeline:

1. Repo-map is created only when git is active, the selected coder has a `repo_content_prefix`, and `map_tokens > 0` or the model setting enables repo maps (`aider/aider/coders/base_coder.py:487`, `aider/aider/coders/base_coder.py:497`).
2. `Coder.get_repo_map()` derives hints from the current conversation: explicit filename mentions, identifier words split from the text, and filename stems that match identifiers (`aider/aider/coders/base_coder.py:713`, `aider/aider/coders/base_coder.py:684`).
3. It separates full-content chat files/read-only files from `other_files`; the map summarizes only the other files, with fallback passes for global maps when no map is produced (`aider/aider/coders/base_coder.py:719`, `aider/aider/coders/base_coder.py:732`).
4. `RepoMap.get_tags()` caches tags by absolute filename and file mtime in `.aider.tags.cache.v*` (`aider/aider/repomap.py:42`, `aider/aider/repomap.py:233`).
5. `get_tags_raw()` maps filename to language, loads a tree-sitter parser and query file, parses source, and extracts captures named `name.definition.*` as `def` tags and `name.reference.*` as `ref` tags (`aider/aider/repomap.py:279`, `aider/aider/queries/tree-sitter-language-pack/python-tags.scm:1`).
6. Each tag is `Tag(rel_fname, fname, line, name, kind)`. If a language query yields definitions but no references, Pygments token names backfill references (`aider/aider/repomap.py:29`, `aider/aider/repomap.py:328`, `aider/aider/repomap.py:347`).
7. `get_ranked_tags()` builds `defines[name] -> files`, `references[name] -> files`, and `definitions[(file, name)] -> tags` (`aider/aider/repomap.py:370`, `aider/aider/repomap.py:451`).
8. The PageRank graph is a `networkx.MultiDiGraph` whose nodes are relative file names. For each identifier that has both defs and refs, Aider adds edges from referencer file to definer file with `ident=<identifier>` and a weight based on mention boosts, identifier shape, private-name penalties, definition fanout, chat-file references, and sqrt reference counts (`aider/aider/repomap.py:470`, `aider/aider/repomap.py:481`, `aider/aider/repomap.py:501`).
9. Personalization boosts chat files, explicitly mentioned files, and paths whose components match mentioned identifiers. If present, personalization is also used for dangling nodes (`aider/aider/repomap.py:381`, `aider/aider/repomap.py:424`, `aider/aider/repomap.py:519`).
10. After PageRank, Aider redistributes each file node's rank across outgoing identifier-labelled edges to rank `(definition file, identifier)` pairs, excludes files already in chat, appends untagged files by file rank, and returns a ranked tag list (`aider/aider/repomap.py:524`, `aider/aider/repomap.py:533`, `aider/aider/repomap.py:554`).
11. `get_ranked_tags_map_uncached()` prepends important files, then binary-searches how many ranked tags fit `max_map_tokens` (`aider/aider/repomap.py:629`, `aider/aider/repomap.py:656`, `aider/aider/repomap.py:676`).
12. `to_tree()` groups tags by file and uses `grep_ast.TreeContext` to render compact source snippets around lines of interest; files without tags are listed by name (`aider/aider/repomap.py:710`, `aider/aider/repomap.py:748`).
13. `get_repo_messages()` injects the repo map as a user message followed by an assistant acknowledgement that the mapped files are read-only unless explicitly added (`aider/aider/coders/base_coder.py:750`).

Novel pattern: the repo-map is not embeddings retrieval. It is a static code graph where file nodes pass PageRank through identifier-labelled reference-to-definition edges, then the winning identifiers choose the lines shown to the model.

## 3. Edit Formats With Prompt-Structure Examples

Selection logic:

1. `Coder.create()` uses an explicit `--edit-format/--chat-mode` when supplied; otherwise it inherits from a previous coder or the selected model's `edit_format` (`aider/aider/coders/base_coder.py:124`, `aider/aider/coders/base_coder.py:142`).
2. CLI choices are generated from registered coder classes, keeping public names aligned with code (`aider/aider/args.py:43`).
3. `ModelSettings` defaults to `whole`, but known model settings commonly set `diff`, `udiff`, `diff-fenced`, or `architect`; generic model heuristics also set `diff` and enable repo maps for many capable coding models (`aider/aider/models.py:120`, `aider/aider/resources/model-settings.yml:35`, `aider/aider/models.py:430`).
4. Architect mode delegates implementation to `main_model.editor_edit_format`; if absent, `get_editor_model()` prefixes `diff`, `whole`, or `diff-fenced` with `editor-` for editor-only prompts (`aider/aider/models.py:618`).

`diff`: SEARCH/REPLACE blocks, implemented by `EditBlockCoder` and prompts in `editblock_prompts.py`. It asks for a filename line, fence, exact `SEARCH`, separator, `REPLACE`, closing fence, and only edits files in chat unless creating a new file (`aider/aider/coders/editblock_coder.py:18`, `aider/aider/coders/editblock_prompts.py:120`).

````text
path/to/file.py
```python
[SEARCH marker: <<<<<<< SEARCH]
old exact lines
[separator marker: =======]
new lines
[REPLACE marker: >>>>>>> REPLACE]
```
````

`diff-fenced`: same edit semantics as `diff`, but the filename appears inside the fenced block before the search marker (`aider/aider/coders/editblock_fenced_coder.py:6`, `aider/aider/coders/editblock_fenced_prompts.py:97`).

````text
```python
path/to/file.py
[SEARCH marker: <<<<<<< SEARCH]
old exact lines
[separator marker: =======]
new lines
[REPLACE marker: >>>>>>> REPLACE]
```
````

`whole`: whole-file replacement, implemented by `WholeFileCoder`. The parser expects each changed file as a filename line followed by a complete file listing; it writes the entire content back (`aider/aider/coders/wholefile_coder.py:13`, `aider/aider/coders/wholefile_coder.py:22`, `aider/aider/coders/wholefile_prompts.py:42`).

````text
path/to/file.py
```
entire updated file content
```
````

`udiff`: unified-diff-like hunks, implemented by `UnifiedDiffCoder`. The prompt requires `--- file`, `+++ file`, `@@ ... @@` hunks, `-` removed lines, and `+` added lines without timestamps or line numbers (`aider/aider/coders/udiff_coder.py:49`, `aider/aider/coders/udiff_prompts.py:74`).

```diff
--- path/to/file.py
+++ path/to/file.py
@@ ... @@
-old line
+new line
```

`patch`: V4A-style add/update/delete patch, implemented by `PatchCoder`. The response should use `*** Begin Patch`, per-file `*** Add/Update/Delete File:` markers, hunks, and `*** End Patch`; the parser also tolerates some missing sentinels when content is patch-like (`aider/aider/coders/patch_coder.py:217`, `aider/aider/coders/patch_coder.py:229`, `aider/aider/coders/patch_prompts.py:116`).

```text
*** Begin Patch
*** Update File: path/to/file.py
@@
-old line
+new line
*** End Patch
```

Parser/apply behavior:
- `diff` parses blocks with `find_original_update_blocks()`, can also collect shell command blocks, searches exact or flexible matches, and reports failed blocks back as a malformed-edit reflection (`aider/aider/coders/editblock_coder.py:21`, `aider/aider/coders/editblock_coder.py:439`).
- `whole` infers filenames from the line before a fence, a recently mentioned chat filename, or the sole chat file; ambiguous output raises `ValueError` (`aider/aider/coders/wholefile_coder.py:54`, `aider/aider/coders/wholefile_coder.py:77`).
- `udiff` normalizes hunks and raises no-match/not-unique errors when context cannot be uniquely applied (`aider/aider/coders/udiff_coder.py:69`).
- `patch` parses actions into `PatchAction` objects and applies add/delete/update/move operations (`aider/aider/coders/patch_coder.py:290`, `aider/aider/coders/patch_coder.py:549`).

Novel pattern: edit format is a model-routing contract. Aider swaps both parser and prompt examples when edit format changes, and summarizes prior chat history when switching formats to avoid the model imitating stale format examples (`aider/aider/coders/base_coder.py:156`).

## 4. Architect/Editor Pattern

1. `ArchitectCoder` is a subclass of `AskCoder` with public edit format `architect`; its prompt tells the model to provide unambiguous instructions for an editor engineer and not to output full updated code (`aider/aider/coders/architect_coder.py:6`, `aider/aider/coders/architect_prompts.py:7`).
2. When the architect reply completes, Aider asks `Edit the files?` unless `auto_accept_architect` is true for the active coder (`aider/aider/coders/architect_coder.py:17`; CLI default is configured at `aider/aider/args.py:179` and passed at `aider/aider/main.py:1005`).
3. On acceptance, the architect creates a fresh editor coder with `main_model.editor_model` or the main model, `edit_format=main_model.editor_edit_format`, shell commands disabled, repo-map disabled, prompt cache disabled, and summarization from the architect disabled (`aider/aider/coders/architect_coder.py:20`).
4. The editor's chat history is cleared, and the architect's natural-language plan becomes the editor's user message with `preproc=False` (`aider/aider/coders/architect_coder.py:37`, `aider/aider/coders/architect_coder.py:44`).
5. Editor prompts are narrower than normal coding prompts: `editor-diff` only asks for SEARCH/REPLACE blocks and disables shell-command prompt text, go-ahead tips, and rename-by-shell text (`aider/aider/coders/editor_editblock_prompts.py:6`).
6. After the editor run, the architect moves its current messages back with "I made those changes to the files," and copies total cost and Aider commit hashes from the editor (`aider/aider/coders/architect_coder.py:46`).

Novel pattern: architect mode turns planning into a first-class chat mode but keeps implementation inside the same edit/apply/commit machinery. The planner does not receive a tool executor; it delegates to a normal coder configured as an editor.

## 5. Git Integration

1. `Coder.__init__()` creates a `GitRepo` when `use_git` is true and no repo object was injected; it stores the repo root and counts tracked files in announcements (`aider/aider/coders/base_coder.py:434`, `aider/aider/coders/base_coder.py:250`).
2. `GitRepo` locates a single working tree from provided files or cwd; multiple repos fail initialization (`aider/aider/repo.py:62`, `aider/aider/repo.py:116`).
3. Before editing an in-chat dirty file, `check_for_dirty_commit()` records it in `need_commit_before_edits`; `prepare_to_edit()` then calls `dirty_commit()` so `/undo` has a committed baseline (`aider/aider/coders/base_coder.py:2180`, `aider/aider/coders/base_coder.py:2291`).
4. Editing files not already in chat is gated. New files require confirmation to create; existing files outside chat require confirmation to edit; gitignored files are skipped unless configured otherwise (`aider/aider/coders/base_coder.py:2191`).
5. `auto_commit()` commits edited files after successful apply when repo, auto-commit, and non-dry-run are true. The commit message is generated from chat context and diffs if no explicit message is supplied (`aider/aider/coders/base_coder.py:2375`, `aider/aider/repo.py:131`, `aider/aider/repo.py:326`).
6. `GitRepo.commit()` stages named files or all dirty files, optionally appends a Co-authored-by trailer for Aider edits, optionally adjusts author/committer attribution, and returns `(commit_hash, commit_message)` (`aider/aider/repo.py:247`, `aider/aider/repo.py:280`, `aider/aider/repo.py:311`).
7. `/commit` commits pending external changes, `/diff` shows diff since the previous message, `/git` runs git commands with output excluded from chat, and `/undo` only undoes the last commit if it was made by Aider in the current chat session (`aider/aider/commands.py:337`, `aider/aider/commands.py:657`, `aider/aider/commands.py:967`, `aider/aider/commands.py:553`).
8. `/undo` safety checks include first-commit guard, "last commit was not made by aider" guard, merge-commit guard, dirty-file guard, previous-file-existence guard, and already-pushed guard. It restores changed files from `HEAD~1`, then performs `git reset --soft HEAD~1` (`aider/aider/commands.py:565`, `aider/aider/commands.py:573`, `aider/aider/commands.py:623`).

Novel pattern: the git layer is part of the agent loop, not just a persistence backend. It creates reversible checkpoints before and after edits, and the undo command is scoped to commits Aider can prove it made during the session.

## 6. Linting & Auto-Fix

1. `Coder.__init__()` creates a `Linter`, wires custom lint commands, and stores `auto_lint`, `auto_test`, and `test_cmd` (`aider/aider/coders/base_coder.py:525`).
2. CLI defaults are `--auto-lint=True`, `--auto-test=False`; `--lint-cmd` can be language-specific or global, and `--test-cmd` supplies the test command (`aider/aider/args.py:527`, `aider/aider/main.py:885`).
3. The linter chooses a language by filename. Python gets tree-sitter syntax checks, `compile()`, and fatal flake8 checks; other languages fall back to tree-sitter syntax checks if available or custom commands if configured (`aider/aider/linter.py:21`, `aider/aider/linter.py:82`, `aider/aider/linter.py:118`).
4. Lint output is converted into a repair prompt headed "Fix any errors below, if possible" plus `TreeContext` snippets marking relevant lines (`aider/aider/linter.py:111`, `aider/aider/linter.py:234`).
5. After edits, `send_message()` runs `lint_edited()` when `auto_lint` is enabled, commits any linter-side changes using context "Ran the linter", stores `lint_outcome`, and asks `Attempt to fix lint errors?` before assigning errors to `reflected_message` (`aider/aider/coders/base_coder.py:1599`).
6. Shell commands proposed by the model are confirmed separately. Their output is added back to chat only if the user confirms (`aider/aider/coders/base_coder.py:2434`, `aider/aider/coders/base_coder.py:2479`).
7. Tests run after shell commands when `auto_test` is enabled. `cmd_test()` runs the configured command and only adds output automatically on non-zero exit; `send_message()` then asks `Attempt to fix test errors?` before reflecting failures (`aider/aider/commands.py:993`, `aider/aider/coders/base_coder.py:1616`).
8. Manual `/lint` is similar but scoped to in-chat files or dirty files; it asks `Fix lint errors in <file>?` before cloning a clean coder and feeding lint output to it (`aider/aider/commands.py:356`, `aider/aider/commands.py:388`).

Novel pattern: lint/test repair is represented as ordinary user-visible context, not hidden tool state. The loop can self-repair malformed edits automatically, but operational validation repair is gated by explicit user confirmation.

## 7. Context Assembly

1. `format_chat_chunks()` chooses fences that do not collide with current file content, formats the coder-specific system prompt, inserts example messages either into the system prompt or message list depending on model settings, and appends system reminders when applicable (`aider/aider/coders/base_coder.py:609`, `aider/aider/coders/base_coder.py:1226`).
2. `ChatChunks.all_messages()` orders context as: system, examples, read-only files, repo map, summarized/done history, editable chat files, current turn messages, reminder (`aider/aider/coders/chat_chunks.py:16`). This exact ordering matters for sequence diagrams.
3. Chat history is split between `done_messages` and `cur_messages`; long history is summarized by `ChatSummary` using weak/main models and reinserted as a summary user message (`aider/aider/coders/base_coder.py:1278`, `aider/aider/history.py:7`).
4. Editable files are full-content messages built from `abs_fnames`; each file is rendered as relative filename plus fenced content and introduced by the coder prompt's `files_content_prefix` (`aider/aider/coders/base_coder.py:637`, `aider/aider/coders/base_coder.py:789`).
5. Read-only files are full-content reference messages from `abs_read_only_fnames`, with image/PDF payloads added only if the model metadata says the model supports them (`aider/aider/coders/base_coder.py:659`, `aider/aider/coders/base_coder.py:763`, `aider/aider/coders/base_coder.py:817`).
6. If no editable files are in chat but a repo map exists, the coding prompts tell the model not to edit existing code and to ask which files should be added (`aider/aider/coders/base_prompts.py:32`, `aider/aider/coders/base_prompts.py:45`).
7. File scope is user-controlled through `/add`, `/drop`, and `/read-only`. `/add` filters against git/aiderignore, supports globs, can create missing files after confirmation, and moves files from read-only to editable when allowed (`aider/aider/commands.py:799`, `aider/aider/commands.py:912`, `aider/aider/commands.py:1328`).
8. User and assistant content can also trigger file-scope changes: `check_for_file_mentions()` asks whether to add mentioned files and, if accepted, reflects a message that the file set changed (`aider/aider/coders/base_coder.py:1761`).
9. Token control occurs before sending. `check_tokens()` estimates the whole message list against `max_input_tokens` and asks whether to proceed if the context is too large; `/tokens` shows cost/token breakdown and suggests `/drop` or `/clear` when tight (`aider/aider/coders/base_coder.py:1396`, `aider/aider/commands.py:445`).
10. Repo-map sizing is model-aware: default map tokens are `max_input_tokens / 8`, clamped between 1024 and 4096, unless overridden (`aider/aider/models.py:775`, `aider/aider/main.py:964`).
11. Prompt caching marks stable chunks with ephemeral cache-control headers when enabled: examples/system, repo or read-only files, and chat files (`aider/aider/coders/chat_chunks.py:28`).
12. `context` chat mode is a specialized context-assembly pass: it asks the model to identify existing files needing modification, refreshes/expands repo-map behavior, updates `abs_fnames`, and reflects once more if the file set changed (`aider/aider/coders/context_coder.py:5`, `aider/aider/coders/context_prompts.py:6`).

Novel pattern: Aider separates "full editable files" from "read-only repo-map summaries" at the prompt-protocol level. The model is repeatedly reminded that only added files are editable, while the repo-map supplies enough graph-ranked context to choose what to add next.

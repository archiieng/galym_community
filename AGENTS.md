# AGENTS.md

## Knowledge graph (graphify)

This repo uses [graphify](https://github.com/Graphify-Labs/graphify) to keep a knowledge graph of the codebase in `graphify-out/`. That directory is gitignored, so a fresh clone will not have it.

### If `graphify-out/graph.json` exists

Use it before grepping or reading files broadly:

1. Read `graphify-out/GRAPH_REPORT.md` first for the god nodes, communities and suggested questions.
2. Answer codebase questions from the graph:

   ```bash
   graphify query "<question>"      # broad context around a question
   graphify path "A" "B"            # shortest path between two nodes
   graphify explain "X"             # one node and its neighbours
   graphify affected "X"            # what a change to X impacts
   ```

3. After changing code, refresh it (AST only, no LLM): `graphify update .`

### If it does not exist

Create it once, from the repo root:

```bash
uv tool install graphifyy        # or: pip install graphifyy
graphify install                 # copies the skill into your agent's config dir
```

Then run `/graphify .` in your agent. Code is extracted structurally with no API key; docs, the plan PDF and images are extracted by the agent itself.

Install and usage details: https://github.com/Graphify-Labs/graphify

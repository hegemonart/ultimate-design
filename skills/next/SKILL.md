---
name: gdd-next
description: "Routes to the next pipeline stage based on current STATE.md position"
tools: Read, Write
---

# Get Design Done — Next

**Role:** Lightweight router. Read `.design/STATE.md` and recommend the next command.

---

## Logic

1. Check if `.design/STATE.md` exists.
   - **No STATE.md** → Print: "No STATE.md found. Run `/gdd:new-project` to initialize, or `@get-design-done brief` to start the pipeline."
2. If STATE.md exists, parse frontmatter `stage:` field and map:

| Current `stage:` | Recommendation |
|---|---|
| `brief` | Run `@get-design-done explore` to scan and interview |
| `explore` | Run `@get-design-done plan` to create design plan |
| `plan` | Run `@get-design-done design` to execute design tasks |
| `design` | Run `@get-design-done verify` to audit and verify |
| `verify` | Pipeline complete. Run `/gdd:new-cycle` for next cycle or `/gdd:ship` to create PR |

3. Print the recommendation as a single formatted block:

```
━━━ Next step ━━━
Current stage: <stage>
Status: <status>
→ <recommendation>
━━━━━━━━━━━━━━━━━━
```

## Do Not

- Do not modify STATE.md.
- Do not invoke the next stage automatically — only recommend.

## NEXT COMPLETE

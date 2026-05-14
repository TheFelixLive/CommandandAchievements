---
# /execute
**Edition:** Bedrock | **Permission:** Operator
**Category:** Command Reference | **Group:** General
---
## 1. Purpose
Runs commands in a modified execution context using chained clauses.

## 2. Syntax (Modeled in `command_list`)
`execute <clause>... run <command...>`

Supported clause families in this pack model:
- `as <targets>`
- `at <targets>`
- `in <dimension>`
- `positioned (as <targets> | over <heightMap> | <position>)`
- `rotated (as <targets> | <yaw> <pitch>)`
- `facing (entity <targets> (eyes|feet) | <position>)`
- `align <axes>`
- `anchored (eyes|feet)`
- `if (...)`
- `unless (...)`
- `store (...)`

The `run` clause is required and is followed by a full command tail.

## 3. Notes
- Internal syntax now uses `choice`, `repeat`, and `command_tail`.
- Old enum-style argument definitions are represented as choice options.
- This page documents the internal command model used by the addon.

## 4. Examples
- `execute as @p at @s run say hi`
- `execute as @e[type=sheep] at @s positioned ~ ~1 ~ run tp @s ~ ~ ~`
- `execute if entity @a run weather clear`

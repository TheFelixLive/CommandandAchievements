---
# /fill
**Edition:** Bedrock | **Permission:** Game Directors (Cheats required)
**Category:** World Editing | **Group:** Block Manipulation
---

## **1. Purpose**
Replaces blocks in a selected region with another block.
It can also target only specific blocks using replace mode and filter states.

---

## **2. Syntax**
### **2.1. Basic**
```mcfunction
fill <from: x y z> <to: x y z> <tileName: Block> [oldBlockHandling: FillMode]
```

### **2.2. Variants**
| Variant | Syntax | Description |
|---|---|---|
| With Block States | `fill <from> <to> <tileName> <blockStates: block properties> [oldBlockHandling: FillMode]` | Fills region using explicit block states. |
| Replace Mode | `fill <from> <to> <tileName> replace [replaceTileName: Block] [replaceBlockStates: block properties]` | Fills and optionally filters replacement target block/states. |
| Replace + States | `fill <from> <to> <tileName> <blockStates: block properties> replace [replaceTileName: Block] [replaceBlockStates: block properties]` | Same as replace mode with explicit placed block states. |
| Hollow Mode | `fill <from> <to> <tileName> [blockStates] hollow` | Fills shell only, inside becomes air. |
| Outline Mode | `fill <from> <to> <tileName> [blockStates] outline` | Fills only outer border blocks. |

---

## **3. Arguments**
### **3.1. Required**
| Name | Type | Description | Example |
|---|---|---|---|
| from | CommandPosition | Start coordinates (x y z). | `0 64 0` |
| to | CommandPosition | End coordinates (x y z). | `10 70 10` |
| tileName | Block | Block to place in the region. | `stone` |

### **3.2. Optional**
| Name | Type | Default | Description | Example |
|---|---|---|---|---|
| blockStates | json | Block default states | State values for placed block. | `{"facing_direction":2}` |
| oldBlockHandling | FillMode | `replace` | How to handle existing blocks. | `destroy` |
| replaceTileName | Block | none | Optional block filter used with `replace`. | `dirt` |
| replaceBlockStates | json | all states | Restricts which block state variants are replaced. | `{"moisturized_amount":7}` |

---

## **4. Enums**
### **4.1. FillMode**
| Value | Behavior | Drops Items? |
|---|---|---|
| replace | Replaces all blocks in region. | No |
| destroy | Breaks and replaces blocks. | Yes |
| keep | Replaces only air blocks. | No |
| hollow | Places only outer layer and clears inside. | No |
| outline | Places only outer layer and keeps inside unchanged. | No |

---

## **5. Examples**
### **5.1. Basic Fill**
Command:
```mcfunction
fill 0 0 0 5 5 5 stone
```

Effect:
Fills a 6x6x6 cube with stone.

### **5.2. Replace Dirt with Grass**
Command:
```mcfunction
fill ~1 ~ ~5 ~5 ~2 ~10 grass replace dirt
```

Effect:
Replaces dirt with grass in a relative area.

---

## **6. Notes**
- Coordinates can be absolute (`10 64 20`) or relative (`~1 ~ ~`).
- Region size is limited by world boundaries and command execution limits.
- `replaceTileName` and `replaceBlockStates` are optional and only used in `replace` mode variants.
- Prefer filtering with `replace` to avoid unintended replacements.

---

## **7. Common Errors**
| Error | Cause | Fix |
|---|---|---|
| Invalid block ID | Block name does not exist. | Use a valid Bedrock block identifier. |
| Region too large | Selected volume exceeds command/world limits. | Reduce region size or split the fill into chunks. |
| Invalid block states | State keys or values are not valid for this block. | Check valid states for that specific block. |

---

## **8. See Also**
- `/clone` - Copy blocks from one region to another.
- `/setblock` - Place or replace a single block.

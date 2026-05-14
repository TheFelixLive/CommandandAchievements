---
# /tp
**Edition:** Both | **Permission:** Cheats
**Category:** Movement | **Group:** Entity Positioning
---

## **1. Purpose**
Teleports entities or players to coordinates or another entity.
It is commonly used for navigation, map logic, and admin moderation.

---

## **2. Syntax**
### **2.1. Basic**
```mcfunction
tp <target: target> <destination: x y z>
```

### **2.2. Variants**
| Variant | Syntax | Description |
|---|---|---|
| To Coordinates | `tp <target> <x> <y> <z> [yRot] [xRot]` | Teleports target to a location, optional rotation. |
| To Entity | `tp <target> <destinationEntity>` | Teleports target to another entity. |
| Self Teleport | `tp <x> <y> <z>` | Teleports command executor to coordinates. |

---

## **3. Arguments**
### **3.1. Required**
| Name | Type | Description | Example |
|---|---|---|---|
| target | target | Entity or player to teleport. | `@p`, `@e[type=zombie]` |
| destination | CommandPosition or target | Coordinates or entity destination. | `100 64 -20`, `@s` |

### **3.2. Optional**
| Name | Type | Default | Description | Example |
|---|---|---|---|---|
| yRot | float | unchanged | Horizontal facing rotation (yaw). | `180` |
| xRot | float | unchanged | Vertical facing rotation (pitch). | `0` |

---

## **4. Enums**
### **4.1. Coordinate Modes**
| Value | Behavior | Notes |
|---|---|---|
| Absolute | Uses world coordinates directly. | Example: `100 70 -30`. |
| Relative (`~`) | Offsets from current position. | Example: `~ ~1 ~`. |
| Local (`^`) | Offsets from current facing direction. | Example: `^ ^ ^5`. |

---

## **5. Examples**
### **5.1. Teleport to Spawn Area**
Command:
```mcfunction
tp @p 0 80 0
```

Effect:
Teleports the nearest player to coordinates `0 80 0`.

### **5.2. Teleport All Players to One Player**
Command:
```mcfunction
tp @a Steve
```

Effect:
Teleports all players to Steve's current position.

---

## **6. Notes**
- Teleporting into solid blocks can suffocate entities.
- Use selectors carefully when teleporting multiple entities.
- Local coordinates (`^`) are useful for directional movement systems.

---

## **7. Common Errors**
| Error | Cause | Fix |
|---|---|---|
| No targets matched selector | The target selector resolved to no entities. | Verify selector filters and nearby entities. |
| Invalid position | Coordinates are malformed or out of bounds. | Use valid numeric coordinates in world limits. |
| Cannot teleport entity | Entity type or state blocks teleport. | Confirm entity is valid and loaded. |

---

## **8. See Also**
- `/spreadplayers` - Distribute entities across an area.
- `/execute` - Run commands at or as specific entities.

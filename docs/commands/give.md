---
# /give
**Edition:** Both | **Permission:** Cheats
**Category:** Inventory | **Group:** Item Manipulation
---

## **1. Purpose**
Gives one or more items directly to a player or target selector.
Useful for testing, kits, and command-based rewards.

---

## **2. Syntax**
### **2.1. Basic**
```mcfunction
give <player: target> <item: Item> [amount: int] [components: json]
```

### **2.2. Variants**
| Variant | Syntax | Description |
|---|---|---|
| Minimal | `give <player> <item>` | Gives 1 of the specified item. |
| With Amount | `give <player> <item> <amount>` | Gives multiple items. |
| With Components | `give <player> <item> <amount> <components>` | Gives item with components/data. |

---

## **3. Arguments**
### **3.1. Required**
| Name | Type | Description | Example |
|---|---|---|---|
| player | target | Player or target selector receiving items. | `@p`, `Steve` |
| item | Item | Item identifier to give. | `diamond_sword`, `minecraft:apple` |

### **3.2. Optional**
| Name | Type | Default | Description | Example |
|---|---|---|---|---|
| amount | int | `1` | Number of items to give. | `64` |
| components | json | none | Additional item data/components. | `{"item_name":"My Sword"}` |

---

## **4. Enums**
### **4.1. Target Selector Shortcuts**
| Value | Behavior | Notes |
|---|---|---|
| `@p` | Nearest player | Most common for testing commands. |
| `@a` | All players | Can affect every online player. |
| `@s` | Command executor | Useful in function/self contexts. |

---

## **5. Examples**
### **5.1. Give Diamond Sword**
Command:
```mcfunction
give @p diamond_sword
```

Effect:
Gives the nearest player 1 diamond sword.

### **5.2. Give Full Stack of Apples**
Command:
```mcfunction
give Steve minecraft:apple 64
```

Effect:
Gives player Steve 64 apples.

---

## **6. Notes**
- Use the `minecraft:` namespace when needed to avoid ID ambiguity.
- Non-stackable items may ignore high amounts and split per slot rules.
- Invalid targets cause the command to fail without giving any items.

---

## **7. Common Errors**
| Error | Cause | Fix |
|---|---|---|
| Unknown item | Item ID is invalid or misspelled. | Use a valid Bedrock item identifier. |
| No targets matched selector | Target selector found no entities. | Adjust selector or use a specific player name. |
| Invalid components JSON | JSON syntax or keys are invalid. | Validate JSON format and component keys. |

---

## **8. See Also**
- `/clear` - Remove items from player inventory.
- `/replaceitem` - Set a specific inventory slot item.

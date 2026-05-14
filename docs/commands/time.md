---
# /time
**Edition:** Bedrock | **Permission:** Game Directors (Cheats required)
**Category:** World Rules | **Group:** Time Control
---

## **1. Purpose**
Changes or queries the world's game time.
Use it to advance time, set named times of day, or query day/daytime/gametime values.

---

## **2. Syntax**
### **2.1. Basic**
```mcfunction
time add <amount: int>
```

### **2.2. Variants**
| Variant | Syntax | Description |
|---|---|---|
| Add Time | `time add <amount: int>` | Adds ticks to current world time progression. |
| Set Time (Ticks) | `time set <amount: int>` | Sets daytime using a numeric tick value. |
| Set Time (Named) | `time set <time: TimeSpec>` | Sets a named daytime point like `day` or `night`. |
| Query Time | `time query <time: TimeQuery>` | Returns `daytime`, `gametime`, or `day`. |

---

## **3. Arguments**
### **3.1. Required**
| Name | Type | Description | Example |
|---|---|---|---|
| amount | int | Tick amount used by `add` or `set`. | `1000`, `24000` |
| time | TimeSpec or TimeQuery | Named time value for `set` or query key for `query`. | `day`, `gametime` |

### **3.2. Optional**
| Name | Type | Default | Description | Example |
|---|---|---|---|---|
| None | - | - | `/time` variants are explicit and do not use optional args. | - |

---

## **4. Enums**
### **4.1. TimeSpec**
| Value | Behavior | Example Tick |
|---|---|---|
| day | Sets day start. | `1000` |
| sunrise | Sets sunrise. | `23000` |
| noon | Sets noon. | `6000` |
| sunset | Sets sunset. | `12000` |
| night | Sets night start. | `13000` |
| midnight | Sets midnight. | `18000` |

### **4.2. TimeQuery**
| Value | Behavior | Returns |
|---|---|---|
| daytime | Time within the current day cycle. | Tick value in day cycle |
| gametime | Total elapsed world game ticks. | Global tick count |
| day | Day count in the world. | Integer day number |

---

## **5. Examples**
### **5.1. Set Daytime to Morning**
Command:
```mcfunction
time set 1000
```

Effect:
Sets daytime to the standard morning/day start tick.

### **5.2. Advance One Full Day**
Command:
```mcfunction
time add 24000
```

Effect:
Advances the world by one full in-game day.

---

## **6. Notes**
- Bedrock supports `time set <amount: int>` and `time set <time: TimeSpec>`.
- `time query` supports `daytime`, `gametime`, and `day`.
- Wiki usage notes can differ across versions; verify behavior against current Bedrock build if you depend on edge cases.

---

## **7. Common Errors**
| Error | Cause | Fix |
|---|---|---|
| Invalid enum value | Unknown `TimeSpec` or `TimeQuery` value used. | Use valid values like `day`, `night`, `daytime`, `gametime`, `day`. |
| Invalid integer | Non-integer used for `amount`. | Use a 32-bit integer tick value. |
| Permission denied | Missing required command permission or cheats disabled. | Enable cheats and run with sufficient permissions. |

---

## **8. See Also**
- `/weather` - Control environmental weather state.
- `/gamerule` - Configure rules like `doDaylightCycle`.

---
# /say
**Edition:** Bedrock | **Permission:** See official reference
**Category:** Command Reference | **Group:** General
---
## **1. Purpose**
Official documentation entry for /say in Minecraft Bedrock Edition.
Use this page as a normalized template target for syntax, examples, and troubleshooting.
---
## **2. Syntax**
### **2.1. Basic**
`mcfunction
say <args>
`
### **2.2. Variants**
| Variant | Syntax | Description |
|---|---|---|
| Basic Variant | $cmd <args> | Base command form from official docs. |
---
## **3. Arguments**
### **3.1. Required**
| Name | Type | Description | Example |
|---|---|---|---|
| args | varies | Depends on command variant. | See official docs |
### **3.2. Optional**
| Name | Type | Default | Description | Example |
|---|---|---|---|---|
| optional_args | varies | depends | Command-specific optional parameters. | See official docs |
---
## **4. Enums**
### **4.1. Command-Specific Enums**
| Value | Behavior | Notes |
|---|---|---|
| varies | Depends on command. | Populate from official command page. |
---
## **5. Examples**
### **5.1. Basic Usage**
Command:
`mcfunction
say <args>
`
Effect:
Runs the command with the provided arguments.
### **5.2. Practical Variant**
Command:
`mcfunction
say <args_variant>
`
Effect:
Runs a common variant used in maps or administration.
---
## **6. Notes**
- Keep this file aligned with the latest Bedrock stable docs.
- Add command-specific limits, permissions, and quirks once verified.
- Prefer explicit examples with Bedrock-valid identifiers.
---
## **7. Common Errors**
| Error | Cause | Fix |
|---|---|---|
| Invalid syntax | Arguments do not match a valid variant. | Check the official syntax and required argument order. |
| Invalid target/value | Selector, ID, enum, or value is invalid. | Use valid Bedrock identifiers and enum values. |
| Permission denied | Insufficient command permission level. | Grant required permissions or run as an authorized operator. |
---
## **8. See Also**
- /help - Show command pages and syntax help in game.
- /execute - Compose advanced command logic with conditions.

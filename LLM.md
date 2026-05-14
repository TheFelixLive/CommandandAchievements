# LLM.md - Large Language Model Documentation

## ProjektÃ¼bersicht

Dieses Projekt ist ein Minecraft Bedrock Behavior Pack namens "Command&Achievement", das erweiterte Befehls- und Achievement-Funktionen fÃ¼r Minecraft Bedrock Edition bereitstellt. Es umfasst Skripte zur Verwaltung von Save-Daten, MenÃ¼s, Gestensteuerung und mehr.

## Hauptfunktionen

- **Save Data Management**: Sichere Speicherung von Daten in Chunks mit Base64-Kodierung oder UTF-16.
- **Multiple Menu System**: Host-Client-Architektur fÃ¼r Add-on-Interaktionen.
- **Command System**: Registrierung und Verwaltung von Befehlen mit Berechtigungen.
- **Gesture Controls**: Steuerung Ã¼ber SprÃ¼nge, Emotes und Nicken.
- **Player Data Handling**: Verwaltung von Spielerdaten, Join-Nachrichten und Reminders.

## Technische Details

- **Sprache**: JavaScript (ES6+)
- **API**: Minecraft Bedrock Script API (@minecraft/server)
- **Speicher**: Dynamic Properties mit Chunking fÃ¼r groÃŸe Datenmengen
- **Architektur**: Modulares Design mit separaten Abschnitten fÃ¼r verschiedene Funktionen

## Wichtige Konstanten

- `BASE_KEY`: "com2hard:save_data"
- `META_KEY`: "com2hard:save_data_meta"
- `MAX_BYTES`: 32767 (Maximale Bytes pro Chunk)

## Funktionen Ãœbersicht

### Save Data Funktionen
- `load_save_data()`: LÃ¤dt die gespeicherten Daten
- `update_save_data(input)`: Speichert Daten in Chunks
- `getBytesfromSDindex(index)`: Gibt Bytes und Chunks fÃ¼r einen Index zurÃ¼ck

### Menu System
- `multiple_menu(player)`: Zeigt das HauptmenÃ¼
- `initialize_multiple_menu()`: Initialisiert das Multi-Addon-MenÃ¼

### Command System
- `registerAllCommands(init)`: Registriert alle Befehle
- `isCommandAvailable(player, cmd)`: PrÃ¼ft BefehlsverfÃ¼gbarkeit

## Update-Prozess fÃ¼r Command-Syntax System (v2)

### ðŸŽ¯ Ziel
Dieses Dokument beschreibt, wie neue Commands hinzugefÃ¼gt oder bestehende Commands erweitert werden, ohne die bestehende Syntax-Struktur zu brechen.

Das System basiert auf einer **rekursiven Command-Grammatik** mit:

* `literal` (Fixpunkte)
* `enum` (diskrete Auswahl)
* `next` (Pfadfortsetzung)
* `optional` (weiche Argumente)
* zukÃ¼nftig: `choice` (explizite Branches)

---

## ðŸ§  1. Grundprinzip
Ein Command ist ein **Syntax-Baum**, kein linearer String.

```txt
Command
 â”œâ”€â”€ literal
 â”œâ”€â”€ enum (Branch)
 â”‚    â”œâ”€â”€ next (Subtree)
 â”‚    â””â”€â”€ next (Subtree)
 â””â”€â”€ optional nodes
```

---

## ðŸ§© 2. Update-Regeln fÃ¼r bestehende Commands

### ðŸ“Œ Regel 1: Keine Breaking Changes
Bestehende Pfade dÃ¼rfen nicht entfernt oder umsortiert werden.

âŒ verboten:

* bestehende `enum.value` lÃ¶schen
* Reihenfolge Ã¤ndern, wenn Parsing davon abhÃ¤ngt

---

### ðŸ“Œ Regel 2: Erweiterungen nur Ã¼ber `next`
Neue Argumente werden **immer angehÃ¤ngt Ã¼ber `next`**, niemals inline ersetzt.

### Beispiel

```js
{
  value: "tp",
  next: [
    { type: "location", name: "pos" }
  ]
}
```

âž¡ Erweiterung:

```js
next: [
  { type: "location", name: "pos" },
  { type: "bool", name: "safe", optional: true }
]
```

---

### ðŸ“Œ Regel 3: `enum` = kontrollierter Branchpunkt
`enum` definiert stabile Optionen.

```js
{
  type: "enum",
  name: "action",
  value: [...]
}
```

#### Regeln:

* `value` ist **stabiler Contract**
* jede `value` kann eigene `next`-Substruktur haben
* neue Actions nur hinzufÃ¼gen, niemals alte Ã¤ndern

---

### ðŸ“Œ Regel 4: `next` ist rekursiv
`next` darf beliebig tief verschachtelt werden:

```js
enum â†’ next â†’ enum â†’ next â†’ enum
```

âž¡ wird als **AST-Traversal** interpretiert

---

### ðŸ“Œ Regel 5: OptionalitÃ¤t nur am Ende eines Pfades

```js
{ type: "int", name: "count", optional: true }
```

#### Regeln:

* optional nur fÃ¼r terminale oder eindeutig Ã¼berspringbare Nodes
* keine Pflichtparameter nach optionalen ohne Branchlogik

---

## ðŸŒ¿ 3. EinfÃ¼hrung von `choice` (NEU)

### ðŸ“Œ Zweck
`choice` ersetzt komplexe oder mehrdeutige `enum + next` Konstrukte, wenn mehrere vollstÃ¤ndige Pfade existieren.

---

### ðŸ“¦ Struktur

```js
{
  type: "choice",
  options: [
    {
      name: "pathA",
      syntaxes: [...]
    },
    {
      name: "pathB",
      syntaxes: [...]
    }
  ]
}
```

---

### ðŸ§  Verhalten

* Parser testet Optionen sequentiell
* erste vollstÃ¤ndige Ãœbereinstimmung gewinnt
* kein Mixing zwischen Optionen erlaubt
* Backtracking Pflicht

---

### ðŸ“Œ Wann `choice` verwenden?

#### âŒ NICHT bei:

* einfachen enums
* optionalen Parametern
* linearen `next`-Chains

#### âœ… NUR bei:

* strukturell unterschiedlichen ArgumentbÃ¤umen
* z. B. `/teleport <entity> <entity>` vs `/teleport <entity> <location>`

---

## ðŸ”€ 4. `enum` vs `choice` vs `next`

| Typ      | Bedeutung                                   |
| -------- | ------------------------------------------- |
| `enum`   | Auswahl eines Tokens innerhalb eines Pfades |
| `next`   | Fortsetzung desselben Pfades                |
| `choice` | komplette alternative Pfade                 |

---

## ðŸ§¬ 5. Parsing-Regeln (Runtime)

### Reihenfolge:

1. literal match
2. enum match
3. choice evaluation (falls vorhanden)
4. next traversal
5. optional skip

---

### ðŸ” Backtracking
Wenn ein Pfad fehlschlÃ¤gt:

* Zustand zurÃ¼cksetzen
* nÃ¤chste enum/choice Option testen
* niemals Teilverbrauch von Input behalten

---

## âš ï¸ 6. Konsistenzregeln

### â— Keine AmbiguitÃ¤t

* zwei Pfade dÃ¼rfen nicht identisch starten ohne Unterscheidung
* enums mÃ¼ssen eindeutig sein

---

### â— Keine stillen Konflikte

Wenn zwei Pfade gleich gut matchen kÃ¶nnten:

âž¡ `choice` muss eingefÃ¼hrt werden

---

## ðŸš€ 7. Best Practices

* `enum` fÃ¼r stabile Subcommands
* `next` fÃ¼r natÃ¼rliche Argumentketten
* `choice` fÃ¼r echte Strukturdivergenz
* optional nur fÃ¼r Komfortargumente
* keine tief verschachtelten enums ohne Notwendigkeit

---

## ðŸ“Œ 8. Ziel des Systems

Dieses System ist kein einfacher Command Parser mehr, sondern:

> eine deklarative Command-Grammatik mit AST-Auswertung

---

## âœ… Fazit

* `enum` = Auswahl
* `next` = Fortsetzung
* `choice` = Branching auf Strukturlevel

Damit wird dein Command-System:

* erweiterbar
* versionierbar
* und deutlich stabiler als klassische Parser-Listen

---

### Helper Funktionen
- `formatBytes(bytes)`: Formatiert Bytes in lesbare Einheiten
- `markdownToMinecraft(md)`: Konvertiert Markdown zu Minecraft-Text
- `toRoman(num)`: Konvertiert Zahlen zu rÃ¶mischen Ziffern

## Verwendung

Dieses Behavior Pack wird in Minecraft Bedrock Edition geladen und erweitert die Spielmechanik. Es ist fÃ¼r Entwickler gedacht, die komplexe Add-ons erstellen mÃ¶chten.

## Hinweise fÃ¼r LLMs

- Bei Ã„nderungen an Save-Daten immer `update_save_data()` verwenden, um Chunking zu gewÃ¤hrleisten.
- Dynamic Properties haben GrÃ¶ÃŸenbeschrÃ¤nkungen; daher das Chunking-System.
- Fehlerbehandlung ist wichtig, da Minecraft-Skripte in einer Sandbox laufen.

## Beitrag

FÃ¼r BeitrÃ¤ge oder Fragen bitte die README.md konsultieren oder Issues im Repository erstellen.

## Bedrock Command Documentation Sync (2026-05-14)

This repository's command documentation was synchronized against the official Bedrock command list:
- https://learn.microsoft.com/en-us/minecraft/creator/commands/commands?view=minecraft-bedrock-stable

What was updated:
- Ensured docs/commands contains one markdown file per command from the official list.
- Kept existing detailed command files (for example fill.md, give.md, tp.md) and generated missing command pages using the standardized template.
- Added docs/commands/README.md as a machine-readable index of command files.

Current baseline:
- Command list source page last-updated date shown by Microsoft Learn: 2024-08-01.
- Local sync date in this repository: 2026-05-14.

Maintenance rule for future updates:
1. Re-check the official command list URL above.
2. Add or remove command files in docs/commands to match the current list.
3. Refresh docs/commands/README.md and this sync section date.

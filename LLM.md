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

# Command & Achievement Behavior Pack – Dokumentation

## Inhaltsverzeichnis
1. [Projektübersicht](#projektübersicht)
2. [Hauptfunktionen](#hauptfunktionen)
3. [Technische Details](#technische-details)
4. [Wichtige Konstanten](#wichtige-konstanten)
5. [API‑Übersicht](#api‑übersicht)
6. [Command‑Syntax System (v2)](#command‑syntax-system-v2)
7. [Best Practices & Konsistenzregeln](#best-practices--konsistenzregeln)
8. [Hilfsfunktionen](#hilfsfunktionen)
9. [Entwicklungs‑ und Beitragsrichtlinien](#entwicklungs‑und‑beitragsrichtlinien)
10. [Synchronisation mit der offiziellen Dokumentation](#synchronisation-mit-der-offiziellen-dokumentation)

---

## Projektübersicht
Dieses **Behavior Pack** erweitert Minecraft Bedrock Edition um ein umfangreiches **Command‑ und Achievement‑System**. Es ermöglicht das Erstellen, Verwalten und Ausführen von benutzerdefinierten Befehlen sowie das Speichern von Spieler‑ und Serverdaten.

---

## Hauptfunktionen
| Feature | Beschreibung |
|---|---|
| **Save‑Data‑Management** | Chunk‑basiertes Speichern großer Datenmengen (Base64‑ oder UTF‑16‑Kodierung) über Dynamic Properties. |
| **Mehrmenü‑System** | Host‑Client‑Architektur für modulare Add‑on‑Interaktionen. |
| **Command‑System** | Registrierung, Berechtigungs‑ und Verfügbarkeitsprüfung von Befehlen. |
| **Gesten‑Steuerung** | Sprünge, Emotes und Kopfnicken als Eingabemethoden. |
| **Spieler‑Daten‑Handling** | Verwaltung von Join‑Nachrichten, Erinnerungen und individuellen Spieler‑Daten. |

---

## Technische Details
* **Sprache**: JavaScript (ES6+)
* **API**: Minecraft Bedrock Script API (`@minecraft/server`)
* **Speicher**: Dynamic Properties mit automatischem Chunking (max. 32 767 Byte pro Chunk)
* **Architektur**: Modulares Design – jede Funktionalität befindet sich in eigenen Modulen unter `scripts/`.

---

## Wichtige Konstanten
```js
export const BASE_KEY = "com2hard:save_data";      // Root‑Key für gespeicherte Daten
export const META_KEY = "com2hard:save_data_meta"; // Metadaten‑Key (Chunk‑Info)
export const MAX_BYTES = 32767;                     // Maximale Chunk‑Größe in Bytes
```

---

## API‑Übersicht
### Save‑Data‑Funktionen
* `load_save_data()` – Lädt alle gespeicherten Daten aus den Dynamic Properties.
* `update_save_data(input)` – Speichert `input` in Chunks, wobei die Chunk‑Größe automatisch beachtet wird.
* `getBytesFromSDindex(index)` – Gibt den Byte‑Array und die zugehörigen Chunks für einen Index zurück.

### Menü‑System
* `multiple_menu(player)` – Öffnet das Hauptmenü für den angegebenen Spieler.
* `initialize_multiple_menu()` – Initialisiert das Multi‑Addon‑Menü beim Server‑Start.

### Command‑System
* `registerAllCommands(init)` – Registriert sämtliche Befehle des Packs.
* `isCommandAvailable(player, cmd)` – Prüft, ob ein Spieler den Befehl `cmd` ausführen darf.

---

## Command‑Syntax System (v2)
Das neue System verwendet eine **rekursive AST‑basierte Grammatik**, die folgende Knotentypen unterstützt:

* `literal` – feste Token (z. B. `tp`).
* `enum` – diskrete Auswahlmöglichkeiten.
* `next` – Fortsetzung des aktuellen Pfades.
* `optional` – optionale Argumente (nur am Pfadende erlaubt).
* `choice` – komplette alternative Pfad‑Strukturen (neu eingeführt).

### Grundprinzip
Ein Befehl wird als Baum dargestellt, nicht als linearer String. Beispiel‑Struktur:

```text
Command
 ├─ literal
 ├─ enum (Branch)
 │   └─ next → …
 └─ optional (Terminal)
```

### Update‑Regeln (keine Breaking Changes)
1. **Keine Entfernung oder Umordnung bestehender Pfade** – `enum.value` darf nicht gelöscht oder verschoben werden.
2. **Erweiterungen ausschließlich über `next`** – neue Argumente werden immer angehängt.
3. **`enum` bleibt stabil** – neue Werte dürfen nur hinzugefügt werden.
4. **`next` ist rekursiv** – beliebig tiefe Verschachtelungen sind erlaubt.
5. **`optional` nur am Ende** – nach einem optionalen Parameter dürfen keine verpflichtenden Parameter folgen.

### Einführung von `choice`
`choice` wird verwendet, wenn ein Befehl mehrere strukturell unterschiedliche Pfade besitzt (z. B. `/teleport <entity> <entity>` vs. `/teleport <entity> <location>`).

#### Struktur
```js
{
  type: "choice",
  options: [
    { name: "entity‑to‑entity", syntaxes: [/* … */] },
    { name: "entity‑to‑location", syntaxes: [/* … */] }
  ]
}
```

#### Verhaltensregeln
* Der Parser testet die Optionen sequenziell und wählt die **erste vollständige Übereinstimmung**.
* Backtracking ist obligatorisch, um falsche Pfade zurückzusetzen.

---

## Best Practices & Konsistenzregeln
| Regel | Beschreibung |
|---|---|
| **Keine Ambiguität** | Zwei Pfade dürfen nicht identisch starten, ohne sich eindeutig zu unterscheiden. |
| **Stabile `enum`‑Werte** | `enum`‑Werte bilden den öffentlichen Vertrag – nie entfernen oder umbenennen. |
| **Verwendung von `choice`** | Nur bei strukturell unterschiedlichen Argumentbäumen einsetzen. |
| **Optionale Parameter** | Nur am Ende eines Pfades, keine Pflichtparameter danach. |

---

## Hilfsfunktionen
```js
/** Formatiert eine Byte‑Anzahl in lesbare Einheiten */
export function formatBytes(bytes) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(2)} ${units[i]}`;
}

/** Wandelt Markdown‑Text in das Minecraft‑Text‑Format um */
export function markdownToMinecraft(md) {
  // Sehr einfache Umsetzung – für komplexe Fälle bitte Bibliothek nutzen
  return md.replace(/\*\*(.*?)\*\*/g, "§l$1§r");
}

/** Konvertiert eine Zahl in römische Ziffern */
export function toRoman(num) {
  const map = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]
  ];
  let result = "";
  for (const [value, numeral] of map) {
    while (num >= value) {
      result += numeral;
      num -= value;
    }
  }
  return result;
}
```

---

## Entwicklungs‑ und Beitragsrichtlinien
* **Code‑Qualität** – Nutze ESLint mit den empfohlenen Regeln für Minecraft‑Skripte.
* **Tests** – Füge neue Befehle immer mit mindestens einem Unit‑Test im `tests/`‑Verzeichnis hinzu.
* **Pull‑Requests** – Beschreibe Änderungen ausführlich und aktualisiere die zugehörige Dokumentation im `docs/commands/`‑Ordner.
* **Issue‑Tracking** – Verwende das Repository‑Issue‑System für Feature‑Requests und Bug‑Reports.

---

## Synchronisation mit der offiziellen Dokumentation
Die Befehls‑Dokumentation wird regelmäßig mit der offiziellen Microsoft‑Learn‑Seite abgeglichen:
* **Quelle**: <https://learn.microsoft.com/en-us/minecraft/creator/commands/commands?view=minecraft-bedrock-stable>
* **Letztes Update**: 2026‑05‑14

### Vorgehen bei zukünftigen Updates
1. Offizielle Befehlsliste prüfen.
2. Fehlende Markdown‑Dateien im Ordner `docs/commands/` anlegen oder veraltete entfernen.
3. `docs/commands/README.md` (Index) und diesen Synchronisations‑Abschnitt aktualisieren.
4. Änderungen nur dann an bestehenden Detail‑Dateien vornehmen, wenn die offizielle Dokumentation signifikante Änderungen enthält.

---

*Dieses Dokument wird kontinuierlich gepflegt, um Entwicklern eine klare und aktuelle Referenz für das **Command & Achievement** Behavior Pack zu bieten.*
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

## Variablen & aktueller Debug‑Stand

Unten ist eine Zusammenstellung der wichtigsten globalen Variablen, ihrer Definition/Initialwerte und Hinweise, wie du den aktuellen Wert im Debugger bzw. zur Laufzeit ermitteln kannst. Werte aus der laufenden Spiel‑/Skriptumgebung kann ich hier nicht automatisch auslesen — die Sektion enthält deshalb kurze Befehle/Snippets, mit denen du die Werte selbst im Spiel protokollieren kannst.

- **`version_info`**: Definition und Metadaten des Add‑ons. Siehe [scripts/main.js](scripts/main.js#L7).
  - Initialwert: Objekt mit `name`, `version`, `build`, `release_type`, `uuid`, u.v.m.
  - Debug‑Wert: runtime (nur im Spiel verfügbar)
  - So ermitteln: Füge kurz `system.run(() => console.log(JSON.stringify(version_info)))` in `scripts/main.js` ein und lade das Add‑on neu.

- **`links`**: Array mit Links (GitHub, CurseForge, MCPEDL). Siehe [scripts/main.js](scripts/main.js#L48).
  - Initialwert: Array mit Objekten `{name, link}`
  - So ermitteln: `system.run(() => console.log(JSON.stringify(links)))`

- **`timezone_list`**: Liste der Zeitzonen‑Definitionen. Siehe [scripts/main.js](scripts/main.js#L55).
  - Initialwert: großes Array von Objektdefinitionen (name/utc/short/lang)

- **`entity_blocklist`**: IDs, die im UI/Commands ausgeschlossen werden. Siehe [scripts/main.js](scripts/main.js#L331).

- **`entity_exceptionlist`**: Map mit Ausnahmen und Icons. Siehe [scripts/main.js](scripts/main.js#L459).

- **`gamerules`**: Liste aller UI‑Gamerules mit Defaults. Siehe [scripts/main.js](scripts/main.js#L477).

- **`command_categories`** und **`command_list`**: Kategorisierung und komplette Befehlsliste (Syntax‑Bäume). Siehe [scripts/main.js](scripts/main.js#L527) bzw. [scripts/main.js](scripts/main.js#L555).

- **`block_command_list`**: Liste gefährlicher Befehle mit Ratings. Siehe [scripts/main.js](scripts/main.js#L2661).

- **`old_version`**: `let old_version = undefined` — speichert die vorherige Version bei Migration. Siehe [scripts/main.js](scripts/main.js#L2674).
  - Debug: `system.run(() => console.log('old_version=', old_version))`

- **`server_mode`**: `let server_mode = false` — wird beim Start auf Basis onlineer Spieler gesetzt. Siehe [scripts/main.js](scripts/main.js#L2675).
  - Debug: `system.run(() => console.log('server_mode=', server_mode))`

- **`system_privileges`**: `let system_privileges = 2` — Host/Client/Inactive Flag. Siehe [scripts/main.js](scripts/main.js#L2697).

- **`addon_list`**: Wird in `initialize_multiple_menu()` gesetzt; enthält die von anderen Add‑ons gemeldeten Daten. Siehe [scripts/main.js](scripts/main.js#L2763).
  - Debug: `system.run(() => console.log(JSON.stringify(addon_list)))` nachdem `initialize_multiple_menu()` gelaufen ist.

- **`BASE_KEY`, `META_KEY`, `MAX_BYTES`**: Konstanten für Save‑Data Chunking. Siehe [scripts/main.js](scripts/main.js#L??).
  - Debug: `system.run(() => console.log(BASE_KEY, META_KEY, MAX_BYTES))`

- **Gesture & State Maps**: `gestureCooldowns_jump`, `gestureState_reset`, `gestureCooldowns_emote`, `gestureState_reset_emote`, `playerHeadMovement` — Maps zur Gestenerkennung.
  - Debug: Beispiel: `system.run(() => console.log('gestureCooldowns_jump size=', gestureCooldowns_jump.size))`

- **Klassen/Builder**: `MenuBuilder` (Klasse) und Hilfsfunktionen wie `TranslateMenuBuilder()` und `print()` sind im Code definiert; ihr Zustand ist typischerweise stateless oder lokal pro Aufruf.

Kurz‑Snippet: Einmalige Debug‑Ausgabe beim Start einfügen

Füge in `scripts/main.js` (temporär, am Ende oder in einem `system.run`) folgendes hinzu, lade das Add‑on neu und schau in die Konsole/Log:

```js
system.run(() => {
  try {
    console.log('DEBUG VARS:');
    console.log('version_info=' + JSON.stringify(version_info));
    console.log('server_mode=' + server_mode);
    console.log('old_version=' + old_version);
    console.log('system_privileges=' + system_privileges);
    console.log('addon_list=' + JSON.stringify(addon_list));
  } catch (e) {
    console.warn('Fehler beim Debug‑Dump', e);
  }
});
```

Hinweis: Viele Werte existieren erst nachdem bestimmte Events gelaufen sind (z. B. `addon_list` nach `initialize_multiple_menu()` oder `server_mode` nachdem Spieler gefunden wurden). Setze `await system.waitTicks(...)` bzw. rufe das Debug‑Dump‑Snippet manuell per `/reload` oder `/scriptevent` nach dem Start auf.

Wenn du möchtest, fülle ich die Liste der Variablen vollständig und extrahiere Inline‑Definitionen (komplette Initialwerte) aus `scripts/main.js` und `subpacks/*/scripts/mode.js` und schreibe sie in diese Datei. Soll ich das jetzt machen?

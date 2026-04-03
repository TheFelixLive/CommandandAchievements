# LLM.md - Large Language Model Documentation

## Projektübersicht

Dieses Projekt ist ein Minecraft Bedrock Behavior Pack namens "Command&Achievement", das erweiterte Befehls- und Achievement-Funktionen für Minecraft Bedrock Edition bereitstellt. Es umfasst Skripte zur Verwaltung von Save-Daten, Menüs, Gestensteuerung und mehr.

## Hauptfunktionen

- **Save Data Management**: Sichere Speicherung von Daten in Chunks mit Base64-Kodierung oder UTF-16.
- **Multiple Menu System**: Host-Client-Architektur für Add-on-Interaktionen.
- **Command System**: Registrierung und Verwaltung von Befehlen mit Berechtigungen.
- **Gesture Controls**: Steuerung über Sprünge, Emotes und Nicken.
- **Player Data Handling**: Verwaltung von Spielerdaten, Join-Nachrichten und Reminders.

## Technische Details

- **Sprache**: JavaScript (ES6+)
- **API**: Minecraft Bedrock Script API (@minecraft/server)
- **Speicher**: Dynamic Properties mit Chunking für große Datenmengen
- **Architektur**: Modulares Design mit separaten Abschnitten für verschiedene Funktionen

## Wichtige Konstanten

- `BASE_KEY`: "com2hard:save_data"
- `META_KEY`: "com2hard:save_data_meta"
- `MAX_BYTES`: 32767 (Maximale Bytes pro Chunk)

## Funktionen Übersicht

### Save Data Funktionen
- `load_save_data()`: Lädt die gespeicherten Daten
- `update_save_data(input)`: Speichert Daten in Chunks
- `getBytesfromSDindex(index)`: Gibt Bytes und Chunks für einen Index zurück

### Menu System
- `multiple_menu(player)`: Zeigt das Hauptmenü
- `initialize_multiple_menu()`: Initialisiert das Multi-Addon-Menü

### Command System
- `registerAllCommands(init)`: Registriert alle Befehle
- `isCommandAvailable(player, cmd)`: Prüft Befehlsverfügbarkeit

### Helper Funktionen
- `formatBytes(bytes)`: Formatiert Bytes in lesbare Einheiten
- `markdownToMinecraft(md)`: Konvertiert Markdown zu Minecraft-Text
- `toRoman(num)`: Konvertiert Zahlen zu römischen Ziffern

## Verwendung

Dieses Behavior Pack wird in Minecraft Bedrock Edition geladen und erweitert die Spielmechanik. Es ist für Entwickler gedacht, die komplexe Add-ons erstellen möchten.

## Hinweise für LLMs

- Bei Änderungen an Save-Daten immer `update_save_data()` verwenden, um Chunking zu gewährleisten.
- Dynamic Properties haben Größenbeschränkungen; daher das Chunking-System.
- Fehlerbehandlung ist wichtig, da Minecraft-Skripte in einer Sandbox laufen.

## Beitrag

Für Beiträge oder Fragen bitte die README.md konsultieren oder Issues im Repository erstellen.
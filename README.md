# Jarvis-like Voice Assistant (Python)

A friendly, polite, and respectful **Jarvis-inspired voice assistant** for basic PC tasks.

## Features
- 🎤 Voice commands using free Google Web Speech recognition API (via `SpeechRecognition`)
- 🔊 Natural speech responses using `pyttsx3` (offline text-to-speech)
- 🧠 Jarvis-style courteous interaction tone
- 🖥️ Basic PC tasks:
  - Open YouTube / Google / GitHub
  - Open Notepad / Calculator / Browser (platform-dependent)
  - Tell current time and date
  - Save voice notes to `jarvis_notes.txt`
  - Exit assistant with commands like `exit`, `quit`, `goodbye`

## Setup
1. Create and activate virtual environment (recommended):
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # Linux/macOS
   .venv\Scripts\activate     # Windows PowerShell
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. (Linux only) If microphone/audio issues occur:
   ```bash
   sudo apt install portaudio19-dev pulseaudio alsa-utils
   ```

## Run
```bash
python jarvis_assistant.py
```

## Example voice commands
- "Open YouTube"
- "Open calculator"
- "What's the time?"
- "Take note buy groceries tomorrow"
- "Who are you?"
- "Goodbye"

## Notes
- Speech recognition requires internet for the free Google recognition endpoint.
- Text-to-speech (`pyttsx3`) works offline.
- App-launch behavior varies by OS and installed applications.

"""Jarvis-like voice assistant for basic PC tasks.

Features:
- Wake-word style command listening.
- Speech-to-text via SpeechRecognition + free Google Web Speech API.
- Text-to-speech via pyttsx3 (offline).
- Friendly and respectful responses inspired by Jarvis.
- Basic PC tasks: open websites/apps, tell time/date, take notes, and exit.
"""

from __future__ import annotations

import datetime as dt
import platform
import subprocess
import webbrowser
from pathlib import Path

import pyttsx3
import speech_recognition as sr


class JarvisAssistant:
    """Voice assistant with Jarvis-like personality."""

    def __init__(self) -> None:
        self.recognizer = sr.Recognizer()
        self.engine = pyttsx3.init()
        self.engine.setProperty("rate", 175)
        self.engine.setProperty("volume", 1.0)
        self.notes_file = Path("jarvis_notes.txt")

    def speak(self, text: str) -> None:
        """Speak text in a calm, polite tone."""
        print(f"Jarvis: {text}")
        self.engine.say(text)
        self.engine.runAndWait()

    def listen(self, timeout: int = 8, phrase_time_limit: int = 8) -> str | None:
        """Capture voice input and convert to text."""
        with sr.Microphone() as source:
            print("Listening...")
            self.recognizer.adjust_for_ambient_noise(source, duration=0.7)
            try:
                audio = self.recognizer.listen(
                    source,
                    timeout=timeout,
                    phrase_time_limit=phrase_time_limit,
                )
            except sr.WaitTimeoutError:
                return None

        try:
            # Free Google Web Speech API via SpeechRecognition
            query = self.recognizer.recognize_google(audio)
            print(f"You: {query}")
            return query.lower().strip()
        except sr.UnknownValueError:
            self.speak("My apologies. I couldn't quite catch that.")
        except sr.RequestError:
            self.speak(
                "I am unable to reach the speech recognition service at the moment."
            )
        return None

    def open_application(self, app_name: str) -> None:
        """Open basic desktop applications based on the operating system."""
        system = platform.system().lower()

        app_map = {
            "notepad": {"windows": ["notepad"], "darwin": ["open", "-a", "TextEdit"]},
            "calculator": {
                "windows": ["calc"],
                "darwin": ["open", "-a", "Calculator"],
                "linux": ["gnome-calculator"],
            },
            "browser": {
                "windows": ["start", "", "https://www.google.com"],
                "darwin": ["open", "https://www.google.com"],
                "linux": ["xdg-open", "https://www.google.com"],
            },
        }

        if app_name not in app_map:
            self.speak("I can only open notepad, calculator, or browser right now, sir.")
            return

        command = app_map[app_name].get(system)
        if command is None:
            self.speak("Apologies, this application mapping is not available on your system.")
            return

        try:
            if system == "windows" and app_name == "browser":
                subprocess.Popen(" ".join(command), shell=True)
            else:
                subprocess.Popen(command)
            self.speak(f"Certainly. Opening {app_name} now.")
        except FileNotFoundError:
            self.speak(f"I couldn't find {app_name} installed on this machine.")

    def write_note(self, note: str) -> None:
        """Append a note to a local text file."""
        timestamp = dt.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        with self.notes_file.open("a", encoding="utf-8") as file:
            file.write(f"[{timestamp}] {note}\n")
        self.speak("Done. I've safely saved that note for you.")

    def handle_command(self, command: str) -> bool:
        """Interpret and run command. Returns False when exit is requested."""
        if any(phrase in command for phrase in ["exit", "quit", "stop", "goodbye"]):
            self.speak("As you wish. Shutting down now. Have a wonderful day.")
            return False

        if "time" in command:
            current_time = dt.datetime.now().strftime("%I:%M %p")
            self.speak(f"The current time is {current_time}.")
            return True

        if "date" in command or "day" in command:
            current_date = dt.datetime.now().strftime("%A, %d %B %Y")
            self.speak(f"Today is {current_date}.")
            return True

        if "open youtube" in command:
            webbrowser.open("https://www.youtube.com")
            self.speak("Certainly. Opening YouTube.")
            return True

        if "open google" in command:
            webbrowser.open("https://www.google.com")
            self.speak("Of course. Opening Google.")
            return True

        if "open github" in command:
            webbrowser.open("https://github.com")
            self.speak("Right away. Opening GitHub.")
            return True

        if "open notepad" in command:
            self.open_application("notepad")
            return True

        if "open calculator" in command:
            self.open_application("calculator")
            return True

        if "open browser" in command:
            self.open_application("browser")
            return True

        if command.startswith("note ") or "take note" in command:
            note_text = command.replace("take note", "").replace("note", "", 1).strip()
            if not note_text:
                self.speak("What would you like me to note down?")
                spoken_note = self.listen(timeout=10, phrase_time_limit=12)
                if spoken_note:
                    self.write_note(spoken_note)
                else:
                    self.speak("No worries. We can try noting something later.")
            else:
                self.write_note(note_text)
            return True

        if "who are you" in command or "your name" in command:
            self.speak(
                "I am Jarvis, your personal voice assistant. How may I assist you today?"
            )
            return True

        self.speak(
            "I beg your pardon, I don't support that command yet. "
            "Please try a basic task like opening an app, asking time, or taking a note."
        )
        return True

    def run(self) -> None:
        """Main event loop."""
        self.speak("Hello. Jarvis online and ready to assist you.")
        self.speak("You may speak your command whenever you're ready.")

        running = True
        while running:
            user_command = self.listen()
            if not user_command:
                continue
            running = self.handle_command(user_command)


def check_dependencies() -> None:
    """Give friendly setup hints if audio dependencies are missing."""
    if platform.system().lower() == "linux":
        # Not a strict requirement check, only guidance.
        likely_missing = not any(Path(path).exists() for path in ["/usr/bin/aplay", "/usr/bin/pulseaudio"])
        if likely_missing:
            print(
                "Tip: install system audio tools if microphone/speaker does not work, "
                "e.g., 'sudo apt install pulseaudio alsa-utils portaudio19-dev'."
            )


if __name__ == "__main__":
    check_dependencies()
    assistant = JarvisAssistant()
    assistant.run()

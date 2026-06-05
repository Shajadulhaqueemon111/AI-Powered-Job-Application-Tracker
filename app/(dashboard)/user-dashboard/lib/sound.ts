let audio: HTMLAudioElement | null = null;

export function playNotificationSound() {
  if (typeof window === "undefined") return;

  if (!audio) {
    audio = new Audio("/audio.mp3"); // ✅ must be in /public
    audio.volume = 0.7;
    audio.preload = "auto";
  }

  audio.currentTime = 0;

  const playPromise = audio.play();

  if (playPromise !== undefined) {
    playPromise.catch((err) => {
      console.log("Audio blocked by browser:", err);
    });
  }
}

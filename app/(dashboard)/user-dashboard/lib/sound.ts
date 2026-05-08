let audio: HTMLAudioElement | null = null;
let unlocked = false;

export function playNotificationSound() {
  if (typeof window === "undefined") return;

  audio = new Audio("/audio.mp3");
  audio.volume = 0.7;

  audio
    .play()
    .then(() => {
      unlocked = true;
    })
    .catch(() => {
      unlocked = false;
    });
}

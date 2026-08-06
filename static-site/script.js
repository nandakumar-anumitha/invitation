const videos = [
  {
    title: "Invitation video",
    src: "./engagement-video.mp4",
    useTamilSong: true,
  },
  {
    title: "Final version",
    src: "./final-version.mp4",
    useTamilSong: false,
  },
];

let activeVideoIndex = 0;

const video = document.getElementById("inviteVideo");
const source = document.getElementById("videoSource");
const song = document.getElementById("tamilSong");
const title = document.getElementById("videoTitle");
const counter = document.getElementById("videoCounter");
const audioNotice = document.getElementById("audioNotice");

function renderVideo() {
  const active = videos[activeVideoIndex];
  video.pause();
  song.pause();
  title.textContent = active.title;
  source.src = active.src;
  video.muted = active.useTamilSong;
  video.load();
  counter.textContent = `${activeVideoIndex + 1} / ${videos.length}`;
  audioNotice.hidden = true;
}

function selectVideo(index) {
  activeVideoIndex = (index + videos.length) % videos.length;
  renderVideo();
}

video.addEventListener("play", async () => {
  const active = videos[activeVideoIndex];
  video.muted = active.useTamilSong;

  if (!active.useTamilSong) {
    song.pause();
    return;
  }

  song.currentTime = video.currentTime;
  try {
    await song.play();
    audioNotice.hidden = true;
  } catch {
    audioNotice.hidden = false;
  }
});

video.addEventListener("pause", () => song.pause());
video.addEventListener("ended", () => {
  song.pause();
  if (activeVideoIndex < videos.length - 1) {
    selectVideo(activeVideoIndex + 1);
  }
});
video.addEventListener("seeked", () => {
  if (videos[activeVideoIndex].useTamilSong) {
    song.currentTime = video.currentTime;
  }
});

document.getElementById("previousVideo").addEventListener("click", () => {
  selectVideo(activeVideoIndex - 1);
});

document.getElementById("nextVideo").addEventListener("click", () => {
  selectVideo(activeVideoIndex + 1);
});

function updateCountdown() {
  const eventStart = new Date("2026-08-23T10:30:00+05:30");
  const remaining = Math.max(0, eventStart.getTime() - Date.now());
  const totalMinutes = Math.floor(remaining / 60000);

  document.getElementById("days").textContent = String(Math.floor(totalMinutes / 1440));
  document.getElementById("hours").textContent = String(Math.floor((totalMinutes % 1440) / 60));
  document.getElementById("minutes").textContent = String(totalMinutes % 60);
}

document.getElementById("copyLink").addEventListener("click", async (event) => {
  const button = event.currentTarget;

  try {
    await navigator.clipboard.writeText(window.location.href);
    button.textContent = "Link Copied";
    window.setTimeout(() => {
      button.textContent = "Copy Link";
    }, 2200);
  } catch {
    button.textContent = "Copy unavailable";
  }
});

updateCountdown();
window.setInterval(updateCountdown, 60000);

const videos = [
  {
    title: "Invitation video",
    src: "./engagement-video.mp4",
    useTamilSong: true,
  },
  {
    title: "A Special Glimpse",
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
const videoFrame = document.getElementById("videoFrame");
const videoDots = Array.from(document.querySelectorAll("[data-video-index]"));
const shareText = encodeURIComponent(
  `You are warmly invited to V. Nandakumar & CMA K. Anumitha's engagement on 23.08.2026 at 10:30 AM, Prem Mahal. ${window.location.href}`
);
const mapShareText = encodeURIComponent(
  "Venue location: Prem Mahal, 1st Main Road, MMDA, TNHB Layout, Mathur, Tamil Nadu. Map: https://www.google.com/maps/search/?api=1&query=Prem%20Mahal%2C%201st%20Main%20Road%2C%20MMDA%2C%20TNHB%20Layout%2C%20Mathur%2C%20Tamil%20Nadu"
);

function renderVideo() {
  const active = videos[activeVideoIndex];
  video.pause();
  song.pause();
  title.textContent = active.title;
  source.src = active.src;
  video.muted = active.useTamilSong;
  videoFrame.classList.toggle("firstVideoFrame", activeVideoIndex === 0);
  videoFrame.classList.toggle("secondVideoFrame", activeVideoIndex === 1);
  if (activeVideoIndex === 0) {
    video.setAttribute("poster", "./engagement-video-poster-rings.png");
  } else {
    video.setAttribute("poster", "./second-video-poster.svg");
  }
  video.load();
  videoDots.forEach((dot, index) => {
    dot.classList.toggle("activeDot", index === activeVideoIndex);
  });
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

videoDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    selectVideo(Number(dot.dataset.videoIndex));
  });
});

document.getElementById("shareInviteFooter").setAttribute("href", `https://wa.me/?text=${mapShareText}`);

function updateCountdown() {
  const eventStart = new Date("2026-08-23T10:30:00+05:30");
  const remaining = Math.max(0, eventStart.getTime() - Date.now());
  const totalMinutes = Math.floor(remaining / 60000);

  document.getElementById("days").textContent = String(Math.floor(totalMinutes / 1440));
  document.getElementById("hours").textContent = String(Math.floor((totalMinutes % 1440) / 60));
  document.getElementById("minutes").textContent = String(totalMinutes % 60);
}

updateCountdown();
window.setInterval(updateCountdown, 60000);

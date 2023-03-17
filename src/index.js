const { async } = require("regenerator-runtime");

const recordBtn = document.getElementById("recordBtn");
const audio = document.querySelector("audio");

const playPauseBtn = document.getElementById("playPauseBtn");
const currenTime = document.getElementById("currenTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const volume = document.getElementById("volume");
const volumeRange = document.getElementById("volumeRange");

let stream;
let recorder;
let recordAudio;
let volumeValue = 0.5;
audio.volume = volumeValue;

const handleDownload = () => {
  recordBtn.removeEventListener("click", handleDownload);
  recordBtn.innerText = "Start Recording";
  const a = document.createElement("a");
  a.href = recordAudio;
  a.download = "MyRecording.webm";
  document.body.appendChild(a);
  a.click();
  recordBtn.addEventListener("click", handleStart);
};

const handleStart = async () => {
  recordBtn.innerText = "Download Recording";
  playPauseBtn.className = "fas fa-play";
  playPauseBtn.style.color = "#8b8b8b";
  recordBtn.disabled = true;
  recordBtn.removeEventListener("click", handleStart);
  stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false
  });
  audio.srcObject = stream;
  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (e) => {
    recordAudio = URL.createObjectURL(e.data);
    audio.srcObject = null;
    audio.src = recordAudio;
    audio.play();
    playPauseBtn.addEventListener("click", handlePlayPause);
    audio.addEventListener("play", handleLoad);
    audio.loop = true;
    playPauseBtn.style.color = "#000";
    playPauseBtn.className = "fas fa-pause";
  };
  recorder.start();
  recordBtn.addEventListener("click", handleDownload);
  setTimeout(() => {
    recorder.stop();
    recordBtn.disabled = false;
  }, 5000);
};
const handlePlayPause = () => {
  if (audio.paused) {
    audio.play();
    playPauseBtn.className = "fas fa-pause";
  } else {
    audio.pause();
    playPauseBtn.className = "fas fa-play";
  }
};
const handleSound = () => {
  if (audio.muted) {
    audio.muted = false;
    volumeRange.value = volumeValue;
    volume.className = "fas fa-volume-up";
  } else {
    audio.muted = true;
    volumeRange.value = 0;
    volume.className = "fas fa-volume-mute";
  }
};

const handleVolume = (event) => {
  const {
    target: { value }
  } = event;
  if (audio.muted) {
    audio.muted = false;
    volume.className = "fas fa-volume-mute";
  }
  if (value === "0") {
    volume.className = "fas fa-volume-off";
  } else {
    volume.className = "fas fa-volume-up";
  }
  audio.volume = volumeValue = value;
};

const handletimeupdate = () => {
  currenTime.innerText = `0:0${Math.floor(audio.currentTime)}`;
  timeline.value = Math.floor(audio.currentTime);
};
const handleLoad = () => {
  totalTime.innerText = "0:05";
  timeline.max = 5;
};
const handleTimeline = (e) => {
  const {
    target: { value }
  } = e;
  audio.currentTime = value;
};

recordBtn.addEventListener("click", handleStart);

audio.addEventListener("timeupdate", handletimeupdate);
volume.addEventListener("click", handleSound);
volumeRange.addEventListener("input", handleVolume);
timeline.addEventListener("input", handleTimeline);

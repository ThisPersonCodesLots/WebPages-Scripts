// ==UserScript==
// @name         HTML5 Enchantment
// @namespace    Violentmonkey Scripts
// @description  Video speed control for HTML5 videos on all websites.
// @version      1.4
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

let video;
// Speed of the video
let videoSpeed = 1; // 1 = 1.00x (default)
let speedDisplay;
// Saturation of the video
let videoSaturation = 1; // 1 = 100% (default)
let oldVideoSaturation = 1;
let videoSaturationDisplay;
// Timeout bug
let speedDisplayTimeout;
let videoSaturationDisplayTimeout;
// Constants
const MIN_RATE = 0;
const MAX_RATE = 5;
const RATE_STEP = 0.05;
const MIN_SATURATION = 0;
const MAX_SATURATION = 2;
const SATURATION_STEP = 0.1;

document.addEventListener("playing", registerShortcutKeys, { capture: true, once: true });
document.addEventListener("playing", restoreSpeed, { capture: true });
document.addEventListener("play", captureActiveVideoElement, true);

// Reset all the video settings to default
function resetVideoSettings() {
  if (video) {
    video.playbackRate = 1;
    video.style.filter = 'none';
    video = null;
  }
  if (speedDisplay) {
    speedDisplay.remove();
    speedDisplay = null;
  }
  if (videoSaturationDisplay) {
    videoSaturationDisplay.remove();
    videoSaturationDisplay = null;
  }
  videoSpeed = 1;
  videoSaturation = 1;
}

function createSpeedDisplay(video) {
  speedDisplay = document.createElement('div');
  Object.assign(speedDisplay.style, {
    position: 'absolute',
    top: '10px',
    left: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'aquamarine',
    padding: '5px',
    borderRadius: '5px',
    zIndex: '2147483647',
    opacity: '0'
  });
  video.parentNode.appendChild(speedDisplay);
  setTimeout(() => speedDisplay.style.opacity = '0', 1000);
}

function createSaturationDisplay(video) {
  videoSaturationDisplay = document.createElement('div');
  Object.assign(videoSaturationDisplay.style, {
    position: 'absolute',
    top: '40px',
    left: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'lightcoral',
    padding: '5px',
    borderRadius: '5px',
    zIndex: '2147483647',
    opacity: '0'
  });
  video.parentNode.appendChild(videoSaturationDisplay);
  setTimeout(() => videoSaturationDisplay.style.opacity = '0', 1000);
}

function registerShortcutKeys(event) {
  captureActiveVideoElement(event);
  document.addEventListener("keydown", handlePressedKey);
}

function restoreSpeed(event) {
  if (event.target.playbackRate !== videoSpeed) event.target.playbackRate = videoSpeed;
}
// Handle key press
function handlePressedKey(event) {
  const target = event.target;
  if (target.localName === "input" || target.localName === "textarea" || target.isContentEditable) return;

  let newRate = video.playbackRate;
  switch (event.key) {
    case "[":
      newRate = Math.max(MIN_RATE, video.playbackRate - RATE_STEP);
      break;
    case "]":
      newRate = Math.min(MAX_RATE, video.playbackRate + RATE_STEP);
      break;
    case ";":
      videoSaturation = Math.max(MIN_SATURATION, videoSaturation - SATURATION_STEP);
      break;
    case "'":
      videoSaturation = Math.min(MAX_SATURATION, videoSaturation + SATURATION_STEP);
      break;
    // Reset all the video settings to default
    case "+":
      resetVideoSettings();
      break;
    // If any other key is pressed, do nothing/exit the function
    default:
      return;
  }

  if (newRate !== video.playbackRate) {
    video.playbackRate = newRate;
    videoSpeed = newRate;
    speedDisplay.textContent = `Speed: ${videoSpeed.toFixed(2)}`;
    speedDisplay.style.opacity = '1';
    setTimeout(() => speedDisplay.style.opacity = '0', 1000);
    // Clear previous timeout
    clearTimeout(speedDisplayTimeout);
    // Keep the reference of new timeout
    speedDisplayTimeout = setTimeout(() => speedDisplay.style.opacity  = '0', 1000);
  }

  if (videoSaturation !== oldVideoSaturation) {
    video.style.filter = `saturate(${videoSaturation})`;
    videoSaturationDisplay.textContent = `Saturation: ${videoSaturation.toFixed(2)}`;
    videoSaturationDisplay.style.opacity = '1';
    setTimeout(() => videoSaturationDisplay.style.opacity = '0', 1000);
    oldVideoSaturation = videoSaturation;

    clearTimeout(videoSaturationDisplayTimeout); // Clear previous timeout
    videoSaturationDisplayTimeout = setTimeout(() => videoSaturationDisplay.style.opacity = '0', 1000); // Keep reference of new timeout
  } else {
    videoSaturationDisplay.style.opacity = '0';
  }
}

function captureActiveVideoElement(event) {
  if (event.target.tagName.toLowerCase() === 'video') {
    video = event.target;
    videoSpeed = video.playbackRate;
    videoSaturation = 1;
    createSpeedDisplay(video);
    createSaturationDisplay(video);
  }
}
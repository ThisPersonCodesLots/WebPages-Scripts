// ==UserScript==
// @name         HTML5 VIDEO SPEED
// @namespace    Violentmonkey Scripts
// @description  Video speed control for HTML5 videos on all websites.
// @version      1.2
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

let video;
let videoSpeed = 1;
let speedDisplay;

document.addEventListener("playing", registerShortcutKeys, { capture: true, once: true });
document.addEventListener("playing", restoreSpeed, { capture: true });
document.addEventListener("play", captureActiveVideoElement, true);

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
  setTimeout(() => speedDisplay.style.opacity = '0', 5000);
}

function registerShortcutKeys(event) {
  captureActiveVideoElement(event);
  document.addEventListener("keydown", handlePressedKey);
}

function restoreSpeed(event) {
  if (event.target.playbackRate !== videoSpeed) event.target.playbackRate = videoSpeed;
}

function captureActiveVideoElement(event) {
  if (event.target.tagName.toLowerCase() === 'video') {
    video = event.target;
    videoSpeed = video.playbackRate;
    createSpeedDisplay(video);
  }
}

function handlePressedKey(event) {
  const target = event.target;
  if (target.localName === "input" || target.localName === "textarea" || target.isContentEditable) return;

  const key = event.key;
  let newRate = video.playbackRate;
  // decrease video speed by 0.5
  if (key === "[") newRate = Math.max(0, video.playbackRate - 0.05);
  // increase video speed by 0.5
  else if (key === "]") newRate = Math.min(5, video.playbackRate + 0.05);
  // reset video speed to 1
  else if (key === "r") newRate = 1;

  if (newRate !== video.playbackRate) {
    video.playbackRate = newRate;
    videoSpeed = newRate;
    speedDisplay.textContent = `Speed: ${videoSpeed.toFixed(2)}`;
    speedDisplay.style.opacity = '1';
    setTimeout(() => speedDisplay.style.opacity = '0', 10000);
  }
}
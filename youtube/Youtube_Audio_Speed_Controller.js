// ==UserScript==
// @name     YouTube Audio Speed Controller
// @version  1
// @grant    none
// @description  Speeds up YouTube videos when audio reach a certain Db
// @match    *://*.youtube.com/*
// ==/UserScript==

const video = document.querySelector('video');
const audioContext = new AudioContext();
const source = audioContext.createMediaElementSource(video);
const destination = audioContext.createDestination();

// Create an analyser node.
const analyser = audioContext.createAnalyser();
analyser.fftSize = 256; // Set FFT size.

// Connect the source to the analyser and the analyser to the destination.
source.connect(analyser);
analyser.connect(audioContext.destination);

// Create a data array to store the audio data.
const dataArray = new Uint8Array(analyser.frequencyBinCount);

// Use requestAnimationFrame to keep checking the volume.
function checkVolume() {
    // Get the audio data.
    analyser.getByteFrequencyData(dataArray);

    // Calculate the volume.
    let values = 0;
    const length = dataArray.length;
    for (let i = 0; i < length; i++) {
        values += dataArray[i];
    }
    const average = values / length;

    // If the volume is below a certain level, speed up the video.
    if (average < 50) { // You can adjust this value as needed.
        video.playbackRate = 2.0; // Speed up video.
    } else {
        video.playbackRate = 1.0; // Normal speed.
    }

    // Keep checking the volume.
    requestAnimationFrame(checkVolume);
}

// Start checking the volume.
checkVolume();

// Start playing the video.
video.play();

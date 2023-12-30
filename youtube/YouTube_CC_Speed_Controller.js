// ==UserScript==
// @name     YouTube CC Speed Controller
// @version  1
// @grant    GM_setValue
// @grant    GM_getValue
// @description  Speeds up YouTube videos when closed captions are displayed.
// @match    *://*.youtube.com/*
// ==/UserScript==

let video = document.querySelector('video'); // get the video element
let ignore_subpatterns = ["#", "♯", "♩", "♪", "♬", "♫", "🎵", "🎶", "%", "[", "(", ")"];
let normalSpeed = GM_getValue('normalSpeed', 1.0);
let fastSpeed = GM_getValue('fastSpeed', 2.0);

setInterval(function() {
    // Video not found
    if(!video) {
        console.error('Video element not found');
        return;
    }
    // React immediately when the CC changes, rather than waiting up to a second.
    let observer = new MutationObserver(function() {
        let ccElement = document.querySelector('.ytp-caption-segment');
        if (ccElement && !ignore_subpatterns.some(subpattern => ccElement.textContent.startsWith(subpattern))) {
            video.playbackRate = normalSpeed;
        } else {
            video.playbackRate = fastSpeed;
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();

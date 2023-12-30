// ==UserScript==
// @name         Apply Custom Font to Webpage
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Custom fonts to different sections on a webpage
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

/*
The idea behind this script it's to mimic the functionality of the Firefox custom font in-built feature.
It's not a perfect solution, because it requires (for now) to manually handle edge cases (for ex, soft subtitles in videos, Youtube CC, and so on).
If somehow, in the future, I'll find a way to automatically handle those cases, I'll update the script. Also the pull requests are welcome.

It allows you to change the font of a webpage to a custom font.
The script will also change the font of the webpage to the custom font every time the page is reloaded.
*/

// List of websites to ignore
const ignoreList = [/docs\.google\.com.*/];

// User's font preferences
const sans = 'Inter Variable';
const sans_serif = 'Inter Variable';
const monospace = 'Fira Code';

// Create CSS rules for our custom fonts
const style = document.createElement('style');
style.innerHTML = `
  .custom-font-sans {
    font-family: ${sans} !important;
  }
  .custom-font-sans-serif {
    font-family: ${sans_serif} !important;
  }
  .custom-font-monospace {
    font-family: ${monospace} !important;
  }
`;
document.head.appendChild(style);

// Function to apply the custom font
function applyCustomFont(element) {
    const hostName = window.location.hostname;
    if (!element || !element.classList || ignoreList.some((pattern) => pattern.test(hostName))) {
        return;
    }

    const currentFontFamily = window.getComputedStyle(element, null).getPropertyValue('font-family');

    try {

        if (currentFontFamily.includes('sans-serif')) {
            element.classList.add('custom-font-sans-serif');
        } else if (currentFontFamily.includes('sans')) {
            element.classList.add('custom-font-sans');
        } else if (currentFontFamily.includes('monospace')) {
            element.classList.add('custom-font-monospace');
        }
    } catch (error) {
        console.error(`Failed to apply custom font, error: ${error.message}`);
    }
}

// document.querySelectorAll('*').forEach(applyCustomFont);

// Apply the custom font to existing elements
let allElements = document.getElementsByTagName('*');
try {
    for (let i = 0; i < allElements.length; i++) {
        applyCustomFont(allElements[i]);
    }
} catch (error) {
    console.log("Error applying custom font to existing elements: " + error);
}

// Apply the custom font to new elements
let observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.type === 'childList') {
            Array.from(mutation.addedNodes).forEach(node => {
                // Check if the added node is an HTMLElement that can contain text
                if (node instanceof HTMLElement) {
                    // Apply custom font to new element and its descendants (if it's an Element node)
                    node.querySelectorAll('*').forEach(applyCustomFont);
                }
            });
        }
    });
});
observer.observe(document.body, {childList: true, subtree: true});

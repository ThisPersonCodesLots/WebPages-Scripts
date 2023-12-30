
// ==UserScript==
// @name         DuckDuckGo Monokai Theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Changes the style of DuckDuckGo search to Monokai theme
// @author       You
// @match        https://*.duckduckgo.com/*
// @grant        GM_addStyle
// ==/UserScript==

// Source: me

let monokai = ["7=272822", "8=f8f8f2", "9=a6e22e", "ae=t", "t=p", "s=m", "w=n", "m=l", "o=s", "j=272822", "a=p", "aa=f92672", "u=-1", "x=fd971f", "y=49483e", "af=1", "ai=1", "f=1"];
for(let i=0;i<monokai.length;i++) {
    document.cookie=monokai[i];
}
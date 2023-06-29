// ==UserScript==
// @name         Hide/Unhide Progress Bar
// @namespace    https://github.com/kazmath/
// @version      1.0
// @description  Enable/Disable progress bar on YouTube videos at will with H key, in case you don't want to spoil yourself about when the video will end. (Timestamp is not hidden)
// @author       KazMath
// @match        *://*.youtube.com/*
// @exclude      *://*.youtube.com/embed/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-idle
// @grant        none
// @updateURL    https://github.com/kazmath/userscripts/raw/main/hideUnhidePBar.user.js
// @downloadURL  https://github.com/kazmath/userscripts/raw/main/hideUnhidePBar.user.js
// @noframes
// ==/UserScript==

'use strict';
const w = window;
if (w.hideUnhidePBar) {

    console.log("[Hide/Unhide Progress Bar] Could not start userscript: Already running.");
    return;
} else {

    document.addEventListener("keyup", (e) => {
        if (e.target.tagName.toLowerCase() == "input") return;
        if (e.target.attributes.contenteditable) return;
        if (e.which !== 72) return; // H key

        let pBar = document.querySelectorAll("div#movie_player div.ytp-chrome-bottom > div.ytp-progress-bar-container")
        if (pBar.length > 1) {
            console.error("[Hide/Unhide Progress Bar] Could not run userscript: Multiple targets.");
            return;
        } else if (pBar.length === 0) {
            console.error("[Hide/Unhide Progress Bar] Could not run userscript: No targets.");
            return;
        }

        pBar[0].toggleAttribute("hidden");
    })

    w.hideUnhidePBar = true;
}

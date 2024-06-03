// ==UserScript==
// @name         Toggle Progress
// @namespace    https://github.com/kazmath/
// @version      1.1
// @description  Enable/Disable progress bar and tmiestamp on YouTube videos at will with H key, in case you don't want to spoil yourself about when the video will end.
// @author       KazMath
// @match        *://*.youtube.com/*
// @exclude      *://*.youtube.com/embed/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-idle
// @grant        none
// @updateURL    https://github.com/kazmath/userscripts/raw/main/toggleProgressYoutube.user.js
// @downloadURL  https://github.com/kazmath/userscripts/raw/main/toggleProgressYoutube.user.js
// @noframes
// ==/UserScript==

'use strict';
const w = window
if (w.toggleProgressYoutube) {

    console.log("[Hide/Unhide Progress] Could not start userscript: Already running.")
    return
} else {
    const blurryTextWhiteStyle = "color: transparent; text-shadow: 0 0 8px #FFF;"

    document.addEventListener("keyup", (e) => {
        if (e.target.tagName.toLowerCase() == "input") return
        if (e.target.attributes.contenteditable) return
        if (e.which !== 72) return // H key

        let pBar = document.querySelectorAll("div#movie_player div.ytp-chrome-bottom > div.ytp-progress-bar-container")
        let currTime = document.querySelectorAll('.ytp-time-display .ytp-time-current')
        if (pBar.length > 1 || currTime.length > 1) {
            console.error("[Hide/Unhide Progress] Could not run userscript: Multiple targets.")
            return
        } else if (pBar.length === 0 || currTime.length === 0) {
            console.error("[Hide/Unhide Progress] Could not run userscript: No targets.")
            return
        }

        pBar[0].toggleAttribute("hidden") ? (currTime[0].style = blurryTextWhiteStyle) : (currTime[0].style = "")
    })

    w.toggleProgressYoutube = true
}

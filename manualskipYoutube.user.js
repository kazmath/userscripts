// ==UserScript==
// @name         Youtube ManualSkipAds
// @namespace    https://github.com/kazmath/
// @version      1.0
// @description  Keybinding to skip video ads at will, regardless of time remaining (Shift+K) and another to set video time to 0 if you somehow wanna see the ad (Shift+ArrowLeft).
// @author       kazmath
// @match        *://*.youtube.com/*
// @exclude      *://*.youtube.com/embed/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-idle
// @grant        none
// @updateURL    https://github.com/kazmath/userscripts/raw/main/manualskipYoutube.user.js
// @downloadURL  https://github.com/kazmath/userscripts/raw/main/manualskipYoutube.user.js
// @noframes
// ==/UserScript==

'use strict';
document.onkeyup = (e) => {
    if (e.shiftKey) { // Shift modifier plus...
        // TODO: Remove deprecated .which
        if (e.which == 75) { // K key
            document.querySelector('video').currentTime = document.querySelector('video').duration;
        }
        if (e.which == 37) { // ArrowLeft key
            document.querySelector('video').currentTime = 0;
        }
    }
}

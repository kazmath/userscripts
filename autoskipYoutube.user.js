// ==UserScript==
// @name         Youtube AutoSkipAd
// @namespace    https://github.com/kazmath/
// @version      1.4
// @description  Skip Youtube video ads and pop-ups automatically as soon as it notices one active.
// @author       KazMath
// @match        *://*.youtube.com/*
// @exclude      *://*.youtube.com/embed/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-idle
// @grant        none
// @updateURL    https://github.com/kazmath/userscripts/raw/main/autoskipYoutube.user.js
// @downloadURL  https://github.com/kazmath/userscripts/raw/main/autoskipYoutube.user.js
// @noframes
// ==/UserScript==

'use strict';
const w = window
if (w.autoskipIntervalID) {
	return
} else {
	w.autoskipIntervalID = setInterval(main, 100)

	function main() {
		if (document.querySelector("button.ytp-ad-skip-button")) {
			document.querySelector("button.ytp-ad-skip-button").click()
		}
		if (document.querySelector("button.ytp-ad-skip-button-modern")) {
			document.querySelector("button.ytp-ad-skip-button-modern").click()
		}
		if (document.querySelector(".ytp-ad-overlay-close-container")) {
			document.querySelector(".ytp-ad-overlay-close-container").click()
		}
		if (document.querySelector("#dismiss-button")) {
			document.querySelector("#dismiss-button").click()
			document.querySelector("#dismiss-button").remove()
		}
		if (document.querySelector(".ytp-ad-message-container")) {
			document.querySelector(".ytp-ad-message-container").remove()
		}
		if (document.querySelector('.ad-showing')) {
			document.querySelector('video').currentTime =
				document.querySelector('video').duration
		}
		// for (
		// 	let elem of document.querySelectorAll('ytd-popup-container')
		// ) {
		// 	elem.remove()
		// }
		return
	}
}

// ==UserScript==
// @name         Go to Terraria's official wiki page
// @namespace    https://github.com/kazmath/
// @version      1.1
// @description  Go to official terraria wiki, instead of old, community-driven wiki.
// @author       kazmath
// @match        *://terraria.fandom.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=terraria.fandom.com
// @grant        none
// @updateURL    https://github.com/kazmath/userscripts/raw/main/goToTerrariaOfficialWiki.user.js
// @downloadURL  https://github.com/kazmath/userscripts/raw/main/goToTerrariaOfficialWiki.user.js
// @run-at document-start
// @noframes
// ==/UserScript==

'use strict';
const dontAsk = false;

if (sessionStorage.getItem("triedOnce")) return;
if (dontAsk || confirm("Go to official terraria wiki?")) {
    window.location.host = "terraria.wiki.gg";
}
sessionStorage.setItem("triedOnce", true);

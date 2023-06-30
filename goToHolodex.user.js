// ==UserScript==
// @name         Go to Holodex [WIP] [Not working rn]
// @namespace    https://github.com/kazmath/
// @version      0.1-alpha
// @description  Button to take you to the holodex's equivalent of a video on youtube.
// @author       kazmath
// @match        *://*.youtube.com/*
// @exclude      *://*.youtube.com/embed/*
// @icon         https://holodex.net/favicon.ico
// @run-at       document-idle
// @updateURL    https://github.com/kazmath/userscripts/raw/main/goToHolodex.user.js
// @downloadURL  https://github.com/kazmath/userscripts/raw/main/goToHolodex.user.js
// @grant        none
// @noframes
// ==/UserScript==

'use strict';
const w = window;

if (assertRerun()) return;
if (assertIFrame()) return;

const observer = new MutationObserver((_)=> {
    if (document.location.href === holodexRedirect.href) return;

    holodexRedirect.action();

    holodexRedirect.href = document.location.href;
});

observer.observe(
    document.querySelector("body"),
    {subtree: true, childList: true}
);

const holodexRedirect = w.holodexRedirect = {
    action: main,
    href: document.location.href
};

// w.addEventListener("click", holodexRedirect.clickAction);

function assertRerun() {
    return w.holodexRedirect !== undefined;
}

function assertIFrame() {
    try {
        return w.self !== w.top;
    } catch (_) {
        return true;
    }

}

function createButton(parentMenu) {
    // Button
    const holodexButton = document.createElement("ytd-menu-service-item-renderer");

    holodexButton.id = "holodex";
    holodexButton.className = "ytp-button"; // "style-scope ytd-menu-popup-renderer";
    holodexButton.style = "transition: all .5s ease;";

    holodexButton.setAttribute("use-icons","");
    holodexButton.setAttribute("system-icons","");
    holodexButton.setAttribute("role","menuitem");
    holodexButton.setAttribute("tabindex","0");
    holodexButton.setAttribute("aria-selected","true");
    holodexButton.addEventListener('mouseleave', function (_) {
        this.style.backgroundColor = "";
        this.style.color = "";
        this.style.fontWeight = "";
        this.querySelector("#holodex-info-text").style.color = ""
        this.querySelector("#holodex-info-text").style.fontWeight = "";
    });
    holodexButton.addEventListener('mouseenter', function (_) {
        this.style.backgroundColor = "#64B5F6";
        this.style.color = "#F06292";
        this.querySelector("#holodex-info-text").style.color = "#F06292"
        this.querySelector("#holodex-info-text").style.fontWeight = "bolder";
    });
    holodexButton.addEventListener("click",transitionToHolodex)

    // Icon
    const infoIcon = document.createElement("yt-icon");
    infoIcon.id = "holodex-info-icon";
    infoIcon.className = "style-scope ytd-menu-service-item-renderer";
    infoIcon.style =
        "margin-right: 16px;" +
        "width: 20px;" +
        "height: 20px;";
    const infoIconImg = document.createElement("img");
    infoIconImg.src = "https://holodex.net/favicon.ico";
    infoIconImg.style =
        "width: 100%;" +
        "height: 100%;"
    /*
        // Text

        let infoText = document.createElement("yt-formatted-string");
        infoText.id = "holodex-info-text";
        infoText.className = "style-scope ytd-menu-service-item-renderer";
*/
    // Appending and replacing
    parentMenu.prepend(holodexButton);
    document.querySelector("#holodex tp-yt-paper-item yt-icon").replaceWith(infoIcon);
    document.querySelector("#holodex #holodex-info-icon").appendChild(infoIconImg);
    // document.querySelector("#holodex tp-yt-paper-item yt-formatted-string").replaceWith(infoText);
    document.querySelector("#holodex #holodex-info-text").removeAttribute("is-empty");
    document.querySelector("#holodex #holodex-info-text").innerHTML = "Holodex";

    return holodexButton;
}

function transitionToHolodex() {
    const transition = document.createElement("div");
    transition.id = "holodex-transition";
    document.getElementsByTagName("body")[0].prepend(transition);

    transition.style.position = "fixed";
    transition.style.bottom = "-50vh";
    transition.style.right = "-50vw";
    transition.style.scale = "0";
    transition.style.backgroundColor = "#64B5F6";
    transition.style.zIndex = "10000";
    transition.style.transition = "all 1s ease";

    // setTimeout(transitionToHolodex2,100,transition);

    setTimeout(() => {
        transition.style.height = "100vh";
        transition.style.width = "100vw";
        transition.style.borderRadius = "50vw";
        transition.style.scale = "5";

        setTimeout(goToHolodex, 1000);
    },100);
}

function goToHolodex() {
    const videoID = new URLSearchParams(location.search).get('v');
    videoID && (location.href = 'https://holodex.net/watch/' + videoID)
}

function main() {
    console.log("clicked!");
    let ytButtons;
    let ytEllipsis;
    if ((ytButtons = document.querySelector('.ytp-chrome-controls .ytp-right-controls')) && !ytButtons.querySelector("#holodex")) {
        let holodexButton = createButton(ytButtons);
    }
}

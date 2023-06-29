// ==UserScript==
// @name         Install flatpaks from the website
// @namespace    https://github.com/kazmath/
// @version      1.0
// @description  Adds button to install flatpaks, instead of downloading refs. (Necessary to manually assign `flatpak:` protocol in browser settings or  systemregistry)
// @author       kazmath
// @match        *://flathub.org/*
// @updateURL    https://github.com/kazmath/userscripts/raw/main/instFlatFromWeb.user.js
// @downloadURL  https://github.com/kazmath/userscripts/raw/main/instFlatFromWeb.user.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=flathub.org
// @run-at       document-idle
// @grant        none
// ==/UserScript==

'use strict';
const w = window;
if (w.instFlatFromWeb) {
    console.log("[instFlatFromWeb] Already running, exiting...");
    return;
} else {
    w.instFlatFromWeb = {
        onblurTriggered: false,
        intervalID: NaN,
        currentLocationPath: w.location.pathname,
        firstRun: true
    };


    function createButton() {
        let linkPath = w.location.pathname
        let header_install = document.querySelectorAll("main > div > header")[0];
        let button_div = document.createElement("div");
        let button_a = document.createElement("a");
        let button_icon = document.createElement("img");

        button_div.classList.add("flex", "items-center", "justify-center", "gap-4");
        button_a.classList.add(
            "w-11",
            "hover:opacity-75",
            "active:opacity-50",
            "bg-flathub-celestial-blue",
            "dark:bg-flathub-celestial-blue",
            "text-gray-100",
            "no-wrap",
            "flex",
            "h-11",
            "items-center",
            "justify-center",
            "overflow-hidden",
            "text-ellipsis",
            "whitespace-nowrap",
            "rounded-lg",
            "px-5",
            "py-2",
            "text-center",
            "font-bold",
            "no-underline",
            "duration-500",
            "hover:cursor-pointer",
            "inst-flat-from-web-button"
        );

        button_a.href = "flatpak:" + linkPath.substring(linkPath.lastIndexOf("/")+1)
        button_a.addEventListener("click", launchLink);
        button_a.style.backgroundColor = "purple";
        // button_a.innerHTML = "Install<br/>on Machine";

        button_icon.src = "https://www.svgrepo.com/download/507477/apps.svg";
        button_icon.alt = "Install on machine";
        button_icon.style.maxWidth = "none";
        button_icon.style.width = "1.8em";

        button_a.appendChild(button_icon);
        button_div.appendChild(button_a);
        header_install.appendChild(button_div);
    }

    function launchLink(event) {
        // event.preventDefault(); // Prevent the default link behavior

        let onBlurHandler = function() {
            w.instFlatFromWeb.onblurTriggered = true;
            w.removeEventListener("blur", onBlurHandler); // Unregister the onBlur event
        };
        w.addEventListener("blur", onBlurHandler);

        setTimeout(function() {
            if (!w.instFlatFromWeb.onblurTriggered) {
                alert("\"flatpak:\" protocol handler not supported");
            }
            w.removeEventListener("blur", onBlurHandler); // Unregister the onBlur event
        }, 2000);
    }


    // if (!w.instFlatFromWeb.intervalID.isNaN) clearInterval(w.instFlatFromWeb.intervalID);

    function repeatMain() {

        let newPath = w.location.pathname;
        if (w.instFlatFromWeb.firstRun ||
            newPath !== w.instFlatFromWeb.currentLocationPath &&
            newPath.startsWith("/apps") &&
            newPath.indexOf("/search") === -1
           ) {
            if (document.querySelectorAll(".inst-flat-from-web-button").length == 0) {
                createButton();
            } else {
                let linkPath = w.location.pathname;
                document.querySelectorAll(".inst-flat-from-web-button")[0].href = "flatpak:" + linkPath.substring(linkPath.lastIndexOf("/")+1);
            }
        }
        w.instFlatFromWeb.currentLocationPath = w.location.pathname;
    }

    w.instFlatFromWeb.intervalID = setInterval(repeatMain, 1000);

    // if (w.instFlatFromWeb.firstRun || w.location.pathname.startsWith("/apps") && w.location.pathname.indexOf("/search") === -1) {
    //     createButton();
    // }

    repeatMain();
    w.instFlatFromWeb.firstRun = false;
}

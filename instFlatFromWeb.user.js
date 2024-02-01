// ==UserScript==
// @name         Install flatpaks from the website
// @namespace    https://github.com/kazmath/
// @version      1.2
// @description  Adds button to install flatpaks, instead of downloading refs. (Manual setup may be necessary)
// @author       kazmath
// @match        *://flathub.org/*
// @updateURL    https://github.com/kazmath/userscripts/raw/main/instFlatFromWeb.user.js
// @downloadURL  https://github.com/kazmath/userscripts/raw/main/instFlatFromWeb.user.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=flathub.org
// @run-at       document-idle
// @resource     flatpak_icon https://www.svgrepo.com/download/507477/apps.svg
// @grant        GM_getResourceURL
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
        // let header_install = document.querySelectorAll("main > div > header")[0];
        let hidden_panel = document.querySelectorAll("div[data-headlessui-state] > button ~ div")[0];
        let button_div = document.createElement("div");
        let button_a = document.createElement("a");
        let button_h1 = document.createElement("h1");
        let button_icon = document.createElement("img");

        button_div.classList.add(
            "items-center",
            "justify-center",
            "gap-4"
        );
        button_a.classList.add(
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
            "px-2",
            "py-2",
            "text-center",
            "font-bold",
            "no-underline",
            "duration-500",
            "hover:cursor-pointer",
            "inst-flat-from-web-button"
        );
        button_h1.innerHTML = "&nbsp;Click to Install Flatpak";

        button_a.href = "appstream:" + linkPath.substring(linkPath.lastIndexOf("/")+1)
        button_a.addEventListener("click", launchLink);
        button_a.style.backgroundColor = "purple";
        // button_a.innerHTML = "Install<br/>on Machine";

        (async function(button_icon) {
            button_icon.src = await GM_getResourceURL("flatpak_icon");
        })(button_icon)

        button_icon.style.maxWidth = "none";
        button_icon.style.width = "1.8em";

        button_a.appendChild(button_icon);
        button_a.appendChild(button_h1);
        button_div.appendChild(button_a);
        hidden_panel.appendChild(button_div);
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
                alert("Custom script took too long to open.\n\nIs \"appstream:\" protocol set up correctly? If it worked as expected, ignore this message.");
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
                document.querySelectorAll(".inst-flat-from-web-button")[0].href = "appstream:" + linkPath.substring(linkPath.lastIndexOf("/")+1);
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

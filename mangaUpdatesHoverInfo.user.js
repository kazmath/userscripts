// ==UserScript==
// @name         MangaUpdates Info on Hover
// @namespace    https://github.com/kazmath/
// @version      1.0
// @description  Series details on link hover for BakaMangaUpdates
// @author       kazmath
// @match        *://www.mangaupdates.com/*
// @updateURL    https://github.com/kazmath/userscripts/raw/main/mangaUpdatesHoverInfo.user.js
// @downloadURL  https://github.com/kazmath/userscripts/raw/main/mangaUpdatesHoverInfo.user.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mangaupdates.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      www.mangaupdates.com
// ==/UserScript==

"use strict";

main();

async function main() {
    var linkElms = [...document.querySelectorAll("a")].filter(
        (link) =>
            link.href.includes("www.mangaupdates.com/series/") &&
            !link.href.endsWith("#") &&
            !link.hasAttribute("data-tooltip")
    );
    if (linkElms.length == 0) return;

    GM_addStyle(`
        a:hover + .hover-info, .hover-info:hover {
            display: flex !important;
            flex-direction: row;
            align-items: flex-start;
            position: absolute;
            border: 4px solid black;
            background: #555;
            padding: .25em;
            z-index: 999;
        }

        .hover-info .description-hover-info {
            overflow-y: auto;
            max-height: 50vh;
            width: 15vw
        }
        .hover-info .image-hover-info {
            height: 50vh;
            width: 15vw
        }
    `);
    GM_addStyle(`
        .spinner-hover-info {
            display: inline-block;
            width: 1em;
            height: 1em;
            border: 3px solid #ccc;
            border-top-color: #000;
            border-radius: 50%;
            animation: spin-hover-info 0.8s linear infinite;
        }
        @keyframes spin-hover-info {
            to { transform: rotate(360deg); }
        }
    `);
    // content: attr(data-tooltip);

    linkElms.forEach((el) => {
        el.addEventListener("mouseover", fetchCover);
    });

    // for (const el of linkElms) {
    //     await fetchCover(el);
    //     // el.setAttribute("data-tooltip", imageSrc);

    //     // Wait a bit
    //     await new Promise((r) => setTimeout(r, 500));
    // }

    // linkElms.forEach(async function (el) {
    //     const html = await fetch(el.href).then((r) => r.text());
    //     const doc = new DOMParser().parseFromString(html, "text/html");
    //     const imageSrc = doc.querySelector(
    //         'div[data-cy="info-box-image"] div img'
    //     ).src;
    //     // const description = doc.querySelector(
    //     //     'div[data-cy="info-box-description"] div div'
    //     // ).innerHTML;
    //     el.attributes["data-tooltip"] = imageSrc;
    // });
}

async function fetchCover(ev) {
    const el = ev.currentTarget;
    if (el.classList.contains("done-hover-info")) return;
    el.classList.add("done-hover-info");
    el.style.display = "inline-flex";

    const spinnerHoverInfo = document.createElement("div");
    spinnerHoverInfo.className = "spinner-hover-info";
    el.appendChild(spinnerHoverInfo);

    const r = await GM.xmlHttpRequest({
        method: "GET",
        url: el.href,
    });

    const doc = new DOMParser().parseFromString(r.responseText, "text/html");

    const imageSrc = doc.querySelector(
        'div[data-cy="info-box-image"] div img'
    ).src;
    const description = doc.querySelector(
        'div[data-cy="info-box-description"] div div'
    ).innerHTML;
    const hoverInfoEl = document.createElement("div");
    hoverInfoEl.className = "hover-info";
    hoverInfoEl.style.display = "none";

    const descHoverInfoEl = document.createElement("div");
    descHoverInfoEl.className = "description-hover-info";
    descHoverInfoEl.innerHTML = description;

    const imgHoverInfoEl = document.createElement("img");
    imgHoverInfoEl.className = "image-hover-info";
    imgHoverInfoEl.src = imageSrc;

    hoverInfoEl.appendChild(descHoverInfoEl);
    hoverInfoEl.appendChild(imgHoverInfoEl);

    spinnerHoverInfo.remove();
    el.style.removeProperty("display");
    el.after(hoverInfoEl);
}

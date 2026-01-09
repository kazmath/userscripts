// ==UserScript==
// @name         MangaUpdates Info on Hover
// @namespace    https://github.com/kazmath/
// @version      1.1
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
            margin-left: 5em;
            background: var(--bs-secondary-bg);
            padding: .25em;
            z-index: 999;
            color: var(--mu-text-color);
        }

        .hover-info .description-hover-info {
            overflow-y: auto;
            overflow-x: auto;
            min-width: 13em;
            max-height: 50vh;
            width: 15vw;
            padding-right: .25em;
        }
        .hover-info .image-hover-info {
            height: 50vh;
        }
    `);
    GM_addStyle(`
        .spinner-hover-info {
            display: inline-block;
            width: 1em;
            height: 1em;
            border: 3px solid var(--mu-text-color);
            border-top-color: var(--bs-secondary-bg);
            border-radius: 50%;
            animation: spin-hover-info 0.8s linear infinite;
        }
        @keyframes spin-hover-info {
            to { transform: rotate(360deg); }
        }
    `);

    linkElms.forEach((el) => {
        el.addEventListener("mouseover", fetchCover);
    });
}

async function fetchCover(ev) {
    const el = ev.currentTarget;
    if (el.classList.contains("done-hover-info")) return;
    el.removeAttribute("title");
    el.classList.add("done-hover-info");
    el.style.display = "inline-flex";

    const spinnerHoverInfo = document.createElement("div");
    spinnerHoverInfo.className = "spinner-hover-info";
    el.appendChild(spinnerHoverInfo);

    let error = false;
    const r = await GM.xmlHttpRequest({
        method: "GET",
        url: el.href,
        onerror: (res) => {
            console.error(res);
            el.classList.remove("done-hover-info");
            el.style.removeProperty("display");
            spinnerHoverInfo.remove();
            error = true;
        },
    });
    if (error) return;

    const doc = new DOMParser().parseFromString(r.responseText, "text/html");

    const imageSrc = doc.querySelector(
        'div[data-cy="info-box-image"] div img'
    ).src;
    const description = [
        // title
        "<b>",
        doc.querySelector("span.releasestitle.tabletitle").innerHTML,
        "</b>",
        '<hr style="border-top: 3px solid #bbb"/>',

        // description
        doc.querySelector('div[data-cy="info-box-description-header"] b')
            .outerHTML,
        doc.querySelector('div[data-cy="info-box-description"] div div')
            .outerHTML,
        '<hr style="border-top: 3px solid #bbb"/>',

        // type
        doc.querySelector('div[data-cy="info-box-type-header"] b').outerHTML,
        doc.querySelector('div[data-cy="info-box-type"]').outerHTML,
        '<hr style="border-top: 3px solid #bbb"/>',

        // status
        doc.querySelector('div[data-cy="info-box-status-header"] b').outerHTML,
        doc.querySelector('div[data-cy="info-box-status"]').outerHTML,
    ].join("");
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

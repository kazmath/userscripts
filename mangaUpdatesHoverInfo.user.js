// ==UserScript==
// @name         MangaUpdates Info on Hover
// @namespace    https://github.com/kazmath/
// @version      1.8
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

const cachedPages = {};
let mousePosX;
let mousePosY;
let pageURL = document.location.toString();

main();

setInterval(() => {
    const currentURL = document.location.toString();
    if (currentURL != pageURL) {
        main();
        pageURL = currentURL;
    }
}, 2000);

async function main() {
    let linkElms = [...document.querySelectorAll("a")].filter((link) => {
        return (
            link.href.match(
                /^https?:\/\/www\.mangaupdates\.com\/series\/[a-zA-Z0-9]+\/[^#?]+$/
            ) != null && //
            !link.hasAttribute("data-tooltip")
        );
    });
    if (linkElms.length == 0) return;

    GM_addStyle(`
        a:hover + .hover-info, .hover-info.pinned-hover-info/*, .hover-info:hover */ {
            display: flex !important;
            flex-direction: row;
            align-items: flex-start;
            position: absolute;
            border: 4px solid black;
            background: var(--bs-secondary-bg);
            padding: .25em;
            z-index: 999;
            color: var(--mu-text-color);
        }

        .hover-info.pinned-hover-info {
            z-index: 998;
        }

        .hover-info .description-hover-info {
            overflow-y: auto;
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

    document.addEventListener("mousemove", (ev) => {
        mousePosX = ev.clientX;
        mousePosY = ev.clientY;
    });
    document.addEventListener(
        "keyup",
        (ev) => {
            if (ev.code == "KeyL" && ev.ctrlKey && ev.shiftKey) {
                ev.preventDefault();

                const hoveredElement = document.elementFromPoint(
                    mousePosX,
                    mousePosY
                );
                if (
                    hoveredElement.parentElement == null ||
                    !hoveredElement.parentElement.classList.contains(
                        "done-hover-info"
                    )
                ) {
                    document
                        .querySelectorAll(".pinned-hover-info")
                        .forEach((el) => {
                            el.classList.remove("pinned-hover-info");
                        });
                    return;
                }

                const elList =
                    hoveredElement.parentElement.parentElement.querySelectorAll(
                        ".hover-info"
                    );

                if (elList.length != 1) return;
                const el = elList[0];

                if (el.classList.contains("pinned-hover-info")) {
                    el.classList.remove("pinned-hover-info");
                } else {
                    el.classList.add("pinned-hover-info");
                }
            }
        },
        {
            passive: false,
        }
    );

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
    const req =
        cachedPages[el.href] != null
            ? cachedPages[el.href]
            : (cachedPages[el.href] = GM.xmlHttpRequest({
                  method: "GET",
                  url: el.href,
                  onerror: (res) => {
                      console.error(res);
                      el.classList.remove("done-hover-info");
                      el.style.removeProperty("display");
                      spinnerHoverInfo.remove();
                      error = true;
                  },
              }));
    const res = await req;
    if (error) return;

    const doc = new DOMParser().parseFromString(res.responseText, "text/html");

    const imageSrc = doc.querySelector(
        'div[data-cy="info-box-image"] div img'
    ).src;
    const description = [
        // title
        "<h3>",
        doc.querySelector("span.releasestitle.tabletitle").innerHTML,
        "</h3>",
        "<hr/>",

        // genres
        '<div class="header-hover-info">',
        doc.querySelector('[data-cy="info-box-genres-header"] b').outerHTML,
        "</div>",
        "<p>",
        [...doc.querySelectorAll('[data-cy="info-box-genres"] > span')]
            .map((el) => {
                el.querySelector("a").innerHTML = el
                    .querySelector("a")
                    .querySelector("u").outerHTML;
                el.innerHTML = el.querySelector("a").outerHTML;
                return el;
            })
            .map((el) => el.outerHTML)
            .join(" "),
        "</p>",
        "<hr/>",

        // type
        '<div class="header-hover-info">',
        doc.querySelector('div[data-cy="info-box-type-header"] b').outerHTML,
        "</div>",
        doc.querySelector('div[data-cy="info-box-type"]').outerHTML,
        "<hr/>",

        // status
        '<div class="header-hover-info">',
        doc.querySelector('div[data-cy="info-box-status-header"] b').outerHTML,
        "</div>",
        doc.querySelector('div[data-cy="info-box-status"]').outerHTML,
        "<hr/>",

        // my reading progress
        doc.querySelectorAll("#chap-links").length > 0
            ? [
                  '<div class="header-hover-info"><b>Progress</b></div>',
                  ...[
                      ...doc.querySelectorAll(
                          "#chap-links > span > div:nth-child(2) > :nth-child(-n + 2)"
                      ),
                  ]
                      .map((el) => el.outerHTML)
                      .join(" "),
                  "<hr/>",
              ].join("")
            : "",

        // description
        '<div class="header-hover-info">',
        doc.querySelector('div[data-cy="info-box-description-header"] b')
            .outerHTML,
        "</div>",
        doc.querySelector('div[data-cy="info-box-description"] div div')
            .outerHTML,
    ].join("");
    const hoverInfoEl = document.createElement("div");
    hoverInfoEl.className = "hover-info";
    hoverInfoEl.style.display = "none";

    const descHoverInfoEl = document.createElement("div");
    descHoverInfoEl.className = "description-hover-info";
    descHoverInfoEl.innerHTML = description;
    descHoverInfoEl.querySelectorAll("hr").forEach((el) => {
        el.style.borderTop = "3px solid #bbb";
        el.style.margin = ".5em 0";
    });
    descHoverInfoEl
        .querySelectorAll("h3")
        .forEach((el) => (el.style.margin = "0"));
    descHoverInfoEl
        .querySelectorAll("p")
        .forEach((el) => (el.style.margin = "0"));
    descHoverInfoEl.querySelectorAll(".header-hover-info").forEach((el) => {
        el.style.border = "1px solid #bbb";
        el.style.marginBottom = ".5em";
    });
    descHoverInfoEl.querySelectorAll("[href='#']").forEach((innerEl) => {
        innerEl.href = el.href;
    });

    const imgHoverInfoEl = document.createElement("img");
    imgHoverInfoEl.className = "image-hover-info";
    imgHoverInfoEl.src = imageSrc;

    hoverInfoEl.appendChild(descHoverInfoEl);
    hoverInfoEl.appendChild(imgHoverInfoEl);

    el.addEventListener(
        "wheel",
        (ev) => {
            if (ev.ctrlKey) {
                ev.preventDefault();

                const sensitivity = 1;
                descHoverInfoEl.scrollBy({
                    top: -(ev.wheelDeltaY * sensitivity),
                    behavior: "smooth",
                });
            }
        },
        {
            passive: false,
        }
    );

    spinnerHoverInfo.remove();
    el.style.removeProperty("display");
    el.after(hoverInfoEl);

    descHoverInfoEl.scrollTo(0, 0);
}

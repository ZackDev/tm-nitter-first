// ==UserScript==
// @name         nitter-first
// @namespace    https://violentmonkey.github.io/
// @version      0.5
// @description  replaces links to twitter.com with nitter.net
// @match        *://*/*
// @grant        none
// @downloadURL  https://github.com/ZackDev/tm-nitter-first/raw/main/tm-nitter-first.user.js
// @updateURL    https://github.com/ZackDev/tm-nitter-first/raw/main/tm-nitter-first.user.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    Array.from(document.getElementsByTagName('a')).filter(e => e.href.startsWith('https://twitter.com/')).forEach(e => { e.href = e.href.replace('https://twitter.com/', 'https://nitter.net/'); });
})();

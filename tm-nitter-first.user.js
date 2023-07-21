// ==UserScript==
// @name         nitter-first
// @namespace    https://tampermonkey.net/
// @version      0.1
// @description  replaces links to twitter.com with nitter.net
// @match        *
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    Array.from(document.getElementsByTagName('a')).filter(e => e.href.startsWith('https://twitter.com/')).forEach(e => { e.href = e.href.replace('https://twitter.com/', 'https://nitter.net/'); });
})();

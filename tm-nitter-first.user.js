// ==UserScript==
// @name         nitter-first
// @namespace    https://violentmonkey.github.io/
// @version      0.10
// @description  replaces links to twitter.com with nitter.net
// @match        *://*/*
// @grant        none
// @downloadURL  https://github.com/ZackDev/tm-nitter-first/raw/main/tm-nitter-first.user.js
// @updateURL    https://github.com/ZackDev/tm-nitter-first/raw/main/tm-nitter-first.user.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    Array.from(document.getElementsByTagName('a')).filter(e => e.href.includes('twitter.com')).forEach((e) => {
        e.href = e.href.replace('twitter.com', 'nitter.net');
        let it = e.innerText;
        let ih = e.innerHTML;
        e.innerText = it.replace('twitter.com', 'nitter.net');
        if (innerHTML.includes('twitter.com')) {
            e.innerHTML = '<s>' + ih + '</s>' + ' ' + ih.replace('twitter.com', 'nitter.net');
        };
    });
})();

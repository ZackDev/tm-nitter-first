// ==UserScript==
// @name         nitter-first
// @namespace    https://violentmonkey.github.io/
// @version      0.17
// @description  replaces links to twitter.com with nitter.net
// @match        *://*/*
// @grant        none
// @downloadURL  https://github.com/ZackDev/tm-nitter-first/raw/main/tm-nitter-first.user.js
// @updateURL    https://github.com/ZackDev/tm-nitter-first/raw/main/tm-nitter-first.user.js
// ==/UserScript==

(function () {
    'use strict';
    const changeLink = (node) => {
        if (node.nodeName) {
            switch (node.nodeName.toUpperCase()) {
                case 'A':
                    if (node.href && node.href.includes('twitter.com')) {
                        node.href = node.href.replace('twitter.com', 'nitter.net');
                    }
                    break;
            }
        }
    };

    const cb = (ml, ob) => {
        console.log(ml);
        ml.forEach(mr => {
            switch (mr.type) {
                case 'childList':
                    let nodes = mr.addedNodes.entries();
                    for (let node of nodes) {
                        for (let entry of node) {
                            changeLink(entry);
                        }
                    }
                    break;

                case 'attributes':
                    changeLink(mr.target);
                    break;
            }
        });
    };

    /*
    check if the document's root node has body as one of its siblings
    */
    document.onreadystatechange = () => {
        if (document.readyState === 'complete') {
            let rootNode = document.getRootNode();
            if (rootNode.nodeName && rootNode.nodeName === '#document') {
                for (let firstLevelNode of rootNode.childNodes) {
                    /*
                    NOTE: a ?valid? html document has two first level nodes:
                    - doctype node: nodeName 'html'
                    - html node:    nodeName 'HTML'
                    */
                    if (firstLevelNode.nodeName && firstLevelNode.nodeName === 'HTML') {
                        for (let secondLevelNode of firstLevelNode.childNodes) {
                            if (secondLevelNode.nodeName && secondLevelNode.nodeName.toUpperCase() === 'BODY') {
                                /*
                                at this point, document->html->body (with potential anchors) exists
                                - change already existing anchors
                                - attach observer to body node
                                */
                                Array.from(document.getElementsByTagName('a')).filter(a => a.href && a.href.includes('twitter.com')).forEach((anchor) => {
                                    changeLink(anchor);
                                });

                                let mo = new MutationObserver(cb);
                                let config = { attributes: true, attributeList: ['href'], childList: true, subtree: true };
                                mo.observe(secondLevelNode, config);
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
})();
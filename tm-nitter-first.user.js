// ==UserScript==
// @name            nitter-first
// @namespace       https://violentmonkey.github.io/
// @version         0.32
// @description     replaces links to twitter.com with nitter.net
// @match           https://*/*
// @exclude-match   https://twitter.com/*
// @grant           none
// @downloadURL     https://github.com/ZackDev/tm-nitter-first/raw/main/tm-nitter-first.user.js
// @updateURL       https://github.com/ZackDev/tm-nitter-first/raw/main/tm-nitter-first.user.js
// ==/UserScript==

(function () {
    'use strict';
    const nodesOfInterest = ['A', 'IMG'];

    const changeLink = (node) => {
        if (node.nodeName) {
            switch (node.nodeName.toUpperCase()) {
                /*
                NOTE: check for the tag/name of the HTML-Element if the MutationOberver's attributeList changes here
                - example: src attribute of img tags
                */
                case 'A':
                    /*
                    NOTE: 'a' tags come from three sources.
                    - document.getElementsByTagName(...) - href attribute not guaranteed
                    - MutationObserver childList - href attribute not guaranteed
                    - MutationObserver attributes & attributeFilter - href attribute guaranteed
                    */
                    if (node.href && node.href.startsWith('https://twitter.com/')) {
                        node.href = node.href.replace('https://twitter.com/', 'https://nitter.net/');
                    }
                    break;

                case 'IMG':
                    if (node.src && node.src.startsWith('https://pbs.twimg.com/media/')) {
                        const pathName = new URL(node.src).pathname;
                        const imgFormat = new URLSearchParams(node.src).get('format');
                        var nitterImgUrl = 'https://nitter.net/pic/orig/' + pathName;
                        if (imgFormat) {
                            nitterImgUrl += '.' + imgFormat;
                        }
                        node.src = nitterImgUrl;
                    }
                    break;
            }
        }
    };

    const mutationCallback = (mutationList, observer) => {
        mutationList.forEach(mutationRecord => {
            switch (mutationRecord.type) {
                case 'childList':
                    mutationRecord.addedNodes.forEach((node) => {
                        nodeWalker(node, changeLink);
                    });
                    break;

                case 'attributes':
                    changeLink(mutationRecord.target);
                    break;
            }
        });
    };

    const nodeWalker = (node, callback) => {
        if (nodesOfInterest.includes(node.nodeName) && typeof callback === 'function') {
            callback(node);
        }
        if (node.hasChildNodes()) {
            node.childNodes.forEach((childNode) => {
                nodeWalker(childNode, callback);
            });
        }
    }

    /*
    check if the document's root node has body as one of its siblings
    */
    document.addEventListener('readystatechange', () => {
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
                                - change already existing anchor href and src
                                - attach observer to body node
                                */
                                
                                nodesOfInterest.forEach(nodeName => {
                                    document.getElementsByTagName(nodeName.toLowerCase()).forEach((elem) => {
                                        changeLink(elem);
                                    });
                                })

                                let mutationObserver = new MutationObserver(mutationCallback);
                                let config = { attributes: true, attributeList: ['href', 'src'], childList: true, subtree: true };
                                mutationObserver.observe(secondLevelNode, config);
                                break;
                            }
                        }
                    }
                }
            }
        }
    })

})();
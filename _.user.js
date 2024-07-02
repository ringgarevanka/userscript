/* THIS IS A PRIVATE USERSCRIPT DO NOT USE */
// ==UserScript==
// @name    _
// @namespace   _
// @description _
// @include *://*/*
// @match   *://*/*
// @exclude-match   -
// @require https://cdn.jsdelivr.net/npm/eruda/eruda.min.js
// @connect https://cdn.jsdelivr.net/npm/eruda/eruda.min.js
// @version 1.0.0.235
// @grant   none
// @author  null
// @compatible  chrome
// @compatible  edge
// @compatible  firefox
// @compatible  safari
// @compatible  brave
// @license MIT
// @run-at  document-start
// @run-at  document-body
// @noframes
// @homepageURL https://ringgarevanka.github.io/
// @supportURL  _
// @downloadURL https://github.com/ringgarevanka/userscript/raw/userscript/_.user.js
// @updateURL   https://github.com/ringgarevanka/userscript/raw/userscript/_.user.js
// @copyright   null
// @inject-into content
// ==/UserScript==

// Check and set 'safe' and 'udm' parameter for specific Google domains
(function() {
    'use strict';

    const url = new URL(window.location.href);
    const params = url.searchParams;
    const isGoogle = /https:\/\/www\.google\..*\/(search|imgres)/.test(url.href);

    if (isGoogle) {
        let updated = false;

        if (params.get('safe') !== 'off') {
            params.set('safe', 'off');
            updated = true;
        }

        if (params.get('udm') !== '14') {
            params.set('udm', '14');
            updated = true;
        }

        if (updated) {
            window.location.replace(url.toString());
        }
    }
})();

// Load and initialize Eruda
(function() {
    'use strict';

    function isMobileDevice() {
        return /Android|webOS|iOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    function shouldLoadEruda() {
        return new URLSearchParams(window.location.search).get('eruda') === 'true' && !window.location.href.startsWith('https://eruda.liriliri.io/');
    }

    if (isMobileDevice() && shouldLoadEruda()) {
        var script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/eruda/eruda.min.js";
        script.onload = function() {
            eruda.init();
        };
        document.body.appendChild(script);
    }
})();

// Remove Website Limitations
(function() {
    'use strict';

    // Domain rules
    const rules = {
        black: {
            name: "black",
            hook_eventNames: "",
            unhook_eventNames: ""
        },
        default: {
            name: "default",
            hook_eventNames: "contextmenu|select|selectstart|copy|cut|dragstart",
            unhook_eventNames: "mousedown|mouseup|keydown|keyup",
            dom0: true,
            hook_addEventListener: true,
            hook_preventDefault: true,
            hook_set_returnValue: true,
            add_css: true
        }
    };

    // Blacklisted domains
    const lists = {
        black: [
            /.*\.youtube\.com.*/,
            /.*\.wikipedia\.org.*/,
            /mail\.qq\.com.*/,
            /translate\.google\..*/]
    };

    let hookEventNames, unhookEventNames, allEventNames;
    const storageName = getRandomString('qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM', Math.floor(Math.random() * 12 + 8));
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    const originalDocumentAddEventListener = document.addEventListener;
    const originalPreventDefault = Event.prototype.preventDefault;

    // Override addEventListener to intercept specific events
    function addEventListener(type, func, useCapture) {
        const addEventListenerFn = this === document ? originalDocumentAddEventListener : originalAddEventListener;
        if (hookEventNames.includes(type)) {
            addEventListenerFn.call(this, type, returnTrue, useCapture);
        } else if (unhookEventNames.includes(type)) {
            const funcStorageName = `${storageName}${type}${useCapture ? 't' : 'f'}`;
            if (!this[funcStorageName]) {
                this[funcStorageName] = [];
                addEventListenerFn.call(this, type, useCapture ? unhookWithCapture : unhookWithoutCapture, useCapture);
            }
            this[funcStorageName].push(func);
        } else {
            addEventListenerFn.call(this, type, func, useCapture);
        }
    }

    // Clear specific event handlers in a loop
    function clearLoop() {
        const elements = getAllElements();
        elements.forEach(element => {
            allEventNames.forEach(eventName => {
                const handlerName = `on${eventName}`;
                if (element[handlerName] && element[handlerName] !== onEvent) {
                    if (unhookEventNames.includes(eventName)) {
                        element[`${storageName}${handlerName}`] = element[handlerName];
                        element[handlerName] = onEvent;
                    } else {
                        element[handlerName] = null;
                    }
                }
            });
        });
    }

    // Function that always returns true
    function returnTrue() {
        return true;
    }

    // Unhook event handler with capture
    function unhookWithCapture(event) {
        return unhook(event, this, `${storageName}${event.type}t`);
    }

    // Unhook event handler without capture
    function unhookWithoutCapture(event) {
        return unhook(event, this, `${storageName}${event.type}f`);
    }

    // Unhook event handler and call original functions
    function unhook(event, element, funcStorageName) {
        element[funcStorageName].forEach(func => func(event));
        event.returnValue = true;
        return true;
    }

    // Generic event handler
    function onEvent(event) {
        const handlerName = `${storageName}on${event.type}`;
        this[handlerName](event);
        event.returnValue = true;
        return true;
    }

    // Generate a random string of given length from specified characters
    function getRandomString(chars, length) {
        let result = '';
        while (length--) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }

    // Get all elements including the document
    function getAllElements() {
        const elements = Array.from(document.getElementsByTagName('*'));
        elements.push(document);
        return elements;
    }

    // Add CSS to the document
    function addStyle(css) {
        const style = document.createElement('style');
        style.innerHTML = css;
        document.head.appendChild(style);
    }

    // Determine which rule to apply based on the URL
    function getRule(url) {
        return lists.black.some(pattern => pattern.test(url)) ? rules.black : rules.
        default;
    }

    // Initialize script functionality
    function init() {
        const url = `${window.location.host}${window.location.pathname}`;
        const rule = getRule(url);

        hookEventNames = rule.hook_eventNames.split("|");
        unhookEventNames = rule.unhook_eventNames.split("|");
        allEventNames = [...hookEventNames, ...unhookEventNames];

        if (rule.dom0) {
            setInterval(clearLoop, 30000);
            setTimeout(clearLoop, 2500);
            window.addEventListener('load', clearLoop, true);
            clearLoop();
        }

        if (rule.hook_addEventListener) {
            EventTarget.prototype.addEventListener = addEventListener;
            document.addEventListener = addEventListener;
        }

        if (rule.hook_preventDefault) {
            Event.prototype.preventDefault = function() {
                if (!allEventNames.includes(this.type)) {
                    originalPreventDefault.apply(this, arguments);
                }
            };
        }

        if (rule.hook_set_returnValue) {
            Object.defineProperty(Event.prototype, 'returnValue', {
                set(value) {
                    if (value !== true && allEventNames.includes(this.type)) {
                        value = true;
                    }
                    return value;
                }
            });
        }

        console.debug('url:', url, 'storageName:', storageName, 'rule:', rule.name);

        if (rule.add_css) {
            addStyle('html, * { user-select: text !important; }');
        }
    }

    init();
})();
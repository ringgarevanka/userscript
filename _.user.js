/* THIS IS A PRIVATE USERSCRIPT DO NOT USE */
// ==UserScript==
// @name    _
// @namespace   _
// @description _
// @include *://*/*
// @match   *://*/*
// @exclude-match   -
// @require -
// @connect -
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
    var url = window.location.href;
    var params = "&safe=off&udm=14";

    if (/google\.[a-z.]+/.test(url)) {
        if (url.indexOf(params) == -1) {
            url += params;
            window.location = url;
        }
    }
})();

// Disable SafeSearch on various search engines
(function() {
    'use strict';

    const hostname = window.location.hostname;
    const website = hostname.split('.').at(-2);

    const cookieSettings = {
        bing: {
            cookie: "SRCHHPGUSR",
            isArray: true,
            name: "ADLT",
            value: "OFF",
            domain: `.${hostname.split('.').slice(-2).join('.')}`,
            sameSite: "None",
            separator: "&"
        },
        duckduckgo: {
            cookie: "p",
            isArray: false,
            value: "-2",
            sameSite: "Lax"
        },
        yep: {
            localStorage: "safeSearch",
            value: "off",
            replaceUrl: "safeSearch"
        },
        yahoo: {
            cookie: "sB",
            isArray: true,
            name: "vm",
            value: "p",
            domain: `.search.${hostname.split('.').slice(-2).join('.')}`,
            sameSite: "None",
            session: true,
            separator: "&"
        },
        you: {
            cookie: "safesearch_guest",
            isArray: false,
            value: "Off"
        },
        ecosia: {
            cookie: "ECFG",
            isArray: true,
            name: "f",
            value: "n",
            domain: `.${hostname.split('.').slice(-2).join('.')}`,
            separator: ":",
            sameSite: "Lax"
        },
        qwant: {
            cookie: "s",
            isArray: false,
            value: "0",
            replaceUrl: "s"
        },
        metager: {
            cookie: "web_setting_s",
            isArray: false,
            value: "o",
            replaceUrl: "s"
        },
        startpage: {
            cookie: "preferences",
            isArray: true,
            name: "disable_family_filter",
            value: "1",
            separator: "N",
            equal: "EEE",
            domain: `.${hostname.split('.').slice(-2).join('.')}`
        },
        brave: {
            cookie: "safesearch",
            isArray: false,
            value: "off"
        }
    };

    const setting = cookieSettings[website];

    function setCookie(name, value, options = {}) {
        options = {
            path: '/',
            ...options
        };

        if (options.expires instanceof Date) {
            options.expires = options.expires.toUTCString();
        }

        let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

        for (let optionKey in options) {
            updatedCookie += "; " + optionKey;
            let optionValue = options[optionKey];
            if (optionValue !== true) {
                updatedCookie += "=" + optionValue;
            }
        }

        document.cookie = updatedCookie;
    }

    function getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    function updateCookie() {
        if (!setting.cookie) return;

        let cookieValue = getCookie(setting.cookie);

        if (setting.isArray) {
            let parts = cookieValue ? cookieValue.split(setting.separator) : [];
            let index = parts.findIndex(part => part.startsWith(setting.name + (setting.equal || '=')));

            if (index !== -1) {
                parts[index] = `${setting.name}${setting.equal || '='}${setting.value}`;
            } else {
                parts.push(`${setting.name}${setting.equal || '='}${setting.value}`);
            }

            cookieValue = parts.join(setting.separator);
        } else {
            cookieValue = setting.value;
        }

        setCookie(setting.cookie, cookieValue, {
            domain: setting.domain,
            sameSite: setting.sameSite,
            secure: true,
            expires: setting.session ? undefined : new Date('2038-01-01')
        });
    }

    function updateLocalStorage() {
        if (!setting.localStorage) return;
        localStorage.setItem(setting.localStorage, setting.value);
    }

    function removeUrlParam(url, parameter) {
        const urlParts = url.split('?');
        if (urlParts.length < 2) return url;

        const prefix = encodeURIComponent(parameter) + '=';
        const parts = urlParts[1].split(/[&;]/g);

        for (let i = parts.length; i-- > 0;) {
            if (parts[i].lastIndexOf(prefix, 0) !== -1) {
                parts.splice(i, 1);
            }
        }

        return urlParts[0] + (parts.length > 0 ? '?' + parts.join('&') : '');
    }

    function main() {
        if (setting.cookie) {
            updateCookie();
        } else if (setting.localStorage) {
            updateLocalStorage();
        }

        if (setting.replaceUrl) {
            const newUrl = removeUrlParam(window.location.href, setting.replaceUrl);
            if (newUrl !== window.location.href) {
                window.location.replace(newUrl);
            }
        }
    }

    main();
})();

// Load and initialize Eruda
(function() {
    'use strict';

    function isMobileDevice() {
        return /Android|webOS|iOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    if (isMobileDevice()) {
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

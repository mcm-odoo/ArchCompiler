// @odoo-module

const parser = new DOMParser();
const xmlDocument = parser.parseFromString("<templates/>", "text/xml");

function hasParsingError(parsedDocument) {
    return parsedDocument.getElementsByTagName("parsererror").length > 0;
}

/**
 * @param {string} str
 * @returns {Element}
 */
export function parseXML(str) {
    const xml = parser.parseFromString(str, "text/xml");
    if (hasParsingError(xml)) {
        throw new Error(
            `An error occured while parsing ${str}: ${xml.getElementsByTagName("parsererror")}`
        );
    }
    return xml.documentElement;
}

/**
 * XML equivalent of `document.createElement`.
 *
 * @param {string} tagName
 * @param {...(Iterable<Element> | Record<string, string>)} args
 * @returns {Element}
 */
export function createElement(tagName, ...args) {
    const el = xmlDocument.createElement(tagName);
    for (const arg of args) {
        if (!arg) {
            continue;
        }
        if (Symbol.iterator in arg) {
            // Children list
            el.append(...arg);
        } else if (typeof arg === "object") {
            // Attributes
            for (const name in arg) {
                el.setAttribute(name, arg[name]);
            }
        }
    }
    return el;
}

/**
 * XML equivalent of `document.createTextNode`.
 *
 * @param {string} data
 * @returns {Text}
 */
export function createTextNode(data) {
    return xmlDocument.createTextNode(data);
}

/**
 * XML equivalent of `document.createDocumentFragment`.
 *
 * @param {Node[]} [children]
 * @returns {DocumentFragment}
 */
export function createFragment(children = []) {
    const fragment = xmlDocument.createDocumentFragment();
    fragment.append(...children);
    return fragment;
}

export function arch(template, ...substitutions) {
    const nodesToReplace = [];
    const slots = [];
    for (const s of substitutions) {
        if (s === null || s === undefined) {
            slots.push("");
        } else if (s instanceof Node) {
            nodesToReplace.push(s);
            slots.push(`<arch-hook-${nodesToReplace.length - 1}/>`);
        } else {
            slots.push(s);
        }
    }

    const str = String.raw(template, ...slots);
    const xml = parseXML(str);

    for (let i = 0; i < nodesToReplace.length; i++) {
        xml.querySelector(`arch-hook-${i}`).replaceWith(nodesToReplace[i]);
    }

    return xml;
}

const identifierRegExp = /^[^\W\d]\w*$/i;

/**
 * @param {string} [str]
 * @returns {import("@odoo").IExpression}
 */
export function createExpr(str = null) {
    return {
        [Symbol.toPrimitive]() {
            return str;
        },
        [Symbol.toString]() {
            return str;
        },
        toString() {
            return str;
        },
        get(arg1, ...args) {
            let expr = null;
            if (str) {
                if (typeof arg1 === "string") {
                    if (identifierRegExp.test(arg1)) {
                        expr = createExpr(`${this}.${arg1}`);
                    } else {
                        expr = createExpr(`${this}['${arg1}']`);
                    }
                } else {
                    expr = createExpr(`${this}[${arg1}]`);
                }
            } else if (typeof arg1 === "string" && identifierRegExp.test(arg1)) {
                expr = createExpr(`${arg1}`);
            } else {
                throw new Error(`Invalid identifier: ${arg1}`);
            }

            if (args.length) {
                expr = expr.get(...args);
            }

            return expr;
        },
        call(...args) {
            return createExpr(`${this}(${args.join(", ")})`);
        },
        raw(...args) {
            return createExpr([this, ...args].join(""));
        },
    };
}

/**
 * @param {Element} element
 * @returns {boolean}
 */
export function isAlwaysInvisible(element) {
    const invisible = element.getAttribute("invisible");
    return invisible === "True" || invisible === "1";
}

// @odoo-module

import { createElement, createFragment, createTextNode } from "./utils";

/**
 * @param {Element} element
 * @returns {Node}
 */
function visitChildren(element) {
    const renderChildren = [];
    for (const child of element.childNodes) {
        if (child instanceof Text) {
            const content = child.textContent.trim();
            renderChildren.push(() => createTextNode(content));
        } else if (child instanceof Element) {
            renderChildren.push(visitElement(child));
        }
    }

    return () => createFragment(renderChildren.map((r) => r()));
}

/**
 * @param {Element} element
 * @returns {Node}
 */
function visitElement(element) {
    switch (element.tagName) {
        case "field":
            return visitField(element);
        default:
            return visitHtmlElement(element);
    }
}

/**
 * @param {Element} element
 * @returns {Node}
 */
function visitField(element) {
    const name = element.getAttribute("name");
    return () => createElement("div", { "t-esc": `record.${name}.value` });
}

/**
 * @param {Element} element
 * @returns {Node}
 */
function visitHtmlElement(element) {
    const renderChildren = visitChildren(element);
    const render = () => {
        const node = element.cloneNode(false);
        node.removeAttribute("invisible");
        node.append(renderChildren());
        return node;
    };

    let renderInvisible = render;
    const invisible = element.getAttribute("invisible");
    if (invisible === "active") {
        renderInvisible = () => {
            return createElement("t", { "t-if": `!record.active.raw_value` }, [render()]);
        };
    }

    return renderInvisible;
}

/**
 * @param {Element} element
 * @returns {object}
 */
export function compileArchQWeb(element) {
    const render = visitChildren(element);
    return () => ({
        node: createElement("t", [render()]),
        context: {},
    });
}

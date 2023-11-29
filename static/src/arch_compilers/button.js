// @odoo-module

import { Button } from "@arch/components";
import { arch, createTextNode } from "./utils";

/**
 * @param {Element} element
 * @param {object} params
 * @returns {object}
 */
export function compileArchButton(element) {
    const icon = element.getAttribute("icon");
    const string = element.getAttribute("string");

    return (expr) => {
        const componentExpr = expr.get("component");
        const propsExpr = expr.get("props");

        const node = arch`<t t-component="${componentExpr}" t-props="${propsExpr}"/>`;

        if (icon) {
            node.append(arch`<i class="fa ${icon}"/>`);
        }
        if (string) {
            node.append(createTextNode(string));
        }

        return {
            node,
            context: {
                component: Button,
                props: {
                    className: element.className,
                    onClick: () => {
                        console.log("clicked of arch button");
                    },
                },
            },
        };
    };
}

// @odoo-module

import { createFragment } from "./utils";

/**
 * @param {Element} element
 * @param {object} params
 * @returns {object}
 */
export function compileArchTree() {
    return {
        renderHeader: () => ({ node: createFragment(), context: {} }),
        renderContent: () => ({ node: createFragment(), context: {} }),
        renderFooter: () => ({ node: createFragment(), context: {} }),
    };
}

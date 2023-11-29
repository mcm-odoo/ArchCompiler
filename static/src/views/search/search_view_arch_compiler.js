// @odoo-module

import { createFragment, registerViewArchCompiler } from "@arch/arch_compilers";
import { ViewController } from "../view_controller";

/**
 * @param {Element} element
 * @param {object} params
 * @returns {any}
 */
function compileArchSearchView() {
    return {
        controller: new ViewController(),
        renderHeader: () => ({ node: createFragment(), context: {} }),
        renderContent: () => ({ node: createFragment(), context: {} }),
        renderFooter: () => ({ node: createFragment(), context: {} }),
    };
}

registerViewArchCompiler("search", compileArchSearchView);

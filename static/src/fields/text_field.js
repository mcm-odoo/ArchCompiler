// @odoo-module

import { createElement, registerFieldArchCompiler } from "@arch/arch_compilers";

function compileArchTextField() {
    return {
        render: () => ({
            node: createElement("textarea"),
            context: {},
        }),
    };
}
registerFieldArchCompiler("text", compileArchTextField);

// @odoo-module

import { createElement, registerFieldArchCompiler } from "@arch/arch_compilers";

function compileArchHtmlField() {
    return {
        render: () => ({
            node: createElement("textarea"),
            context: {},
        }),
    };
}
registerFieldArchCompiler("html", compileArchHtmlField);

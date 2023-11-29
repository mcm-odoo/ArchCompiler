// @odoo-module

import { arch, registerFieldArchCompiler } from "@arch/arch_compilers";

function compileArchUrlField() {
    return {
        render: () => ({
            node: arch`<a href="#">www.odoo.com</a>`,
            context: {},
        }),
    };
}
registerFieldArchCompiler("url", compileArchUrlField);

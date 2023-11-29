// @odoo-module

import { createFragment, registerFieldArchCompiler } from "@arch/arch_compilers";

function compileArchDateTimeField(element) {
    const name = element.getAttribute("name");

    return {
        render: () => {
            return {
                node: createFragment(name),
                context: {},
            };
        },
    };
}
registerFieldArchCompiler("datetime", compileArchDateTimeField);

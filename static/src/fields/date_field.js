// @odoo-module

import { createFragment, registerFieldArchCompiler } from "@arch/arch_compilers";

function compileArchDateField(element) {
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
registerFieldArchCompiler("date", compileArchDateField);

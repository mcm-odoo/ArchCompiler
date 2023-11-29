// @odoo-module

import { createFragment, registerFieldArchCompiler } from "@arch/arch_compilers";

function compileArchPropertiesField(element) {
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
registerFieldArchCompiler("properties", compileArchPropertiesField);

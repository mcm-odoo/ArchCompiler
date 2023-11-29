// @odoo-module

import { createTextNode, registerFieldArchCompiler } from "@arch/arch_compilers";

function compileArchReferenceField() {
    return {
        render: () => ({
            node: createTextNode("reference"),
            context: {},
        }),
    };
}
registerFieldArchCompiler("reference", compileArchReferenceField);

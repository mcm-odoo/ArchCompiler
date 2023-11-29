// @odoo-module

import { createTextNode, registerFieldArchCompiler } from "@arch/arch_compilers";

function compileArchMany2ManyField() {
    return {
        render: () => ({
            node: createTextNode("many2many"),
            context: {},
        }),
    };
}
registerFieldArchCompiler("many2many", compileArchMany2ManyField);

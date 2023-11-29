// @odoo-module

import { createTextNode, registerFieldArchCompiler } from "@arch/arch_compilers";

function compileArchMany2ManyTagsField() {
    return {
        render: () => ({
            node: createTextNode("many2many_tags"),
            context: {},
        }),
    };
}
registerFieldArchCompiler("many2many_tags", compileArchMany2ManyTagsField);

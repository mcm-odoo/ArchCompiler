// @odoo-module

import { createFragment, registerFieldArchCompiler } from "@arch/arch_compilers";

function compileArchBinaryField() {
    return {
        render: () => ({
            node: createFragment(),
            context: {},
        }),
    };
}
registerFieldArchCompiler("binary", compileArchBinaryField);

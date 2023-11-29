// @odoo-module

import { arch, registerFieldArchCompiler } from "@arch/arch_compilers";

function compileArchIntegerField(element) {
    const name = element.getAttribute("name");

    return {
        render: ({ expr, dataStream }) => {
            const valueExpr = expr.get("value");
            const onInputExpr = expr.get("onInput");

            return {
                node: arch`<input type="number" class="o_input" t-att-value="${valueExpr}" t-on-input="${onInputExpr}"/>`,
                context: {
                    get value() {
                        return dataStream.read()[name];
                    },
                    onInput: (e) => {
                        dataStream.write({ [name]: e.target.value });
                    },
                },
            };
        },
    };
}
registerFieldArchCompiler("integer", compileArchIntegerField);

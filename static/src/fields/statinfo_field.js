// @odoo-module

import { arch, createFragment, registerFieldArchCompiler } from "@arch/arch_compilers";

function compileArchStatInfoField(element) {
    const name = element.getAttribute("name");
    const string = element.getAttribute("string");

    return {
        render: ({ expr, dataStream }) => {
            const valueExpr = expr.get("value");

            return {
                node: createFragment([
                    arch`<span class="o_stat_info o_stat_value" t-esc="${valueExpr}"/>`,
                    arch`<span class="o_stat_text">${string}</span>`,
                ]),
                context: {
                    get value() {
                        return dataStream.read()[name];
                    },
                },
            };
        },
    };
}
registerFieldArchCompiler("statinfo", compileArchStatInfoField);

// @odoo-module

import { arch, registerFieldArchCompiler } from "@arch/arch_compilers";

function render({ expr, dataStream, name }) {
    const valueExpr = expr.get("value");
    const onInputExpr = expr.get("onInput");

    return {
        node: arch`<input type="number" step="0.1" class="o_input" t-att-value="${valueExpr}" t-on-input="${onInputExpr}"/>`,
        context: {
            get value() {
                return dataStream.read()[name];
            },
            onInput: (e) => {
                dataStream.write({ [name]: e.target.value });
            },
        },
    };
}

function renderReadonly({ expr, dataStream, name }) {
    const valueExpr = expr.get("value");

    return {
        node: arch`<span t-esc="${valueExpr}"/>`,
        context: {
            get value() {
                return dataStream.read()[name];
            },
        },
    };
}

function compileArchMonetaryField(element) {
    const name = element.getAttribute("name");

    return {
        render: (params) => render({ ...params, name }),
        renderReadonly: (params) => renderReadonly({ ...params, name }),
    };
}
registerFieldArchCompiler("monetary", compileArchMonetaryField);

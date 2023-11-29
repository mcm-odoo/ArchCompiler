// @odoo-module

import { arch, registerFieldArchCompiler } from "@arch/arch_compilers";
import { Input } from "@arch/components";

function render({ expr, dataStream, name, placeholder }) {
    const componentExpr = expr.get("component");
    const propsExpr = expr.get("props");

    return {
        node: arch`<t t-component="${componentExpr}" t-props="${propsExpr}"/>`,
        context: {
            component: Input,
            props: {
                placeholder,
                get value() {
                    return dataStream.read()[name];
                },
                onChange: (value) => {
                    dataStream.write({ [name]: value });
                },
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
                return dataStream.read()[name] || "";
            },
        },
    };
}

function compileArchCharField(element) {
    const name = element.getAttribute("name");
    const placeholder = element.getAttribute("placeholder") ?? "";

    return {
        render: (params) => render({ ...params, name, placeholder }),
        renderReadonly: (params) => renderReadonly({ ...params, name }),
    };
}
registerFieldArchCompiler("char", compileArchCharField);

// @odoo-module

import { arch, registerFieldArchCompiler } from "@arch/arch_compilers";
import { CheckBox } from "@arch/components";

function compileArchBooleanField(element) {
    const name = element.getAttribute("name");

    return {
        render: ({ expr, dataStream }) => {
            const componentExpr = expr.get("component");
            const propsExpr = expr.get("props");

            return {
                node: arch`<t t-component="${componentExpr}" t-props="${propsExpr}"/>`,
                context: {
                    component: CheckBox,
                    props: {
                        get value() {
                            return dataStream.read()[name] || false;
                        },
                        onChange: (value) => {
                            dataStream.write({ [name]: value });
                        },
                    },
                },
            };
        },
    };
}
registerFieldArchCompiler("boolean", compileArchBooleanField);

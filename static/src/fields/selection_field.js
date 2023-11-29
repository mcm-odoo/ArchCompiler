// @odoo-module

import { arch, registerFieldArchCompiler } from "@arch/arch_compilers";
import { Select } from "@arch/components";
import {
    Many2OneSelectionSource,
    SelectionOptionsProvider,
    SelectionSource,
} from "@arch/selection_utils";

function compileArchSelectionField(element, { models, modelName }) {
    const name = element.getAttribute("name");
    const placeholder = element.getAttribute("placeholder");

    const fieldDef = models[modelName][name];
    const source =
        fieldDef.type === "many2one"
            ? new Many2OneSelectionSource({ fieldDef })
            : new SelectionSource({ fieldDef });

    return {
        render: ({ expr, dataStream }) => {
            const providerComponentExpr = expr.get("provider", "component");
            const providerPropsExpr = expr.get("provider", "props");
            const selectionComponentExpr = expr.get("selection", "component");
            const selectionPropsExpr = expr.get("selection", "props");

            return {
                node: arch`
                    <t t-component="${providerComponentExpr}" t-props="${providerPropsExpr}" t-slot-scope="scope">
                        <t t-component="${selectionComponentExpr}" t-props="${selectionPropsExpr}" options="scope.options"/>
                    </t>
                `,
                context: {
                    provider: {
                        component: SelectionOptionsProvider,
                        props: { source },
                    },
                    selection: {
                        component: Select,
                        props: {
                            placeholder,
                            get value() {
                                return dataStream.read()[name];
                            },
                            update(value) {
                                dataStream.write({ [name]: value });
                            },
                        },
                    },
                },
            };
        },
    };
}
registerFieldArchCompiler("selection", compileArchSelectionField);

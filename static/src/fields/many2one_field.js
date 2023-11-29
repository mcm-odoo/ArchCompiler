// @odoo-module

import { arch, registerFieldArchCompiler } from "@arch/arch_compilers";
import { ComboBox } from "@arch/components";
import { Orm } from "@arch/data_source";
import { Field } from "./field";
import { Component, onWillStart, useState, xml } from "@odoo/owl";

class Many2OneField extends Field {
    buildSpecification() {
        return {
            [this.name]: { id: {}, display_name: {} },
        };
    }
}

class ComboBoxOptionsLoader extends Component {
    static template = xml`<t t-slot="default" options="state.options" load="(n) => this.load(n)"/>`;
    static props = ["slots", "model"];

    setup() {
        this.state = useState({ options: [] });
        onWillStart(() => this.load(""));
    }

    async load(name) {
        const records = await Orm.server.call(this.props.model, "name_search", [], {
            name,
            args: [],
            limit: 10,
            context: {},
        });
        this.state.options = records.map((r) => ({ key: r[0], value: r[1] }));
    }
}

function compileArchMany2OneField(element, { models, modelName }) {
    const fieldName = element.getAttribute("name");
    const fieldDef = models[modelName][fieldName];
    const placeholder = element.getAttribute("placeholder") ?? "";
    const info = new Many2OneField({ name: fieldName });

    return {
        info,
        render: ({ expr }) => {
            const optionsLoaderComponentExpr = expr.get("optionsLoader", "component");
            const optionsLoaderPropsExpr = expr.get("optionsLoader", "props");
            const comboBoxComponentExpr = expr.get("comboBox", "component");
            const comboBoxPropsExpr = expr.get("comboBox", "props");

            return {
                node: arch`
                    <t t-component="${optionsLoaderComponentExpr}" t-props="${optionsLoaderPropsExpr}" t-slot-scope="scope">
                        <t t-component="${comboBoxComponentExpr}" t-props="${comboBoxPropsExpr}" onSearch="scope.load" options="scope.options"/>
                    </t>
                `,
                context: {
                    optionsLoader: {
                        component: ComboBoxOptionsLoader,
                        props: { model: fieldDef.relation },
                    },

                    comboBox: {
                        component: ComboBox,
                        props: { placeholder },
                    },
                },
            };
        },
    };
}
registerFieldArchCompiler("many2one", compileArchMany2OneField);

// @odoo-module

import { compileArchKanban, createFragment, registerFieldArchCompiler } from "@arch/arch_compilers";
import { Field } from "./field";
import { mergeFieldSpecifications } from "@arch/field_utils";

class One2ManyField extends Field {
    setup(params) {
        super.setup(params);
        this.fields = params.fields;
    }

    buildSpecification() {
        return {
            [this.name]: {
                fields: mergeFieldSpecifications(this.fields.map((f) => f.buildSpecification())),
            },
        };
    }
}

/**
 * @param {Element} element
 * @param {import("@odoo").IFieldArchCompilerParams} params
 */
function compileForm(element) {}

/**
 * @param {Element} element
 * @param {import("@odoo").IFieldArchCompilerParams} params
 */
function compileKanban(element, params) {
    return compileArchKanban(element, {
        models: params.models,
        modelName: params.modelName,
        viewType: "kanban",
        viewVariant: null,
    });
}

/**
 * @param {Element} element
 * @param {import("@odoo").IFieldArchCompilerParams} params
 */
function compileTree(element) {}

/**
 * @param {Element} element
 * @param {import("@odoo").IFieldArchCompilerParams} params
 */
function compileArchOne2ManyField(element, params) {
    const name = element.getAttribute("name");
    const mode = element.getAttribute("mode");
    const views = {};

    const formEl = element.querySelector(":scope > form");
    if (formEl) {
        views.form = compileForm(formEl, params);
    }

    const kanbanEl = element.querySelector(":scope > kanban");
    if (kanbanEl) {
        views.kanban = compileKanban(kanbanEl, params);
    }

    const treeEl = element.querySelector(":scope > tree");
    if (treeEl) {
        views.tree = compileTree(treeEl, params);
    }

    const info = new One2ManyField({
        name,
        fields: views[mode]?.fields ?? [],
    });

    return {
        info,
        render: ({ expr, dataStream }) => {
            if (!mode) {
                return {
                    node: createFragment(),
                    context: {},
                };
            }

            const view = views[mode];
            const { node, context } = view.renderContent({
                expr,
                dataStream: {
                    read() {
                        return dataStream.read()[name];
                    },
                },
            });

            return { node, context };
        },
    };
}
registerFieldArchCompiler("one2many", compileArchOne2ManyField);

// @odoo-module

import { DataGrid } from "@arch/components";
import { xml } from "@odoo/owl";
import { compileArchField } from "./field";
import { compileArchQWeb } from "./qweb";
import { arch, createExpr, createFragment } from "./utils";
import { url } from "@web/core/utils/urls";

/**
 * @param {Element} element
 * @param {object} params
 */
function compileField(element, params) {
    const field = compileArchField(element, {
        modelName: params.modelName,
        models: params.models,
        viewType: params.viewType,
        viewVariant: params.viewVariant,
    });
    params.fields.push(field.info);
    return () => {};
}
/**
 * @param {Element} element
 * @returns {string}
 */
function compileQWeb(element) {
    const renderQWeb = compileArchQWeb(element);
    return () => {
        const qweb = renderQWeb();
        console.dirxml(qweb);
        return xml`${qweb.node.innerHTML}`;
    };
}

/**
 * @param {Element} element
 * @param {object} params
 */
function visitChildren(element, params) {
    const renderChildren = [];
    for (const child of element.children) {
        renderChildren.push(visitElement(child, params));
    }

    return (context) => {
        for (const renderChild of renderChildren) {
            renderChild(context);
        }
    };
}
/**
 * @param {Element} element
 * @param {object} params
 */
function visitElement(element, params) {
    switch (element.tagName) {
        case "field": {
            return visitField(element, params);
        }
        case "templates": {
            return visitTemplates(element, params);
        }
    }
}

/**
 * @param {Element} element
 * @param {object} params
 */
function visitField(element, params) {
    return compileField(element, params);
}
/**
 * @param {Element} element
 * @param {object} params
 */
function visitTemplates(element) {
    const kanbanBoxEl = [...element.children].find(
        (c) => c.getAttribute("t-name") === "kanban-box"
    );
    if (!kanbanBoxEl) {
        return () => {};
    }

    const renderQWeb = compileQWeb(kanbanBoxEl);
    return ({ root, rendererScopeExpr, makeRenderingContextExpr }) => {
        const recordExpr = rendererScopeExpr.get("record");
        const contextExpr = makeRenderingContextExpr.call(recordExpr);

        const templateName = renderQWeb();
        root.append(arch`
            <t t-call="${templateName}" t-call-context="${contextExpr}"/>
        `);
    };
}

/**
 * @param {Element} element
 * @param {object} params
 * @returns {object}
 */
function compileContent(element, params) {
    const renderChildren = visitChildren(element, {
        modelName: params.modelName,
        models: params.models,
        viewType: params.viewType,
        viewVariant: params.viewVariant,
        fields: params.fields,
    });

    return ({ expr, dataStream }) => {
        const rendererComponentExpr = expr.get("renderer", "component");
        const rendererPropsExpr = expr.get("renderer", "props");
        const rendererScopeExpr = createExpr("rendererScope");
        const makeRenderingContextExpr = expr.get("makeRenderingContext");

        const node = arch`<t t-component="${rendererComponentExpr}" t-props="${rendererPropsExpr}" t-slot-scope="${rendererScopeExpr}"/>`;
        renderChildren({ expr, rendererScopeExpr, makeRenderingContextExpr, root: node });
        return {
            node,
            context: {
                renderer: {
                    component: DataGrid,
                    props: {
                        get records() {
                            return dataStream.read();
                        },
                    },
                },
                makeRenderingContext: (record) => {
                    return {
                        kanban_color: () => `oe_kanban_color_0`,
                        kanban_image: (model, field, id) => {
                            return url("/web/image", { model, field, id });
                        },
                        record: new Proxy(record, {
                            get: (target, k) => {
                                return {
                                    value: target[k],
                                    raw_value:
                                        params.models[params.modelName][k].type === "many2one" &&
                                        target[k]
                                            ? target[k][0]
                                            : target[k],
                                };
                            },
                        }),
                    };
                },
            },
        };
    };
}

/**
 * @param {Element} element
 * @param {object} params
 * @returns {object}
 */
export function compileArchKanban(element, params) {
    const fields = [];
    const contentParams = { ...params, fields };
    const renderContent = compileContent(element, contentParams);

    return {
        fields,
        renderHeader: () => ({ node: createFragment(), context: {} }),
        renderContent,
        renderFooter: () => ({ node: createFragment(), context: {} }),
    };
}

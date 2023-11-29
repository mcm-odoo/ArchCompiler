// @odoo-module

import { evaluateBooleanExpr } from "@web/core/py_js/py";
import { compileArchButton } from "./button";
import { compileArchField } from "./field";
import { arch, createElement, createFragment, createTextNode, isAlwaysInvisible } from "./utils";
import { compileArchWidget } from "./widget";
import { Notebook } from "@web/core/notebook/notebook";

function wrapConditionalRender(render, condition) {
    return (params) => {
        const { expr, conditionalElements } = params;

        const index = conditionalElements.length;
        conditionalElements.push(condition);

        const isVisibleExpr = expr.get("isVisible").call(index);
        return arch`<t t-if="${isVisibleExpr}">${render(params)}</t>`;
    };
}

/**
 * @param {Element} element
 * @param {object} params
 * @returns {any}
 */
function compileButton(element, params) {
    const renderButton = compileArchButton(element);
    const renderContent = visitChildren(element, params);

    return (params) => {
        const { expr, buttons } = params;

        const buttonExpr = expr.get("buttons", buttons.length);
        const { node, context } = renderButton(buttonExpr);
        node.append(renderContent(params));
        buttons.push(context);

        return node;
    };
}

/**
 * @param {Element} element
 * @param {object} params
 * @returns {any}
 */
function compileField(element, params) {
    const field = compileArchField(element, {
        modelName: params.modelName,
        models: params.models,
        viewType: params.viewType,
        viewVariant: params.viewVariant,
    });
    params.fields.push(field.info);

    const render = ({ expr, fields, dataStream }) => {
        const fieldExpr = expr.get("fields", fields.length);
        const { node, context } = field.render({
            expr: fieldExpr,
            dataStream,
        });
        fields.push(context);

        const className = ["o_field_widget", ...element.classList].join(" ");
        return arch`<div class="${className}" name="${field.name}">${node}</div>`;
    };

    return { info: field, render };
}

/**
 * @param {Element} element
 * @param {object} params
 * @returns {any}
 */
function compileWidget(element) {
    const widget = compileArchWidget(element, {});

    const render = ({ expr, widgets }) => {
        const widgetExpr = expr.get("widgets", widgets.length);
        const { node, context } = widget.render(widgetExpr);
        widgets.push(context);
        return node;
    };

    return { info: widget, render };
}

/**
 * @param {Element} element
 * @param {object} params
 * @returns {Node}
 */
function visitChildren(element, params) {
    const renderChildren = [];
    for (const child of element.childNodes) {
        if (child instanceof Text) {
            const text = child.textContent.trim();
            renderChildren.push(() => createTextNode(text));
        } else if (child instanceof Element) {
            renderChildren.push(visitElement(child, params));
        }
    }

    return (p) => createFragment(renderChildren.map((r) => r(p)));
}

/**
 * @param {Element} element
 * @param {object} params
 * @returns {Node}
 */
function visitElement(element, params) {
    switch (element.tagName) {
        case "button":
            return visitButton(element, params);
        case "field":
            return visitField(element, params);
        case "group":
            return visitGroup(element, params);
        case "label":
            return visitLabel(element, params);
        case "notebook":
            return visitNotebook(element, params);
        case "sheet":
            return visitSheet(element, params);
        case "widget":
            return visitWidget(element, params);
        default:
            return visitHtmlElement(element, params);
    }
}

/**
 * @param {Element} element
 * @param {object} params
 * @returns {Node}
 */
function visitButton(element, params) {
    const renderButton = compileButton(element, params);

    let render = renderButton;
    const invisible = element.getAttribute("invisible");
    if (invisible) {
        const isVisible = (context) => !evaluateBooleanExpr(invisible, context);
        render = wrapConditionalRender(render, isVisible);
    }

    return render;
}

/**
 * @param {Element} element
 * @param {object} params
 * @returns {Node}
 */
function visitField(element, params) {
    const { render: renderField } = compileField(element, params);
    if (isAlwaysInvisible(element)) {
        return () => createFragment();
    }

    let render = renderField;
    const invisible = element.getAttribute("invisible");
    if (invisible) {
        const isVisible = (context) => !evaluateBooleanExpr(invisible, context);
        render = wrapConditionalRender(render, isVisible);
    }

    return render;
}

/**
 * @param {Element} element
 * @param {object} params
 * @returns {Node}
 */
function visitFieldset(element, params) {
    const { info, render: renderField } = compileField(element, params);
    if (isAlwaysInvisible(element)) {
        return () => createFragment();
    }

    let render = (params) =>
        createFragment([
            arch`
                <div class="o_cell o_wrap_label flex-grow-1 flex-sm-grow-0 w-100 text-break text-900">
                    <label class="o_form_label">${info.string}</label>
                </div>
            `,
            renderField(params),
        ]);

    const invisible = element.getAttribute("invisible");
    if (invisible) {
        const isVisible = (context) => !evaluateBooleanExpr(invisible, context);
        render = wrapConditionalRender(render, isVisible);
    }

    return render;
}

/**
 * @param {Element} element
 * @param {object} params
 * @returns {Node}
 */
function visitHtmlElement(element, params) {
    if (element.classList.contains("oe_chatter") || element.classList.contains("alert")) {
        return () => createFragment();
    }

    const renderChildren = visitChildren(element, params);
    let render = (params) => {
        return createElement(element.tagName, { className: element.className }, [
            renderChildren(params),
        ]);
    };

    const invisible = element.getAttribute("invisible");
    if (invisible) {
        const isVisible = (context) => !evaluateBooleanExpr(invisible, context);
        render = wrapConditionalRender(render, isVisible);
    }

    return render;
}

/**
 * @param {Element} element
 * @param {object} params
 * @returns {Node}
 */
function visitInnerGroupChildren(element, params) {
    const renderChildren = [];
    for (const child of element.children) {
        if (child.tagName === "field") {
            renderChildren.push(visitFieldset(child, params));
        } else {
            renderChildren.push(visitElement(child, params));
        }
    }

    return (p) => createFragment(renderChildren.map((r) => r(p)));
}

/**
 * @param {Element} element
 * @param {object} params
 * @returns {Node}
 */
function visitInnerGroup(element, params) {
    const string = element.getAttribute("string");

    const renderChildren = visitInnerGroupChildren(element, params);
    const render = (params) => {
        const children = renderChildren(params);

        if (string) {
            children.prepend(arch`
                <div class="g-col-sm-2">
                    <div class="o_horizontal_separator mt-4 mb-3 text-uppercase fw-bolder small">
                        ${string}
                    </div>
                </div>
            `);
        }

        return arch`<div class="o_inner_group grid col-lg-6">${children}</div>`;
    };

    return render;
}

/**
 * @param {Element} element
 * @param {object} params
 * @returns {Node}
 */
function visitOuterGroup(element, params) {
    const renderChildren = visitChildren(element, { ...params, inGroup: true });
    return (params) => arch`
        <div class="o_group row align-items-start">
            ${renderChildren(params)}
        </div>
    `;
}

/**
 * @param {Element} element
 * @param {object} params
 * @returns {Node}
 */
function visitGroup(element, params) {
    if (params.inGroup) {
        return visitInnerGroup(element, params);
    } else {
        return visitOuterGroup(element, params);
    }
}

/**
 * @param {Element} element
 * @param {object} params
 * @returns {Node}
 */
function visitLabel(element, params) {
    const fieldName = element.getAttribute("for");
    if (!fieldName) {
        return () => createFragment();
    }

    const { models, modelName } = params;

    const string = models[modelName][fieldName]?.string ?? "@todo";
    const className = ["o_form_label", ...element.classList].join(" ");

    const renderChildren = visitChildren(element, params);
    return (params) => arch`
        <div class="o_cell o_wrap_label flex-grow-1 flex-sm-grow-0 w-100 text-break text-900">
            <label class="${className}">${string || renderChildren(params)}</label>
        </div>
    `;
}

/**
 * @param {Element} element
 * @param {object} params
 * @returns {Node}
 */
function visitNotebook(element, params) {
    const renderPages = [];
    for (const child of element.children) {
        if (child.tagName !== "page") {
            continue; // is that an error?
        }
        renderPages.push(visitPage(child, params));
    }

    return (params) => {
        const { expr, notebooks } = params;

        const notebookExpr = expr.get("notebooks", notebooks.length);
        const notebookComponentExpr = notebookExpr.get("component");

        const pages = [];
        notebooks.push({ component: Notebook, pages });

        const node = arch`<t t-component="${notebookComponentExpr}"/>`;
        for (const renderPage of renderPages) {
            const pageExpr = notebookExpr.get("pages", pages.length);
            const page = renderPage(params, pageExpr);
            node.append(page.node);
            pages.push(page.context);
        }

        return node;
    };
}

/**
 * @param {Element} element
 * @param {object} params
 * @param {object} pageExpr
 * @returns {Node}
 */
function visitPage(element, params) {
    const name = element.getAttribute("name");
    const string = element.getAttribute("string");

    const renderChildren = visitChildren(element, params);
    return (params, pageExpr) => {
        const stringExpr = pageExpr.get("string");

        return {
            node: arch`
                <t t-set-slot="${name}" title="${stringExpr}" isVisible="true">
                    ${renderChildren(params)}
                </t>
            `,
            context: {
                string,
            },
        };
    };
}

/**
 * @param {Element} element
 * @param {object} params
 * @returns {Node}
 */
function visitSheet(element, params) {
    const renderChildren = visitChildren(element, params);
    return (params) => arch`
        <div class="o_form_sheet_bg">
            <div class="o_form_sheet position-relative">${renderChildren(params)}</div>
        </div>
    `;
}

/**
 * @param {Element} element
 * @param {object} params
 * @returns {Node}
 */
function visitWidget(element, params) {
    const widget = compileWidget(element, params);
    return widget.render;
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
        inGroup: false,
    });

    return ({ expr, dataStream }) => {
        const conditionalElements = [];
        const buttons = [];
        const fields = [];
        const widgets = [];
        const notebooks = [];

        const children = renderChildren({
            expr,
            dataStream,
            conditionalElements,
            buttons,
            fields,
            widgets,
            notebooks,
        });

        return {
            node: arch`
                <div class="o_form_renderer o_form_editable d-flex flex-column">
                    ${children}
                </div>
            `,
            context: {
                isVisible: (index) => conditionalElements[index](dataStream.read()),
                buttons,
                fields,
                widgets,
                notebooks,
            },
        };
    };
}

/**
 * @param {Element} element
 * @param {object} params
 * @returns {object}
 */
export function compileArchForm(element, params) {
    const fields = [];
    const contentParams = { ...params, fields };

    return {
        fields,
        renderHeader: () => ({ node: createFragment(), context: {} }),
        renderContent: compileContent(element, contentParams),
        renderFooter: () => ({ node: createFragment(), context: {} }),
    };
}

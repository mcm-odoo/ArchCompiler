// @odoo-module

import { ActionLayout } from "@arch/action_utils";
import { arch } from "./utils";
import { compileArchView } from "./view";
import { Component, xml } from "@odoo/owl";
import { Button } from "@arch/components";
import { useActiveState } from "@arch/active_state_hook";

class ViewSwitcher extends Component {
    static components = { Button };
    static template = xml`
        <div class="btn-group">
            <t t-foreach="env.view.types" t-as="viewType" t-key="viewType">
                <Button className="getBtnClassName(viewType)" groupState="btnGroupState" onClick="() => env.view.switch(viewType)">
                    <t t-esc="viewType"/>
                </Button>
            </t>
        </div>
    `;
    static props = [];

    setup() {
        this.btnGroupState = useActiveState(true);
    }

    getBtnClassName(viewType) {
        const classNames = ["btn-secondary"];
        if (this.env.view.currentViewType === viewType) {
            classNames.push("active");
        }
        return classNames.join(" ");
    }
}

function renderControlPanel(view, expr) {
    const viewHeaderExpr = expr.get("viewHeader");
    const viewSwitcherExpr = expr.get("viewSwitcher");

    const header = view.renderHeader(viewHeaderExpr);
    const node = arch`
        <div class="o_control_panel d-flex pt-2 pb-3 px-3">
            <div class="o_control_panel_breadcrumbs">
            </div>
            <div class="o_control_panel_actions">
                ${header.node}
            </div>
            <div class="o_control_panel_navigation justify-content-end d-flex gap-3">
                <t t-component="${viewSwitcherExpr}"/>
            </div>
        </div>
    `;

    return {
        node,
        context: {
            viewSwitcher: ViewSwitcher,
            viewHeader: header.context,
        },
    };
}

function renderView(view, expr) {
    const controlPanelExpr = expr.get("controlPanel");
    const contentExpr = expr.get("content");
    const footerExpr = expr.get("footer");
    const layoutComponentExpr = expr.get("layout", "component");
    const layoutPropsExpr = expr.get("layout", "props");

    const header = renderControlPanel(view, controlPanelExpr);
    const content = view.renderContent(contentExpr);
    const footer = view.renderFooter(footerExpr);

    return {
        node: arch`
            <t t-component="${layoutComponentExpr}" t-props="${layoutPropsExpr}">
                <t t-set-slot="header">${header.node}</t>
                <t t-set-slot="content">${content.node}</t>
                <t t-set-slot="footer">${footer.node}</t>
            </t>
        `,
        context: {
            layout: {
                component: ActionLayout,
                props: {
                    className: `o_${view.type}_view`,
                },
            },
            controlPanel: header.context,
            content: content.context,
            footer: footer.context,
        },
    };
}

/**
 * @param {Element} element
 * @param {object} expr
 * @param {object} params
 * @returns {any}
 */
export function compileArch(element, params) {
    const view = compileArchView(element, {
        models: params.models,
        modelName: params.modelName,
        localState: params.localState,
        globalState: params.globalState,
    });

    return {
        controller: view.controller,
        render: (expr) => renderView(view, expr),
    };
}

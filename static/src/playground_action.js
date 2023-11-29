// @odoo-module

import { Component, onWillStart, useState, useSubEnv, xml } from "@odoo/owl";
import { Domain } from "@web/core/domain";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { parseXML } from "@web/core/utils/xml";
import { useSetupAction } from "@web/webclient/actions/action_hook";
import { compileArch, createExpr } from "./arch_compilers";

const VIEWS_MAP = {
    "crm.lead": [
        [564, "kanban"],
        [567, "list"],
        [561, "calendar"],
        [573, "pivot"],
        [571, "graph"],
        [false, "form"],
    ],
    "res.partner": [
        [128, "kanban"],
        [122, "list"],
        [125, "form"],
        [127, "search"],
    ],
};

const RES_MODEL = "res.partner";
const VIEWS = VIEWS_MAP[RES_MODEL];

export class PlaygroundAction extends Component {
    static template = xml`
        <t t-call="{{ currentView.template }}" t-call-context="currentView.context"/>
    `;
    static props = ["*"];

    setup() {
        console.log(this);
        this.view = useService("view");

        this.viewDefs = {};
        this.relatedModels = {};
        this.fieldDefs = {};
        this.viewsInfo = {};

        this.globalState = useState({
            domain: new Domain(),
        });
        this.localStates = useState({});

        const state = useState({
            viewType: null,
        });
        this.state = state;

        useSetupAction({
            beforeLeave: () => {
                return this.currentView.controller.willLeave();
            },
        });

        useSubEnv({
            view: {
                get currentViewType() {
                    return state.viewType;
                },
                types: VIEWS.map((v) => v[1]),
                switch: (type) => this.switchView(type),
            },
        });

        onWillStart(async () => {
            const { views, relatedModels, fields } = await this.loadViewInfo(RES_MODEL);
            console.log(fields);
            this.viewDefs = views;
            this.relatedModels = relatedModels;
            this.fieldDefs = fields;
            await this.switchView("form");
        });
    }

    get currentView() {
        return this.viewsInfo[this.state.viewType];
    }

    async loadViewInfo(resModel) {
        const params = {
            resModel,
            views: VIEWS,
        };
        const options = { action_id: 209, load_filters: true, toolbar: true };
        const result = await this.view.loadViews(params, options);
        return result;
    }

    compileArch(arch, params) {
        const archRoot = parseXML(arch);
        console.dirxml(archRoot);
        const { controller, render } = compileArch(archRoot, params);
        const renderResult = render(createExpr());
        console.log({ controller, ...renderResult });
        return {
            controller,
            template: xml`${renderResult.node.outerHTML}`,
            context: renderResult.context,
        };
    }

    async switchView(viewType) {
        await this.currentView?.controller.willLeave();

        this.localStates[viewType] = {};
        if (!this.viewsInfo[viewType]) {
            const viewDef = this.viewDefs[viewType];
            this.viewsInfo[viewType] = this.compileArch(viewDef.arch, {
                models: this.relatedModels,
                modelName: RES_MODEL,
                localState: this.localStates[viewType],
                globalState: this.globalState,
            });
        }

        await this.viewsInfo[viewType].controller.willEnter();
        this.state.viewType = viewType;
    }
}
registry.category("actions").add("playground-arch", PlaygroundAction);

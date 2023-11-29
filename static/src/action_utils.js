// @odoo-module

import { Component, useState, useSubEnv, xml } from "@odoo/owl";
import { makeActiveState } from "./active_state_hook";
import { Button } from "./components";

const ACTION_BTN_GROUP_STATE_SYMBOL = Symbol("ACTION_BTN_GROUP_STATE");

export class ActionLayout extends Component {
    static template = xml`
        <div class="o_action" t-att-class="props.className">
            <t t-slot="header"/>
            <div class="o_content">
                <t t-slot="content"/>
            </div>
        </div>
    `;
    static props = ["className", "slots"];

    setup() {
        useSubEnv({
            [ACTION_BTN_GROUP_STATE_SYMBOL]: makeActiveState(true),
        });
    }
}

export class ActionButton extends Component {
    static components = { Button };
    static template = xml`
        <Button className="'btn-secondary'" groupState="groupState" onClick="() => this.execute()">
            <t t-slot="default"/>
        </Button>
    `;
    static props = ["slots"];

    setup() {
        this.groupState = useState(this.env[ACTION_BTN_GROUP_STATE_SYMBOL]);
    }

    async execute() {
        await new Promise((r) => setTimeout(r, 200 + Math.random() * 1800));
    }
}

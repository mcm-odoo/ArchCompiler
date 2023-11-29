// @odoo-module

import { useActiveState } from "@arch/active_state_hook";
import { Component } from "@odoo/owl";

export class Button extends Component {
    static template = "oui:Button";
    static props = ["className?", "groupState?", "onClick", "slots"];
    static defaultProps = {
        className: "",
    };

    setup() {
        this.selfState = useActiveState(true);
    }

    get state() {
        return this.props.groupState ?? this.selfState;
    }

    async execute(state) {
        if (!state.active) {
            return;
        }
        state.disable();
        try {
            await this.props.onClick();
        } finally {
            state.enable();
        }
    }
}

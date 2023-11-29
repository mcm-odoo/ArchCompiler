// @odoo-module

import { Component, onWillUpdateProps, useState } from "@odoo/owl";

export class Input extends Component {
    static template = "oui:Input";
    static props = ["*"];

    setup() {
        this.isFocused = false;
        this.state = useState({
            value: this.props.value,
        });
        onWillUpdateProps((np) => {
            if (!this.isFocused && this.state.value !== np.value) {
                this.state.value = np.value;
            }
        });
    }

    onFocus(e) {
        this.isFocused = true;
        this.state.value = e.target.value;
        this.props.onFocus?.();
    }

    onBlur(e) {
        this.isFocused = false;
    }

    onInput(e) {
        this.state.value = e.target.value;
        this.props.onInput?.(e.target.value);
    }

    onChange(e) {
        this.state.value = e.target.value;
        this.props.onChange?.(e.target.value);
    }
}

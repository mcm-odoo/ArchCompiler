// @odoo-module

import { Component } from "@odoo/owl";

export class Select extends Component {
    static template = "oui:Select";
    static props = ["options", "placeholder?", "required?", "update", "value"];
    static defaultProps = {
        placeholder: "",
        required: false,
    };

    deserialize(value) {
        return JSON.parse(value);
    }

    serialize(value) {
        return JSON.stringify(value);
    }
}

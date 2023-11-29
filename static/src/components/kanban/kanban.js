// @odoo-module

import { Component } from "@odoo/owl";

export class Kanban extends Component {
    static template = "oui:Kanban";
    static props = ["groups", "records", "slots"];

    getGroupValue(group) {
        return Array.isArray(group.value) ? group.value[0] : group.value;
    }

    getGroupLabel(group) {
        return (Array.isArray(group.value) ? group.value[1] : group.value) || "Undefined";
    }

    getGroupRecords(group) {
        return group.records.map((id) => this.props.records[id]);
    }
}

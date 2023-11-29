// @odoo-module

import { Component } from "@odoo/owl";
import { useDebounced } from "@web/core/utils/timing";

export class ComboBox extends Component {
    static template = "oui:ComboBox";
    static props = ["*"];

    static nextDataListId = 1;

    setup() {
        this.datalistId = `combobox-datalist-${ComboBox.nextDataListId++}`;
        this.onSearch = useDebounced((query) => this.props.onSearch(query), 300);
    }
}

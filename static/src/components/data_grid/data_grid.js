// @odoo-module

import { Component } from "@odoo/owl";

export class DataGrid extends Component {
    static template = "oui:DataGrid";
    static props = ["records", "slots"];
}

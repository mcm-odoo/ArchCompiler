// @odoo-module

import { Orm } from "@arch/data_source";
import { Component, onWillStart, useState, xml } from "@odoo/owl";
import { Cache } from "@web/core/utils/cache";

export class SelectionOptionsProvider extends Component {
    static template = xml`<t t-slot="default" options="state.options"/>`;
    static props = ["slots", "source"];

    setup() {
        this.state = useState({ options: [] });
        onWillStart(() => this.onUpdate(this.props));
    }

    async onUpdate({ source }) {
        this.state.options = await source.load();
    }
}

export class SelectionSource {
    constructor({ fieldDef }) {
        this.fieldDef = fieldDef;
    }

    async load() {
        return this.fieldDef.selection.map((s) => ({ value: s[0], label: s[1] }));
    }
}

export class Many2OneSelectionSource extends SelectionSource {
    constructor(params) {
        super(params);
        this.cache = new Cache(async () => {
            const records = await Orm.server.searchRead(
                params.fieldDef.relation,
                [],
                ["id", "display_name"],
                { limit: 10 }
            );
            return records.map((r) => ({ value: r.id, label: r.display_name }));
        });
    }

    async load() {
        return this.cache.read();
    }
}

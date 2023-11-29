// @odoo-module

import { ViewController } from "@arch/views/view_controller";
import { Orm, ServerDataSource } from "@arch/data_source";
import { mergeFieldSpecifications } from "@arch/field_utils";

export class KanbanViewController extends ViewController {
    setup({ models, modelName, localState, fields }) {
        this.models = models;
        this.modelName = modelName;
        this.localState = localState;
        this.fields = fields;

        this.localState.search = {
            offset: 0,
            limit: 80,
        };
        this.localState.data = {
            records: {},
            count: 0,
            groups: [],
        };

        const source = new ServerDataSource(modelName, models[modelName]);
        this.orm = new Orm(source);
    }

    async willEnter() {
        await this.loadData();
    }

    get records() {
        return this.localState.data.records;
    }

    get groups() {
        return this.localState.data.groups;
    }

    buildSpecification() {
        return mergeFieldSpecifications(this.fields.map((f) => f.buildSpecification()));
    }

    async loadData() {
        const data = await Orm.server.call(this.modelName, "arch_search", [], {
            context: { bin_size: true },
            domain: [],
            specification: this.buildSpecification(),
        });

        Object.assign(this.localState.data, data);
        this.localState.data.records = data.records;
    }
}

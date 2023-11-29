// @odoo-module

import { Orm } from "@arch/data_source";
import { ViewController } from "../view_controller";
import { mergeFieldSpecifications } from "@arch/field_utils";

export class FormViewController extends ViewController {
    setup({ modelName, localState, fields }) {
        this.modelName = modelName;
        this.localState = localState;
        this.fields = fields;
    }

    async willEnter() {
        await this.loadRecord();
    }

    get record() {
        return this.localState.record;
    }

    buildSpecification() {
        return mergeFieldSpecifications(this.fields.map((f) => f.buildSpecification()));
    }

    async loadRecord() {
        const [record] = await Orm.server.call(this.modelName, "arch_get", [[14]], {
            context: { bin_size: true },
            specification: this.buildSpecification(),
        });

        this.localState.record = record;
    }
}

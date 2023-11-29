// @odoo-module

export class Field {
    constructor(params) {
        this.name = params.name;
        this.setup(params);
    }

    setup(params) {}

    buildSpecification() {
        return {
            [this.name]: {},
        };
    }
}

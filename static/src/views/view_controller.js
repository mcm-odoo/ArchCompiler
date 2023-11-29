// @odoo-module

export class ViewController {
    constructor(...params) {
        this.setup(...params);
    }

    setup() {}
    async willEnter() {}
    async willLeave() {}
}

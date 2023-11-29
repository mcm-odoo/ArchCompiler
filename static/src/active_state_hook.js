// @odoo-module

import { reactive, useState } from "@odoo/owl";

export function makeActiveState(defaultActive = false) {
    return reactive({
        active: defaultActive,
        toggle(value = null) {
            this.active = value ?? !this.active;
        },
        enable() {
            this.active = true;
        },
        disable() {
            this.active = false;
        },
    });
}

export function useActiveState(defaultActive = false) {
    return useState(makeActiveState(defaultActive));
}

// @odoo-module

import { registry } from "@web/core/registry";

function playgroundItem({ env }) {
    return {
        type: "item",
        description: "Playground",
        callback: () => {
            env.services.action.doAction("playground-arch");
        },
    };
}
registry
    .category("debug")
    .category("default")
    .add("playground-arch", playgroundItem, { sequence: 100 });

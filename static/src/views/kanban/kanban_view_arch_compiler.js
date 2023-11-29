// @odoo-module

import { compileArchKanban, registerViewArchCompiler } from "@arch/arch_compilers";
import { KanbanViewController } from "./kanban_view_controller";

/**
 * @param {Element} element
 * @param {object} params
 * @returns {any}
 */
function compileArchKanbanView(element, params) {
    const kanban = compileArchKanban(element, params);

    const controller = new KanbanViewController({
        models: params.models,
        modelName: params.modelName,
        localState: params.localState,
        fields: kanban.fields,
    });

    const dataStream = {
        read() {
            return controller.records;
        },
    };

    return {
        controller,
        renderHeader: (expr) => kanban.renderHeader({ expr, dataStream }),
        renderContent: (expr) => kanban.renderContent({ expr, dataStream }),
        renderFooter: (expr) => kanban.renderFooter({ expr, dataStream }),
    };
}

registerViewArchCompiler("kanban", compileArchKanbanView);

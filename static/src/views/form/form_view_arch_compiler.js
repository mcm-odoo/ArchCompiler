// @odoo-module

import { compileArchForm, registerViewArchCompiler } from "@arch/arch_compilers";
import { FormViewController } from "./form_view_controller";

/**
 * @param {Element} element
 * @param {object} params
 * @returns {any}
 */
function compileArchFormView(element, params) {
    const form = compileArchForm(element, params);

    const controller = new FormViewController({
        modelName: params.modelName,
        localState: params.localState,
        fields: form.fields,
    });

    const dataStream = {
        read() {
            return controller.record;
        },
        write(changes) {
            Object.assign(controller.record, changes);
        },
    };

    return {
        controller,
        // render functions
        // breadcrumbs?
        // buttons -> buttons next to breadcrumbs
        // action -> center of control panel
        // pager -> pager..
        renderHeader: (expr) => form.renderHeader({ expr, dataStream }),
        renderContent: (expr) => form.renderContent({ expr, dataStream }),
        renderFooter: (expr) => form.renderFooter({ expr, dataStream }),
    };
}

registerViewArchCompiler("form", compileArchFormView);

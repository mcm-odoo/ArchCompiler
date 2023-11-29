// @odoo-module

import { arch, registerFieldArchCompiler } from "@arch/arch_compilers";
import { url } from "@web/core/utils/urls";

function compileArchImageField(element, { modelName }) {
    return {
        render: ({ expr, dataStream }) => {
            const srcExpr = expr.get("value");

            return {
                node: arch`<img t-att-src="${srcExpr}"/>`,
                context: {
                    get src() {
                        return url("/web/image", {
                            model: modelName,
                            field: "avatar_128",
                            id: dataStream.read().id,
                        });
                    },
                },
            };
        },
    };
}
registerFieldArchCompiler("image", compileArchImageField);

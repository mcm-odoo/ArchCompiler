// @odoo-module

import { createFragment } from "./utils";

// const compilers = {};

// /**
//  * @param {string} key
//  * @param {(element: Element, params: object) => object} compiler
//  */
// export function registerWidgetArchCompiler(key, compiler) {
//     if (compilers[key]) {
//         throw new Error(`Widget arch compiler already exists: ${key}`);
//     }
//     compilers[key] = compiler;
// }

// /**
//  * @param {string} key
//  * @returns {(element: Element, params: object) => object}
//  */
// function findCompiler(key) {
//     if (!compilers[key]) {
//         throw new Error(`Widget arch compiler does not exist: ${key}`);
//     }
//     return compilers[key];
// }

/**
 * @param {Element} element
 * @param {object} params
 * @returns {object}
 */
export function compileArchWidget(element) {
    // const widgetType = element.getAttribute("name");

    // const compileWidget = findCompiler(widgetType);
    // const compilationResult = compileWidget(element, { ...params, widgetType });

    // return compilationResult;

    return {
        render: () => ({
            node: createFragment(),
            context: {},
        }),
    };
}

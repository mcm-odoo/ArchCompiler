// @odoo-module

import { Field } from "@arch/fields/field";

const compilers = {};

/**
 * @param {string} key
 * @param {(element: Element, params: object) => object} compiler
 */
export function registerFieldArchCompiler(key, compiler) {
    if (compilers[key]) {
        throw new Error(`Field arch compiler already exists: ${key}`);
    }
    compilers[key] = compiler;
}

/**
 * @param {string} viewVariant
 * @param {string} viewType
 * @param {string} fieldVariant
 * @param {string} fieldType
 * @returns {(element: Element, params: object) => object}
 */
function findCompiler(viewVariant, viewType, fieldVariant, fieldType) {
    const keys = [
        `${viewVariant}.${fieldVariant}`,
        `${viewVariant}.${fieldType}`,
        `${viewType}.${fieldVariant}`,
        `${viewType}.${fieldType}`,
        fieldVariant,
        fieldType,
    ];
    const compiler = keys.map((k) => compilers[k]).find(Boolean);
    if (!compiler) {
        throw new Error(`Field arch compiler does not exist: ${fieldType}`);
    }
    return compiler;
}

/**
 * @param {Element} element
 * @param {object} params
 * @returns {object}
 */
export function compileArchField(element, params) {
    const name = element.getAttribute("name");
    if (!name) {
        throw new Error("Field should have a name");
    }

    const { models, modelName, viewType, viewVariant } = params;
    const fieldDef = models[modelName][name];

    const fieldType = fieldDef.type;
    const fieldVariant = element.getAttribute("widget");

    const compileField = findCompiler(viewVariant, viewType, fieldVariant, fieldType);
    const compilationResult = compileField(element, { ...params, fieldType, fieldVariant });

    const string = element.getAttribute("string") || fieldDef.string;

    const info = new Field({ name });
    const renderReadonly = compilationResult.renderReadonly ?? compilationResult.render;

    return {
        info,
        name,
        string,
        ...compilationResult,
        renderReadonly,
    };
}

// @odoo-module

/**
 * @param {object[]} fieldSpecifications
 * @returns {object}
 */
export function mergeFieldSpecifications(fieldSpecifications) {
    return fieldSpecifications.reduce((result, spec) => ({ ...result, ...spec }), {});
}

// @odoo-module

const compilers = {};

/**
 * @param {string} key
 * @param {(element: Element, params: object) => object} compiler
 */
export function registerViewArchCompiler(key, compiler) {
    if (compilers[key]) {
        throw new Error(`View arch compiler already exists: ${key}`);
    }
    compilers[key] = compiler;
}

/**
 * @param {string} viewVariant
 * @param {string} viewType
 * @returns {(element: Element, params: object) => object}
 */
function findCompiler(viewVariant, viewType) {
    const keys = [viewVariant, viewType];
    const compiler = keys.map((k) => compilers[k]).find(Boolean);
    if (!compiler) {
        throw new Error(`View arch compiler does not exist: ${viewType}`);
    }
    return compiler;
}

/**
 * @param {Element} element
 * @param {object} params
 * @returns {object}
 */
export function compileArchView(element, params) {
    const viewType = element.tagName;
    const viewVariant = element.getAttribute("js_class");

    const compileView = findCompiler(viewVariant, viewType);
    const compilationResult = compileView(element, { ...params, viewType, viewVariant });

    return {
        ...compilationResult,
        type: viewType,
    };
}

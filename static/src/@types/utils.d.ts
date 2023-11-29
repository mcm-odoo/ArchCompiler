declare module "@odoo" {
    export type Domain = [path: string, operator: string, value: boolean | number | string | number[] | string[]][] | "&" | "|" | "!";
}

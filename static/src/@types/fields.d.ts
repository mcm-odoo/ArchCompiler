declare module "@odoo" {
    export type FieldType =
        "binary" |
        "boolean" |
        "char" |
        "date" |
        "datetime" |
        "float" |
        "html" |
        "integer" |
        "json" |
        "many2many" |
        "many2one" |
        "many2one_reference" |
        "monetary" |
        "one2many" |
        "properties" |
        "properties_definition" |
        "reference" |
        "selection" |
        "text";

    // ------------------------------------------------------------------------

    export interface IFieldDefinition<T extends FieldType> {
        change_default: boolean;
        groups?: string;
        help?: string;
        name: string;
        readonly: boolean;
        related?: string;
        required: boolean;
        searchable: boolean;
        sortable: boolean;
        store: boolean;
        string: string;
        type: T;
    }

    interface IRelational {
        context: object;
        domain: Domain | string;
        relation: string;
    }

    // ------------------------------------------------------------------------

    export type BinaryFieldDefinition = IFieldDefinition<"binary">;

    export type BooleanFieldDefinition = IFieldDefinition<"boolean">;

    export type CharFieldDefinition = IFieldDefinition<"char"> & {
        translatable: boolean;
        trim: boolean;
    };

    export type DateFieldDefinition = IFieldDefinition<"date">;

    export type DateTimeFieldDefinition = IFieldDefinition<"datetime">;

    export type FloatFieldDefinition = IFieldDefinition<"float"> & {
        digits: [separator: number, decimals: number];
        group_operator: string;
    };

    export type HtmlFieldDefinition = IFieldDefinition<"html"> & {
        translatable: boolean;
        sanitize: boolean;
        sanitize_tags: boolean;
    };

    export type IntegerFieldDefinition = IFieldDefinition<"integer"> & {
        group_operator: string;
    };

    export type JsonFieldDefinition = IFieldDefinition<"json">;

    export type Many2ManyFieldDefinition = IFieldDefinition<"many2many"> & IRelational;

    export type Many2OneFieldDefinition = IFieldDefinition<"many2one"> & IRelational;

    export type Many2OneReferenceFieldDefinition = IFieldDefinition<"many2one_reference">;

    export type MonetaryFieldDefinition = IFieldDefinition<"monetary"> & {
        currency_field: string;
        digits: [separator: number, decimals: number];
        group_operator: string;
    };

    export type One2ManyFieldDefinition = IFieldDefinition<"one2many"> & IRelational & {
        relation_field: string;
    };

    export type PropertiesFieldDefinition = IFieldDefinition<"properties"> & {
        definition_record: string;
    };

    export type PropertiesDefinitionFieldDefinition = IFieldDefinition<"properties_definition">;

    export type ReferenceFieldDefinition = IFieldDefinition<"reference"> & {
        selection: [value: number | string, label: string][];
    };

    export type SelectionFieldDefinition = IFieldDefinition<"selection"> & {
        selection: [value: number | string, label: string][];
    };

    export type TextFieldDefinition = IFieldDefinition<"text"> & {
        translatable: boolean;
    };

    // ------------------------------------------------------------------------

    export type FieldDefinition =
        BinaryFieldDefinition |
        BooleanFieldDefinition |
        CharFieldDefinition |
        DateFieldDefinition |
        DateTimeFieldDefinition |
        FloatFieldDefinition |
        HtmlFieldDefinition |
        IntegerFieldDefinition |
        JsonFieldDefinition |
        Many2ManyFieldDefinition |
        Many2OneFieldDefinition |
        Many2OneReferenceFieldDefinition |
        MonetaryFieldDefinition |
        One2ManyFieldDefinition |
        PropertiesFieldDefinition |
        PropertiesDefinitionFieldDefinition |
        ReferenceFieldDefinition |
        SelectionFieldDefinition |
        TextFieldDefinition;

    export type FieldDefinitionMap = Record<string, FieldDefinition>;
}

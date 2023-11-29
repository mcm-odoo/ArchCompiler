declare module "@odoo" {
    interface IExpression {
        [Symbol.toPrimitive](): string;
        [Symbol.toString](): string;
        toString(): string;
        get(...args: (string | number | IExpression)[]): IExpression;
        call(...args: (string | number | IExpression)[]): IExpression;
        raw(...args: (string | number | IExpression)[]): IExpression;
    }

    interface ModelRegistry {
        models: Record<string, FieldDefinitionMap>;
        currentName: string;
        readonly current: FieldDefinitionMap;
    }

    interface IArchCompilerParams {
        models: Record<string, FieldDefinitionMap>;
        modelName: string;
    }

    interface IFieldArchCompilerParams extends IArchCompilerParams {
        viewVariant: string;
        viewType: string;
        fieldVariant: string;
        fieldType: string;
    }
}

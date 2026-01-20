import type {FieldNode} from "@components/dynamic-form/utils/types.ts";

export const normalizeValue = (value: any, field: FieldNode) => {
    if (value === "") return undefined;

    if (field.renderer === "number") {
        return value === undefined ? undefined : Number(value);
    }

    return value;
};


export const isFieldVisible = (
    field: FieldNode,
    values: Record<string, any>
): boolean => {
    const condition = field.visibleWhen;
    if (!condition) return true;

    const evaluate = (cond: any): boolean => {
        const currentValue = values[cond.field];

        switch (cond.op) {
            case "equals":
                return currentValue === cond.value;
            case "in":
                return Array.isArray(cond.value) && cond.value.includes(currentValue);
            default:
                return true;
        }
    };

    if (Array.isArray(condition)) {
        return condition.every(evaluate);
    }

    return evaluate(condition);
};

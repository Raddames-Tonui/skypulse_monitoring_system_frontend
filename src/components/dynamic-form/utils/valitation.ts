import {isFieldVisible, normalizeValue} from "./visibility.ts";
import type { FieldNode } from "./types";

export const validateField = (
    field: FieldNode,
    rawValue: any,
    allValues: Record<string, any>
): string | null => {

    // 1. Skip hidden fields
    if (!isFieldVisible(field, allValues)) {
        return null;
    }

    const value = normalizeValue(rawValue, field);
    const rules = field.rules;
    if (!rules) return null;

    // 2. Required
    if (rules.required) {
        if (field.renderer === "checkbox") {
            if (value !== true) {
                return typeof rules.required === "string"
                    ? rules.required
                    : "This field is required";
            }
        } else if (
            value === undefined ||
            value === null ||
            value === ""
        ) {
            return typeof rules.required === "string"
                ? rules.required
                : "This field is required";
        }
    }

    // 3. String length
    if (typeof value === "string") {
        if (rules.minLength && value.length < rules.minLength.value) {
            return rules.minLength.message || `Minimum length is ${rules.minLength.value}`;
        }

        if (rules.maxLength && value.length > rules.maxLength.value) {
            return rules.maxLength.message || `Maximum length is ${rules.maxLength.value}`;
        }
    }

    // 4. Array length (multiselect)
    if (Array.isArray(value)) {
        if (rules.minLength && value.length < rules.minLength.value) {
            return rules.minLength.message || `Select at least ${rules.minLength.value} items`;
        }

        if (rules.maxLength && value.length > rules.maxLength.value) {
            return rules.maxLength.message || `Select at most ${rules.maxLength.value} items`;
        }
    }

    // 5. Pattern
    if (rules.pattern && typeof value === "string" && value !== "") {
        if (!rules.pattern.value.test(value)) {
            return rules.pattern.message || "Invalid format";
        }
    }

    // 6. Number range
    if (typeof value === "number") {
        if (rules.min && value < rules.min.value) {
            return rules.min.message || `Value must be >= ${rules.min.value}`;
        }

        if (rules.max && value > rules.max.value) {
            return rules.max.message || `Value must be <= ${rules.max.value}`;
        }
    }

    // 7. File validation
    if (field.renderer === "file" && value) {
        const files = Array.isArray(value) ? value : [value];

        // Required
        if (rules.required && files.length === 0) {
            return typeof rules.required === "string"
                ? rules.required
                : "File is required";
        }

        for (const file of files) {
            // Max size
            if (field.props?.maxSize && file.size > field.props.maxSize) {
                return `File must be smaller than ${Math.round(field.props.maxSize / 1024 / 1024)}MB`;
            }

            // Accept types
            if (field.props?.accept) {
                const allowed = field.props.accept.split(",");
                if (!allowed.some((type: string) => file.name.endsWith(type.trim()))) {
                    return "Invalid file type";
                }
            }
        }
    }


    // 8. Custom validator
    if (typeof rules.validate === "function") {
        const result = rules.validate(value, allValues);
        if (result !== true && result !== undefined) {
            return result;
        }
    }

    return null;
};

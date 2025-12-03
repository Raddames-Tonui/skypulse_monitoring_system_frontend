import React, { useEffect, useState } from "react";
import { validateField } from "./utils/valitation";
import type { DynamicFormProps, FieldNode, LayoutNode } from "./utils/types";
import "./css/formstyle.css";


export default function DynamicForm({ schema, onSubmit, initialData, className, fieldClassName, buttonClassName, style, }: DynamicFormProps) {
  const { id, meta, fields, layout } = schema;
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ---------- Initial Values ----------
  const initialValues = Object.fromEntries(
    Object.entries(fields).map(([id, field]) => {
      const defaultVal = field.defaultValue ?? "";
      const initialVal = initialData?.[id] ?? defaultVal;

      if (field.renderer === "number") {
        return [id, typeof initialVal === "number" ? initialVal : ""];
      } else if (field.renderer === "checkbox" || field.renderer === "switch") {
        return [id, !!initialVal];
      } else if (field.renderer === "multiselect") {
        return [id, Array.isArray(initialVal) ? initialVal : []];
      } else {
        return [id, initialVal];
      }
    })
  );

  const [formValues, setFormValues] = useState<Record<string, any>>(initialValues);
  useEffect(() => {
    if (initialData) {
      const newValues = Object.fromEntries(
        Object.entries(fields).map(([id, field]) => [
          id,
          initialData[id] ?? field.defaultValue ?? "",
        ])
      );
      setFormValues(newValues);
    }
  }, [initialData, fields]);

  // ---------- Visibility Logic ----------
  const isFieldVisible = (field: FieldNode): boolean => {
    const rule = field.visibleWhen;
    if (!rule) return true;

    const checkCondition = (condition: any) => {
      const target = formValues[condition.field];
      switch (condition.op) {
        case "equals":
          return target === condition.value;
        case "in":
          return Array.isArray(condition.value) && condition.value.includes(target);
        default:
          return true;
      }
    };

    return Array.isArray(rule) ? rule.every(checkCondition) : checkCondition(rule);
  };

  // ---------- Handle Input ----------
  const handleChange = (fieldId: string, value: any) => {
    setFormValues((prev) => {
      const updated = { ...prev, [fieldId]: value };
      Object.values(fields).forEach((f) => {
        if (!isFieldVisible(f)) updated[f.id] = undefined;
      });
      return updated;
    });

    const field = fields[fieldId];
    const error = validateField(field, value, { ...formValues, [fieldId]: value });
    setErrors((p) => ({ ...p, [fieldId]: error || "" }));
  };

  // ---------- Submission ----------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: Record<string, string> = {};

    Object.values(fields).forEach((f) => {
      if (!isFieldVisible(f)) return;
      const val = formValues[f.id];
      const err = validateField(f, val, formValues);
      if (err) validationErrors[f.id] = err;
    });

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const sanitized = Object.fromEntries(
        Object.entries(formValues).map(([k, v]) => {
          const f = fields[k];
          if (f?.renderer === "number") {
            return [k, typeof v === "number" ? v : undefined];
          }
          return [k, v];
        })
      );
      onSubmit?.(sanitized);
    }
  };

  // ---------- Render Field ----------
  const renderField = (field: FieldNode) => {
    const value = formValues[field.id] ?? field.defaultValue ?? "";
    const handleInputChange = (e: React.ChangeEvent<any>) => handleChange(field.id, e.target.value);
    const hasError = !!errors[field.id];
    const errorClass = hasError ? "input-error" : "";

    if (!isFieldVisible(field)) return null;

    switch (field.renderer) {
      case "select":
        return (
          <div className={fieldClassName || ""}>
            <select id={field.id} value={value} onChange={handleInputChange} className={errorClass}>
              <option value="">{field.placeholder || "Select..."}</option>
              {field.props?.data?.map((opt: any, i: number) => {
                const val = typeof opt === "object" ? opt.value : opt;
                const label = typeof opt === "object" ? opt.label : opt;
                return <option key={i} value={val}>{label}</option>;
              })}
            </select>
          </div>
        );

      case "multiselect":
        return (
          <div className={fieldClassName || ""}>
            <MultiSelectField field={field} value={value} onChange={handleChange} />
          </div>
        );

      case "textarea":
        return (
          <div className={fieldClassName || ""}>
            <textarea
              id={field.id}
              placeholder={field.placeholder}
              rows={field.props?.minRows || 3}
              value={value}
              onChange={handleInputChange}
              className={`${errorClass} ${field.props?.className || ""}`} 
            />
          </div>
        );


      case "number": {
        const rawValue = formValues[field.id] ?? field.defaultValue;
        const value = typeof rawValue === "number" && !isNaN(rawValue) ? rawValue : "";

        return (
          <div className={fieldClassName || ""}>
            <input
              id={field.id}
              type="number"
              value={value}
              min={field.props?.min}
              max={field.props?.max}
              step={field.props?.step || 1}
              placeholder={field.placeholder}
              onChange={(e) => {
                const num = e.target.valueAsNumber;
                handleChange(field.id, isNaN(num) ? undefined : num);
              }}
              className={errorClass}
            />
          </div>
        );
      }

      case "radio":
        return (
          <div id={field.id} className={fieldClassName || ""}>
            {field.props?.options?.map((opt: any) => (
              <label key={opt.value} style={{ marginRight: 10 }}>
                <input
                  type="radio"
                  name={field.id}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={() => handleChange(field.id, opt.value)}
                  className={errorClass}
                />
                {opt.label}
              </label>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <label className={fieldClassName || ""}>
            <input
              type="checkbox"
              id={field.id}
              checked={!!value}
              onChange={(e) => handleChange(field.id, e.target.checked)}
              className={errorClass}
            />
            {field.label}
          </label>
        );

      case "switch":
        return (
          <label className={`switch ${fieldClassName || ""}`}>
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => handleChange(field.id, e.target.checked)}
              className={errorClass}
            />
            <span className="slider" />
            {field.label}
          </label>
        );

      case "date":
        return (
          <div className={fieldClassName || ""}>
            <input type="date" id={field.id} value={value} onChange={handleInputChange} className={errorClass} />
          </div>
        );

      case "file":
        return (
          <div className={fieldClassName || ""}>
            <input
              id={field.id}
              type="file"
              accept={field.props?.accept}
              multiple={field.props?.multiple || false}
              onChange={(e) => handleChange(field.id, e.target.files)}
              className={errorClass}
            />
          </div>
        );

      default:
        return (
          <div className={fieldClassName || ""}>
            <input
              id={field.id}
              type={field.inputType || "text"}
              placeholder={field.placeholder}
              value={value}
              onChange={handleInputChange}
              className={errorClass}
            />
          </div>
        );
    }
  };
  // ---------- Layout Renderer ----------
  const renderLayoutNode = (node: LayoutNode, index?: number): JSX.Element | null => {
    const key = node.fieldId || node.title || `${node.kind}-${index}`;

    switch (node.kind) {
      case "field": {
        const field = fields[node.fieldId!];
        if (!isFieldVisible(field)) return null;
        return (
          <div key={field.id} className={`form-field ${fieldClassName || ""}`}>
            {field.renderer !== "checkbox" && field.renderer !== "switch" && (
              <label htmlFor={field.id}>{field.label}</label>
            )}
            {renderField(field)}
            {errors[field.id] && (
              <p className="error-text">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="error-icon"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="7" x2="12" y2="13" />
                  <circle cx="12" cy="17" r="1" fill="currentColor" />
                </svg>
                {errors[field.id]}
              </p>
            )}
          </div>
        );
      }

      case "stack":
        return (
          <div key={key} className={`stack stack-${node.spacing || "md"}`}>
            {node.children?.map((child, i) => renderLayoutNode(child, i))}
          </div>
        );

      case "grid":
        return (
          <div key={key} className={`grid grid-cols-${node.cols || 2} gap-${node.spacing || "md"}`}>
            {node.children?.map((child, i) => renderLayoutNode(child, i))}
          </div>
        );

      case "section":
        return (
          <fieldset key={key} className="form-section">
            {node.title && <h3 className="section-title">{node.title}</h3>}
            {node.children?.map((child, i) => renderLayoutNode(child, i))}
          </fieldset>
        );

      default:
        return null;
    }
  };


  const handleReset = () => {
    setFormValues(initialValues);
    setErrors({});
  };

  // ---------- Render Form ----------
  return (
    <div className={`dynamic-form ${className || ""}`} style={style}>
      {meta.title && <h1 className="form-h1">{meta.title}</h1>}
      {meta.subtitle && <h2 className="form-h2">{meta.subtitle}</h2>}

      <form id={id} onSubmit={handleSubmit}>
        {layout?.map((node, i) => renderLayoutNode(node))}
        <div className={`form-buttons ${buttonClassName || ""}`}>
          <button className="dynamic-form-submit-button" type="submit">Submit</button>
          <button className="dynamic-form-reset-button" type="reset" onClick={handleReset}>Reset</button>
        </div>
      </form>
    </div>
  );

  // ---------- MultiSelect Component ----------
  function MultiSelectField({
    field,
    value,
    onChange,
    wrapperClassName,
  }: {
    field: FieldNode;
    value: string[];
    onChange: (id: string, value: any) => void;
    wrapperClassName?: string;
  }) {
    const [search, setSearch] = useState("");
    const options = field.props?.data || [];
    const selected = value || [];

    const filtered = field.props?.searchable
      ? options.filter((o: any) =>
        o.label.toLowerCase().includes(search.toLowerCase())
      )
      : options;

    const toggle = (optValue: string) => {
      const newVals = selected.includes(optValue)
        ? selected.filter((v) => v !== optValue)
        : [...selected, optValue];
      onChange(field.id, newVals);
    };

    return (
      <div className={`multiselect-wrapper ${wrapperClassName || ""}`}>
        {field.props?.searchable && (
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        )}
        <div className="options-list">
          {filtered.map((opt: any, i: number) => (
            <div
              key={i}
              className={`option-item ${selected.includes(opt.value) ? "selected" : ""}`}
              onClick={() => toggle(opt.value)}
            >
              {opt.label}
            </div>
          ))}
        </div>
        {selected.length > 0 && (
          <div className="selected-tags">
            {selected.map((val, i) => {
              const item = options.find((o: any) => o.value === val);
              return (
                <span key={i} className="tag">
                  {item?.label || val}
                  <button onClick={() => remove(val)} type="button">
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>
    )
  }
};

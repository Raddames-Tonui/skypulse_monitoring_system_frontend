import React, { useEffect, useState} from "react";
import type {JSX }  from "react";
import type { DynamicFormProps, FieldNode, LayoutNode } from "./utils/types";
import {isFieldVisible} from "@components/dynamic-form/utils/visibility.ts";
import { validateField } from "./utils/valitation";
import "./css/formstyle.css";


export default function DynamicForm({ schema, onSubmit, initialData, className, fieldClassName, buttonClassName, style, showButtons = true, }: DynamicFormProps) {
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
  const isVisible = (field: FieldNode) =>
      isFieldVisible(field, formValues);

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

  // ---------- Visibility helper for handleChange ----------
  const isVisibleWith = (
      values: Record<string, any>,
      field: FieldNode
  ): boolean => {
    return isFieldVisible(field, values);
  };


  // ---------- Handle Input ----------
  const handleChange = (fieldId: string, value: any) => {
    setFormValues((prev) => {
      const updated = { ...prev, [fieldId]: value };

      Object.values(fields).forEach((f) => {
        if (!isVisibleWith(updated, f)) {
          updated[f.id] = undefined;
        }
      });

      return updated;
    });

    const field = fields[fieldId];
    const error = validateField(field, value, {
      ...formValues,
      [fieldId]: value,
    });

    setErrors((p) => ({ ...p, [fieldId]: error || "" }));
  };

  // ---------- Submission ----------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: Record<string, string> = {};

    Object.values(fields).forEach((f) => {
      if (!isVisible(f)) return;
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


  // ---------- MultiSelect Component ----------
    const MultiSelectField = ({
                                  field,
                                  value,
                                  onChange,
                                  wrapperClassName,
                              }: {
        field: FieldNode;
        value: string[] | string;
        onChange: (id: string, value: any) => void;
        wrapperClassName?: string;
    }) => {
        const [search, setSearch] = useState("");
        const [showAllSelected, setShowAllSelected] = useState(false);

        const options = field.props?.data || [];
        const multiple = field.props?.multiple ?? true;
        const maxVisibleTags = field.props?.maxVisibleTags ?? 3;

        const valueKey = field.props?.valueKey || "value";
        const labelKey = field.props?.labelKey || "label";

        const selectedValues = Array.isArray(value)
            ? value.map((v) => String(v))
            : value
                ? [String(value)]
                : [];

        const filteredOptions = field.props?.searchable
            ? options.filter((opt: any) => {
                const label = typeof opt === "string" ? opt : opt[labelKey];
                return label?.toString().toLowerCase().includes(search.toLowerCase());
            })
            : options;

        const toggleOption = (opt: any) => {
            const optValue = typeof opt === "string" ? opt : opt[valueKey];
            let newVals: string[];
            if (selectedValues.includes(optValue)) {
                newVals = selectedValues.filter((v) => v !== optValue);
            } else {
                newVals = multiple ? [...selectedValues, optValue] : [optValue];
            }
            onChange(field.id, multiple ? newVals : newVals[0]);
        };

        const removeTag = (val: string) => {
            const newVals = selectedValues.filter((v) => v !== val);
            onChange(field.id, multiple ? newVals : newVals[0] ?? "");
        };

        const previewTags = selectedValues.slice(0, maxVisibleTags);
        const hiddenCount = selectedValues.length - previewTags.length;

        return (
            <div className={`multiselect-wrapper ${wrapperClassName || ""}`}>
                {field.props?.searchable && (
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                        disabled={field.disabled}
                    />
                )}

                <div className="options-list" style={{ maxHeight: "200px", overflowY: "auto" }}>
                    {filteredOptions.map((opt: any, i: number) => {
                        const optValue = typeof opt === "string" ? opt : opt[valueKey];
                        const optLabel = typeof opt === "string" ? opt : opt[labelKey];
                        const isSelected = selectedValues.includes(optValue);

                        return (
                            <div
                                key={i}
                                className={`option-item ${isSelected ? "selected" : ""}`}
                                onClick={() => !field.disabled && toggleOption(opt)}
                                style={{ cursor: field.disabled ? "not-allowed" : "pointer" }}
                            >
                                {optLabel}
                            </div>
                        );
                    })}
                </div>

                {selectedValues.length > 0 && (
                    <div className="selected-tags">
                        {previewTags.map((val) => {
                            const item = options.find((o) =>
                                typeof o === "string" ? o === val : o[valueKey] === val
                            );
                            const label = item ? (typeof item === "string" ? item : item[labelKey]) : val;

                            return (
                                <span key={val} className="tag">
                {label}
                                    {!field.disabled && <button type="button" onClick={() => removeTag(val)}>×</button>}
              </span>
                            );
                        })}

                        {hiddenCount > 0 && (
                            <button type="button" className="view-all-btn" onClick={() => setShowAllSelected(true)}>
                                +{hiddenCount} more
                            </button>
                        )}
                    </div>
                )}

                {showAllSelected && (
                    <div className="selected-all-panel">
                        <div className="selected-all-tags" style={{ maxHeight: "200px", overflowY: "auto" }}>
                            {selectedValues.map((val) => {
                                const item = options.find((o) =>
                                    typeof o === "string" ? o === val : o[valueKey] === val
                                );
                                const label = item ? (typeof item === "string" ? item : item[labelKey]) : val;

                                return (
                                    <span key={val} className="tag">
                  {label}
                                        {!field.disabled && <button type="button" onClick={() => removeTag(val)}>×</button>}
                </span>
                                );
                            })}
                        </div>
                        <button type="button" className="back-btn" onClick={() => setShowAllSelected(false)}>
                            Back
                        </button>
                    </div>
                )}
            </div>
        );
    };


    // ---------- Render Field ----------
  const renderField = (field: FieldNode) => {
    const value = formValues[field.id] ?? field.defaultValue ?? "";
    const handleInputChange = (e: React.ChangeEvent<any>) => handleChange(field.id, e.target.value);
    const hasError = !!errors[field.id];
    const errorClass = hasError ? "input-error" : "";

    if (!isVisible(field)) return null;

    switch (field.renderer) {
      case "select":
        return (
          <div className={fieldClassName || ""}>
            <select
              id={field.id}
              value={value}
              onChange={handleInputChange}
              className={errorClass}
              disabled={field.disabled}
            >
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
              disabled={field.disabled}
            />
          </div>
        );

      case "number": {
        const rawValue = formValues[field.id] ?? field.defaultValue;
        const numValue = typeof rawValue === "number" && !isNaN(rawValue) ? rawValue : "";

        return (
          <div className={fieldClassName || ""}>
            <input
              id={field.id}
              type="number"
              value={numValue}
              min={field.props?.min}
              max={field.props?.max}
              step={field.props?.step || 1}
              placeholder={field.placeholder}
              onChange={(e) =>
                handleChange(field.id, isNaN(e.target.valueAsNumber) ? undefined : e.target.valueAsNumber)
              }
              className={errorClass}
              disabled={field.disabled}
            />
          </div>
        );
      }

      case "checkbox":
      case "switch":
        return (
          <label className={`switch ${fieldClassName || ""}`}>
            <input
              type="checkbox"
              id={field.id}
              checked={!!value}
              onChange={(e) => handleChange(field.id, e.target.checked)}
              className={errorClass}
              disabled={field.disabled}
            />
            <span className="slider" />
            {field.label}
          </label>
        );

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
                  disabled={field.disabled}
                />
                {opt.label}
              </label>
            ))}
          </div>
        );

      case "date":
        return (
          <div className={fieldClassName || ""}>
            <input
              type="date"
              id={field.id}
              value={value}
              onChange={handleInputChange}
              className={errorClass}
              disabled={field.disabled}
            />
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
              onChange={(e) => {
                const files = e.target.files ? Array.from(e.target.files) : [];
                handleChange(field.id, field.props?.multiple ? files : files[0]);
              }}
              className={errorClass}
              disabled={field.disabled}
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
              disabled={field.disabled}
            />
          </div>
        );
    }
  };

  // ---------- Layout Renderer ----------
  const renderLayoutNode = (node: LayoutNode, index?: number): JSX.Element | null => {
    // Use node.id if available, otherwise fieldId/title, otherwise fallback to kind + index
    const key = node.id ?? node.fieldId ?? node.title ?? `${node.kind}-${index}`;

    switch (node.kind) {
      case "field": {
        const field = fields[node.fieldId!];
        if (!isVisible(field)) return null;

        return (
            <div key={field.id} className={`form-field ${fieldClassName || ""}`}>
              {field.renderer !== "checkbox" && field.renderer !== "switch" && field.label && (
                  <label
                      htmlFor={field.id}
                      className={field.rules?.required ? "required" : ""}
                  >
                    {field.label}
                  </label>
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
              {node.children?.map(renderLayoutNode)}
            </div>
        );

      case "grid":
        return (
            <div key={key} className={`grid grid-cols-${node.cols || 2} gap-${node.spacing || "md"}`}>
              {node.children?.map(renderLayoutNode)}
            </div>
        );

      case "section":
        return (
            <fieldset key={key} className="form-section">
              {node.title && <h3 className="section-title">{node.title}</h3>}
              {node.children?.map(renderLayoutNode)}
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

      <form id={id} onSubmit={handleSubmit} onReset={handleReset}>
        {layout?.map((node, _) => renderLayoutNode(node))}


        {showButtons && (
          <div className={`form-buttons ${buttonClassName || ""}`}>
            <button className="dynamic-form-submit-button" type="submit">Submit</button>
            <button className="dynamic-form-reset-button" type="reset" onClick={handleReset}>Reset</button>
          </div>
        )}

      </form>
    </div>
  );

};

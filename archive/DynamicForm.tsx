import React, { useMemo, useState } from "react";
import { validateField } from "./utils/valitation";
import "./css/formstyle.css";

/**
 * Types (adapted from what you provided; keep compatible with existing schema)
 */
export interface FieldNode {
  id: string;
  label: string;
  renderer:
    | "text"
    | "select"
    | "textarea"
    | "checkbox"
    | "number"
    | "radio"
    | "file"
    | "date"
    | "switch"
    | "multiselect";
  inputType?: string;
  placeholder?: string;
  rules?: Record<string, any>;
  props?: Record<string, any>;
  defaultValue?: any;
  visibleWhen?: any;
}

export interface LayoutNode {
  // keep backwards-compatible 'kind' (old code) but tolerate 'type' when present
  kind?: string;
  type?: "row" | "column" | "tabs" | "group" | "field";
  id?: string;
  fieldId?: string;
  title?: string;
  colSpan?: number;
  cols?: number;
  spacing?: string;
  withDivider?: boolean;
  tabLabels?: string[];
  children?: LayoutNode[];
  fields?: string[];
  props?: Record<string, any>;
}

export interface FormSchema {
  id: string;
  meta: {
    title?: string;
    subtitle?: string;
  };
  fields: Record<string, FieldNode>;
  layout: LayoutNode[];
}

export interface DynamicFormProps {
  schema: FormSchema;
  onSubmit?: (values: Record<string, any>) => void;
  initialData?: Record<string, any>;

  className?: string; // wrapper
  fieldClassName?: string; // wrapper of each field
  labelClassName?: string; // label styling
  inputClassName?: string; // input/select/textarea styling
  sectionClassName?: string; // section <fieldset>
  gridClassName?: string; // grid container
  stackClassName?: string; // stack container
  buttonClassName?: string; // submit/reset
}

/**
 * DynamicForm component
 */
export default function DynamicForm(props: DynamicFormProps) {
  const {
    schema,
    onSubmit,
    initialData = {},
    className,
    fieldClassName,
    labelClassName,
    inputClassName,
    sectionClassName,
    gridClassName,
    stackClassName,
    buttonClassName,
  } = props;

  const { id: formId, meta = {}, fields = {}, layout = [] } = schema;

  // ---------- Initial Values ----------
  const initialValues = useMemo(() => {
    return Object.fromEntries(
      Object.entries(fields).map(([fid, field]) => {
        const defaultVal = field.defaultValue ?? "";
        const initialVal = initialData?.[fid] ?? defaultVal;

        if (field.renderer === "number") {
          return [fid, typeof initialVal === "number" ? initialVal : ""];
        } else if (field.renderer === "checkbox" || field.renderer === "switch") {
          return [fid, !!initialVal];
        } else if (field.renderer === "multiselect") {
          return [fid, Array.isArray(initialVal) ? initialVal : []];
        } else {
          return [fid, initialVal];
        }
      })
    );
  }, [fields, initialData]);

  const [formValues, setFormValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ---------- Visibility Logic ----------
  const evaluateCondition = (condition: any, values: Record<string, any>) => {
    if (!condition) return true;
    const target = values?.[condition.field];

    switch (condition.op) {
      case "equals":
        return target === condition.value;
      case "notEquals":
        return target !== condition.value;
      case "in":
        return Array.isArray(condition.value) && condition.value.includes(target);
      case "notIn":
        return Array.isArray(condition.value) && !condition.value.includes(target);
      case "exists":
        return target !== undefined && target !== null && target !== "";
      default:
        // fallback: if condition is a function or simple key/value
        if (typeof condition === "function") {
          try {
            return !!condition(values);
          } catch {
            return true;
          }
        }
        if (condition.field && condition.value !== undefined) return target === condition.value;
        return true;
    }
  };

  const isFieldVisible = (field: FieldNode, values = formValues) => {
    const rule = field?.visibleWhen;
    if (!rule) return true;
    if (Array.isArray(rule)) {
      return rule.every((r) => evaluateCondition(r, values));
    }
    return evaluateCondition(rule, values);
  };

  // ---------- Handle Input ----------
  const handleChange = (fieldId: string, value: any) => {
    setFormValues((prev) => {
      const updated = { ...prev, [fieldId]: value };

      // when a change happens, any field that becomes invisible should be cleared/undefined
      Object.values(fields).forEach((f) => {
        if (!isFieldVisible(f, updated)) {
          updated[f.id] = undefined;
        }
      });

      return updated;
    });

    // immediate field validation
    const field = fields[fieldId];
    const mergedValues = { ...formValues, [fieldId]: value };
    const err = validateField(field, value, mergedValues);
    setErrors((prev) => ({ ...prev, [fieldId]: err || "" }));
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
      // sanitize numbers (keep numbers only)
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

  // ---------- Reset ----------
  const handleReset = () => {
    setFormValues(initialValues);
    setErrors({});
  };

  // ---------- Render helpers ----------
  const renderInputWrapper = (field: FieldNode, content: React.ReactNode) => {
    const showLabel = field.renderer !== "checkbox" && field.renderer !== "switch";
    return (
      <div className={`form-field ${fieldClassName || ""}`} key={field.id}>
        {showLabel && (
          <label htmlFor={field.id} className={`form-label ${labelClassName || ""}`}>
            {field.label}
          </label>
        )}
        <div className="form-input-wrapper">{content}</div>
        {errors[field.id] && (
          <p className="error-text">
            {/* small inline icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="error-icon"
              style={{ width: 16, height: 16, marginRight: 6 }}
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
  };

  // ---------- Field Renderer ----------
  const renderField = (field: FieldNode) => {
    const rawVal = formValues[field.id];
    const value =
      field.renderer === "number"
        ? typeof rawVal === "number" && !isNaN(rawVal)
          ? rawVal
          : ""
        : rawVal ?? field.defaultValue ?? (field.renderer === "multiselect" ? [] : "");

    const commonProps = {
      id: field.id,
      placeholder: field.placeholder ?? "",
      className: `form-input ${inputClassName || ""} ${errors[field.id] ? "input-error" : ""}`,
    };

    const handleBasicChange = (e: React.ChangeEvent<any>) => {
      // for non-special inputs
      handleChange(field.id, e.target.value);
    };

    switch (field.renderer) {
      case "select": {
        const opts = field.props?.data ?? [];
        return renderInputWrapper(
          field,
          <select
            {...commonProps}
            value={value}
            onChange={handleBasicChange}
            aria-invalid={!!errors[field.id]}
          >
            <option value="">{field.placeholder || "Select..."}</option>
            {opts.map((opt: any, idx: number) => {
              const val = typeof opt === "object" ? opt.value : opt;
              const label = typeof opt === "object" ? opt.label : opt;
              return (
                <option key={idx} value={val}>
                  {label}
                </option>
              );
            })}
          </select>
        );
      }

      case "multiselect":
        return renderInputWrapper(
          field,
          <MultiSelectField field={field} value={value || []} onChange={handleChange} />
        );

      case "textarea": {
        return renderInputWrapper(
          field,
          <textarea
            {...commonProps}
            rows={field.props?.minRows || 3}
            value={value}
            onChange={handleBasicChange}
          />
        );
      }

      case "number": {
        return renderInputWrapper(
          field,
          <input
            {...commonProps}
            type="number"
            value={value}
            min={field.props?.min}
            max={field.props?.max}
            step={field.props?.step ?? 1}
            onChange={(e) => {
              const num = e.target.valueAsNumber;
              handleChange(field.id, isNaN(num) ? undefined : num);
            }}
          />
        );
      }

      case "radio": {
        const options = field.props?.options ?? [];
        return renderInputWrapper(
          field,
          <div id={field.id}>
            {options.map((opt: any) => (
              <label key={String(opt.value)} style={{ marginRight: 10 }}>
                <input
                  type="radio"
                  name={field.id}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={() => handleChange(field.id, opt.value)}
                  className={errors[field.id] ? "input-error" : ""}
                />
                {opt.label}
              </label>
            ))}
          </div>
        );
      }

      case "checkbox":
        return renderInputWrapper(
          field,
          <label className="checkbox-label">
            <input
              id={field.id}
              type="checkbox"
              checked={!!value}
              onChange={(e) => handleChange(field.id, e.target.checked)}
              className={errors[field.id] ? "input-error" : ""}
            />
            <span style={{ marginLeft: 8 }}>{field.label}</span>
          </label>
        );

      case "switch":
        return renderInputWrapper(
          field,
          <label className="switch">
            <input
              id={field.id}
              type="checkbox"
              checked={!!value}
              onChange={(e) => handleChange(field.id, e.target.checked)}
              className={errors[field.id] ? "input-error" : ""}
            />
            <span className="slider" />
            <span style={{ marginLeft: 8 }}>{field.label}</span>
          </label>
        );

      case "date":
        return renderInputWrapper(
          field,
          <input {...commonProps} type="date" value={value} onChange={handleBasicChange} />
        );

      case "file":
        return renderInputWrapper(
          field,
          <input
            id={field.id}
            type="file"
            accept={field.props?.accept}
            multiple={field.props?.multiple || false}
            onChange={(e) => handleChange(field.id, e.target.files)}
            className={errors[field.id] ? "input-error" : ""}
          />
        );

      default:
        // treat as text
        return renderInputWrapper(
          field,
          <input
            {...commonProps}
            type={field.inputType || "text"}
            value={value}
            onChange={handleBasicChange}
          />
        );
    }
  };

  // ---------- Layout renderer (keeps old 'kind' API) ----------
  // If node.kind is missing but node.type exists, we map it to a kind for compatibility.
  const kindForNode = (node: LayoutNode) => {
    if (node.kind) return node.kind;
    // fallback mapping from new 'type' to older 'kind' semantics:
    switch (node.type) {
      case "row":
        return "stack";
      case "column":
        return "stack";
      case "group":
        return "section";
      case "tabs":
        return "tabs";
      case "field":
        return "field";
      default:
        return "stack";
    }
  };

  const renderLayoutNode = (node: LayoutNode, idx?: number): React.ReactNode => {
    const key = node.fieldId || node.title || `${kindForNode(node)}-${idx ?? Math.random()}`;

    const kind = kindForNode(node);

    switch (kind) {
      case "field": {
        if (!node.fieldId) return null;
        const f = fields[node.fieldId];
        if (!f) return null;
        if (!isFieldVisible(f)) return null;
        return <div key={key}>{renderField(f)}</div>;
      }

      case "stack": {
        return (
          <div key={key} className={`stack ${stackClassName || ""} spacing-${node.spacing || "md"}`}>
            {node.children?.map((c, i) => (
              <React.Fragment key={i}>{renderLayoutNode(c, i)}</React.Fragment>
            ))}
          </div>
        );
      }

      case "grid": {
        const cols = node.cols ?? 2;
        return (
          <div key={key} className={`grid ${gridClassName || ""}`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {node.children?.map((c, i) => (
              <div key={i} className={`grid-item col-span-${c.colSpan ?? 1}`}>
                {renderLayoutNode(c, i)}
              </div>
            ))}
          </div>
        );
      }

      case "section": {
        return (
          <fieldset key={key} className={`form-section ${sectionClassName || ""}`}>
            {node.title && <legend className="section-title">{node.title}</legend>}
            {node.children?.map((c, i) => (
              <React.Fragment key={i}>{renderLayoutNode(c, i)}</React.Fragment>
            ))}
          </fieldset>
        );
      }

      case "tabs": {
        // Lightweight tabs implementation (keeps code self-contained)
        const tabLabels = node.tabLabels ?? node.children?.map((c) => c.title ?? `Tab ${Math.random()}`);
        const [activeIndex, setActiveIndex] = useState(0);
        return (
          <div key={key} className="tabs-wrapper">
            <div className="tabs-heads">
              {tabLabels?.map((t, i) => (
                <button key={i} type="button" className={`tab-btn ${i === activeIndex ? "active" : ""}`} onClick={() => setActiveIndex(i)}>
                  {t}
                </button>
              ))}
            </div>
            <div className="tabs-body">
              {node.children?.map((c, i) => (
                <div key={i} style={{ display: i === activeIndex ? "block" : "none" }}>
                  {renderLayoutNode(c, i)}
                </div>
              ))}
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  // ---------- Render Form ----------
  return (
    <div className={`dynamic-form ${className || ""}`}>
      {meta?.title && <h1 className="form-h1">{meta.title}</h1>}
      {meta?.subtitle && <h2 className="form-h2">{meta.subtitle}</h2>}

      <form id={formId} onSubmit={handleSubmit} onReset={handleReset}>
        {layout?.map((n, i) => (
          <React.Fragment key={i}>{renderLayoutNode(n, i)}</React.Fragment>
        ))}

        <div className="form-buttons">
          <button type="submit" className={`btn ${buttonClassName || ""}`}>
            Submit
          </button>
          <button type="reset" className={`btn ${buttonClassName || ""}`}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

/**
 * MultiSelectField component (keeps behavior from original)
 */
function MultiSelectField({
  field,
  value,
  onChange,
}: {
  field: FieldNode;
  value: string[];
  onChange: (id: string, value: any) => void;
}) {
  const [search, setSearch] = useState("");
  const options = field.props?.data ?? [];
  const selected = Array.isArray(value) ? value : [];

  const filtered = field.props?.searchable
    ? options.filter((o: any) => {
        const text = typeof o === "string" ? o : o?.label ?? o?.value ?? String(o);
        return text.toLowerCase().includes(search.toLowerCase());
      })
    : options;

  const toggle = (opt: any) => {
    const val = typeof opt === "object" ? opt.value ?? opt.label ?? opt : opt;
    const newVals = selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val];
    onChange(field.id, newVals);
  };

  const remove = (opt: any) => {
    const val = opt;
    onChange(field.id, selected.filter((v) => v !== val));
  };

  return (
    <div className="multiselect-wrapper">
      {field.props?.searchable && (
        <input
          type="text"
          placeholder={field.props?.searchPlaceholder ?? "Search..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      )}

      <div className="options-list">
        {filtered.map((opt: any, i: number) => {
          const val = typeof opt === "object" ? opt.value ?? opt.label ?? opt : opt;
          const label = typeof opt === "object" ? opt.label ?? opt.value ?? String(opt) : opt;
          const isSelected = selected.includes(val);
          return (
            <div
              key={i}
              className={`option-item ${isSelected ? "selected" : ""}`}
              onClick={() => toggle(opt)}
              role="button"
            >
              {label}
            </div>
          );
        })}
      </div>

      {selected.length > 0 && (
        <div className="selected-tags">
          {selected.map((item: any, i: number) => (
            <span key={i} className="tag">
              {item}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  remove(item);
                }}
                className="tag-remove"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

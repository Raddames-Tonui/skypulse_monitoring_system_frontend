# DynamicForm Documentation

## Overview

`DynamicForm` is a fully dynamic and customizable React form component that renders fields based on a `FormSchema`. It supports all common field types (`text`, `select`, `textarea`, `checkbox`, `switch`, `radio`, `number`, `date`, `file`, `multiselect`) and integrates easily with initial data and submission logic.

The form also supports:

* Field-level **disabled state**
* Conditional field visibility
* Schema-driven validation
* Per-field and per-renderer **custom styling** via schema props

The design follows a **schema-first, CSS-driven** approach suitable for large applications and internal UI systems.

---

## Props

```ts
interface DynamicFormProps {
  schema: FormSchema;
  onSubmit?: (values: Record<string, any>) => void;
  initialData?: Record<string, any>;
  className?: string;           // Wrapper form container
  fieldClassName?: string;      // Wrapper for each field
  buttonClassName?: string;     // Wrapper for the buttons
  style?: React.CSSProperties;  // Inline styles for the form wrapper
}
```

---

## Field Schema

Each field is defined using a `FieldNode`.

```ts
export interface FieldNode {
  id: string;
  label: string;
  renderer:
    | 'text'
    | 'select'
    | 'textarea'
    | 'checkbox'
    | 'switch'
    | 'number'
    | 'radio'
    | 'file'
    | 'date'
    | 'multiselect';
  inputType?: string;
  placeholder?: string;
  rules?: Record<string, any>;
  props?: {
    className?: string;        // Applied to the input element
    wrapperClass?: string;     // Applied to the field wrapper
    [key: string]: any;
  };
  defaultValue?: any;
  visibleWhen?: any;
  disabled?: boolean;          // Disables the field input
}
```

---

## Example FormSchema

```ts
const systemSettingsFormSchema: FormSchema = {
  id: 'system-settings',
  meta: {
    title: 'System Settings',
    subtitle: 'Manage application settings'
  },
  fields: {
    is_active: {
      id: 'is_active',
      label: 'Active',
      renderer: 'switch',
      defaultValue: true,
      props: {
        wrapperClass: 'switch'
      }
    },
    ssl_check_interval: {
      id: 'ssl_check_interval',
      label: 'SSL Check Interval',
      renderer: 'number',
      props: { min: 60, max: 3600, step: 10 }
    },
    ssl_alert_thresholds: {
      id: 'ssl_alert_thresholds',
      label: 'SSL Alert Thresholds',
      renderer: 'multiselect',
      props: {
        data: ['30', '15', '5'],
        searchable: true
      }
    }
  },
  layout: [
    { kind: 'field', fieldId: 'is_active' },
    { kind: 'field', fieldId: 'ssl_check_interval' },
    { kind: 'field', fieldId: 'ssl_alert_thresholds' }
  ]
};
```

---

## Renderer Behavior Notes

### Checkbox and Switch

Both `checkbox` and `switch` render using:

```html
<input type="checkbox" />
```

The difference is **purely visual** and handled via CSS. This avoids duplicated logic and keeps behavior consistent.

```ts
case 'checkbox':
case 'switch':
```

Use `props.wrapperClass` to style a switch differently from a standard checkbox.

---

## Disabled Fields

Any field can be disabled at schema level:

```ts
email: {
  id: 'email',
  label: 'Primary Email',
  renderer: 'text',
  inputType: 'email',
  disabled: true
}
```

Disabled fields:

* Cannot be edited
* Respect native browser disabled behavior
* Are still included in submission values

---

## Custom Styling (Per Field)

Styling is applied declaratively via `props`.

### Example

```ts
receive_weekly_reports: {
  id: 'receive_weekly_reports',
  label: 'Receive Weekly Reports',
  renderer: 'checkbox',
  defaultValue: true,
  props: {
    className: 'checkbox-accent-primary',
    wrapperClass: 'checkbox-row'
  }
}
```

---

## Using DynamicForm

```tsx
import DynamicForm from './DynamicForm';
import { systemSettingsFormSchema } from './FormSchema';

function App() {
  const initialData = {
    is_active: true,
    ssl_check_interval: 360,
    ssl_alert_thresholds: ['30', '15']
  };

  const handleSubmit = (values: Record<string, any>) => {
    console.log('Form submitted:', values);
  };

  return (
    <DynamicForm
      schema={systemSettingsFormSchema}
      initialData={initialData}
      onSubmit={handleSubmit}
      className="dynamic-form-wrapper"
      fieldClassName="form-field-wrapper"
      buttonClassName="form-buttons-wrapper"
      style={{ maxWidth: '700px', margin: '0 auto' }}
    />
  );
}
```

---

## CSS Styling (Raw CSS)

```css
.dynamic-form-wrapper {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #fafafa;
}

.form-field-wrapper {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.form-field-wrapper label {
  font-weight: 600;
  margin-bottom: 5px;
}

.form-field-wrapper input,
.form-field-wrapper select,
.form-field-wrapper textarea {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.form-field-wrapper .input-error {
  border-color: red;
}

.checkbox-accent-primary {
  accent-color: #2563eb;
}

.switch input[type="checkbox"] {
  appearance: none;
  width: 42px;
  height: 22px;
  background: #ccc;
  border-radius: 999px;
  position: relative;
}

.switch input[type="checkbox"]:checked {
  background: #2563eb;
}

.form-buttons-wrapper {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
```

---

## Notes

* `initialData` updates the form values on load or when the prop changes
* `props.className` styles the input element
* `props.wrapperClass` styles the field wrapper
* `disabled` is respected across all renderers, including `multiselect`
* Validation errors are displayed automatically

This setup provides a clean separation between **schema**, **behavior**, and **presentation**, making the form system scalable and maintainable.

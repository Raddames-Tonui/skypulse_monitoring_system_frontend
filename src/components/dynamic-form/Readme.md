# DynamicForm Documentation

## Overview

`DynamicForm` is a fully dynamic and customizable React form component that renders fields based on a `FormSchema`. It supports all common field types (`text`, `select`, `textarea`, `checkbox`, `switch`, `radio`, `number`, `date`, `file`, `multiselect`) and integrates easily with initial data and submission logic.

The form also supports custom styling through props, allowing you to override CSS classes and inline styles for the form wrapper, fields, buttons, and individual components.

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

## Example FormSchema

```ts
const systemSettingsFormSchema: FormSchema = {
  id: 'system-settings',
  meta: { title: 'System Settings', subtitle: 'Manage application settings' },
  fields: {
    is_active: { id: 'is_active', label: 'Active', renderer: 'switch', defaultValue: true },
    ssl_check_interval: { id: 'ssl_check_interval', label: 'SSL Check Interval', renderer: 'number', props: { min: 60, max: 3600, step: 10 } },
    ssl_alert_thresholds: { id: 'ssl_alert_thresholds', label: 'SSL Alert Thresholds', renderer: 'multiselect', props: { data: ['30','15','5'], searchable: true } },
    // ... add more fields as needed
  },
  layout: [
    { kind: 'field', fieldId: 'is_active' },
    { kind: 'field', fieldId: 'ssl_check_interval' },
    { kind: 'field', fieldId: 'ssl_alert_thresholds' }
  ]
};
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
      style={{ maxWidth: '700px', margin: '0 auto', backgroundColor: '#f9f9f9' }}
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

.form-buttons-wrapper {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.form-buttons-wrapper button {
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
}

.btn-danger {
  background-color: #e53935;
  color: white;
  border: none;
  border-radius: 4px;
}

.btn-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

---

## Notes

* `initialData` updates the form values on load or when the prop changes.
* `fieldClassName` applies to each field wrapper including inputs, textareas, selects, and multiselects.
* `buttonClassName` wraps the Submit/Reset buttons for styling.
* `style` allows inline styles for the form container.
* `MultiSelectField` supports `searchable` prop and displays selected tags with removal buttons.
* Validation errors are displayed automatically with the `input-error` class.

This setup gives full control over appearance using your raw CSS without needing Tailwind.

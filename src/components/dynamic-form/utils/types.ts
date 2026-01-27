export interface FieldNode {
    id: string;
    label: string;
    renderer: "text" | "select" | "textarea" | "checkbox" | "number" | "radio" | "file" | "date" | "switch" | "multiselect";
    inputType?: string;
    placeholder?: string;
    rules?: Record<string, any>;
    props?: Record<string, any>;
    defaultValue?: any;
    visibleWhen?: any;
    disabled?: boolean; 
}


export interface LayoutNode {
  type: 'row' | 'column' | 'tabs' | 'group' | 'field';
  id?: string;
  fieldId?: string;
  title?: string;
  kind?: string;
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
  className?: string;          
  fieldClassName?: string;    
  buttonClassName?: string;     
  style?: React.CSSProperties; 
  showButtons?: boolean;
externalSubmit?: () => void;
}

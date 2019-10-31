/**
 * FormField
 */
export type FormFieldState = {
  touched?: boolean;
  active?: boolean;
};

/**
 * FormRegisteredField
 */
export type FormRegisteredField = {
  type?: string;
  name: string;
  count: number;
};

/**
 * FormFieldsValue
 */
export type FormStateValues = { [key: string]: any };
export type FormStateInitial = { [key: string]: any };
export type FormStateErrors = { [key: string]: any };

/**
 * FormState
 */
export type FormState = {
  active?: string;
  anyTouched?: boolean;
  submitting?: boolean;
  initial?: FormStateInitial;
  values?: FormStateValues;
  errors?: FormStateErrors;
  registeredFields?: {
    [name: string]: FormRegisteredField;
  };
  fields?: {
    [name: string]: FormFieldState;
  };
};

export type FormEvents = {
  fieldChange(field: string, value: any, touch?: boolean): void;
  fieldBlur(field: string, value: any, touch: boolean): void;
  fieldFocus(field: string): void;
  fieldTouch(fields: string[]): void;
  fieldRegister(field: string, type?: string): void;
  fieldUnregister(field: string): void;
};

/**
 * FormContext
 */
export type FormContext = {
  state: FormState;
  events: FormEvents;
  onSubmit(): any;
  setFieldValue(field: string, value: any): any;
  getFieldValue(field: string): any;
};

/**
 * form reducer action interface
 */
export interface AnyAction {
  type: string;
  [key: string]: any;
}

import * as React from "react";
import R from "ramda";

/**
 * interfaces
 */
export interface IFormField {
  touched: boolean;
  active?: boolean;
}

export interface IFormRegisteredField {
  type: string;
  name: string;
  count: number;
}

export interface IFormState {
  formName?: string;
  active?: string;
  anyTouched?: boolean;

  initial?: { [key: string]: any };
  values?: { [key: string]: any };
  errors?: { [key: string]: any };
  registeredFields?: {
    [name: string]: IFormRegisteredField;
  };
  fields?: {
    [name: string]: IFormField;
  };
}

export interface IAnyAction {
  type: string;
  [key: string]: any;
}

type IBehavior = (state: IFormState, action: any) => IFormState;

/**
 * helpers
 */
export const createFormState = (formName: string): IFormState => {
  return { formName, fields: {} };
};

export interface MapDispatch {
  (dispatch: React.Dispatch<IAnyAction>, ac: () => IAnyAction): () => void;
  <T1>(dispatch: React.Dispatch<IAnyAction>, ac: (arg1: T1) => IAnyAction): (arg1: T1) => void;
  <T1, T2>(dispatch: React.Dispatch<IAnyAction>, ac: (arg1: T1, arg2: T2) => IAnyAction): (
    arg1: T1,
    arg2: T2
  ) => void;
  <T1, T2, T3>(
    dispatch: React.Dispatch<IAnyAction>,
    ac: (arg1: T1, arg2: T2, arg3: T3) => IAnyAction
  ): (arg1: T1, arg2: T2, arg3: T3) => void;
}
export const mapDispatch: MapDispatch = (dispatch: any, actionCreater: any) => {
  return (...args: any[]) => dispatch(actionCreater(...args));
};

/**
 * action types
 */
const formPrefix = "@@form/";

export const FORM_FIELD_CHANGE = `${formPrefix}CHANGE`;
export const FORM_FIELD_BLUR = `${formPrefix}BLUR`;
export const FORM_FIELD_FOCUS = `${formPrefix}FOCUS`;
export const FORM_FIELD_REGISTER = `${formPrefix}REGISTER`;
export const FORM_FIELD_UNREGISTER = `${formPrefix}UNREGISTER`;

export const FORM_SUBMIT = `${formPrefix}SUBMIT`;
export const FORM_SUBMIT_FAILED = `${formPrefix}SUBMIT_FAILED`;
export const FORM_SUBMIT_SUCCESSED = `${formPrefix}SUBMIT_SUCCESSED`;
export const FORM_RESET = `${formPrefix}RESET`;

/**
 * actions
 */

export const fieldChange = (field: string, value: any, touch?: boolean) => {
  return {
    type: FORM_FIELD_CHANGE,
    meta: { field, touch },
    payload: value,
  };
};

export const fieldBlur = (field: string, value: any, touch: boolean) => {
  return {
    type: FORM_FIELD_BLUR,
    meta: { field, touch },
    payload: value,
  };
};

export const fieldFocus = (field: string) => {
  return {
    type: FORM_FIELD_FOCUS,
    meta: { field },
  };
};

export const fieldRegister = (field: string, type: string) => {
  return {
    type: FORM_FIELD_REGISTER,
    meta: { field, type },
  };
};

export const fieldUnregister = (field: string) => {
  return {
    type: FORM_FIELD_UNREGISTER,
    meta: { field },
  };
};

export const formSubmit = () => {
  return {
    type: FORM_SUBMIT,
  };
};

export const formSubmitFailed = () => {
  return {
    type: FORM_SUBMIT_FAILED,
  };
};

export const formSubmitSuccessed = () => {
  return {
    type: FORM_SUBMIT_SUCCESSED,
  };
};

export const formReset = () => {
  return {
    type: FORM_RESET,
  };
};

/**
 * reducer
 */
const behaviors: { [type: string]: IBehavior } = {
  [FORM_FIELD_CHANGE]: (
    state,
    { meta: { field, touch }, payload }: ReturnType<typeof fieldChange>
  ) => {
    let result = state;
    const initial = R.path<any>(["initial", field], result);
    if (initial === undefined && payload === "") {
      result = R.dissocPath(["values", field], result);
    } else if (R.type(payload) === "Function") {
      const currValue = R.path<any>(["values", field], result);
      result = R.assocPath(["values", field], payload(currValue, state.values), result);
    } else if (payload !== undefined) {
      result = R.assocPath(["values", field], payload, result);
    }
    if (touch) {
      result = R.assocPath(["fields", field, "touched"], true, result);
      result = R.assocPath(["anyTouched"], true, result);
    }
    return result;
  },
  [FORM_FIELD_BLUR]: (state, { meta: { field, touch }, payload }: ReturnType<typeof fieldBlur>) => {
    let result = state;
    const initial = R.path<any>(["initial", field], result);
    if (initial === undefined && payload === "") {
      result = R.dissocPath(["values", field], result);
    } else if (payload !== undefined) {
      result = R.assocPath(["values", field], payload, result);
    }
    if (field === R.path(["active"], result)) {
      result = R.dissocPath(["active"], result);
    }
    result = R.dissocPath(["fields", field, "active"], result);
    if (touch) {
      result = R.assocPath(["fields", field, "touched"], true, result);
      result = R.assocPath(["anyTouched"], true, result);
    }
    return result;
  },
  [FORM_FIELD_FOCUS]: (state, { meta: { field } }: ReturnType<typeof fieldFocus>) => {
    let result = state;
    const prevActive = R.prop("active", result);
    if (prevActive) {
      result = R.dissocPath(["fields", field, "active"], result);
    }
    result = R.assocPath(["fields", field, "active"], true, result);
    result = R.assocPath(["active"], field, result);
    return result;
  },
  [FORM_FIELD_REGISTER]: (state, { meta: { field, type } }: ReturnType<typeof fieldRegister>) => {
    let result = state;
    let regField = R.path<IFormRegisteredField>(["registeredFields", field], result);
    if (regField) {
      const count = regField.count + 1;
      regField = R.assocPath(["registeredFields", field, "count"], count, regField);
    } else {
      regField = { name: field, type, count: 1 };
    }
    result = R.assocPath(["registeredFields", field], regField, result);
    return result;
  },
  [FORM_FIELD_UNREGISTER]: (state, { meta: { field } }: ReturnType<typeof fieldUnregister>) => {
    let result = state;
    let regField = R.path<IFormRegisteredField>(["registeredFields", field], result);
    if (!regField) {
      return result;
    }
    const count = R.prop("count", regField) - 1;
    if (count < 1) {
      result = R.dissocPath(["registeredFields", field], result);
      const registeredFields = R.prop("registeredFields", result);
      if (R.equals(registeredFields, {})) {
        result = R.dissoc("registeredFields", result);
      }
      let errors = R.prop("errors", result);
      if (errors) {
        errors = R.dissoc(field, errors);
        if (R.equals(errors, {})) {
          result = R.dissoc("errors", result);
        } else {
          result = R.assoc("errors", errors, result);
        }
      }
    } else {
      regField = R.assoc("count", count, regField);
      result = R.assocPath(["registeredFields", field], regField, result);
    }

    return result;
  },
  [FORM_SUBMIT]: (state, action: ReturnType<typeof formSubmit>) => {
    return state;
  },
  [FORM_SUBMIT_FAILED]: (state, action: ReturnType<typeof formSubmitFailed>) => {
    return state;
  },
  [FORM_SUBMIT_SUCCESSED]: (state, action: ReturnType<typeof formSubmitSuccessed>) => {
    return state;
  },
  [FORM_RESET]: (state, action: ReturnType<typeof formReset>) => {
    return state;
  },
};

export const formReducer = (state: IFormState, action: IAnyAction) => {
  const behavior = behaviors[action.type];
  return behavior ? behavior(state, action) : state;
};

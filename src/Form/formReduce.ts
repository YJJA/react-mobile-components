import * as R from 'ramda';

import {
  FormState,
  FormRegisteredField,
  AnyAction,
  FormStateValues
} from './types';
import {
  FORM_FIELD_CHANGE,
  FORM_FIELD_BLUR,
  FORM_FIELD_FOCUS,
  FORM_FIELD_TOUCH,
  FORM_FIELD_REGISTER,
  FORM_FIELD_UNREGISTER,
  FORM_INITIAL,
  FORM_SUBMIT_START,
  FORM_SUBMIT_FAILED,
  FORM_SUBMIT_SUCCESSED,
  FORM_RESET,
  FORM_ERRORS
} from './formActionType';
import {
  fieldChange,
  fieldBlur,
  fieldFocus,
  fieldTouch,
  fieldRegister,
  fieldUnregister,
  formInitial,
  formSubmitStart,
  formSubmitFailed,
  formSubmitSuccessed,
  formErrors
} from './formActions';

type Behavior = (state: FormState, action: any) => FormState;

const behaviors: { [type: string]: Behavior } = {
  [FORM_FIELD_CHANGE]: (
    state,
    { meta: { field, touch }, payload }: ReturnType<typeof fieldChange>
  ) => {
    let result = state;
    const initial = R.path<any>(['initial', field], result);
    if (initial === undefined && payload === '') {
      result = R.dissocPath(['values', field], result);
    } else if (R.type(payload) === 'Function') {
      const currValue = R.path<any>(['values', field], result);
      result = R.assocPath(
        ['values', field],
        payload(currValue, state.values),
        result
      );
    } else if (payload !== undefined) {
      result = R.assocPath(['values', field], payload, result);
    }
    if (touch) {
      result = R.assocPath(['fields', field, 'touched'], true, result);
      result = R.assocPath(['anyTouched'], true, result);
    }

    return result;
  },
  [FORM_FIELD_BLUR]: (
    state,
    { meta: { field, touch }, payload }: ReturnType<typeof fieldBlur>
  ) => {
    let result = state;
    const initial = R.path<any>(['initial', field], result);
    if (initial === undefined && payload === '') {
      result = R.dissocPath(['values', field], result);
    } else if (payload !== undefined) {
      result = R.assocPath(['values', field], payload, result);
    }
    if (field === R.path(['active'], result)) {
      result = R.dissocPath(['active'], result);
    }
    result = R.dissocPath(['fields', field, 'active'], result);

    if (touch) {
      result = R.assocPath(['fields', field, 'touched'], true, result);
      result = R.assocPath(['anyTouched'], true, result);
    }
    return result;
  },
  [FORM_FIELD_FOCUS]: (
    state,
    { meta: { field } }: ReturnType<typeof fieldFocus>
  ) => {
    let result = state;
    const prevActive = R.path<any>(['active'], result);
    if (prevActive) {
      result = R.dissocPath(['fields', field, 'active'], result);
    }
    result = R.assocPath(['fields', field, 'active'], true, result);
    result = R.assocPath(['active'], field, result);
    return result;
  },
  [FORM_FIELD_TOUCH]: (
    state,
    { meta: { fields } }: ReturnType<typeof fieldTouch>
  ) => {
    let result = state;
    fields.map(field => {
      result = R.assocPath(['fields', field, 'touched'], true, result);
    });
    return result;
  },

  [FORM_FIELD_REGISTER]: (
    state,
    { meta: { field, type } }: ReturnType<typeof fieldRegister>
  ) => {
    let result = state;
    let regField = R.path<FormRegisteredField>(
      ['registeredFields', field],
      result
    );

    if (regField) {
      const count = regField.count + 1;
      regField = R.assocPath(
        ['registeredFields', field, 'count'],
        count,
        regField
      );
    } else {
      regField = { name: field, type, count: 1 };
    }

    result = R.assocPath(['registeredFields', field], regField, result);
    let initialValue = R.path<any>(['initial', field], result);
    if (typeof initialValue !== 'undefined') {
      result = R.assocPath(['values', field], initialValue, result);
    }

    return result;
  },
  [FORM_FIELD_UNREGISTER]: (
    state,
    { meta: { field } }: ReturnType<typeof fieldUnregister>
  ) => {
    let result = state;
    let regField = R.path<FormRegisteredField>(
      ['registeredFields', field],
      result
    );
    if (!regField) {
      return result;
    }
    const count = R.prop('count', regField) - 1;
    if (count < 1) {
      result = R.dissocPath(['registeredFields', field], result);
      const registeredFields = R.path<any>(['registeredFields'], result);
      if (R.equals(registeredFields, {})) {
        result = R.dissoc('registeredFields', result);
      }
      let errors = R.path<any>(['errors'], result);
      if (errors) {
        errors = R.dissoc(field, errors);
        if (R.equals(errors, {})) {
          result = R.dissocPath(['errors'], result);
        } else {
          result = R.assocPath(['errors'], errors, result);
        }
      }
    } else {
      regField = R.assoc('count', count, regField);
      result = R.assocPath(['registeredFields', field], regField, result);
    }

    return result;
  },

  [FORM_INITIAL]: (
    state,
    { payload: { initial } }: ReturnType<typeof formInitial>
  ) => {
    let result = state;

    if (R.equals(result.initial, initial)) {
      return result;
    }

    result = R.assocPath(['initial'], initial, result);
    let values: FormStateValues = {};
    const registeredFields = R.path<{ [key: string]: FormRegisteredField }>(
      ['registeredFields'],
      result
    );
    if (registeredFields) {
      values = Object.keys(registeredFields).reduce<any>((result, key) => {
        if (typeof initial[key] !== 'undefined') {
          result[key] = initial[key];
        }
        return result;
      }, {});
    }

    result = R.assocPath(['values'], values, result);
    return result;
  },

  [FORM_SUBMIT_START]: (state, {  }: ReturnType<typeof formSubmitStart>) => {
    let result = state;
    result = R.assocPath(['submitting'], true, result);
    return result;
  },
  [FORM_SUBMIT_FAILED]: (state, {  }: ReturnType<typeof formSubmitFailed>) => {
    let result = state;
    result = R.assocPath(['submitting'], false, result);
    return result;
  },
  [FORM_SUBMIT_SUCCESSED]: (
    state,
    {  }: ReturnType<typeof formSubmitSuccessed>
  ) => {
    let result = state;
    result = R.assocPath(['submitting'], false, result);
    return result;
  },

  [FORM_RESET]: state => {
    return state;
  },
  [FORM_ERRORS]: (state, { payload }: ReturnType<typeof formErrors>) => {
    let result = state;
    if (R.equals(payload, {})) {
      result = R.dissocPath(['errors'], result);
    } else {
      result = R.assocPath(['errors'], payload, result);
    }
    return result;
  }
};

/**
 * form reducer
 */
export function formReducer(
  state: FormState = { values: {} },
  action: AnyAction
) {
  const behavior = behaviors[action.type];
  const result = behavior ? behavior(state, action) : state;
  return result;
}

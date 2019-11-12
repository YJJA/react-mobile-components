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

import { setIn, getIn, rmvIn } from '../utils/plain';
import { isEqual, isFunction } from '../utils/types';

type Behavior = (state: FormState, action: any) => FormState;

const behaviors: { [type: string]: Behavior } = {
  [FORM_FIELD_CHANGE]: (
    state,
    { meta: { field, touch }, payload }: ReturnType<typeof fieldChange>
  ) => {
    let result = state;
    const initial = getIn<any>(['initial', field], result);
    if (initial === undefined && payload === '') {
      result = rmvIn(['values', field], result);
    } else if (isFunction(payload)) {
      const currValue = getIn<any>(['values', field], result);
      result = setIn(
        ['values', field],
        payload(currValue, state.values),
        result
      );
    } else if (payload !== undefined) {
      result = setIn(['values', field], payload, result);
    }
    if (touch) {
      result = setIn(['fields', field, 'touched'], true, result);
      result = setIn(['anyTouched'], true, result);
    }

    return result;
  },
  [FORM_FIELD_BLUR]: (
    state,
    { meta: { field, touch }, payload }: ReturnType<typeof fieldBlur>
  ) => {
    let result = state;
    const initial = getIn<any>(['initial', field], result);
    if (initial === undefined && payload === '') {
      result = rmvIn(['values', field], result);
    } else if (payload !== undefined) {
      result = setIn(['values', field], payload, result);
    }
    if (field === getIn(['active'], result)) {
      result = rmvIn(['active'], result);
    }
    result = rmvIn(['fields', field, 'active'], result);

    if (touch) {
      result = setIn(['fields', field, 'touched'], true, result);
      result = setIn(['anyTouched'], true, result);
    }
    return result;
  },
  [FORM_FIELD_FOCUS]: (
    state,
    { meta: { field } }: ReturnType<typeof fieldFocus>
  ) => {
    let result = state;
    const prevActive = getIn<any>(['active'], result);
    if (prevActive) {
      result = rmvIn(['fields', field, 'active'], result);
    }
    result = setIn(['fields', field, 'active'], true, result);
    result = setIn(['active'], field, result);
    return result;
  },
  [FORM_FIELD_TOUCH]: (
    state,
    { meta: { fields } }: ReturnType<typeof fieldTouch>
  ) => {
    let result = state;
    fields.map(field => {
      result = setIn(['fields', field, 'touched'], true, result);
    });
    return result;
  },

  [FORM_FIELD_REGISTER]: (
    state,
    { meta: { field, type } }: ReturnType<typeof fieldRegister>
  ) => {
    let result = state;
    let regField = getIn<FormRegisteredField>(
      ['registeredFields', field],
      result
    );

    if (regField) {
      const count = regField.count + 1;
      regField = setIn(['registeredFields', field, 'count'], count, regField);
    } else {
      regField = { name: field, type, count: 1 };
    }

    result = setIn(['registeredFields', field], regField, result);
    let initialValue = getIn<any>(['initial', field], result);
    if (typeof initialValue !== 'undefined') {
      result = setIn(['values', field], initialValue, result);
    }

    return result;
  },
  [FORM_FIELD_UNREGISTER]: (
    state,
    { meta: { field } }: ReturnType<typeof fieldUnregister>
  ) => {
    let result = state;
    let regField = getIn<FormRegisteredField>(
      ['registeredFields', field],
      result
    );
    if (!regField) {
      return result;
    }
    const count = getIn(['count'], regField) - 1;
    if (count < 1) {
      result = rmvIn(['registeredFields', field], result);
      const registeredFields = getIn<any>(['registeredFields'], result);
      if (isEqual(registeredFields, {})) {
        result = rmvIn(['registeredFields'], result);
      }
      let errors = getIn<any>(['errors'], result);
      if (errors) {
        errors = rmvIn([field], errors);
        if (isEqual(errors, {})) {
          result = rmvIn(['errors'], result);
        } else {
          result = setIn(['errors'], errors, result);
        }
      }
    } else {
      regField = setIn(['count'], count, regField);
      result = setIn(['registeredFields', field], regField, result);
    }

    return result;
  },

  [FORM_INITIAL]: (
    state,
    { payload: { initial } }: ReturnType<typeof formInitial>
  ) => {
    let result = state;

    if (isEqual(result.initial, initial)) {
      return result;
    }

    result = setIn(['initial'], initial, result);
    let values: FormStateValues = {};
    const registeredFields = getIn<{ [key: string]: FormRegisteredField }>(
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

    result = setIn(['values'], values, result);
    return result;
  },

  [FORM_SUBMIT_START]: (state, {  }: ReturnType<typeof formSubmitStart>) => {
    let result = state;
    result = setIn(['submitting'], true, result);
    return result;
  },
  [FORM_SUBMIT_FAILED]: (state, {  }: ReturnType<typeof formSubmitFailed>) => {
    let result = state;
    result = setIn(['submitting'], false, result);
    return result;
  },
  [FORM_SUBMIT_SUCCESSED]: (
    state,
    {  }: ReturnType<typeof formSubmitSuccessed>
  ) => {
    let result = state;
    result = setIn(['submitting'], false, result);
    return result;
  },

  [FORM_RESET]: state => {
    return state;
  },
  [FORM_ERRORS]: (state, { payload }: ReturnType<typeof formErrors>) => {
    let result = state;
    if (isEqual(payload, {})) {
      result = rmvIn(['errors'], result);
    } else {
      result = setIn(['errors'], payload, result);
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

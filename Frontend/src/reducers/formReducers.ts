const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type FieldState = {
  value: string;
  isValid: boolean;
};

export type FieldAction =
  | { type: 'USER_INPUT'; val: string }
  | { type: 'INPUT_BLUR' };

export const emailReducer = (state: FieldState, action: FieldAction): FieldState => {
  if (action.type === 'USER_INPUT') {
    return { value: action.val, isValid: EMAIL_REGEX.test(action.val) };
  }
  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.includes('@') };
  }
  return { value: '', isValid: false };
};

export const passwordReducer = (state: FieldState, action: FieldAction): FieldState => {
  if (action.type === 'USER_INPUT') {
    return { value: action.val, isValid: action.val.trim().length > 6 };
  }
  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }
  return { value: '', isValid: false };
};

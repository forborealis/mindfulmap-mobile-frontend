const initialState = {
  user: null,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'SIGN_OUT':
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
}
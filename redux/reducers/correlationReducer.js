const initialState = {
    correlationResults: [],
    loading: false,
    error: null,
  };
  
  export default function correlationReducer(state = initialState, action) {
    switch (action.type) {
      case 'FETCH_CORRELATION_REQUEST':
        return {
          ...state,
          loading: true,
          error: null,
        };
  
      case 'FETCH_CORRELATION_SUCCESS':
        return {
          ...state,
          loading: false,
          correlationResults: action.payload,
        };
  
      case 'FETCH_CORRELATION_FAILURE':
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
  
      default:
        return state;
    }
  }
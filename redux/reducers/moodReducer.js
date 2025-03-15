const initialState = {
  mood: null,
  selectedDate: new Date(), 
  activities: {
    activities: [],
    social: [],
    health: [],
    sleepQuality: '',
  },
  loading: false,
  error: null,
  savedLogs: [],
  moodLogs: [], // Ensure moodLogs is initialized as an empty array
};

export default function moodReducer(state = initialState, action) {
  switch (action.type) {
    case 'SELECT_MOOD':
      return { ...state, mood: action.payload };

    case 'SELECT_DATE':
      return { ...state, selectedDate: action.payload };
      
    case 'TOGGLE_ACTIVITY':
      const { category, activity } = action.payload;
      return {
        ...state,
        activities: {
          ...state.activities,
          [category]: state.activities[category].includes(activity)
            ? state.activities[category].filter((item) => item !== activity)
            : [...state.activities[category], activity],
        },
      };

    case 'SAVE_MOODLOG_REQUEST':
      return { ...state, loading: true, error: null };

    case 'SAVE_MOODLOG_SUCCESS':
      return {
        ...initialState,
        loading: false,
        savedLogs: [...state.savedLogs, action.payload],
      };

    case 'SAVE_MOODLOG_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case 'FETCH_MOODLOGS_REQUEST':
      return { ...state, loading: true, error: null };

    case 'FETCH_MOODLOGS_SUCCESS':
      if (JSON.stringify(state.moodLogs) === JSON.stringify(action.payload)) {
        return state;
      }
      return {
        ...state,
        loading: false,
        moodLogs: action.payload,
      };

    case 'FETCH_MOODLOGS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
}
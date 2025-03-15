import { API_URL } from '@env';

export const selectMood = (mood) => ({
  type: 'SELECT_MOOD',
  payload: mood,
});

export const selectDate = (date) => ({
  type: 'SELECT_DATE',
  payload: date,
});

export const toggleActivity = (category, activity) => ({
  type: 'TOGGLE_ACTIVITY',
  payload: { category, activity },
});

export const fetchMoodLogs = (userId) => async (dispatch) => {
  dispatch({ type: 'FETCH_MOODLOGS_REQUEST' });
  try {
    const response = await fetch(`${API_URL}/moodlogs?user=${userId}`);
    const data = await response.json();
    console.log('Fetched mood logs:', data); // Add logging
    dispatch({ type: 'FETCH_MOODLOGS_SUCCESS', payload: data });
  } catch (error) {
    console.error('Error fetching mood logs:', error); // Add logging
    dispatch({ type: 'FETCH_MOODLOGS_FAILURE', payload: error.message });
  }
};

export const saveMoodLog = (moodLog) => async (dispatch) => {
  dispatch({ type: 'SAVE_MOODLOG_REQUEST' });
  try {
    const response = await fetch(`${API_URL}/moodlogs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(moodLog),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to save mood log');
    }

    const data = await response.json();
    dispatch({ type: 'SAVE_MOODLOG_SUCCESS', payload: data });
    return data;
  } catch (error) {
    dispatch({ type: 'SAVE_MOODLOG_FAILURE', payload: error.message });
    throw error;
  }
};
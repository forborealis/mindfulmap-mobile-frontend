import { API_URL } from '@env';

export const fetchCorrelation = (userId) => async (dispatch) => {
  dispatch({ type: 'FETCH_CORRELATION_REQUEST' });
  try {
    const response = await fetch(`${API_URL}/correlation?user=${userId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log('Fetched Correlation Data:', data); // Log the fetched data
    dispatch({ type: 'FETCH_CORRELATION_SUCCESS', payload: data });
  } catch (error) {
    console.error('Error fetching correlation data:', error); // Log any errors
    dispatch({ type: 'FETCH_CORRELATION_FAILURE', payload: error.message });
  }
};
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import authReducer from './reducers/authReducer'; 
import moodReducer from './reducers/moodReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  moodLog: moodReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));
export default store;
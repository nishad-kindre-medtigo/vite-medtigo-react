import { combineReducers } from 'redux';
import accountReducer from './accountReducer';
import getAllInstitutes from './institutesReducers'

const rootReducer = combineReducers({
  account: accountReducer,
  institutes: getAllInstitutes
});

export default rootReducer;

import { combineReducers } from 'redux';
import { entities } from 'redux-entity';
import counter from './counter';
import user from './user';

export default combineReducers({
  entities,
  counter,
  user
});

import { combineReducers } from 'redux';
import { entities } from 'redux-entity';
import counter from './counter';
import authentication from './authentication';

export default combineReducers({
  entities,
  counter,
  authentication
});

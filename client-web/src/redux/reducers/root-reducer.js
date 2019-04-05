import { combineReducers } from 'redux';
import { entities } from 'redux-entity';
import counter from './counter';
import authentication from './authentication';
import { authConstants } from 'Redux/_constants';
import { INITIAL_STATE } from 'Common/app-const';

const rootReducer = combineReducers({
  entities,
  counter,
  authentication
});

export default (state, action) => {
  if (action.type === authConstants.LOGOUT) {
    state = INITIAL_STATE;
  }

  return rootReducer(state, action)
}

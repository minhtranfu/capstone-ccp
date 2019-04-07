import { combineReducers } from 'redux';
import { entities } from 'redux-entity';
import counter from './counter';
import authentication from './authentication';
import materialCart from './material-cart.reducer';
import { authActionTypes } from 'Redux/_types';
import { INITIAL_STATE } from 'Common/app-const';

const rootReducer = combineReducers({
  entities,
  counter,
  authentication,
  materialCart
});

export default (state, action) => {
  if (action.type === authActionTypes.LOGOUT) {
    state = INITIAL_STATE;
  }

  return rootReducer(state, action)
}

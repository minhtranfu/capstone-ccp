import * as Actions from "../types";

const Initial_State = {
  loading: false,
  userIsLoggin: false
};

export default function authReducer(state = Initial_State, action) {
  const { type, payload } = action;
  switch (type) {
    case Actions.LOGIN_SUCCESS: {
      return {
        ...state,
        userIsLoggin: payload
      };
    }
    case Actions.LOGOUT_SUCCESS: {
      return {
        ...state,
        userIsLoggin: payload
      };
    }
    default:
      return state;
  }
}

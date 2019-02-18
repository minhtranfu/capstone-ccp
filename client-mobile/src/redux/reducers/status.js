import * as ACTIONS from "../types";

const initialState = { status: "loading", message: "...", loading: false };

export default function statusReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case ACTIONS.STATUS_LOADING:
      return {
        message: payload.message,
        type: "loading",
        loading: true
      };
    case ACTIONS.STATUS_SUCCESS:
      return {
        message: payload.message,
        type: "success",
        loading: false
      };
    case ACTIONS.STATUS_FAIL:
      return {
        message: payload.message,
        type: "error",
        loading: false
      };
    default:
      return state;
  }
}

import * as ACTIONS from "../types";

const initialState = { status: "loading", message: "...", loading: false };

export default function statusReducer(state = initialState, action) {
  switch (action.type) {
    case ACTIONS.STATUS_LOADING:
      return {
        message: action.payload.message,
        type: "loading",
        loading: true
      };
    case ACTIONS.STATUS_SUCCESS:
      return {
        message: action.payload.message,
        type: "success",
        loading: true
      };
    case ACTIONS.STATUS_FAIL:
      return {
        message: action.payload.message,
        type: "error",
        loading: false
      };
    default:
      return state;
  }
}

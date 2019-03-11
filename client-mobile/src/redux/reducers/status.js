import * as ACTIONS from "../types";

const initialState = {
  type: "loading",
  message: "...",
  status: "",
  time: null
};

export default function statusReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case ACTIONS.STATUS_LOADING:
      return {
        ...state,
        message: payload.message
      };
    case ACTIONS.STATUS_SUCCESS:
      return {
        ...state,
        message: payload.message,
        type: "success",
        time: payload.time
      };
    case ACTIONS.STATUS_ERROR:
      return {
        message: payload.message,
        type: "error",
        time: payload.time,
        status: payload.status
      };
    default:
      return state;
  }
}

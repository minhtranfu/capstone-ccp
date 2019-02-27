import * as ACTIONS from "../types";

const initialState = {
  type: "loading",
  message: "...",
  loading: false,
  time: null
};

export default function statusReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case ACTIONS.STATUS_LOADING:
      return {
        ...state,
        message: payload.message,
        loading: true
      };
    case ACTIONS.STATUS_SUCCESS:
      return {
        message: payload.message,
        type: "success",
        loading: false,
        time: payload.time
      };
    case ACTIONS.STATUS_ERROR:
      console.log("payload", payload);
      return {
        ...state,
        message: payload.message,
        type: "error",
        time: payload.time
      };
    default:
      return state;
  }
}

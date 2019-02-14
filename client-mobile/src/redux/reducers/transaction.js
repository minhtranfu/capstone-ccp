import * as ACTIONS from "../types";

const initialState = { status: "" };

export default function transactionReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (action.type) {
    case ACTIONS.SEND_TRANSACTION_REQUEST_SUCCESS:
      return {
        status: payload
      };
    case ACTIONS.APPROVE_TRANSACTION_SUCCESS:
      return {
        status: payload
      };
    case ACTIONS.DENY_TRANSACTION_SUCCESS:
      return {
        status: payload
      };
    case ACTIONS.CANCEL_TRANSACTION_SUCCESS:
      return {
        status: payload
      };
    default:
      return state;
  }
}

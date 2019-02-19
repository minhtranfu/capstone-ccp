import * as ACTIONS from "../types";

const initialState = {
  status: null,
  transactionStatus: {},
  transactionDetail: {},
  listSupplierTransaction: []
};

export default function transactionReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (action.type) {
    case ACTIONS.LIST_SUPPLIER_TRANSACTION_SUCCESS: {
      return {
        ...state,
        listSupplierTransaction: payload
      };
    }
    case ACTIONS.GET_TRANSACTION_DETAIL_SUCCESS: {
      return {
        ...state,
        transactionDetail: payload,
        transactionStatus: payload
      };
    }
    case ACTIONS.SEND_TRANSACTION_REQUEST_SUCCESS:
      return {
        ...state,
        transactionStatus: payload,
        listSupplierTransaction: [...state.listSupplierTransaction, payload]
      };
    case ACTIONS.APPROVE_TRANSACTION_SUCCESS:
      return {
        ...state,
        transactionStatus: payload
      };
    case ACTIONS.DENY_TRANSACTION_SUCCESS:
      return {
        ...state,
        transactionStatus: payload
      };
    case ACTIONS.CANCEL_TRANSACTION_SUCCESS:
      return {
        ...state,
        transactionStatus: payload
      };
    case ACTIONS.CLEAR_TRANSACTION_DETAIL:
      return {
        ...state,
        transactionDetail: {}
      };
    case ACTIONS.CLEAR_SUPPLIER_TRANSACTION_SUCCESS:
      return {
        ...state,
        listSupplierTransaction: []
      };
    default:
      return state;
  }
}

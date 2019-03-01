import * as Actions from "../types";

const initialState = {
  loading: false,
  listSupplierTransaction: [],
  listRequesterTransaction: []
};

export default function transactionReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (action.type) {
    case Actions.LIST_SUPPLIER_TRANSACTION.REQUEST: {
      return { ...state, loading: true };
    }
    case Actions.LIST_SUPPLIER_TRANSACTION.SUCCESS: {
      return {
        ...state,
        loading: false,
        listSupplierTransaction: payload.data
      };
    }
    case Actions.LIST_REQUESTER_TRANSACTION.REQUEST: {
      return {
        ...state,
        loading: true
      };
    }
    case Actions.LIST_REQUESTER_TRANSACTION.SUCCESS: {
      return {
        ...state,
        loading: false,
        listRequesterTransaction: payload.data
      };
    }
    case Actions.SEND_TRANSACTION_REQUEST.SUCCESS:
      return {
        ...state,
        // transactionStatus: payload,
        listSupplierTransaction: [
          ...state.listSupplierTransaction,
          payload.data
        ]
      };
    case Actions.REQUEST_TRANSACTION.REQUEST: {
      return {
        ...state,
        loading: true
      };
    }
    case Actions.REQUEST_TRANSACTION.SUCCESS: {
      return {
        ...state,
        loading: false,
        listSupplierTransaction: state.listSupplierTransaction.map(item =>
          item.id === payload.id ? (item = payload.data.data) : item
        )
      };
    }
    case Actions.REQUEST_TRANSACTION.ERROR: {
      return {
        ...state,
        loading: true,
        error: payload.message
      };
    }
    case Actions.CANCEL_TRANSACTION_SUCCESS:
      return {
        ...state,
        listSupplierTransaction: state.listSupplierTransaction.map(item =>
          item.id === payload.id ? (item = payload.data.data) : item
        )
      };
    case Actions.CLEAR_SUPPLIER_TRANSACTION_SUCCESS:
      return {
        ...state,
        listSupplierTransaction: []
      };
    default:
      return state;
  }
}

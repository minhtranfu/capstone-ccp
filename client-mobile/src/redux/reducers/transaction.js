import * as Actions from "../types";

const initialState = {
  loading: false,
  adjustLoading: false,
  listSupplierTransaction: [],
  listRequesterTransaction: [],
  adjustTransaction: [],
  error: ""
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
    case Actions.LIST_SUPPLIER_TRANSACTION.REQUEST: {
      return { ...state, loading: false };
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
    case Actions.LIST_REQUESTER_TRANSACTION.ERROR: {
      return { ...state, loading: false };
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
        loading: false
      };
    }
    case Actions.CANCEL_TRANSACTION.SUCCESS:
      return {
        ...state,
        listRequesterTransaction: state.listRequesterTransaction.filter(
          item => item.id !== payload.id
        )
      };
    case Actions.GET_ADJUST_TRANSACTION.REQUEST:
      return {
        ...state,
        adjustLoading: true
      };
    case Actions.GET_ADJUST_TRANSACTION.SUCCESS:
      return {
        ...state,
        adjustLoading: false,
        adjustTransaction: payload.data
      };
    case Actions.SEND_ADJUST_TRANSACTION.REQUEST:
      return {
        ...state,
        adjustLoading: true
      };
    case Actions.SEND_ADJUST_TRANSACTION.SUCCESS:
      return {
        ...state,
        adjustLoading: false,
        adjustTransaction: payload.data
      };
    case Actions.REQUEST_ADJUST_TRANSACTION.REQUEST:
      return {
        ...state,
        adjustLoading: true
      };
    case Actions.REQUEST_ADJUST_TRANSACTION.SUCCESS:
      return {
        ...state,
        adjustLoading: false,
        adjustTransaction: payload.data
      };
    case Actions.DELETE_ADJUST_TRANSACTION.REQUEST:
      return {
        ...state,
        adjustLoading: true
      };
    case Actions.DELETE_ADJUST_TRANSACTION.SUCCESS:
      return {
        ...state,
        adjustLoading: false,
        adjustTransaction: state.adjustTransaction.filter(
          item => item.id !== payload.id
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

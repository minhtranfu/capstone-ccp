import * as Actions from "../types";

const initialState = {
  loading: false,
  adjustLoading: false,
  listSupplierTransaction: [],
  listRequesterTransaction: [],
  listSupplierMaterial: [],
  listRequesterMaterial: [],
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
    //Requester send transaction to supplier
    case Actions.SEND_TRANSACTION_REQUEST.SUCCESS:
      return {
        ...state,
        // transactionStatus: payload,
        listSupplierTransaction: [
          ...state.listSupplierTransaction,
          payload.data
        ],
        listRequesterTransaction: [
          ...state.listRequesterTransaction,
          payload.data
        ]
      };
    case Actions.UPDATE_TRANSACTION_EQUIPMENT_STATUS.REQUEST: {
      return {
        ...state,
        loading: true
      };
    }
    //Requester receive equipment
    case Actions.UPDATE_TRANSACTION_EQUIPMENT_STATUS.SUCCESS: {
      return {
        ...state,
        loading: false,
        listRequesterTransaction: state.listRequesterTransaction.map(item =>
          item.id === payload.transactionId
            ? (item.equipment.status = payload.data.data.status)
            : item
        )
      };
    }
    case Actions.REQUEST_TRANSACTION.REQUEST: {
      return {
        ...state,
        loading: true
      };
    }

    //Contractor send request to supplier
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

    case Actions.LIST_SUPPLIER_MATERIAL_TRANSACTION.REQUEST:
      return {
        ...state
      };
    case Actions.LIST_SUPPLIER_MATERIAL_TRANSACTION.SUCCESS:
      return {
        ...state,
        listSupplierMaterial: payload.data
      };
    case Actions.LIST_SUPPLIER_MATERIAL_TRANSACTION.ERROR:
      return {
        ...state
      };

    case Actions.LIST_REQUESTER_MATERIAL_TRANSACTION.REQUEST:
      return {
        ...state
      };
    case Actions.LIST_REQUESTER_MATERIAL_TRANSACTION.SUCCESS:
      return {
        ...state,
        listRequesterMaterial: payload.data
      };
    case Actions.LIST_REQUESTER_MATERIAL_TRANSACTION.ERROR:
      return {
        ...state
      };

    case Actions.SEND_MATERIAL_TRANSACTION_REQUEST.REQUEST:
      return {
        ...state
      };
    //Contractor send request to supplier
    case Actions.SEND_MATERIAL_TRANSACTION_REQUEST.SUCCESS:
      return {
        ...state,
        listSupplierMaterial: [...state.listSupplierMaterial, payload.data]
      };
    //Supplier response to request
    case Actions.CHANGE_MATERIAL_TRANSACTION_REQUEST.REQUEST:
      return {
        ...state
      };
    case Actions.CHANGE_MATERIAL_TRANSACTION_REQUEST.SUCCESS:
      return {
        ...state,
        listSupplierMaterial: state.listSupplierMaterial.map(item =>
          item.id === payload.id ? (item = payload.data.data) : item
        )
      };
    default:
      return state;
  }
}

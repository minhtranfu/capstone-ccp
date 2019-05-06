import * as Actions from "../types";

const initialState = {
  loading: false,
  adjustLoading: false,
  debrisLoading: false,
  // feedbackLoading: {},
  feedbackLoading: false,
  listSupplierTransaction: [],
  listRequesterTransaction: [],
  listSupplierMaterial: [],
  listRequesterMaterial: [],
  listSupplierDebris: [],
  listRequesterDebris: [],
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
        listSupplierTransaction: payload.data.items
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
        listRequesterTransaction: payload.data.items
      };
    }
    case Actions.LIST_REQUESTER_TRANSACTION.ERROR: {
      return { ...state, loading: false };
    }

    // If list requester or list supplier not available
    // So when user click go detai
    case Actions.GET_TRANSACTION_DETAIL.SUCCESS: {
      return {
        ...state,
        listRequesterTransaction: [payload.data],
        listSupplierTransaction: [payload.data]
      };
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
            ? {
                ...item,
                status: payload.data.data.processingHiringTransaction.status,
                equipment: {
                  ...item.equipment,
                  status: payload.data.data.status
                }
              }
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
        adjustTransaction: payload.data.items
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
    case Actions.REQUEST_ADJUST_TRANSACTION.ERROR:
      return {
        ...state,
        adjustLoading: false
      };
    case Actions.RESPONSE_ADJUST_TRANSACTION.REQUEST:
      return {
        ...state,
        adjustLoading: true
      };
    case Actions.RESPONSE_ADJUST_TRANSACTION.SUCCESS:
      return {
        ...state,
        adjustLoading: false,
        adjustTransaction: state.adjustTransaction.map(item =>
          item.id == payload.id
            ? { ...item, status: payload.data.data.status }
            : item
        )
      };
    case Actions.RESPONSE_ADJUST_TRANSACTION.ERROR:
      return {
        ...state,
        adjustLoading: false
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
        listSupplierMaterial: payload.data.items
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
        listRequesterMaterial: payload.data.items
      };
    case Actions.LIST_REQUESTER_MATERIAL_TRANSACTION.ERROR:
      return {
        ...state
      };

    case Actions.SEND_MATERIAL_TRANSACTION_REQUEST.REQUEST:
      return {
        ...state
      };
    //New material request will be added to requester transaction list
    case Actions.SEND_MATERIAL_TRANSACTION_REQUEST.SUCCESS:
      return {
        ...state,
        listRequesterMaterial: [...state.listRequesterMaterial, payload.data]
      };
    //Supplier response to request
    case Actions.CHANGE_MATERIAL_TRANSACTION_REQUEST.REQUEST:
      return {
        ...state
      };
    case Actions.CHANGE_MATERIAL_TRANSACTION_REQUEST.SUCCESS:
      if (payload.role === "Requester") {
        return {
          ...state,
          listRequesterMaterial: state.listRequesterMaterial.map(item =>
            item.id === payload.id ? (item = payload.data.data) : item
          )
        };
      } else {
        return {
          ...state,
          listSupplierMaterial: state.listSupplierMaterial.map(item =>
            item.id === payload.id ? (item = payload.data.data) : item
          )
        };
      }

    //DEBRIS
    case Actions.GET_DEBRIS_TRANSACTION_BY_SUPPLIER.REQUEST:
      return {
        ...state,
        debrisLoading: true
      };
    case Actions.GET_DEBRIS_TRANSACTION_BY_SUPPLIER.SUCCESS:
      return {
        ...state,
        debrisLoading: false,
        listSupplierDebris: payload.data.items
      };
    case Actions.GET_DEBRIS_TRANSACTION_BY_SUPPLIER.ERROR:
      return {
        ...state,
        debrisLoading: false
      };
    case Actions.GET_DEBRIS_TRANSACTION_BY_REQUESTER.SUCCESS:
      return {
        ...state,
        listRequesterDebris: payload.data.items
      };
    //New request will add to requester screen
    case Actions.SEND_REQUEST_DEBRIS_TRANSACTION.SUCCESS:
      return {
        ...state,
        listRequesterDebris: [...state.listRequesterDebris, payload.data]
      };
    //Requester change status of debris transaction
    case Actions.UPDATE_DEBRIS_TRANSACTION_STATUS.SUCCESS:
      return {
        ...state,
        listRequesterDebris: state.listRequesterDebris.map(item =>
          item.id === payload.id ? (item = payload.data.data) : item
        ),
        listSupplierDebris: state.listSupplierDebris.map(item =>
          item.id === payload.id ? (item = payload.data.data) : item
        )
      };
    case Actions.SEND_EQUIPMENT_FEEDBACK.REQUEST: {
      return {
        ...state,
        feedbackLoading: true
        // feedbackLoading: { [payload.id]: true }
        // listRequesterTransaction: state.listRequesterTransaction.map(item =>
        //   item.id === payload.id ? { ...item, feedbacked: true } : item
        // )
      };
    }
    case Actions.SEND_EQUIPMENT_FEEDBACK.SUCCESS: {
      const { hiringTransaction } = payload.data;
      return {
        ...state,
        listRequesterTransaction: state.listRequesterTransaction.map(item =>
          item.id === hiringTransaction.id
            ? { ...item, feedbacked: hiringTransaction.feedbacked }
            : item
        ),
        // feedbackLoading: { [hiringTransaction.id]: false }
        feedbackLoading: false
      };
    }
    case Actions.SEND_EQUIPMENT_FEEDBACK.ERROR: {
      return {
        ...state,
        feedbackLoading: false
      };
    }

    //SEND debris feedback
    case Actions.SEND_DEBRIS_FEEDBACK.REQUEST: {
      return {
        ...state,
        feedbackLoading: true
      };
    }
    case Actions.SEND_DEBRIS_FEEDBACK.SUCCESS: {
      return {
        ...state,
        listRequesterDebris: state.listRequesterDebris.map(item =>
          item.id === hiringTransaction.id
            ? { ...item, feedbacked: hiringTransaction.feedbacked }
            : item
        ),
        feedbackLoading: false
      };
    }
    case Actions.SEND_DEBRIS_FEEDBACK.ERROR: {
      return {
        ...state,
        feedbackLoading: false
      };
    }

    case Actions.SEND_MATERIAL_FEEDBACK.REQUEST: {
      return {
        ...state,
        feedbackLoading: true
      };
    }
    case Actions.SEND_MATERIAL_FEEDBACK.SUCCESS: {
      return {
        ...state,
        listRequesterMaterial: state.listRequesterMaterial.map(item =>
          item.id === payload.transactionId
            ? {
                ...item,
                materialTransactionDetails: item.materialTransactionDetails.map(
                  item =>
                    item.id === payload.materialId
                      ? { ...item, feedbacked: true }
                      : item
                )
              }
            : item
        ),
        feedbackLoading: false
      };
    }
    case Actions.SEND_MATERIAL_FEEDBACK.ERROR: {
      return {
        ...state,
        feedbackLoading: false
      };
    }
    default:
      return state;
  }
}

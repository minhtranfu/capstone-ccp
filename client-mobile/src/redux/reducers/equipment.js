import * as Actions from "../types";

const INITIAL_STATE = {
  loading: false,
  searchLoading: false,
  imageLoading: false,
  feedbackLoading: false,
  listSearch: [],
  contractorEquipment: [],
  imageList: []
};

export default function equipmentReducer(state = INITIAL_STATE, action) {
  const { type, payload } = action;
  switch (type) {
    case Actions.LIST_CONTRACTOR_EQUIPMENT.REQUEST: {
      return {
        ...state,
        loading: true
      };
    }
    case Actions.LIST_CONTRACTOR_EQUIPMENT.SUCCESS: {
      return {
        ...state,
        loading: false,
        contractorEquipment: payload.data.items
      };
    }
    case Actions.LIST_CONTRACTOR_EQUIPMENT.ERROR: {
      return {
        ...state,
        loading: false
      };
    }
    case Actions.ADD_EQUIPMENT.REQUEST: {
      return {
        ...state,
        loading: true
      };
    }
    case Actions.ADD_EQUIPMENT.SUCCESS: {
      return {
        ...state,
        loading: false,
        contractorEquipment: [...state.contractorEquipment, payload.data]
      };
    }
    case Actions.ADD_EQUIPMENT.ERROR: {
      return {
        ...state,
        loading: false
      };
    }
    case Actions.UPDATE_EQUIPMENT.REQUEST: {
      return {
        ...state,
        loading: true
      };
    }
    case Actions.UPDATE_EQUIPMENT.SUCCESS: {
      return {
        ...state,
        loading: false,
        contractorEquipment: state.contractorEquipment.map(item =>
          item.id === payload.id ? (item = payload.data.data) : item
        )
      };
    }
    case Actions.UPDATE_EQUIPMENT_STATUS.REQUEST: {
      return {
        ...state,
        loading: true
      };
    }
    case Actions.UPDATE_EQUIPMENT_STATUS.SUCCESS: {
      return {
        ...state,
        loaing: false,
        contractorEquipment: state.contractorEquipment.map(item =>
          item.id === payload.id ? (item = payload.data.data) : item
        )
      };
    }
    case Actions.REMOVE_EQUIPMENT.SUCCESS:
      return {
        ...state
      };
    case Actions.SEARCH_EQUIPMENT.REQUEST: {
      return {
        ...state,
        searchLoading: true
      };
    }
    case Actions.SEARCH_EQUIPMENT.SUCCESS:
      if (action.offset <= 0) {
        return {
          ...state,
          searchLoading: false,
          listSearch: payload.data
        };
      } else {
        return {
          ...state,
          searchLoading: false,
          listSearch: state.listSearch.concat(payload.data)
        };
      }
    // return {
    //   ...state,
    //   searchLoading: false,
    //   listSearch: payload.data
    // };
    case Actions.SEARCH_EQUIPMENT.ERROR:
      return {
        ...state,
        searchLoading: false
      };
    case Actions.CLEAR_SEARCH_RESULT.SUCCESS:
      return {
        ...state,
        listSearch: []
      };
    case Actions.SEND_EQUIPMENT_FEEDBACK.REQUEST: {
      return {
        ...state,
        feedbackLoading: true
      };
    }
    case Actions.SEND_EQUIPMENT_FEEDBACK.SUCCESS: {
      return {
        ...state,
        feedbackLoading: false
      };
    }
    case Actions.SEND_EQUIPMENT_FEEDBACK.ERROR: {
      return {
        ...state,
        feedbackLoading: false
      };
    }

    case Actions.GET_EQUIPMENT_IMAGES_LIST.REQUEST: {
      return {
        ...state,
        imageLoading: true
      };
    }
    case Actions.GET_EQUIPMENT_IMAGES_LIST.SUCCESS: {
      return {
        ...state,
        imageLoading: false,
        imageList: payload.data
      };
    }
    case Actions.GET_EQUIPMENT_IMAGES_LIST.ERROR: {
      return {
        ...state,
        imageLoading: false
      };
    }
    case Actions.INSERT_NEW_EQUIPMENT_IMAGE.REQUEST: {
      return {
        ...state
        // imageLoading: true
      };
    }
    case Actions.INSERT_NEW_EQUIPMENT_IMAGE.SUCCESS: {
      return {
        ...state,
        //imageLoading: false,
        imageList: payload.data.equipmentImages
      };
    }
    case Actions.INSERT_NEW_EQUIPMENT_IMAGE.ERROR: {
      return {
        ...state,
        imageLoading: false
      };
    }
    case Actions.DELETE_EQUIPMENT_IMAGE.REQUEST: {
      return {
        ...state,
        imageLoading: true
      };
    }
    case Actions.DELETE_EQUIPMENT_IMAGE.SUCCESS: {
      return {
        ...state,
        imageLoading: false,
        imageList: state.imageList.filter(item => item.id !== payload.id)
      };
    }
    case Actions.DELETE_EQUIPMENT_IMAGE.ERROR: {
      return {
        ...state,
        imageLoading: false
      };
    }
    case Actions.RESET_EQUIPMENT_IMAGE: {
      return {
        ...state,
        imageList: []
      };
    }
    default:
      return state;
  }
}

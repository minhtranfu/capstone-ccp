import * as Actions from "../types";

const INITIAL_STATE = {
  loading: false,
  readNoti: false,
  listNotification: [],
  token: {},
  allowPushNotification: false
};

export default function notificationReducer(state = INITIAL_STATE, action) {
  const { type, payload } = action;
  switch (type) {
    case Actions.ALLOW_PUSH_NOTIFICATION.SUCCESS: {
      return {
        ...state,
        allowPushNotification: payload
      };
    }
    case Actions.INSERT_NOTIFICATION_TOKEN.SUCCESS: {
      return {
        ...state
      };
    }
    case Actions.GET_ALL_NOTIFICATION.REQUEST: {
      return {
        ...state,
        loading: true
      };
    }
    case Actions.GET_ALL_NOTIFICATION.SUCCESS: {
      if (action.offset <= 0) {
        return {
          ...state,
          loading: false,
          listNotification: payload.data
        };
      } else {
        return {
          ...state,
          loading: false,
          listNotification: state.listNotification.concat(payload.data)
        };
      }
    }
    case Actions.READ_NOTIFICATION.REQUEST: {
      return {
        ...state,
        loading: true
      };
    }
    case Actions.READ_NOTIFICATION.SUCCESS: {
      return {
        ...state,
        readNoti: true,
        loading: false,
        listNotification: state.listNotification.map(item =>
          item.id === payload.id ? (item = payload.data.data) : item
        )
      };
    }
    case Actions.DELETE_NOTIFICATION_MESSAGE.SUCCESS: {
      return {
        ...state
      };
    }
    case Actions.DELETE_NOTIFICATION_TOKEN.SUCCESS: {
      return {
        ...state
      };
    }
    case Actions.READ_ALL_NOTIFICATION.REQUEST: {
      return {
        ...state,
        loading: true
      };
    }
    case Actions.READ_ALL_NOTIFICATION.SUCCESS: {
      return {
        ...state,
        loading: false
      };
    }
    case Actions.READ_ALL_NOTIFICATION.ERROR: {
      return {
        ...state,
        loading: false
      };
    }
    default:
      return state;
  }
}

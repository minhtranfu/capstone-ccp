import * as Actions from "../types";

const INITIAL_STATE = {
  loading: false,
  listSubscription: []
};

export default function subscriptionReducer(state = INITIAL_STATE, action) {
  const { type, payload } = action;
  switch (type) {
    case Actions.ADD_SUBSCRIPTIONS.REQUEST: {
      return {
        ...state,
        loading: true
      };
    }
    case Actions.ADD_SUBSCRIPTIONS.SUCCESS: {
      return {
        ...state,
        listSubscription: [...state.listSubscription, payload.data],
        loading: false
      };
    }
    case Actions.ADD_SUBSCRIPTIONS.ERROR: {
      return {
        ...state,
        loading: false
      };
    }
    case Actions.GET_SUBSCRIPTIONS.REQUEST: {
      return {
        ...state,
        loading: true
      };
    }
    case Actions.GET_SUBSCRIPTIONS.SUCCESS: {
      return {
        ...state,
        loading: false,
        listSubscription: payload
      };
    }
    case Actions.GET_SUBSCRIPTIONS.ERROR: {
      return {
        ...state,
        loading: false,
        listSubscription: []
      };
    }

    case Actions.DELETE_SUBSCRIPTION.SUCCESS: {
      return {
        ...state,
        listSubscription: state.listSubscription.filter(
          sub => sub.id !== payload
        )
      };
    }

    default:
      return state;
  }
}

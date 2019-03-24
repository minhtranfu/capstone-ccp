import { GET_SUBSCRIPTIONS, DELETE_SUBSCRIPTION } from '../types'

const INITIAL_STATE = {
  loading: false,
  listSubscription: []
}

export default function subscriptionReducer(state = INITIAL_STATE, action) {
  const { type, payload } = action
  switch (type) {
    case GET_SUBSCRIPTIONS.REQUEST: {
      return {
        ...state,
        loading: true
      }
    }
    case GET_SUBSCRIPTIONS.SUCCESS: {
      return {
        ...state,
        loading: false,
        listSubscription: payload
      }
    }
    case GET_SUBSCRIPTIONS.ERROR: {
      return {
        ...state,
        loading: false,
        listSubscription: []
      }
    }

    case DELETE_SUBSCRIPTION.SUCCESS: {
      return {
        ...state,
        listSubscription: state.listSubscription.filter(
          sub => sub.id !== payload
        )
      }
    }

    default:
      return state
  }
}

import axios from 'axios'
import { GET_SUBSCRIPTIONS, DELETE_SUBSCRIPTION } from '../types'

export function addSubscription(info) {
  return axios.post('subscriptions', info)
}

export function getSubscriptions() {
  return async dispatch => {
    try {
      dispatch({ type: GET_SUBSCRIPTIONS.REQUEST })
      const res = await axios.get('subscriptions')
      dispatch({
        type: GET_SUBSCRIPTIONS.SUCCESS,
        payload: res.data
      })
    } catch (err) {
      dispatch({
        type: GET_SUBSCRIPTIONS.ERROR
      })
    }
  }
}

export function deleteSubscription(id) {
  return async dispatch => {
    try {
      const res = await axios.delete(`subscriptions/${id}`)
      console.log('ahihi res', res)
      dispatch({
        type: DELETE_SUBSCRIPTION.SUCCESS,
        payload: id
      })
    } catch (err) {
      console.log('err ne', err)
      dispatch({
        type: DELETE_SUBSCRIPTION.ERROR
      })
    }
  }
}

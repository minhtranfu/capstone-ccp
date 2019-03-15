import axios from "axios";
import StatusAction from "./status";
import * as Actions from "../types";

export function register(contractor) {
  return async dispatch => {
    const res = await axios.post(`contractors`, contractor);

    dispatch({
      type: Actions.CONTRACTOR_REGISTER_SUCCESS
    });
  };
}

export function getContractorDetail(contractorId) {
  return async dispatch => {
    dispatch({
      type: Actions.GET_CONTRACTOR.REQUEST
    });
    try {
      const res = await axios.get(`contractors/${contractorId}`);
      dispatch({
        type: Actions.GET_CONTRACTOR.SUCCESS,
        payload: res
      });
    } catch (error) {
      dispatch({ type: Actions.GET_CONTRACTOR.ERROR });
    }
  };
}

export function updateContractorDetail(contractorId, contractor) {
  return async dispatch => {
    const res = await axios.put(`contractors/${contractorId}`, contractor);
    dispatch({
      type: Actions.UPDATE_CONTRACTOR_DETAIL.SUCCESS,
      payload: res
    });
  };
}

export function getConstructionList(contractorId) {
  return async dispatch => {
    const res = await axios.get(`contractors/${contractorId}/constructions`);
    dispatch({
      type: Actions.GET_CONSTRUCTION_LIST.SUCCESS,
      payload: res
    });
  };
}

export function createConstruction(contractorId, construction) {
  return async dispatch => {
    const res = await axios.post(
      `contractors/${contractorId}/constructions`,
      construction
    );
    dispatch({
      type: Actions.CREATE_CONSTRUCTION.SUCCESS,
      payload: res
    });
  };
}

export function updateConstruction(contractorId, constructionId, construction) {
  return async dispatch => {
    const res = await axios.put(
      `contractors/${contractorId}/constructions/${constructionId}`,
      construction
    );

    dispatch({
      type: Actions.UPDATE_CONSTRUCTION.SUCCESS,
      payload: { data: res, id: constructionId }
    });
  };
}

export function deleteConstruction(contractorId, constructionId) {
  return async dispatch => {
    const res = await axios.delete(
      `contractors/${contractorId}/constructions/${constructionId}`
    );
    dispatch({
      type: Actions.DELETE_CONSTRUCTION.SUCCESS,
      payload: { data: res, id: constructionId }
    });
  };
}

export function getListFeedback(id) {
  return async dispatch => {
    const res = await axios.get(`feedbacks/${id}`);
    dispatch({
      type: Actions.GET_LIST_FEEDBACK.SUCCESS,
      payload: res
    });
  };
}

export function listFeedbackTypes() {
  return async dispatch => {
    dispatch({
      type: Actions.LIST_FEEDBACK_TYPES.REQUEST
    });
    const res = await axios.get(`feedbackTypes`);
    dispatch({
      type: Actions.LIST_FEEDBACK_TYPES.SUCCESS,
      payload: res
    });
  };
}

export function createNewFeedback(feedback) {
  return async dispatch => {
    const res = await axios.post(`feedbacks`, feedback);
    dispatch({
      type: Actions.CREATE_NEW_FEEDBACK.SUCCESS,
      payload: res
    });
  };
}

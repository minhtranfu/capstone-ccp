import * as Actions from "../types";
import axios from "axios";

const INITIAL_STATE = {
  loading: false,
  debrisTypes: [],
  debrisArticles: [],
  debrisBids: [],
  listSearch: [],
  typeServices: []
};

export default function debrisReducer(state = INITIAL_STATE, action) {
  const { type, payload } = action;
  switch (type) {
    case Actions.GET_DEBRIS_SERVICES_TYPES.REQUEST: {
      return {
        ...state,
        loading: true
      };
    }
    case Actions.GET_DEBRIS_SERVICES_TYPES.SUCCESS: {
      return {
        ...state,
        loading: false,
        debrisTypes: payload.data
      };
    }
    case Actions.GET_DEBRIS_ARTICLE_BY_REQUESTER.SUCCESS: {
      return {
        ...state,
        debrisArticles: payload.data
      };
    }
    case Actions.POST_DEBRIS_ARTICLE.SUCCESS: {
      return {
        ...state,
        debrisArticles: [...state.debrisArticles, payload.data]
      };
    }
    case Actions.EDIT_DEBRIS_ARTICLE.SUCCESS: {
      return {
        ...state,
        debrisArticles: state.debrisArticles.map(item =>
          item.id === payload.id ? (item = payload.data.data) : item
        )
      };
    }
    case Actions.GET_DEBRIS_BIDS_BY_SUPPLIER.SUCCESS: {
      return {
        ...state,
        debrisBids: payload.data
      };
    }
    case Actions.SEND_DEBRIS_BIDS.SUCCESS: {
      return {
        ...state,
        debrisBids: [...state.debrisBids, payload.data]
        // listDebris: state.listDebris.map(item =>
        //   item.id === payload.data.data.debrisPost.id
        //     ? item.debrisBids.push(payload.data.data.id)
        //     : item
        // )
      };
    }
    case Actions.EDIT_DEBRIS_BIDS.SUCCESS: {
      return {
        ...state,
        debrisBids: state.debrisBids.map(item =>
          item.id === payload.id ? (item = payload.data.data) : item
        )
        // listDebris: state.listDebris.map(item =>
        //   item.id === payload.data.data.debrisPost.id
        //     ? item.debrisBids.map(item=> item.id === payload.data.data.id?item=payload.data:item)
        //     : item
        // )
      };
    }
    case Actions.DELETE_DEBRIS_BID.SUCCESS: {
      return {
        ...state,
        debrisBids: state.debrisBids.filter(item => item.id !== payload.id)
        // listDebris: state.listDebris.map(item =>
        //   item.id === payload.data.data.debrisProps.id
        //     ? item.debrisBid.filter(item => item.id !== payload.data.data.id)
        //     : item
        // )
      };
    }
    case Actions.SEARCH_DEBRIS.REQUEST: {
      return {
        ...state,
        loading: true
      };
    }
    case Actions.SEARCH_DEBRIS.SUCCESS: {
      return {
        ...state,
        loading: false,
        listSearch: payload.data
      };
    }
    case Actions.ADD_TYPE_SERVICES.SUCCESS: {
      return {
        ...state,
        typeServices: payload
      };
    }
    case Actions.REMOVE_TYPE_SERVICES.SUCCESS:
      return {
        ...state,
        typeServices: state.typeServices.filter(x => x.id !== payload)
      };
    case Actions.CLEAR_TYPE_SERVICES.SUCCESS:
      return {
        ...state,
        typeServices: []
      };
    default:
      return state;
  }
}

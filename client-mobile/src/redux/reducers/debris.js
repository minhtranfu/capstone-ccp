import * as Actions from "../types";
import axios from "axios";

const INITIAL_STATE = {
  loading: false,
  detailLoading: false,
  debrisTypes: [],
  debrisArticles: [],
  debrisBids: [],
  listSearch: [],
  typeServices: [],
  debrisDetail: {}
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
    case Actions.GET_DEBRIS_DETAIL_BY_SUPPLIER.REQUEST: {
      return {
        ...state,
        detailLoading: true
      };
    }
    case Actions.GET_DEBRIS_DETAIL_BY_SUPPLIER.SUCCESS: {
      return {
        ...state,
        detailLoading: false,
        debrisDetail: payload.data
      };
    }
    case Actions.CLEAR_DEBRIS_DETAIL.SUCCESS: {
      return {
        ...state,
        debrisDetail: {}
      };
    }
    case Actions.SEND_DEBRIS_BIDS.SUCCESS: {
      return {
        ...state,
        debrisBids: [...state.debrisBids, payload.data],
        listSearch: state.listSearch.map(item =>
          item.id === payload.data.debrisPost.id
            ? { ...item, debrisBid: item.debrisBids.push(payload.data) }
            : item
        )
      };
    }
    case Actions.EDIT_DEBRIS_BIDS.SUCCESS: {
      return {
        ...state,
        debrisBids: state.debrisBids.map(item =>
          item.id === payload.id ? (item = payload.data.data) : item
        ),
        listSearch: state.listSearch.map(item =>
          item.id === payload.data.data.debrisPost.id
            ? {
                ...item,
                debrisBids: item.debrisBids.map(bid =>
                  bid.id === payload.data.data.id
                    ? Object.assign(
                        {},
                        bid,
                        { price: payload.data.data.price },
                        { description: payload.data.data.description }
                      )
                    : bid
                )
              }
            : item
        )
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

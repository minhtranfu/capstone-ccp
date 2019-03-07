function renderActions(name) {
  return {
    SUCCESS: `${name}_SUCCESS`,
    ERROR: `${name}_ERROR`,
    REQUEST: `${name}_REQUEST`
  };
}

//LOGIN
export const LOGIN_REQUEST = "@@auth/LOGIN_REQUEST";
export const LOGIN_SUCCESS = "@@auth/LOGIN_SUCCESS";
export const LOGIN_FAIL = "@@auth/LOGIN_FAIL";

export const LOGOUT_SUCCESS = "@@auth/LOGOUT_SUCCESS";

//TYPE
export const GET_GENERAL_EQUIPMENT_TYPE = renderActions(
  "@@type/GET_GENERAL_EQUIPMENT_TYPE"
);

//EQUIPMENT
export const LIST_CONTRACTOR_EQUIPMENT = renderActions(
  "@@equip/LIST_CONTRACTOR_EQUIPMENT"
);
export const UPDATE_EQUIPMENT = renderActions("@@equip/UPDATE_EQUIPMENT");
export const ADD_EQUIPMENT = renderActions("@@equip/ADD_EQUIPMENT");
export const REMOVE_EQUIPMENT = renderActions("@@equip/REMOVE_EQUIPMENT");
export const EQUIPMENT_LIST = renderActions("@@equip/EQUIPMENT_LIST");
export const UPDATE_EQUIPMENT_STATUS = renderActions(
  "@@equip/UPDATE_EQUIPMENT_STATUS"
);
export const CLEAR_SEARCH_RESULT = renderActions("@@equip/CLEAR_SEARCH_RESULT");

//TRANSACTION
export const LIST_SUPPLIER_TRANSACTION = renderActions(
  "@@equip/LIST_SUPPLIER_TRANSACTION"
);
export const LIST_REQUESTER_TRANSACTION = renderActions(
  "@@transaction/LIST_REQUESTER_TRANSACTION"
);
export const SEND_TRANSACTION_REQUEST = renderActions(
  "@@transaction/SEND_REQUEST"
);
export const REQUEST_TRANSACTION = renderActions(
  "@@transaction/REQUEST_TRANSACTION"
);
export const ADJUST_TRANSACTION = renderActions(
  "@@transaction/ADJUST_TRANSACTION"
);
export const CANCEL_TRANSACTION = renderActions(
  "@@transaction/CANCEL_TRANSACTION"
);
export const CLEAR_SUPPLIER_TRANSACTION_SUCCESS =
  "@@equip/CLEAR_SUPPLIER_TRANSACTION_SUCCESS";

//SEARCH EQUIPMENT
export const SEARCH_EQUIPMENT = renderActions("@@equip/SEARCH_EQUIPMENT");
export const SEARCH_FILTER_EQUIPMENT = renderActions(
  "@@equip/SEARCH_FILTER_EQUIPMENT"
);

//CART
export const GET_LIST_CART = renderActions("@@cart/GET_LIST_CART");
export const ADD_ITEM_CART = renderActions("@@cart/ADD_ITEM_CART");
export const UPDATE_ITEM_CART = renderActions("@@cart/UPDATE_ITEM_CART");
export const REMOVE_ITEM_CART = renderActions("@@cart/REMOVE_ITEM_CART");
export const REMOVE_ALL_ITEM = renderActions("@@cart/REMOVE_ALL_ITEM");
export const CART_CHECK_OUT = renderActions("@@cart/CART_CHECK_OUT");

// STATUS
export const STATUS_LOADING = "@@status/LOADING";
export const STATUS_SUCCESS = "@@status/SUCCESS";
export const STATUS_ERROR = "@@status/ERROR";

//CONTRACTOR
export const GET_CONTRACTOR = renderActions("@@contractor/GET_CONTRACTOR");
export const CONTRACTOR_REGISTER = renderActions(
  "@@contractor/CONTRACTOR_REGISTER"
);
export const UPDATE_CONTRACTOR_DETAIL = renderActions(
  "@@contractor/UPDATE_CONTRACTOR_DETAIL"
);

export const GET_CONSTRUCTION_LIST = renderActions(
  "@@contractor/GET_CONSTRUCTION_LIST"
);
export const CREATE_CONSTRUCTION = renderActions(
  "@@contractor/CREATE_CONSTRUCTION"
);
export const UPDATE_CONSTRUCTION = renderActions(
  "@@contractor/UPDATE_CONSTRUCTION"
);
export const DELETE_CONSTRUCTION = renderActions(
  "@@contractor/DELETE_CONSTRUCTION"
);

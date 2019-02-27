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
  "@transaction/REQUEST_TRANSACTION"
);

export const CANCEL_TRANSACTION = renderActions(
  "@@transaction/CANCEL_TRANSACTION"
);
export const CLEAR_SUPPLIER_TRANSACTION_SUCCESS =
  "@@equip/CLEAR_SUPPLIER_TRANSACTION_SUCCESS";

//SEARCH EQUIPMENT
export const SEARCH_EQUIPMENT = renderActions("@@equip/SEARCH_EQUIPMENT");

//CART
export const ADD_NEW_CART = "@@cart/ADD_NEW_CART";
export const UPDATE_CART = "@@cart/UPDATE_CART";
export const REMOVE_ITEM_CART = "@@cart/REMOVE_ITEM_CART";
export const REMOVE_CART = "@@cart/REMOVE_CART";

// STATUS
export const STATUS_LOADING = "@@status/LOADING";
export const STATUS_SUCCESS = "@@status/SUCCESS";
export const STATUS_ERROR = "@@status/ERROR";

//CONTRACTOR
export const GET_CONTRACTOR_SUCCESS = "@@contractor/GET_CONTRACTOR_SUCCESS";
export const CONTRACTOR_REGISTER_SUCCESS =
  "@@contractor/CONTRACTOR_REGISTER_SUCCESS";
export const UPDATE_CONTRACTOR_SUCCESS =
  "@@contractor/UPDATE_CONTRACTOR_SUCCESS";

export const GET_CONSTRUCTION_SUCCESS = "@@contractor/GET_CONSTRUCTION_SUCCESS";
export const CREATE_CONSTRUCTION_SUCCESS =
  "@@contractor/CREATE_CONSTRUCTION_SUCCESS";
export const UPDATE_CONSTRUCTION_SUCCESS =
  "@@contractor/UPDATE_CONSTRUCTION_SUCCESS";
export const DELETE_CONSTRUCTION_SUCCESS =
  "@@contractor/DELETE_CONSTRUCTION_SUCCESS";

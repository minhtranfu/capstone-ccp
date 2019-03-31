import * as Actions from "../types";

const INITIAL_STATE = {
  loading: false,
  list: [],
  listMaterial: []
};

export default function cartReducer(state = INITIAL_STATE, action) {
  const { type, payload } = action;
  switch (type) {
    case Actions.GET_LIST_CART.REQUEST: {
      return {
        ...state,
        loading: true
      };
    }
    case Actions.GET_LIST_CART.SUCCESS: {
      return {
        ...state,
        loading: false,
        list: payload.data
      };
    }
    case Actions.ADD_ITEM_CART.SUCCESS: {
      return {
        ...state,
        list: [...state.list, payload.data]
      };
    }
    case Actions.UPDATE_ITEM_CART.SUCCESS: {
      return {
        ...state,
        list: state.list.map(item =>
          item.id === payload.id ? (item = payload.data.data) : item
        )
      };
    }
    case Actions.REMOVE_ITEM_CART.SUCCESS: {
      return {
        ...state,
        list: state.list.filter(item => item.id !== payload.id)
      };
    }
    case Actions.CART_CHECK_OUT.SUCCESS: {
      return {
        ...state,
        list: []
      };
    }
    case Actions.LIST_MATERIAL_CART_ITEM.SUCCESS: {
      return {
        ...state,
        listMaterial: state.listMaterial
      };
    }
    case Actions.ADD_MATERIAL_ITEM_TO_CART.SUCCESS: {
      //if yes, quantity of item plus 1
      //cart: [{ id: 12, items: [{id: 1, quantity 10},{id: 2, quantity: 20}]}]
      //payload: {id: 12, item: {id: 1, ...item}}
      //cart : {13: {items: {1: {quantity: 10}}}
      // if(payload.id in state.listMaterial){
      //   if(payload.item.id in state.listMaterial[payload.id].items){
      //     state.listMaterial[payload.id].items={
      //       ...state.listMaterial[payload.id].items,
      //       [payload.item.id]:{
      //         ...state.listMaterial[payload.id].items[payload.item.id],
      //         quantity: state.listMaterial[payload.id].items[payload.item.id].quantity+1

      //       }
      //     }
      //   }else{
      //     state.listMaterial[payload.id].items = {
      //       ...state.listMaterial[payload.id].items,
      //       [payload.item.id]: {quantity: 1, ...payload.item}}
      //   }
      // }else{
      //   state.listMaterial[payload.id]={items: {[payload.item.id]:{quantity: 1,...payload.item}}
      // }
      //cart: [{ id: 12, items: [{id: 1, quantity 10},{id: 2, quantity: 20}]}]
      if (state.listMaterial.find(item => item.id === payload.id)) {
        return {
          ...state,
          listMaterial: state.listMaterial.map(supplier =>
            supplier.id === payload.id
              ? {
                  ...supplier,
                  items: supplier.items.find(
                    item => item.id === payload.item.id
                  )
                    ? supplier.items.map(item =>
                        item.id === payload.item.id
                          ? { ...item, quantity: item.quantity + 1 }
                          : item
                      )
                    : [...supplier.items, { ...payload.item, quantity: 1 }]
                }
              : supplier
          )
        };
      }
      return {
        ...state,
        listMaterial: [
          ...state.listMaterial,
          { id: payload.id, items: [{ item: payload.item, quantity: 1 }] }
        ]
      };

      // for(let i = 0;i<state.listMaterial.length; i++ ){
      //   //check if supplier id exists in cart
      //   if(payload.id == cart[id].id){
      //   cart[id].items.forEach(item=>{
      //     //check if item exists in supplier's item
      //     if(item.id == payload.item.id){
      //         item.quantity++;
      //     }else{

      //       cart[id].items.push(payload.item)
      //     }
      //   } )
      //   }
      // //if no, add new item
      //   else{
      //     cart.push({id: payload.id, item: item.push(payload.item)})
      //   }
      // }
    }
    case Actions.UPDATE_MATERIAL_ITEM_TO_CART.SUCCESS: {
      return {
        ...state
        // listMaterial: state.listMaterial.map(item =>
        //   item.id === payload.id ? (item = payload.data) : item
        // )
      };
    }
    case Actions.REMOVE_MATERIAL_ITEM_FROM_CART: {
      return {
        ...state,
        listMaterial: listMaterial.filter(item => item.id !== payload)
      };
    }
    case Actions.CLEAR_MATERIAL_CART.SUCCESS: {
      return {
        ...state,
        listMaterial: []
      };
    }
    default:
      return state;
  }
}

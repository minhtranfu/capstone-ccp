// import * as Actions from "../types";

// const INITIAL_STATE = {
//   loading: null,
//   imageURL: []
// };

// export default function uploadReducer(state = INITIAL_STATE, action) {
//   const { type, payload } = action;
//   switch (type) {
//     case Actions.UPLOAD_IMAGE.REQUEST: {
//       return {
//         ...state,
//         loading: true
//       };
//     }
//     case Actions.UPLOAD_IMAGE.SUCCESS: {
//       return {
//         ...state,
//         loading: false,
//         imageURL: payload.data
//       };
//     }
//     case Actions.UPLOAD_IMAGE.ERROR: {
//       return {
//         ...state,
//         loading: false
//       };
//     }
//     case Actions.CLEAR_IMAGE_LIST: {
//       return {
//         loading: false,
//         imageURL: []
//       };
//     }
//     default:
//       return state;
//   }
// }

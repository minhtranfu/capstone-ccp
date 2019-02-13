import { combineReducers } from "redux";
import authReducer from "./auth";
import equipmentReducer from "./equipment";
import typeReducer from "./type";

const rootReducer = combineReducers({
  auth: authReducer,
  equipment: equipmentReducer,
  type: typeReducer
});

export default rootReducer;

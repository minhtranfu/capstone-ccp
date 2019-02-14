import { combineReducers } from "redux";
import authReducer from "./auth";
import equipmentReducer from "./equipment";
import typeReducer from "./type";
import statusReducer from "./status";

const rootReducer = combineReducers({
  auth: authReducer,
  equipment: equipmentReducer,
  type: typeReducer,
  status: statusReducer
});

export default rootReducer;

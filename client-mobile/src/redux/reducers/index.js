import { combineReducers } from "redux";
import authReducer from "./auth";
import equipmentReducer from "./equipment";

const rootReducer = combineReducers({
  auth: authReducer,
  equipment: equipmentReducer
});

export default rootReducer;

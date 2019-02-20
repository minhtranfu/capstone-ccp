import { combineReducers } from "redux";
import authReducer from "./auth";
import equipmentReducer from "./equipment";
import typeReducer from "./type";
import statusReducer from "./status";
import transactionReducer from "./transaction";
import contractorReducer from "./contractor";

const rootReducer = combineReducers({
  auth: authReducer,
  equipment: equipmentReducer,
  type: typeReducer,
  status: statusReducer,
  transaction: transactionReducer,
  contractor: contractorReducer
});

export default rootReducer;

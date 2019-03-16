import { combineReducers } from "redux";
import authReducer from "./auth";
import equipmentReducer from "./equipment";
import typeReducer from "./type";
import statusReducer from "./status";
import transactionReducer from "./transaction";
import contractorReducer from "./contractor";
import cartReducer from "./cart";
import uploadReducer from "./upload";
import notificationReducer from "./notification";
import materialReducer from "./material";

const rootReducer = combineReducers({
  auth: authReducer,
  equipment: equipmentReducer,
  type: typeReducer,
  status: statusReducer,
  transaction: transactionReducer,
  contractor: contractorReducer,
  cart: cartReducer,
  upload: uploadReducer,
  notification: notificationReducer,
  material: materialReducer
});

export default rootReducer;

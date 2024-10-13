import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "../../src/redux/features/userSlice";
import cartReducer from "../../src/redux/features/cartSlice";
export const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
});

// store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import cartReducer from "../components/cartSlice";

const userInitialState = {
  user: null,
};

function userReducer(state = userInitialState, action) {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;

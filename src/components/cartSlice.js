// cartSlice.js

import { createSlice, createSelector } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    addItem: (state, action) => {
      const itemIndex = state.findIndex(
        (item) => item.id === action.payload.id
      );
      if (itemIndex >= 0) {
        // If item already exists in the cart, increment its quantity
        state[itemIndex].quantity += 1;
      } else {
        // If item does not exist in the cart, add it
        state.push({ ...action.payload, quantity: 1 });
      }
    },
    removeItem: (state, action) => {
      const itemIndex = state.findIndex(
        (item) => item.id === action.payload.id
      );
      if (itemIndex >= 0) {
        // If item's quantity is more than 1, decrement it
        if (state[itemIndex].quantity > 1) {
          state[itemIndex].quantity -= 1;
        } else {
          // If item's quantity is 1, remove it from the cart
          state.splice(itemIndex, 1);
        }
      }
    },
    removeEntireItem: (state, action) => {
      if (action.payload && action.payload.id) {
        return state.filter((item) => item.id !== action.payload.id);
      } else {
        return [];
      }
    },
    addSize: (state, action) => {
      const itemIndex = state.findIndex(
        (item) => item.id === action.payload.id
      );
      if (itemIndex >= 0) {
        // If item exists in the cart, add size to it
        state[itemIndex].size = action.payload.size;
      }
    },
  },
});

export const { addSize, addItem, removeItem, removeEntireItem } =
  cartSlice.actions;

export const selectTotalQuantity = createSelector(
  (state) => state.cart,
  (cartItems) => cartItems.reduce((total, item) => total + item.quantity, 0)
);

export default cartSlice.reducer;

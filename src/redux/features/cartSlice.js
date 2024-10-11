import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    addOrder: (state, action) => {
      const order = action.payload;
      state.push(order);
    },
    clearAll: () => [],
  },
});

export const { addOrder, clearAll } = cartSlice.actions;
export default cartSlice.reducer;

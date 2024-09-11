import { createSlice } from '@reduxjs/toolkit';
import {
  getCartFromLocalStorage,
  resetCartAtLocalStorage,
  setCartToLocalStorage,
  calculateTotal,
} from './cartUtils';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: {},
    totalCount: 0,
    totalPrice: 0,
  },
  reducers: {
    initCart: (state, action) => {
      const userId = action.payload;
      if (!userId) return;
      const prevCartItem = getCartFromLocalStorage(userId);
      const total = calculateTotal(prevCartItem);
      state.cart = prevCartItem;
      state.totalCount = total.totalCount;
      state.totalPrice = total.totalPrice;
    },
    resetCart: (state, action) => {
      const userId = action.payload;
      resetCartAtLocalStorage(userId);
      state.cart = {};
      state.totalCount = 0;
      state.totalPrice = 0;
    },
    addCartItem: (state, action) => {
      const { item, userId, count } = action.payload;
      state.cart[item.id] = {
        ...item,
        count: (state.cart[item.id]?.count ?? 0) + count,
      };
      const total = calculateTotal(state.cart);
      state.totalCount = total.totalCount;
      state.totalPrice = total.totalPrice;
      setCartToLocalStorage(state.cart, userId);
    },
    removeCartItem: (state, action) => {
      const { itemId, userId } = action.payload;
      delete state.cart[itemId];
      const total = calculateTotal(state.cart);
      state.totalCount = total.totalCount;
      state.totalPrice = total.totalPrice;
      setCartToLocalStorage(state.cart, userId);
    },
    changeCartItemCount: (state, action) => {
      const { itemId, count, userId } = action.payload;
      state.cart[itemId].count = count;
      const total = calculateTotal(state.cart);
      state.totalCount = total.totalCount;
      state.totalPrice = total.totalPrice;
      setCartToLocalStorage(state.cart, userId);
    },
  },
});

export const {
  initCart,
  resetCart,
  addCartItem,
  removeCartItem,
  changeCartItemCount,
} = cartSlice.actions;

export default cartSlice.reducer;

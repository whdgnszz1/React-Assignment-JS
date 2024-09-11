import { createSlice } from '@reduxjs/toolkit';
import { loadProducts, addProduct } from './productsActions';

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    lastVisibleId: null,
    hasNextPage: true,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        const { products, newLastVisibleId, hasNextPage, isInitial } =
          action.payload;
        state.items = isInitial ? products : [...state.items, ...products];
        state.lastVisibleId = newLastVisibleId;
        state.hasNextPage = hasNextPage;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.isLoading = false;
        state.error = null;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default productsSlice.reducer;

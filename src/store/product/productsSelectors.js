export const selectProducts = (state) => state.products.items;
export const selectLastVisible = (state) => state.products.lastVisible;
export const selectHasNextPage = (state) => state.products.hasNextPage;
export const selectIsLoading = (state) => state.products.isLoading;
export const selectError = (state) => state.products.error;

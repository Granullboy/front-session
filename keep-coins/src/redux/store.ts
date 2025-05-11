import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.ts';
/*import transactionReducer from './slices/transactionSlice';
import categoryReducer from './slices/categorySlice';*/

const store = configureStore({
  reducer: {
    auth: authReducer,
    /*transactions: transactionReducer,
    categories: categoryReducer,*/
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export { store };
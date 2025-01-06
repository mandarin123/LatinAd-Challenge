import { combineReducers } from '@reduxjs/toolkit';
import searchReducer from '../slices/searchSlice';
import cartReducer from '../slices/cartSlice';

const rootReducer = combineReducers({
  search: searchReducer,
  cart: cartReducer,
});

export default rootReducer; 
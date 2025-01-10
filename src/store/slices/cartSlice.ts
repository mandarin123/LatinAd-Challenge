import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DisplayResponse } from '../../services/displays.service';

interface CartItem extends DisplayResponse {
  quantity: number;
  selectedDays: number;
  totalPrice: number;
  dateFrom: string;
  dateTo: string;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<DisplayResponse & { 
      selectedDays: number; 
      totalPrice: number;
      dateFrom: string;
      dateTo: string;
    }>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
        existingItem.totalPrice = action.payload.totalPrice;
      } else {
        state.items.push({ 
          ...action.payload, 
          quantity: 1,
          selectedDays: action.payload.selectedDays,
          totalPrice: action.payload.totalPrice,
          dateFrom: action.payload.dateFrom,
          dateTo: action.payload.dateTo
        });
      }
      state.totalItems += 1;
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        state.totalItems -= item.quantity;
        state.items = state.items.filter(item => item.id !== action.payload);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer; 
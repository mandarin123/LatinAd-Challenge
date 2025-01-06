import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DisplayResponse } from '../../services/displays.service';

interface CartItem extends DisplayResponse {
  quantity: number;
  selectedDays: number;
  totalPrice: number;
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
    addToCart: (state, action: PayloadAction<DisplayResponse & { selectedDays: number; totalPrice: number }>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
        existingItem.totalPrice = action.payload.totalPrice * existingItem.quantity;
      } else {
        state.items.push({ 
          ...action.payload, 
          quantity: 1,
          selectedDays: action.payload.selectedDays,
          totalPrice: action.payload.totalPrice
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
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        state.totalItems -= item.quantity;
        state.totalItems += action.payload.quantity;
        item.quantity = action.payload.quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer; 
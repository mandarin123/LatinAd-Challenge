import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DisplayResponse } from '../../services/displays.service';

interface SearchState {
  loading: boolean;
  results: DisplayResponse[];
  dates: {
    dateFrom: string | null;
    dateTo: string | null;
  };
  location: string | null;
}

const initialState: SearchState = {
  loading: false,
  results: [],
  dates: {
    dateFrom: null,
    dateTo: null
  },
  location: null
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<DisplayResponse[]>) => {
      state.results = action.payload;
    },
    clearSearchResults: (state) => {
      state.results = [];
      state.dates = {
        dateFrom: null,
        dateTo: null
      };
      state.location = null;
    },
    setDates: (state, action: PayloadAction<{ dateFrom: string; dateTo: string }>) => {
      state.dates = action.payload;
    },
    setLocation: (state, action: PayloadAction<string>) => {
      state.location = action.payload;
    }
  }
});

export const { 
  setLoading, 
  setSearchResults, 
  clearSearchResults,
  setDates,
  setLocation
} = searchSlice.actions;

export default searchSlice.reducer; 
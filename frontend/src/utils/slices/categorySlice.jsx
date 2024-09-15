import { createSlice } from '@reduxjs/toolkit';

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    status: 'idle',
    error: null
  },
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
      state.status = 'succeeded';
    },
    setLoading: (state) => {
      state.status = 'loading';
    },
    setError: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    }
  }
});

export const { setCategories, setLoading, setError } = categorySlice.actions;

export default categorySlice.reducer;

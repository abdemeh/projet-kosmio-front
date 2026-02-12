import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  image: null,
  isLoading: false,
};

const ficheSlice = createSlice({
  name: 'fiche',
  initialState,
  reducers: {
    setImage: (state, action) => {
      state.image = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    resetImageState: (state) => {
      Object.assign(state, initialState);
    },
  },
});


export const { setImage, resetImageState} = ficheSlice.actions;
export default ficheSlice.reducer;
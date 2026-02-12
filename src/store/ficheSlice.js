import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  image: null,
  isLoading: false,
  section: 0,
};

const ficheSlice = createSlice({
  name: 'fiche',
  initialState,
  reducers: {
    setSection: (state, action) => {
      state.section = action.payload;
    },
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


export const { setImage, setSection, resetImageState} = ficheSlice.actions;
export default ficheSlice.reducer;
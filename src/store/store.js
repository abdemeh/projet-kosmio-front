import { configureStore } from '@reduxjs/toolkit';
import ficheReducer from './ficheSlice'; 
import pdfReducer from './pdfSlice';    
import uiReducer from './uiSlice';       

export const store = configureStore({
  reducer: {
    fiche: ficheReducer,
    pdf: pdfReducer,
    ui: uiReducer,
  },
  

  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
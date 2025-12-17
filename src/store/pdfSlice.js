import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pdfFile: null,        // L'objet File du PDF
  chunks: [],           // Les chunks de données après traitement (futur)
  isLoading: false,     // Statut du traitement (Upload + Génération IA)
  error: null,
};

const pdfSlice = createSlice({
  name: 'pdf',
  initialState,
  reducers: {
    setPdfFile: (state, action) => {
      // Stocke le fichier et réinitialise l'erreur
      state.pdfFile = action.payload; 
      state.error = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    resetPdfState: (state) => {
      // Réinitialise l'état pour un nouvel upload
      Object.assign(state, initialState);
    },
    // Action future pour l'équipe backend
    setPdfChunks: (state, action) => {
        state.chunks = action.payload;
    }
  },
});

export const { setPdfFile, setLoading, resetPdfState, setPdfChunks } = pdfSlice.actions;

export default pdfSlice.reducer;
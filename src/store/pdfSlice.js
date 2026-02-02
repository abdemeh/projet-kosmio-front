import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pdfFile: null,         // L'objet File du PDF
  chunks: [],            // Les chunks de données après traitement (futur)
  isLoading: false,      // Statut du traitement (Upload + Génération IA)
  error: null,
  generatedJson: null,   // JSON récupéré de l'API (solution/secteur)
  markdown: null,        // Markdown généré à partir du JSON
};

const pdfSlice = createSlice({
  name: 'pdf',
  initialState,
  reducers: {
    setPdfFile: (state, action) => {
      state.pdfFile = action.payload; 
      state.error = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    resetPdfState: (state) => {
      Object.assign(state, initialState);
    },
    setPdfChunks: (state, action) => {
      state.chunks = action.payload;
    },
    setGeneratedJson: (state, action) => {
      state.generatedJson = action.payload;
    },
    setMarkdown: (state, action) => {
      state.markdown = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  },
});

export const { 
  setPdfFile, 
  setLoading, 
  resetPdfState, 
  setPdfChunks, 
  setGeneratedJson,
  setMarkdown,
  setError
} = pdfSlice.actions;

export default pdfSlice.reducer;

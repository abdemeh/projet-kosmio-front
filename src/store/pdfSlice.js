import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pdfFile: null,        // L'objet File du PDF
  chunks: [],           // Les chunks de données après traitement (futur)
  isLoading: false,     // Statut du traitement (Upload + Génération IA)
  error: null,
  generatedJson: null,
  markdown: null, 
  type: 'solution',
  id: null,
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
    },
    setGeneratedJson: (state, action) => {
      state.generatedJson = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setMarkdown: (state, action) => {
      state.markdown = action.payload;
    },
    setType: (state, action) => {
      state.type = action.payload
    },
    setId: (state, action) => {
      state.id = action.payload
    }
  },
});

export const { setId, setPdfFile, setLoading, resetPdfState, setPdfChunks, setGeneratedJson, setError, setMarkdown, setType} = pdfSlice.actions;

export default pdfSlice.reducer;
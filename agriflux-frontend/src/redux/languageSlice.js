import { createSlice } from '@reduxjs/toolkit';

const languageSlice = createSlice({
    name: 'language',
    initialState: {
        // Load saved language from localStorage
        // Default is English
        current: localStorage.getItem('agriflux_lang') || 'en',
    },
    reducers: {
        setLanguage: (state, action) => {
            state.current = action.payload;
            localStorage.setItem('agriflux_lang', action.payload);
        },
    },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
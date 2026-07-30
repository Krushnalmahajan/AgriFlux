import { createSlice } from '@reduxjs/toolkit';

// Load user from localStorage on app start
const token = localStorage.getItem('agriflux_token');
const user = JSON.parse(
    localStorage.getItem('agriflux_user') || 'null'
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: token || null,
        user: user || null,
        isLoggedIn: !!token,
    },
    reducers: {
        loginSuccess: (state, action) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.isLoggedIn = true;
            // Save to localStorage
            localStorage.setItem(
                'agriflux_token', action.payload.token);
            localStorage.setItem(
                'agriflux_user',
                JSON.stringify(action.payload.user));
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            state.isLoggedIn = false;
            localStorage.removeItem('agriflux_token');
            localStorage.removeItem('agriflux_user');
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
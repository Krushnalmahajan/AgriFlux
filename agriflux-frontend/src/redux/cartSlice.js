import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        totalItems: 0,
        totalAmount: 0,
        cartId: null,
    },
    reducers: {
        setCart: (state, action) => {
            state.items = action.payload.items || [];
            state.totalItems = action.payload.totalItems || 0;
            state.totalAmount = action.payload.totalAmount || 0;
            state.cartId = action.payload.cartId || null;
        },
        clearCartState: (state) => {
            state.items = [];
            state.totalItems = 0;
            state.totalAmount = 0;
            state.cartId = null;
        },
    },
});

export const { setCart, clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
import { createSlice, createAsyncThunk, unwrapResult } from '@reduxjs/toolkit';
import axios from 'axios'
import { cartListUrl } from '../../services/constant';


export const cartHandler = createAsyncThunk('posts/cartListcall', async (data, thunkAPI) => {
    const headers = { 'Authorization': "Bearer " + data }
    return await axios.get(cartListUrl, { headers: headers }).then(response => {
        return response.data
    }).catch((err) => {
        console.log("Inside the cart.js redux.............", err)
    })
})

export const cartListSlice = createSlice({
    name: 'cartList',
    initialState: {
        data: [],
        isSuccess: false,
        message: "",
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(cartHandler.pending, (state) => {
            state.loading = true;
        }),
            builder.addCase(cartHandler.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
    },
})
export default cartListSlice.reducer;



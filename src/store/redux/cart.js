import { createSlice, createAsyncThunk, unwrapResult } from '@reduxjs/toolkit';
import axios from 'axios'
import { cartListUrl } from '../../services/constant';


export const cartHandler = createAsyncThunk('posts/cartListcall', async (data, thunkAPI) => {
    // console.log("Inside the api call cartList", data.data);
    const headers = { 'Authorization': "Bearer " + data }
    // console.log(headers,"headers  yes")
    return await axios.get(cartListUrl, { headers: headers }).then(response => {
        return response.data
    }).catch((err) => {
        console.log(err)
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
        // Add reducers for additional action types here, and handle loading state as needed
        // console.log(cartHandler, "search response")   
        builder.addCase(cartHandler.pending, (state) => {
            state.loading = true;
            // console.log("hello status pending ",state.loading)
        }),
            builder.addCase(cartHandler.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
    },
})
export default cartListSlice.reducer;



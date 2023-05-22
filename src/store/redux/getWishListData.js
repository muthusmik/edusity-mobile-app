import { createSlice, createAsyncThunk, unwrapResult } from '@reduxjs/toolkit';
import axios from 'axios'
import { wishlistUrl } from '../../services/constant';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const newToken = await AsyncStorage.getItem("loginToken");
export const getWishListDataHandler = createAsyncThunk('gets/wishListcall', async (data, thunkAPI) => {

    const headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + data
    }
    // let courseUrl = courseListUrl + "?page=1";
    // process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    return await axios.get(wishlistUrl, { headers: headers }).then((response) => {
        // console.log("Success response for wishListurl.........", response.data)
        return response.data
    }).catch((err) => {
        console.log("Inisde Catch Error response for wishListurl.........", err)
    })

})

export const getWishListSlice = createSlice({
    name: 'getWishList',
    initialState: {
        data: [],
        isSuccess: false,
        message: "",
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        // console.log(courseListHandler, "search response")
        // builder.addCase(getWishListDataHandler.fulfilled, (state, action) => {
        //     console.log("state action in wishList", state);
        //     state.data = action.payload;
        // })
        builder
            .addCase(getWishListDataHandler.pending, (state) => {
                // state.isLoading = true;
                // console.log("Pending status of getwishlist")
                state.error = null;
            })
            .addCase(getWishListDataHandler.fulfilled, (state, action) => {
                // state.isLoading = false;
                // console.log("fulfilled status of getwishlist")
                state.data = action.payload;
                state.error = null;
            })
            .addCase(getWishListDataHandler.rejected, (state, action) => {
                // state.isLoading = false;
                console.log("rejected status of getwishlist")
                state.data = null;
                state.error = action.error.message;
            });

    },
})
export default getWishListSlice.reducer;



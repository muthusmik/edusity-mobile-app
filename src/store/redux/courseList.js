import { createSlice, createAsyncThunk, unwrapResult } from '@reduxjs/toolkit';
import axios from 'axios'
import { courseListUrl } from '../../services/constant';

export const courseListHandler = createAsyncThunk('posts/courseListcall', async (data, thunkAPI) => {

    const headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + data
    }
    let courseUrl = courseListUrl + "?page=1";
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    return await axios.post(courseUrl, { headers: headers }).then((response) => {
        return response.data
    }).catch((err) => {
        console.log("Inisde Catch Error response for courseListUrl.........", err)
        return "error"
    })
    // try {
    //     const result = await fetch(courseUrl);
    //     console.log("Result........", result);
    // }
    // catch (error) {
    //     console.log("Error in course list",error);
    // }
})

export const courseListSlice = createSlice({
    name: 'courseList',
    initialState: {
        data: [],
        isSuccess: false,
        message: "",
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(courseListHandler.fulfilled, (state, action) => {
            state.data = action.payload;
        })
    },
})
export default courseListSlice.reducer;



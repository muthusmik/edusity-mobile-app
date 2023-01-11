import { createSlice, createAsyncThunk, unwrapResult } from '@reduxjs/toolkit';
import axios from 'axios'
import { courseListUrl } from '../../services/constant';


export const courseListHandler = createAsyncThunk('posts/courseListcall', async (data, thunkAPI) => {
    // try {
      const headers =  {
       'Content-Type': 'application/json; charset=utf-8', 
       'Authorization':'Bearer '+data
     }
     let courseUrl = courseListUrl + "?page=1";
     process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    return await axios.get(courseUrl,{headers:headers}).then((response) => {
        console.log("success for listing initial")
        // console.log("success for listing initial")
        return response.data })
        .catch((err)=>{
        console.log("error in axios : ",err)
        })
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
        // Add reducers for additional action types here, and handle loading state as needed
       // console.log(courseListHandler, "search response")
        builder.addCase(courseListHandler.fulfilled, (state, action) => {
            console.log("state action",state);
            state.data = action.payload;
        })
    },
})
export default courseListSlice.reducer;



import { createSlice, createAsyncThunk, unwrapResult } from '@reduxjs/toolkit';
import axios from 'axios'
import { courseListUrl } from '../../services/constant';


export const courseListHandler = createAsyncThunk('posts/courseListcall', async (data, thunkAPI) => {
    // console.log("Inside the api call courseList", data);
    const headers = {'Content-Type': 'application/json','Authorization':"Bearer "+data}
    return  await axios.get(courseListUrl, { headers: headers }).then(response=> {
        // console.log("success for listing initial",response.data.data)
        // console.log("success for listing initial")
        return response.data })
        .catch((err)=>{
        console.log(err)
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
            state.data = action.payload;
        })
    },
})
export default courseListSlice.reducer;



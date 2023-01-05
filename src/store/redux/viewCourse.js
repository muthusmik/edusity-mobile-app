import { createSlice, createAsyncThunk, unwrapResult } from '@reduxjs/toolkit';
import axios from 'axios'
import { ViewCourseUrl } from '../../services/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const viewCourseHandler = createAsyncThunk('posts/viewCoursecall', async (data, thunkAPI) => {
    // console.log("Inside the api call courseList", data);
    const Url=ViewCourseUrl+data;
    let token = await AsyncStorage.getItem("loginToken");
    const headers = {'Content-Type': 'application/json','Authorization':"Bearer "+ token}
    return  await axios.get(Url,{ headers: headers }).then(response=> {
        // console.log("success View Course",response)
        return response.data })
        .catch((err)=>{
        console.log(err)
        })
})

export const viewCourseSlice = createSlice({     
    name: 'viewCourse',
    initialState: {
        data: [],
        isSuccess: false,
        message: "",
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        // console.log(viewCourseHandler, "search response of view Course")
        builder.addCase(viewCourseHandler.fulfilled, (state, action) => {
            state.data = action.payload;
        })
    },
})
export default viewCourseSlice.reducer;



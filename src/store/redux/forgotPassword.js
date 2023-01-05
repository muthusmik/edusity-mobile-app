import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { forgotPasswordUrl } from '../../services/constant';



export const forgotPasswordHanlder = createAsyncThunk('posts/forgotPasswordcall', async (data, thunkAPI) => {
    // console.log("Inside the api call", data.forgotemail);
    const payload = { "email": data.forgotemail};
    const headers = {'Content-Type': 'application/json',}

    return  await axios.post(forgotPasswordUrl, payload, { headers: headers }).then(response=> {
    //  console.log("response")
    //  console.log("finalData", response.data.error)
     if(response.data.error===false){
        return response.data   
     }else{
        var errorData={"errorCode":response.data.errorCode,"errormessage":response.data.message}
        // console.log(errorData);
        return errorData
   
     }
 }).catch((err)=>{
     console.log(err)
 })
})

export const forgotPasswordHandleSlice = createSlice({
    name: 'forgotpasswordHandle',
    initialState: {
        data: null,
        isSuccess: false,
        message: "",
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        // console.log(forgotPasswordHanlder, "search response")
        builder.addCase(forgotPasswordHanlder.fulfilled, (state, action) => {
            state.data = action.payload;
            // console.log("data in reducer", state);
        })
    },
})
export default forgotPasswordHandleSlice.reducer;
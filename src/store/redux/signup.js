import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { signUpPostApi } from '../../services/Login/signUpApi';
import axios from 'axios'
import { signupUrl } from '../../services/constant';



export const signUpHanlder = createAsyncThunk('posts/signupPostcall', async (data, thunkAPI) => {
    // console.log("Inside the api call", data);
    const headers = {'Content-Type': 'application/json',}

    return  await axios.post(signupUrl, data, { headers: headers }).then(response=> {
    //  console.log("response")
    //  console.log("finalData", response.data.error)
     return response.data
    //  if(response.data.error===false){
    //     return response.data
    //  }else{
    //     var errorData={"errorCode":response.data.errorCode,"errormessage":response.data.message}
    //     console.log(errorData);
    //     return errorData
   
    //  }
 }).catch((err)=>{   
     console.log(err)
 })
})

export const signUpHandleSlice = createSlice({
    name: 'signUpHandle',
    initialState: {
        data: null,
        isSuccess: false,
        message: "",
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        // console.log(signUpHanlder, "search response")
        builder.addCase(signUpHanlder.fulfilled, (state, action) => {
            state.data = action.payload;
            // console.log("data in reducer", state);
        })
    },
})
export default signUpHandleSlice.reducer;
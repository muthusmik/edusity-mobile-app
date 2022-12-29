import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { loginPostApi } from '../../services/Login/loginApi';
import axios from 'axios'
import { bool } from 'prop-types'
import { userUrl } from '../../services/constant';



export const userLoginHanlder = createAsyncThunk('posts/userLogincall', async (data, thunkAPI) => {
    // console.log("Inside the api call", data);

    const headers = {'Content-Type': 'application/json','Authorization':"Bearer "+ data}
    // console.log(headers,"header")
    return  await axios.get(userUrl,{ headers: headers }).then(response=> {
    //  console.log("response")
    //  console.log("finalData userLogin Api", response.data.error)
  
     return response.data
 })   
})

export const userLoginHandleSlice = createSlice({
    name: 'userLoginHandle',
    initialState: {
        data: null,
        isSuccess: false,
        message: "",
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        // console.log(userLoginHanlder, "search response")
        builder.addCase(userLoginHanlder.fulfilled, (state, action) => {
            state.data = action.payload;
            
            // console.log("data in reducer hello", state);
        })
    },
})
export default userLoginHandleSlice.reducer;
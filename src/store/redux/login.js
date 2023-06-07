import { createSlice, createAsyncThunk, } from '@reduxjs/toolkit';
import axios from 'axios'
import { loginUrl } from '../../services/constant';

// export const  userApi=async(data)=>{
//     console.log("Handle user api",data)
//     const headers = {'Content-Type': 'application/json','Authorization':"Bearer "+ data}
//   return  await axios.get(userUrl, { headers: headers }).then(response=> {
//     console.log(headers,"userApis");
//     console.log(response.data,"userApi return")
//     return response.data
// }).catch((err)=>{
//     console.log(err,"err in userApi")
// })

// }

export const loginHanlder = createAsyncThunk('posts/loginPostcall', async (data, thunkAPI) => {
    const payload = { "email": data.emailorusername, "password": data.loginpassword };
    const headers = { 'Content-Type': 'application/json', }
    return await axios.post(loginUrl, payload, { headers: headers }).then(response => {
        return response.data
    }).catch((err) => {
        console.log("Error in loginhandler..................", err)
        return "error"
    })
})

export const loginHandleSlice = createSlice({
    name: 'loginHandle',
    initialState: {
        data: "No data",
        isSuccess: false,
        message: "",
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(loginHanlder.fulfilled, (state, action) => {
            state.data = action.payload;
        })
    },
})
export default loginHandleSlice.reducer;



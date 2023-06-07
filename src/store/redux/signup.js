import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { signUpPostApi } from '../../services/Login/signUpApi';
import axios from 'axios'
import { signupUrl } from '../../services/constant';



export const signUpHanlder = createAsyncThunk('posts/signupPostcall', async (data, thunkAPI) => {
    const headers = { 'Content-Type': 'application/json' }

    return await axios.post(signupUrl, data, { headers: headers }).then(response => {
        return response.data
    }).catch((err) => {
        console.log("Error in signuphandler................", err)
        return "error"
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
        builder.addCase(signUpHanlder.fulfilled, (state, action) => {
            state.data = action.payload;
        })
    },
})
export default signUpHandleSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { forgotPasswordUrl } from '../../services/constant';

export const forgotPasswordHanlder = createAsyncThunk('posts/forgotPasswordcall', async (data, thunkAPI) => {
    const payload = { "email": data.forgotemail };
    const headers = { 'Content-Type': 'application/json' }

    return await axios.post(forgotPasswordUrl, payload, { headers: headers }).then(response => {
        return response.data
    }).catch((err) => {
        console.log("Error in forgotPasswordHanlder..........", err)
        return "error";
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
        builder.addCase(forgotPasswordHanlder.fulfilled, (state, action) => {
            state.data = action.payload;
        })
    },
})
export default forgotPasswordHandleSlice.reducer;
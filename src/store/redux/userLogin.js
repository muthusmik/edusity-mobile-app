import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { loginPostApi } from '../../services/Login/loginApi';
import axios from 'axios'
import { bool } from 'prop-types'
import { userUrl } from '../../services/constant';



export const userLoginHanlder = createAsyncThunk('posts/userLogincall', async (data, thunkAPI) => {
    const headers = { 'Content-Type': 'application/json', 'Authorization': "Bearer " + data }
    return await axios.get(userUrl, { headers: headers }).then(response => {
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
        builder.addCase(userLoginHanlder.fulfilled, (state, action) => {
            state.data = action.payload;
        })
    },
})
export default userLoginHandleSlice.reducer;
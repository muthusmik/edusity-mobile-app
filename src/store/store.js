import {configureStore } from '@reduxjs/toolkit';
import loginHandleReducer from "./redux/login/";
import signUpHandleReducer from "./redux/signup";
import  forgotPasswordHandleReducer from './redux/forgotPassword';
import userLoginHandleReducer from './redux/userLogin';
import courseListReducer from "./redux/courseList";
import  viewCourseReducer from './redux/viewCourse';
import  geoLocationReducer  from './redux/geoLocation';
import cartListReducer  from './redux/cart';
const store=configureStore({
    reducer:{
        loginHandle:loginHandleReducer,
        signUpHandle:signUpHandleReducer,
        forgotPasswordHandle:forgotPasswordHandleReducer,
        userLoginHandle:userLoginHandleReducer,
        courseList:courseListReducer,
        viewCourse:viewCourseReducer,
        geoLocationPicker:geoLocationReducer,
        cartList:cartListReducer,

    },
})

export default store;
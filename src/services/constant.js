import React from "react";
import { useSelector } from "react-redux";


//dev
//export const baseUrl="https://backend-linux-login.azurewebsites.net/";
//export const baseUrl_payment="https://backend-linux-payment.azurewebsites.net/";

//live
export const baseUrl="https://livelogin.edusity.com/";
export const baseUrl_payment="https://livepayment.edusity.com/";

//newlogin.edusity.com
//export const baseUrl="http://newlogin.edusity.com/";
//export const baseUrl_payment = "http://newpayment.edusity.com/";


export const loginUrl=baseUrl+"login";
export const signupUrl=baseUrl+"sign-up";
export const forgotPasswordUrl=baseUrl+"forgot-password";
export const  verificationLinkUrl=baseUrl+"get-verification-link";
export const passwordResetUrl=baseUrl+"reset";
export const userUrl=baseUrl+"user";
export const wishlistUrl=baseUrl_payment+"/wishlist/";
export const courseListUrl=baseUrl+"course";
export const ViewCourseUrl=baseUrl+"course/";
export const OTPUrl = baseUrl+"send-otp";
export const cartListUrl=baseUrl_payment+"v2/cart";
export const deleteItemUrl=baseUrl_payment+"v2/cart/";
export const wishlist=baseUrl+"/wishlist/";
export const getPurchasedUrl= baseUrl+"/course/purchased?page=";
export const verifyUrl = baseUrl+"verify-otp";
export const searchUrl = baseUrl+"search/course?search=";
export const updateProfileUrl=baseUrl+"user/profile";
export const checkoutUrl = baseUrl_payment + "v2/checkout";
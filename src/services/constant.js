import React from "react";
import { useSelector } from "react-redux";




export const baseUrl="https://backend-linux-login.azurewebsites.net/";
export const baseUrl_payment="https://backend-linux-payment.azurewebsites.net/";
export const loginUrl=baseUrl+"login";
export const signupUrl=baseUrl+"sign-up";
export const forgotPasswordUrl=baseUrl+"forgot-password";
export const  verificationLinkUrl=baseUrl+"get-verification-link";
export const passwordResetUrl=baseUrl+"reset";
export const userUrl=baseUrl+"user";
export const wishlistUrl=baseUrl_payment+"/wishlist/";
export const courseListUrl=baseUrl+"course?page=1";
export const ViewCourseUrl=baseUrl+"course/";

export const cartListUrl=baseUrl_payment+"v2/cart";
export const deleteItemUrl="https://backend-linux-payment.azurewebsites.net/v2/cart/"
export const wishlist=baseUrl+"/wishlist/";
export const getPurchasedUrl= baseUrl+"/course/purchased?page="

export const updateProfileUrl="https://backend-linux-login.azurewebsites.net/user/profile"
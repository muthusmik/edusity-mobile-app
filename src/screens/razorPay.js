import React, { useEffect, useState } from "react";
import RazorpayCheckout from 'react-native-razorpay';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';






const RazorpayOverlay=({data,pricing}) => {
    const navigation=useNavigation();
  
    // console.log("im the price of total amount................",pricing)
    var options = {
        name: "Edusity",
        amount: pricing,
        description: "Test Transaction",
        image: "../assets/icons/edusity-logo.png",
        currency: 'INR',
        key: "rzp_test_0YBgt6YFSNUirq",
        order_id: data,
        prefill: {
            name: "buusha",
            email: "buusha.br@gmail.com",
            contact: 8939423416,
        },
    };
    // console.log("im the price of total amount................",JSON.stringify(options))
    RazorpayCheckout.open(options)
        .then(async result => {
            // console.log("im the checkout................")
            // alert(`Success: ${result.razorpay_payment_id}`);
            let Token=await AsyncStorage.getItem("loginToken");
            var sessionId = { "sessionId": result.razorpay_payment_id }
            // console.log("Im inisde the data of Cart page....", result)
            let cartremoval = `https://backend-linux-payment.azurewebsites.net/v2/checkout?country=IN`;
            const response = await axios.post(cartremoval, sessionId, {
                headers: {
                    Authorization: `Bearer ${Token}`,
                }
            }).then(result => {
                // console.log("hebrew",sessionId,Token);
                navigation.navigate('Checkout')
            }).catch(err=>{
                console.log("err in removal",err)
            });
            // console.log("im th echeckout token.................", Token);
            // console.log("im the response of checkout data.......", response);
        })
        .catch(error => {
            Toast.show(error, "RazorPay Rejection", Toast.LONG);
            // console.log("im th echeckout error.................", error);
        });
}

const RazorPay=({route})=>{
    // console.log("routers",route?.params)
    let dataSession=route?.params.dataSession;
    let price= route?.params.totalValue
    // const [token,setToken]=useState();
    // useEffect(()=>{
    //     const initialLoading=async()=>{
    //         let Token=await AsyncStorage.getItem("loginToken");
    //         setToken(Token)
    //         console.log("Token",Token)
    //     }
    //     initialLoading()
    // },[])
return(
    <>
    {/* {console.log(dataSession,price)} */}
    <RazorpayOverlay  data={dataSession} pricing={price}  />
    </>
)}
export default RazorPay;
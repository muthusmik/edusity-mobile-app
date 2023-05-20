import React,{useState,useEffect} from "react";
import axios from "axios";
import { useSelector,useDispatch } from "react-redux";
import { webinarListUrl,generateWebinarTokenUrl } from "./constant";
import { Platform } from "react-native";
import { View } from "react-native";

export const getWebinars = async (Token,page) => {
  // const Token=useSelector(state=>state.loginHandle.data.data);
   return await  axios
      .get(`${webinarListUrl}`,{headers:{Authorization:`Bearer ${Token}`}})
      .then(response  => {
        console.log("Webinar Courses",response.data);
       
         return response.data;
        
      })
      .catch((res) => {
        // console.log(res);
        return(res)
      });
  };



  
export const generateWebinarToken = async (Token,id) => {
  
   return await  axios
      .get(`${generateWebinarTokenUrl}${id}`,{headers:{Authorization:`Bearer ${Token}`}})
      .then(response  => {
        console.log("Webinar Courses",response.data);
       
         return response.data;
        
      })
      .catch((res) => {
        // console.log(res);
        return(res)
      });
  };


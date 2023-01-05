import React,{useState,useEffect} from "react";
import axios from "axios";
import { useSelector,useDispatch } from "react-redux";
import { getPurchasedUrl } from "./constant";

export const purchasedCourses = async (Token,page) => {
  // const Token=useSelector(state=>state.loginHandle.data.data);
   return await  axios
      .get(`${getPurchasedUrl}${page}`,{headers:{Authorization:`Bearer ${Token}`}})
      .then(response  => {
        // console.log("Purchased Courses",response.data.data.data[0]);
       
         return response.data;
        
      })
      .catch((res) => {
        // console.log(res);
        return(res)
      });
  };

    
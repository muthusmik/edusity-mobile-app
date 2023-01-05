import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { cartHandler } from "../store/redux/cart";
import { updateProfileUrl } from "./constant";







export const updateProfile=async(Token,Payload)=>{
    let Url=updateProfileUrl;
    return await axios.put(Url,JSON.stringify(Payload),
      {
        headers: {
          Authorization: `Bearer ${Token}`,
          "Content-Type": "application/json",
        },
      }
    )
        .then(response => {
        // console.log(response.data,"user Update response")
        return response.data
    })
        .catch((err) => {
            // console.log(err,"error");
            return  err;
        })

   


}
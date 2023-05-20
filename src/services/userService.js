import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { cartHandler } from "../store/redux/cart";
import { updateProfileUrl,userDeactiveUrl, userDeleteUrl} from "./constant";







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

export const DeleteProfile=async(Token)=>{
  let Url=userDeleteUrl;
  console.log("Token,,,,,",Token)
  return await axios.delete(Url,
    {
      headers: {
        Authorization: `Bearer ${Token}`,
        "Content-Type": "application/json",
      },
    }
  )
      .then(response => {
      console.log(response.data,"user delete response")
      return response.data.data
  })
      .catch((err) => {
          // console.log(err,"error");
          return  err;  
      })
}



export const DeactivateProfile=async(Token)=>{
  let Url=userDeactiveUrl;
  console.log("Token",Token)
  return await axios.put(Url,
    {
      headers: {
        Authorization:'Bearer '+Token,
        "Content-Type": "application/json",
      },
    }
  )
      .then(response => {
     console.log("kkkkk",'Bearer '+Token, Url)
     console.log(response.data,"user deactivate response")
      return response.data.data
  })
      .catch((err) => {
          // console.log(err,"error");
          return  err;
      })
}
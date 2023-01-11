import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { cartHandler } from "../store/redux/cart";
import { cartListUrl } from './constant';






export const addtoCart=async(id,Token)=>{
    let cartAddUrl=cartListUrl + `/${id}?country=IN&isBundle=0`;
    // const dispatch=useDispatch();
   
    return await axios.post(cartAddUrl,JSON.stringify({
        latitude: 11.0231552,
        longitude: 77.0179072,
        countryCode: 'IN',
        coupon: 0,
      }),
      {
        headers: {
          Authorization: `Bearer ${Token}`,
          "Content-Type": "application/json",
        },
      }
    )
        .then(response => {
        // console.log(response.data,"addcart response")
        // dispatch(cartHandler(Token));
        return response.data
    })
        .catch((err) => {
            // console.log(err,"error");
            return  err;
        })

   


}
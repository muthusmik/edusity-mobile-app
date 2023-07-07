import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { cartHandler } from "../store/redux/cart";
import { cartListUrl } from './constant';

export const addtoCart = async (id, Token) => {
  let cartAddUrl = cartListUrl + `?country=IN`;
  return await axios.post(cartAddUrl, JSON.stringify({
    // latitude: 11.0231552,
    // longitude: 77.0179072,
    // countryCode: 'IN',
    courses: [ id ],
    bundles: [],
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
      return response.data
    })
    .catch((err) => {
      console.log("Inside the catch...........addtoCart", err);
      return "error";
    })
}
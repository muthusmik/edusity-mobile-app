import axios from "axios";
import { getPurchasedUrl } from "./constant";

export const purchasedCourses = async (Token, page) => {
  return await axios
    .get(`${getPurchasedUrl}${page}`, { headers: { Authorization: `Bearer ${Token}` } })
    .then(response => {
      // console.log("Purchased Courses",response.data.data.data[0]);

      return response.data;
    })
    .catch((res) => {
      // console.log(res);
      return (res)
    });
};


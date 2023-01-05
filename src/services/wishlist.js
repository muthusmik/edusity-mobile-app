import axios from 'axios'
import { wishlistUrl } from './constant'


export const wishListApi = async(payload,token)=>{
     let url=wishlistUrl+payload;
    // let url="https://newlogin.edusity.com/send-otp";
    let data={"courseId":payload}
    const headers={Authorization:`Bearer ${token}`}
    // console.log("url",url,"rr",headers)
   await axios.post(url,data,{ headers: {Authorization:`Bearer ${token}`}}).then(response=> {
    // console.log("response")
    // console.log("finalData", response.data)
    return response.data
}).catch((err)=>{
    console.log(err)
})
}
export const wishListRemoverApi = async(payload,token)=>{
    let url=wishlistUrl+payload;
    let data={"courseId":payload}
    const headers={Authorization:`Bearer ${token}`}
    // console.log("deletedd.............................................")
   await axios.delete(url,{ headers: {Authorization:`Bearer ${token}`}}).then(response=> {
    // console.log("response deletedddd.")
    // console.log("finalData", response.data)
    return response.data
}).catch((err)=>{
    console.log(err)
})
}

export const getWishListedCourses = async (Token) => {
    // console.log("wishlisted")
    // const Token=useSelector(state=>state.loginHandle.data.data);
     return await  axios
        .get(`${wishlistUrl}`,{headers:{Authorization:`Bearer ${Token}`}})
        .then(response  => {
        //   console.log("WishList Courses",response.data);
         
           return response.data;
          
        })
        .catch((res) => {
        //   console.log(res);
          return(res)
        });
    };
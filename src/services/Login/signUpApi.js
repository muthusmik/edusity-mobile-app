
import axios from 'axios'
import { signupUrl } from '../constant';

export const signUpPostApi = async (payload,headers)=>{

   await axios.post(signupUrl, payload, { headers: headers }).then(response=> {
    // console.log("response")
    // console.log("finalData", response)
    return response.data
}).catch((err)=>{
    console.log(err)
})
}
import axios from 'axios'
import { loginUrl } from '../constant'


export const loginPostApi = async (payload,headers)=>{

   await axios.post(loginUrl, payload, { headers: headers }).then(response=> {
    console.log("response")
    console.log("finalData", response)
    return response.data
}).catch((err)=>{
    console.log(err)
})
}
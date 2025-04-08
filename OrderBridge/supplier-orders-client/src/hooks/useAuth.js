import { useSelector } from "react-redux"
import { selectToken } from "../features/auth/authSlice"
import {jwtDecode} from "jwt-decode"
const useAuth=()=>{
const token=useSelector(selectToken)
if(token)
{
    const decodedUser=jwtDecode(token)
    const {name,role,profil}=decodedUser
    return {name,role,profil}
}
console.log("no token")
return {username:'',role:''}
}
export default useAuth
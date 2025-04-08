import { useSelector } from "react-redux"
import { selectToken } from "./authSlice"
import { useEffect, useRef, useState } from "react"
import { useRefreshMutation } from "./authApiSlice"
import { Navigate, Outlet, useNavigate } from "react-router-dom"

const PersistLogin = () => {
    const navigate=useNavigate()
    const token = useSelector(selectToken)
    const effectRan = useRef(false)
    const [trueSuccess, setTrueSuccess] = useState(false)
    const [refresh, { isLoading, isSuccess, isError,isUninitialized,error }] = useRefreshMutation()
    useEffect(() => {
        if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
            const verifyRefreshToken = async () => {
                try {
                    await refresh()
                    setTrueSuccess(true)
                }
                catch (err) {
                    console.log(err)
                }
            }
            if(!token)
            verifyRefreshToken()
        }
        return()=>effectRan.current=true
    }, [])
    if(isError)
    {  
    navigate("/login") }
    return(<>{(isSuccess&&trueSuccess||isUninitialized&&token)&&<Outlet/>}</>)

}
export default PersistLogin
import{createApi,fetchBaseQuery}from "@reduxjs/toolkit/query/react"
import { setToken } from "../features/auth/authSlice"
const baseQuery=fetchBaseQuery(
    {
        baseUrl:"http://localhost:5000",
        credentials:'include',
        prepareHeaders:(headers,{getState})=>{
            const token=getState().auth.token
            if(token){
                console.log(token)
                headers.set("authorization",`Bearer ${token}`)
            }
           
        return headers
        }
    }
)
const baseQueryWithRefresh=async(args,app,extraOptions)=>{
    let  result=await baseQuery(args,app,extraOptions)
    if(result?.error?.status===403)
    {
        const refreshResult=await baseQuery("/api/auth/refresh",app,extraOptions)
        if(refreshResult?.data)
        {
            app.dispatch(setToken({...refreshResult.data}))
            result=await baseQuery(args,app,extraOptions)

        }
        else{
            if(refreshResult?.error?.status===403)
                refreshResult.error.data.message="your login has expired"
return refreshResult
        }
    }
    return result
}
const apiSlice=createApi(
    {
        reducerPath:"api",
        baseQuery:baseQueryWithRefresh,
        endpoints:()=>({})
    }
)
export default apiSlice

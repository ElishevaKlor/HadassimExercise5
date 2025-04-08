import apiSlice from "../../app/apiSlice";
import { logout, setToken } from "./authSlice";
const authApiSlice=apiSlice.injectEndpoints({
    endpoints:(build)=>({
        refresh:build.mutation({
            query:()=>({
                url:"/api/auth/refresh",
                method:'GET'
            }),
            async onQueryStarted(args,{dispatch,queryFulfilled})
            {
             try{
             const {data}=await queryFulfilled
             if(data.accessToken)
             dispatch(setToken(data))}
             catch(err)
             {
                 console.log(err)
             }
            }
        }),
        login:build.mutation({
            query:(data)=>({
                url:"/api/auth/login",
                method:'POST',
                body:data
            }),
           async onQueryStarted(args,{dispatch,queryFulfilled})
           {
            try{
            const {data}=await queryFulfilled
            if(data.accessToken)
            dispatch(setToken(data))}
            catch(err)
            {
                console.log(err)
            }
           }
        }),
        sendLogout:build.mutation({
            query:(data)=>({
                url:"/api/auth/logout",
                method:'POST',
                body:data
            }),
            async onQueryStarted(args,{dispatch,queryFulfilled}) {
                try{
                    await queryFulfilled
                    dispatch(logout())
                    setTimeout(()=>{
                     dispatch(apiSlice.util.resetApiState())
                    },1000)
                }
                catch(err)
                {
console.log(err)
                }
            }
            
        })

    })
})
export const{useLoginMutation,useRefreshMutation,useSendLogoutMutation}=authApiSlice
export default apiSlice
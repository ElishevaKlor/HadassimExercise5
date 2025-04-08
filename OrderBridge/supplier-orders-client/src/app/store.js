import {configureStore} from "@reduxjs/toolkit"
import authSlice from "../features/auth/authSlice"
import apiSlice from "./apiSlice"
const store=configureStore(
  {
    
    reducer:{
    [apiSlice.reducerPath]:apiSlice.reducer,
     auth:authSlice
  },
  middleware:(defaultMiddleware)=>defaultMiddleware().concat(apiSlice.middleware),
  devTools:true
}
)
export default store
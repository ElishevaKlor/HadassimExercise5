import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import apiSlice from "../app/apiSlice"; 

const storeGoodsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    checkStockAndOrder: builder.mutation({
      query: ({ goodId, quantity }) => ({
        url: `/api/storegoods/${goodId}`, 
        method: 'POST',
        body: { quantity },  
      }),
    }),
    addStoreGood: builder.mutation({
        query: (storeGood) => ({
          url: '/api/storegoods', 
          method: 'POST',
          body: storeGood,  
        }),
      }),
      getStoreGoods: builder.query({
        query: () => ({
          url: '/api/storegoods', 
          method: 'GET',  
        }),
      })
  }),
});

export const { useCheckStockAndOrderMutation,useAddStoreGoodMutation, useGetStoreGoodsQuery } = storeGoodsApiSlice;  

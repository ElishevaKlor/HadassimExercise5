import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import apiSlice from "../app/apiSlice";

const goodsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addGoods: builder.mutation({
      query: (goodsData) => ({
        url: '/api/goods', 
        method: 'POST',
        body: goodsData,
      }),
    }),
  }),
});

export const { useAddGoodsMutation } = goodsApiSlice;

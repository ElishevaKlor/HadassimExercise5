import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


import apiSlice from "../app/apiSlice";

const supplierApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSuppliers: builder.query({
            query: () => '/api/suppliers',
        }),
        addSupplier: builder.mutation({
            query: (supplierData) => ({
                url: '/api/suppliers',
                method: 'POST',
                body: supplierData,
            }),
        }),
        getSupplierGoods: builder.query({
            query: ({_id}) => ({
                url: `/api/suppliers/${_id}`,
                method: 'GET'
            }),
        }),
    }),
});



export const { useGetSuppliersQuery, useAddSupplierMutation, useGetSupplierGoodsQuery } = supplierApiSlice;

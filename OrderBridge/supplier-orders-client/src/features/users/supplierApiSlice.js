const { default: apiSlice } = require("../../app/apiSlice");

const supplierApiSlice = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        addSupplier: build.mutation({
            query: (data) => ({
                url: "/api/suppliers",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Supplier"],
        }),
        updateSupplier: build.mutation({
            query: (data) => ({
                url: "/api/suppliers",
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Supplier"],
        }),
        deleteSupplier: build.mutation({
            query: (data) => ({
                url: "/api/suppliers",
                method: "DELETE",
                body: data,
            }),
            invalidatesTags: ["Supplier"],
        }),
    }),
});

export const { 
    useAddSupplierMutation, 
    useUpdateSupplierMutation, 
    useDeleteSupplierMutation 
} = supplierApiSlice;

export default supplierApiSlice;

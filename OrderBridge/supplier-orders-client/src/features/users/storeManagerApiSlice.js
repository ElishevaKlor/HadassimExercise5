const { default: apiSlice } = require("../../app/apiSlice");

const storeManagerApiSlice = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        addStoreManager: build.mutation({
            query: (data) => ({
                url: "/api/store-managers",
                method: "POST",
                body: data,
            }),
            invalidatesTags: [{ type: "StoreManager", id: "LIST" }],
        }),
        GetAdminById: build.query({  
            query: (adminId) => `/admins/${adminId}`,
        }),
    }),
});

export const { 
    useAddStoreManagerMutation, 
    useGetAdminByIdQuery
} = storeManagerApiSlice;

export default storeManagerApiSlice;

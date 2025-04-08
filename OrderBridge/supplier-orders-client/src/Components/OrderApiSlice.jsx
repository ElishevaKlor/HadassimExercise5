import apiSlice from "../app/apiSlice";

const orderApiSlice = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        getOrders: build.query({
            query: () => ({
                url: "/api/orders",
            }),
            providesTags: ['Orders']
        }),
        getOrdersBySupplier: build.query({
            query: () => ({
                url: "/api/orders/supplier",
            }),
            providesTags: ['Orders']
        }),
        createOrder: build.mutation({
            query: (order) => ({
                url: "/api/orders",
                method: "POST",
                body: order
            }),
            invalidatesTags: ['Orders']

            
        }),
        getOrderStatuses: build.query({
          query: () => ({
              url: "/api/orders/order-statuses", 
          }),
          providesTags: ['OrderStatuses']
      }),
        updateOrderStatus: build.mutation({
            query: ({ orderId, status }) => ({
                url: `/api/orders`,
                method: "PUT",
                body: { orderId, status }
            }),
            invalidatesTags: ['Orders']
        }),
    })
});

export const {
    useGetOrdersQuery,
    useGetOrdersBySupplierQuery,
    useCreateOrderMutation,
    useUpdateOrderStatusMutation,
    useGetOrderStatusesQuery
} = orderApiSlice;

export default orderApiSlice;

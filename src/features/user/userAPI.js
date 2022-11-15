import { apiSlice } from "../api/apiSlice";
const userAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => `/users`,
      providesTags: ["StoreUser", "UpdateUser", "DeleteUser"],
    }),
    storeUser: builder.mutation({
      query: (data) => ({
        url: "/users",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["StoreUser"],
    }),
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["UpdateUser"],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DeleteUser"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useUpdateUserMutation,
  useStoreUserMutation,
  useDeleteUserMutation,
} = userAPI;

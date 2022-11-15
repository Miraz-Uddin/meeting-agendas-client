import { apiSlice } from "../api/apiSlice";
const userAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => `/users`,
    }),
  }),
});

export const { useGetUsersQuery } = userAPI;

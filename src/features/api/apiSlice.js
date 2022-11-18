import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_URL,
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    if (result?.error?.status === 401) {
      localStorage.clear();
    }
    return result;
  },
  tagTypes: [
    "StoreUser",
    "UpdateUser",
    "DeleteUser",
    "StoreMeeting",
    "UpdateMeeting",
    "DeleteMeeting",
    "StoreAgenda",
    "UpdateAgenda",
    "DeleteAgenda",
  ],
  endpoints: (builder) => ({}),
});

import { apiSlice } from "../api/apiSlice";
export const meetingAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMeetings: builder.query({
      query: () => `/meetings`,
      providesTags: [
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
    }),
    getMeeting: builder.query({
      query: (meetingId) => `/meetings/${meetingId}`,
      providesTags: [
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
    }),
    storeMeeting: builder.mutation({
      query: (data) => ({
        url: "/meetings",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["StoreMeeting"],
    }),
    updateMeeting: builder.mutation({
      query: ({ id, data }) => ({
        url: `/meetings/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["UpdateMeeting"],
    }),
    deleteMeeting: builder.mutation({
      query: (meetingId) => ({
        url: `/meetings/${meetingId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DeleteMeeting"],
    }),
  }),
});

export const {
  useGetMeetingsQuery,
  useStoreMeetingMutation,
  useUpdateMeetingMutation,
  useDeleteMeetingMutation,
  useGetMeetingQuery,
} = meetingAPI;

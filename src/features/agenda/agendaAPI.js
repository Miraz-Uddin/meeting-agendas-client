import { apiSlice } from "../api/apiSlice";
const agendaAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAgendas: builder.query({
      query: (meetingId) => {
        let query = "";
        if (meetingId === null || meetingId === undefined || meetingId === "") {
          query = "";
        } else {
          query = `?meetingId=${meetingId}`;
        }
        return `/agendas${query}`;
      },
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
    storeAgenda: builder.mutation({
      query: (data) => ({
        url: "/agendas",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["StoreAgenda"],
    }),
    updateAgenda: builder.mutation({
      query: ({ id, data }) => ({
        url: `/agendas/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["UpdateAgenda"],
    }),
    deleteAgenda: builder.mutation({
      query: (agendaId) => ({
        url: `/agendas/${agendaId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DeleteAgenda"],
    }),
  }),
});

export const {
  useGetAgendasQuery,
  useStoreAgendaMutation,
  useUpdateAgendaMutation,
  useDeleteAgendaMutation,
} = agendaAPI;

import React from "react";
import { useGetUserQuery } from "../../features/user/userAPI";

export default function Facilitator({ userId }) {
  const { data, isLoading, isError } = useGetUserQuery(userId);
  if (!isLoading && !isError) {
    return <span>{data?.name}</span>;
  } else {
    return <span>Not Found</span>;
  }
}

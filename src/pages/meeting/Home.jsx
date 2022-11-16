import moment from "moment/moment";
import { React, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useGetMeetingsQuery } from "../../features/meeting/meetingAPI";
import Facilitator from "./Facilitator";
import MeetingModal from "./MeetingModal";
// import { useSnackbar } from "notistack";
// import {useDeleteMeetingMutation} from "../../features/meeting/meetingAPI";

export default function Home() {
  // const { enqueueSnackbar } = useSnackbar();
  const { data: meetings, isLoading, isError } = useGetMeetingsQuery();
  // const [deleteMeeting] = useDeleteMeetingMutation();
  let content;
  if (isLoading)
    content = (
      <tr>
        <td>Meetings Loading ....</td>
      </tr>
    );
  if (!isLoading && isError)
    content = (
      <tr>
        <td>Error while Fetching Meetings</td>
      </tr>
    );
  if (!isLoading && !isError && meetings?.length === 0)
    content = (
      <tr>
        <td>No Meetings Found</td>
      </tr>
    );
  if (!isLoading && !isError && meetings?.length > 0) {
    content = meetings.map((meeting, i) => {
      return (
        <tr key={meeting.id}>
          <td>{++i}</td>
          <td>{meeting.title}</td>
          <td className="text-center">
            {moment(meeting.startTime).format("h:mm a | DD MMMM")}
          </td>
          <td className="text-center">
            {moment(meeting.endTime).format("h:mm a | DD MMMM")}
          </td>
          <td className="text-center">
            <Facilitator userId={meeting.facilitator} />{" "}
          </td>
          <td>
            {" "}
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleEdit(meeting)}
            >
              Edit
            </Button>{" "}
            {/* Will work later */}
            {/* <Button
              variant="danger"
              size="sm"
              onClick={() => handleDeleteMeeting(meeting.id)}
            >
              Delete
            </Button>{" "} */}
          </td>
        </tr>
      );
    });
  }

  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [meetingInfo, setMeetingInfo] = useState(undefined);
  const handleAdd = () => {
    setMeetingInfo(undefined);
    setAddModal(true);
  };
  const handleEdit = (meeting) => {
    setMeetingInfo(meeting);
    setEditModal(true);
  };

  const handleAddHide = () => {
    setMeetingInfo(undefined);
    setAddModal(false);
  };
  const handleEditHide = () => {
    setMeetingInfo(undefined);
    setEditModal(false);
  };

  // const handleDeleteMeeting = (id) => {
  //   enqueueSnackbar("Meeting Deleted Successfully", {
  //     variant: "success",
  //   });
  //   deleteMeeting(id);
  // };

  return (
    <div className="p-4">
      <MeetingModal
        meeting={undefined}
        show={addModal}
        onHide={handleAddHide}
      />
      <MeetingModal
        meeting={meetingInfo}
        show={editModal}
        onHide={handleEditHide}
      />
      <h3 className="d-flex justify-content-between">
        <span>Meetings List </span>
        <span>
          {" "}
          <Button variant="success" size="md" onClick={handleAdd}>
            Add New Meeting
          </Button>{" "}
        </span>
      </h3>

      <Table
        striped
        hover
        responsive
        style={{
          borderLeft: "1px solid #2c2c2c",
          borderRight: "1px solid #2c2c2c",
        }}
      >
        <thead
          style={{
            borderTop: "1px solid #2c2c2c",
          }}
        >
          <tr>
            <th>#</th>
            <th>Title</th>
            <th className="text-center">Start Time</th>
            <th className="text-center">End Time</th>
            <th className="text-center">Facilitator</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody
          style={{
            borderBottom: "1px solid #2c2c2c",
          }}
        >
          {content}
        </tbody>
      </Table>
    </div>
  );
}

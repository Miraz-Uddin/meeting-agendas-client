import Multiselect from "multiselect-react-dropdown";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import DateTimePicker from "react-datetime-picker";
import { useNavigate } from "react-router-dom";
import {
  useStoreMeetingMutation,
  useUpdateMeetingMutation,
} from "../../features/meeting/meetingAPI";
import { useGetUsersQuery } from "../../features/user/userAPI";
export default function MeetingModal(props) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [
    updateMeeting,
    {
      data: meetingUpdatedData,
      isLoading: meetingUpdating,
      isError: meetingUpdateError,
    },
  ] = useUpdateMeetingMutation();
  const [
    storeMeeting,
    {
      data: meetingStoredData,
      isLoading: meetingStoring,
      isError: meetingStoreError,
    },
  ] = useStoreMeetingMutation();

  const { onHide, show, meeting } = props;
  const { title, startTime, endTime, facilitator, attendees, id } =
    meeting || {};
  const timeA = new Date(startTime);
  const timeB = new Date(endTime);
  const [meetingTitle, setMeetingTitle] = useState(title ?? " ");
  const [meetingStartTime, setMeetingStartTime] = useState(
    startTime === undefined ? null : timeA.getTime()
  );
  const [meetingEndTime, setMeetingEndTime] = useState(
    endTime === undefined ? null : timeB.getTime()
  );
  const [meetingFacilitator, setMeetingFacilitator] = useState(facilitator);
  const [meetingAttendees, setMeetingAttendees] = useState(attendees ?? []);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      meetingAttendees === null ||
      meetingAttendees === undefined ||
      meetingAttendees === ""
    ) {
      enqueueSnackbar("Please Add Atleast 1 Participant", {
        variant: "warning",
      });
    } else if (
      meetingTitle === null ||
      meetingTitle === undefined ||
      meetingTitle === ""
    ) {
      enqueueSnackbar("Please Insert a Title", { variant: "error" });
    } else if (meetingFacilitator === undefined || meetingFacilitator === "") {
      enqueueSnackbar("Please Choose a Facilitator", { variant: "error" });
    } else {
      if (
        meetingStartTime === null ||
        meetingStartTime === undefined ||
        meetingEndTime === null ||
        meetingEndTime === undefined
      ) {
        enqueueSnackbar("Please Choose a Date", { variant: "error" });
      } else {
        const time1 = new Date(meetingStartTime);
        const meetingBegin = time1.getTime();
        const time2 = new Date(meetingEndTime);
        const meetingEnd = time2.getTime();
        if (meetingBegin >= meetingEnd) {
          enqueueSnackbar(
            "Ending time should not be less or equal to Start time",
            { variant: "warning" }
          );
        } else {
          if (id) {
            updateMeeting({
              id,
              data: {
                title: meetingTitle,
                startTime: meetingBegin,
                endTime: meetingEnd,
                facilitator: +meetingFacilitator,
                attendees: meetingAttendees,
              },
            });
          } else {
            storeMeeting({
              title: meetingTitle,
              startTime: meetingBegin,
              endTime: meetingEnd,
              facilitator: +meetingFacilitator,
              attendees: meetingAttendees,
            });
          }
          onHide();
        }
      }
    }
  };
  useEffect(() => {
    setMeetingTitle(title);
  }, [title]);
  useEffect(() => {
    if (startTime !== undefined) {
      const timeA = new Date(startTime);
      setMeetingStartTime(timeA);
    }
    if (endTime !== undefined) {
      const timeB = new Date(endTime);
      setMeetingEndTime(timeB);
    }
    setMeetingFacilitator(facilitator);
    setMeetingAttendees(attendees);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meeting]);

  useEffect(() => {
    if (meetingStoreError) {
      const errorMessage = meetingStoreError?.data?.error?.message;
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
    if (meetingUpdateError) {
      const errorMessage = meetingUpdateError?.data?.error?.message;
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
    if (meetingStoredData) {
      enqueueSnackbar("Meeting Created Successfully", { variant: "success" });
      navigate("/");
    }
    if (meetingUpdatedData) {
      enqueueSnackbar("Meeting Updated Successfully", { variant: "success" });
      navigate("/");
    }
  }, [
    meetingStoreError,
    meetingUpdateError,
    meetingStoredData,
    meetingUpdatedData,
    enqueueSnackbar,
    navigate,
  ]);

  const {
    data: users,
    isLoading: isUserLoading,
    isError: isUserLoadingError,
  } = useGetUsersQuery();
  const attendeesSelect = (selectedList, selectedItem) => {
    setMeetingAttendees(selectedList);
  };
  let userDropdown;
  if (isUserLoading) {
    userDropdown = (
      <Form.Select
        aria-label="Default select example"
        defaultValue={""}
        disabled={true}
      >
        <option>Users Data Loading ...</option>
      </Form.Select>
    );
  }
  if (!isUserLoading && isUserLoadingError) {
    userDropdown = (
      <Form.Select
        aria-label="Default select example"
        defaultValue={""}
        disabled={true}
      >
        <option>Error While Fetching Users Data</option>
      </Form.Select>
    );
  }
  if (!isUserLoading && !isUserLoadingError && users?.length === 0) {
    userDropdown = (
      <Form.Select
        aria-label="Default select example"
        defaultValue={""}
        disabled={true}
      >
        <option>No User Found</option>
      </Form.Select>
    );
  }
  if (!isUserLoading && !isUserLoadingError && users?.length > 0) {
    userDropdown = (
      <>
        <Form.Select
          aria-label="Default select example"
          value={meetingFacilitator}
          onChange={(e) => {
            setMeetingFacilitator(e.target.value);
          }}
        >
          <option value={""}>Choose a Facilitator</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </Form.Select>
        <Form.Label className="mt-2">Participants</Form.Label>
        <Multiselect
          displayValue="name"
          onKeyPressFn={function noRefCheck() {}}
          onRemove={function noRefCheck() {}}
          onSearch={function noRefCheck() {}}
          onSelect={attendeesSelect}
          options={[...users]}
          selectedValues={
            meetingAttendees === undefined ? [] : [...meetingAttendees]
          }
        />
      </>
    );
  }

  return (
    <Modal
      onHide={onHide}
      show={show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {id ? "Edit" : "Add"} Meeting
        </Modal.Title>
      </Modal.Header>
      <Form>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Title</Form.Label>
            <Form.Control
              defaultValue={meetingTitle}
              type="text"
              placeholder="Enter Meeting Title"
              onChange={(e) => setMeetingTitle(e.target.value)}
            />
          </Form.Group>
          <Row>
            <Col>
              <Form.Label>Start Time</Form.Label>
              {meetingStartTime !== null ?? meetingStartTime.getTime()}
              <br />
              <DateTimePicker
                onChange={setMeetingStartTime}
                value={meetingStartTime}
              />
            </Col>
            <Col>
              <Form.Label>Ending Time</Form.Label>
              <br />
              <DateTimePicker
                onChange={setMeetingEndTime}
                value={meetingEndTime}
              />
            </Col>
          </Row>
          <Form.Group className="mb-3" controlId="formName"></Form.Group>
          <Form.Label>Facilitator Name</Form.Label>
          {userDropdown}
        </Modal.Body>
        <Modal.Footer>
          <Button
            disabled={meetingUpdating || meetingStoring}
            onClick={handleSubmit}
            type="submit"
          >
            {id ? "Update" : "Create"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

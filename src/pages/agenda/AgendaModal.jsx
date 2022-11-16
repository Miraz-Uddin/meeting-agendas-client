import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import DateTimePicker from "react-datetime-picker";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useStoreAgendaMutation,
  useUpdateAgendaMutation,
} from "../../features/agenda/agendaAPI";
import {
  meetingAPI,
  useGetMeetingsQuery,
} from "../../features/meeting/meetingAPI";
import { useGetUsersQuery } from "../../features/user/userAPI";
export default function AgendaModal(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [
    updateAgenda,
    {
      data: agendaUpdatedData,
      isLoading: agendaUpdating,
      isError: agendaUpdateError,
    },
  ] = useUpdateAgendaMutation();
  const [
    storeAgenda,
    {
      data: agendaStoredData,
      isLoading: agendaStoring,
      isError: agendaStoreError,
    },
  ] = useStoreAgendaMutation();

  const { onHide, show, agenda } = props;
  const { name, startTime, endTime, shortDescription, speaker, meetingId, id } =
    agenda || {};
  const timeA = new Date(startTime);
  const timeB = new Date(endTime);
  const [agendaName, setAgendaName] = useState(name ?? " ");
  const [agendaStartTime, setAgendaStartTime] = useState(
    startTime === undefined ? null : timeA.getTime()
  );
  const [agendaEndTime, setAgendaEndTime] = useState(
    endTime === undefined ? null : timeB.getTime()
  );
  const [agendaShortDescription, setAgendaShortDescription] = useState(
    shortDescription ?? " "
  );
  const [agendaSpeaker, setAgendaSpeaker] = useState(speaker?.id);
  const [agendaMeetingId, setAgendaMeetingId] = useState(meetingId ?? null);
  const [agendaMeetingInfo, setAgendaMeetingInfo] = useState(meetingId ?? null);

  useEffect(() => {
    if (
      agendaMeetingId !== undefined ||
      agendaMeetingId !== null ||
      agendaMeetingId !== ""
    ) {
      dispatch(
        meetingAPI.endpoints.getMeeting.initiate(agendaMeetingId, {
          forceRefetch: true,
        })
      )
        .unwrap()
        .then((data) => {
          setAgendaMeetingInfo(data);
        })
        .catch((err) => {});
    }
  }, [agendaMeetingId, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (agendaName === null || agendaName === undefined || agendaName === "") {
      enqueueSnackbar("Please Insert Agenda Topic", { variant: "error" });
    } else if (
      agendaMeetingId === null ||
      agendaMeetingId === undefined ||
      agendaMeetingId === ""
    ) {
      enqueueSnackbar("Please Choose a Meeting", { variant: "error" });
    } else {
      if (agendaStartTime === null || agendaStartTime === undefined) {
        enqueueSnackbar("Please Choose Agenda Start Time", {
          variant: "error",
        });
      } else if (agendaEndTime === null || agendaEndTime === undefined) {
        enqueueSnackbar("Please Choose Agenda End Time", { variant: "error" });
      } else {
        const time1 = new Date(agendaStartTime);
        const agendaBegin = time1.getTime();
        const time2 = new Date(agendaEndTime);
        const agendaEnd = time2.getTime();
        if (agendaBegin >= agendaEnd) {
          enqueueSnackbar(
            "Ending time should not be less or equal to Start time",
            { variant: "warning" }
          );
        } else if (agendaMeetingInfo.startTime > agendaBegin) {
          enqueueSnackbar(
            "Agenda Discussion Can not Start Before Meeting Start time , Please Check Meeting Start time again",
            {
              variant: "info",
            }
          );
        } else if (agendaMeetingInfo.endTime < agendaEnd) {
          enqueueSnackbar(
            "Agenda Discussion Can not End After Meeting Ending time , Please Check Meeting Ending time again",
            {
              variant: "info",
            }
          );
        } else {
          if (agendaSpeaker === undefined) {
            if (id) {
              updateAgenda({
                id,
                data: {
                  name: agendaName,
                  shortDescription: agendaShortDescription ?? null,
                  startTime: agendaBegin,
                  endTime: agendaEnd,
                  speaker: {},
                  meetingId: agendaMeetingId,
                },
              });
            } else {
              storeAgenda({
                name: agendaName,
                shortDescription: agendaShortDescription ?? null,
                startTime: agendaBegin,
                endTime: agendaEnd,
                speaker: {},
                meetingId: agendaMeetingId,
              });
            }
            onHide();
          } else if (agendaSpeaker !== undefined && +agendaSpeaker !== 0) {
            let speakerInfo;
            let isFound = agendaMeetingInfo.attendees.find((el) => {
              speakerInfo = el;
              return el.id === +agendaSpeaker;
            });
            if (isFound) {
              if (id) {
                updateAgenda({
                  id,
                  data: {
                    name: agendaName,
                    shortDescription: agendaShortDescription ?? null,
                    startTime: agendaBegin,
                    endTime: agendaEnd,
                    // speaker: +agendaSpeaker,
                    speaker: speakerInfo,
                    meetingId: agendaMeetingId,
                  },
                });
              } else {
                storeAgenda({
                  name: agendaName,
                  shortDescription: agendaShortDescription ?? null,
                  startTime: agendaBegin,
                  endTime: agendaEnd,
                  speaker: speakerInfo,
                  // speaker: +agendaSpeaker,
                  meetingId: agendaMeetingId,
                });
              }
              onHide();
            } else {
              enqueueSnackbar(
                "Select a Speaker who is Present in the Meeting or Just Keep it Blank",
                {
                  variant: "info",
                }
              );
            }
          } else {
            if (id) {
              updateAgenda({
                id,
                data: {
                  name: agendaName,
                  shortDescription: agendaShortDescription ?? null,
                  startTime: agendaBegin,
                  endTime: agendaEnd,
                  speaker: {},
                  meetingId: agendaMeetingId,
                },
              });
            } else {
              storeAgenda({
                name: agendaName,
                shortDescription: agendaShortDescription ?? null,
                startTime: agendaBegin,
                endTime: agendaEnd,
                speaker: {},
                meetingId: agendaMeetingId,
              });
            }
            onHide();
          }
        }
      }
    }
  };

  useEffect(() => {
    setAgendaName(name);
    setAgendaShortDescription(shortDescription);
    setAgendaMeetingId(meetingId);
  }, [name, shortDescription, meetingId]);

  useEffect(() => {
    if (startTime !== undefined) {
      const timeA = new Date(startTime);
      setAgendaStartTime(timeA);
    }
    if (endTime !== undefined) {
      const timeB = new Date(endTime);
      setAgendaEndTime(timeB);
    }
    setAgendaSpeaker(speaker?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agenda]);

  useEffect(() => {
    if (agendaStoreError) {
      const errorMessage = agendaStoreError?.data?.error?.message;
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
    if (agendaUpdateError) {
      const errorMessage = agendaUpdateError?.data?.error?.message;
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
    if (agendaStoredData) {
      enqueueSnackbar("Agenda Created Successfully", { variant: "success" });
      navigate("/agendas");
    }
    if (agendaUpdatedData) {
      enqueueSnackbar("Agenda Updated Successfully", { variant: "success" });
      navigate("/agendas");
    }
  }, [
    agendaStoreError,
    agendaUpdateError,
    agendaStoredData,
    agendaUpdatedData,
    enqueueSnackbar,
    navigate,
  ]);

  const {
    data: users,
    isLoading: isUserLoading,
    isError: isUserLoadingError,
  } = useGetUsersQuery();
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
          value={agendaSpeaker}
          onChange={(e) => {
            setAgendaSpeaker(e.target.value);
          }}
        >
          <option value={""}>Choose a Speaker</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </Form.Select>
      </>
    );
  }

  const {
    data: meetings,
    isLoading: isMeetingsLoading,
    isError: isMeetingsError,
  } = useGetMeetingsQuery();
  let meetingsDropdown;
  if (isMeetingsLoading) {
    meetingsDropdown = (
      <Form.Select
        aria-label="Default select example"
        defaultValue={""}
        disabled={true}
      >
        <option>Meetings Loading ...</option>
      </Form.Select>
    );
  }
  if (!isMeetingsLoading && isMeetingsError) {
    meetingsDropdown = (
      <Form.Select
        aria-label="Default select example"
        defaultValue={""}
        disabled={true}
      >
        <option>Error While Fetching Meetings</option>
      </Form.Select>
    );
  }
  if (!isMeetingsLoading && !isMeetingsError && meetings?.length === 0) {
    meetingsDropdown = (
      <Form.Select
        aria-label="Default select example"
        defaultValue={""}
        disabled={true}
      >
        <option>No Meeting Found</option>
      </Form.Select>
    );
  }
  if (!isMeetingsLoading && !isMeetingsError && meetings?.length > 0) {
    meetingsDropdown = (
      <>
        <Form.Select
          aria-label="Default select example"
          value={agendaMeetingId}
          onChange={(e) => {
            setAgendaMeetingId(e.target.value);
          }}
        >
          <option value={""}>Choose a Meeting</option>
          {meetings.map((meeting) => (
            <option
              key={meeting.id}
              value={meeting.id}
              //   className="d-inline-block text-truncate"
              style={{
                maxWidth: "100px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {meeting.title}
            </option>
          ))}
        </Form.Select>
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
          {id ? "Edit" : "Add"} Agenda
        </Modal.Title>
      </Modal.Header>
      <Form>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Meeting Name</Form.Label>
            {meetingsDropdown}
            <Form.Label className="mt-3">Agenda Topic</Form.Label>
            <Form.Control
              defaultValue={agendaName}
              type="text"
              placeholder="Enter Meeting Title"
              onChange={(e) => setAgendaName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formShortDescription">
            <Form.Label>Short Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              defaultValue={agendaShortDescription}
              placeholder="Enter Agenda Short Description"
              onChange={(e) => setAgendaShortDescription(e.target.value)}
            />
          </Form.Group>
          <Row>
            <Col>
              <Form.Label>Start Time</Form.Label>
              {agendaStartTime !== null ?? agendaStartTime.getTime()}
              <br />
              <DateTimePicker
                onChange={setAgendaStartTime}
                value={agendaStartTime}
              />
            </Col>
            <Col>
              <Form.Label>Ending Time</Form.Label>
              <br />
              <DateTimePicker
                onChange={setAgendaEndTime}
                value={agendaEndTime}
              />
            </Col>
          </Row>
          <Form.Group className="mb-3" controlId="formSpeakerName"></Form.Group>
          <Form.Label>Speaker Name</Form.Label>
          {userDropdown}
        </Modal.Body>
        <Modal.Footer>
          <Button
            disabled={agendaUpdating || agendaStoring}
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

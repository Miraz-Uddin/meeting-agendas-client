import moment from "moment/moment";
import { React, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useGetAgendasQuery } from "../../features/agenda/agendaAPI.js";
import Facilitator from "../meeting/Facilitator";
import AgendaModal from "./AgendaModal";
// import { useSnackbar } from "notistack";
// import {useDeleteAgendaMutation} from "../../features/agenda/agendaAPI.js";

export default function Agendas() {
  // const { enqueueSnackbar } = useSnackbar();
  const { data: agendas, isLoading, isError } = useGetAgendasQuery();
  // const [deleteAgenda] = useDeleteAgendaMutation();
  let content;
  if (isLoading)
    content = (
      <tr>
        <td>Agendas Loading ....</td>
      </tr>
    );
  if (!isLoading && isError)
    content = (
      <tr>
        <td>Error while Fetching Agendas</td>
      </tr>
    );
  if (!isLoading && !isError && agendas?.length === 0)
    content = (
      <tr>
        <td>No Agendas Found</td>
      </tr>
    );
  if (!isLoading && !isError && agendas?.length > 0) {
    content = agendas.map((agenda, i) => {
      return (
        <tr key={agenda.id}>
          <td>{++i}</td>
          <td>{agenda.name}</td>
          <td>{agenda.meetingId}</td>
          <td className="text-center">
            {moment(agenda.startTime).format("h:mm a | DD MMMM")}
          </td>
          <td className="text-center">
            {moment(agenda.endTime).format("h:mm a | DD MMMM")}
          </td>
          <td className="text-center">{agenda.shortDescription ?? "- - -"}</td>
          <td className="text-center">
            <Facilitator userId={agenda.speaker} />{" "}
          </td>
          <td>
            {" "}
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleEdit(agenda)}
            >
              Edit
            </Button>{" "}
            {/* Will work later */}
            {/* <Button
              variant="danger"
              size="sm"
              onClick={() => handleDeleteAgenda(agenda.id)}
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
  const [agendaInfo, setAgendaInfo] = useState(undefined);
  const handleAdd = () => {
    setAgendaInfo(undefined);
    setAddModal(true);
  };
  const handleEdit = (agenda) => {
    setAgendaInfo(agenda);
    setEditModal(true);
  };

  const handleAddHide = () => {
    setAgendaInfo(undefined);
    setAddModal(false);
  };
  const handleEditHide = () => {
    setAgendaInfo(undefined);
    setEditModal(false);
  };

  // const handleDeleteAgenda = (id) => {
  //   enqueueSnackbar("Agenda Deleted Successfully", {
  //     variant: "success",
  //   });
  //   deleteAgenda(id);
  // };

  return (
    <div className="p-4">
      <AgendaModal agenda={undefined} show={addModal} onHide={handleAddHide} />
      <AgendaModal
        agenda={agendaInfo}
        show={editModal}
        onHide={handleEditHide}
      />
      <h3 className="d-flex justify-content-between">
        <span>Agendas List </span>
        <span>
          {" "}
          <Button variant="success" size="md" onClick={handleAdd}>
            Add New Agenda
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
            <th>Name</th>
            <th>Meeting Id</th>
            <th className="text-center">Start Time</th>
            <th className="text-center">End Time</th>
            <th className="text-center">Short Description</th>
            <th className="text-center">Speaker</th>
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

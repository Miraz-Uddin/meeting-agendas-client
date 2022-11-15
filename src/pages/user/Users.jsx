import { useSnackbar } from "notistack";
import { React, useState } from "react";
import { Button, Table } from "react-bootstrap";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from "../../features/user/userAPI";
import UserModal from "./UserModal";

export default function Users() {
  const { enqueueSnackbar } = useSnackbar();
  const { data: users, isLoading, isError } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  let content;
  if (isLoading)
    content = (
      <tr>
        <td>Users Loading ....</td>
      </tr>
    );
  if (!isLoading && isError)
    content = (
      <tr>
        <td>Error while Fetching Users</td>
      </tr>
    );
  if (!isLoading && !isError && users?.length === 0)
    content = (
      <tr>
        <td>No Users Found</td>
      </tr>
    );
  if (!isLoading && !isError && users?.length > 0) {
    content = users.map((user, i) => {
      return (
        <tr key={user.id}>
          <td>{++i}</td>
          <td>{user.name}</td>
          <td>{user.designation}</td>
          <td>
            {" "}
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleEdit(user)}
            >
              Edit
            </Button>{" "}
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleDeleteUser(user.id)}
            >
              Delete
            </Button>{" "}
          </td>
        </tr>
      );
    });
  }

  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [userInfo, setUserInfo] = useState(undefined);
  const handleEdit = (user) => {
    setUserInfo(user);
    setEditModal(true);
  };

  const handleAddHide = () => {
    setUserInfo(undefined);
    setAddModal(false);
  };
  const handleEditHide = () => {
    setUserInfo(undefined);
    setEditModal(false);
  };

  const handleDeleteUser = (id) => {
    enqueueSnackbar("User Deleted Successfully", {
      variant: "success",
    });
    deleteUser(id);
  };

  return (
    <div className="p-4">
      <UserModal user={undefined} show={addModal} onHide={handleAddHide} />
      <UserModal user={userInfo} show={editModal} onHide={handleEditHide} />
      <h3 className="d-flex justify-content-between">
        <span>Users List </span>
        <span>
          {" "}
          <Button variant="success" size="md" onClick={() => setAddModal(true)}>
            Add New User
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
            <th>Designation</th>
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

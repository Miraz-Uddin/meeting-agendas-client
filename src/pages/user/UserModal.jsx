import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  useStoreUserMutation,
  useUpdateUserMutation,
} from "../../features/user/userAPI";

export default function UserModal(props) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [
    updateUser,
    {
      data: userUpdatedData,
      isLoading: userUpdating,
      isError: userUpdateError,
    },
  ] = useUpdateUserMutation();
  const [
    storeUser,
    { data: userStoredData, isLoading: userStoring, isError: userStoreError },
  ] = useStoreUserMutation();
  const { onHide, show, user } = props;
  const { designation, name, id } = user || {};
  const [userName, setUserName] = useState(name ?? " ");
  const [userDesignation, setUserDesignation] = useState(designation ?? " ");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      userName === null ||
      userName === undefined ||
      userName === "" ||
      userDesignation === null ||
      userDesignation === undefined ||
      userDesignation === ""
    ) {
      enqueueSnackbar("Please Fillup all fields", { variant: "error" });
    } else {
      if (id) {
        updateUser({
          id,
          data: {
            name: userName,
            designation: userDesignation,
          },
        });
      } else {
        storeUser({
          name: userName,
          designation: userDesignation,
        });
      }
      onHide();
    }
  };

  useEffect(() => {
    setUserName(name);
    setUserDesignation(designation);
  }, [name, designation]);

  useEffect(() => {
    if (userStoreError) {
      const errorMessage = userStoreError?.data?.error?.message;
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
    if (userUpdateError) {
      const errorMessage = userUpdateError?.data?.error?.message;
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
    if (userStoredData) {
      enqueueSnackbar("User Created Successfully", { variant: "success" });
      navigate("/users");
    }
    if (userUpdatedData) {
      enqueueSnackbar("User Updated Successfully", { variant: "success" });
      navigate("/users");
    }
  }, [
    userStoreError,
    userUpdateError,
    userStoredData,
    userUpdatedData,
    enqueueSnackbar,
    navigate,
  ]);
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
          {id ? "Edit" : "Add"} User
        </Modal.Title>
      </Modal.Header>
      <Form>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              defaultValue={userName}
              type="text"
              placeholder="Enter Name"
              // value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Designation</Form.Label>
            <Form.Control
              defaultValue={userDesignation}
              type="text"
              placeholder="Enter Your Designation"
              // value={userDesignation}
              onChange={(e) => setUserDesignation(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            disabled={userUpdating || userStoring}
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

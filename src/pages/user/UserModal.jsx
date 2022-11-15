import { Button, Form, Modal } from "react-bootstrap";

export default function UserModal(props) {
  const { onHide, show, user } = props;
  const { designation, name, id } = user || {};
  const handleSubmit = (e) => {
    onHide();
    e.preventDefault();
    // if(id){

    // }else{

    // }
  };
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
              defaultValue={name}
              type="text"
              placeholder="Enter Name"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Designation</Form.Label>
            <Form.Control
              defaultValue={designation}
              type="text"
              placeholder="Enter Your Designation"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit} type="submit">
            {id ? "Update" : "Create"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

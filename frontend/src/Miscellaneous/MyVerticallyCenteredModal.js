import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Image } from "react-bootstrap";
import { ChatState } from "../Context/ChatProvider";
function MyVerticallyCenteredModal({ user, ...props }) {
  //const { user } = ChatState();
  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header style={{margin:"0 auto"}}>
        <Modal.Title>Your Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            src={user.pic}
            roundedCircle
            style={{ width: "200px", height: "200px" }}
          />
        </div>
        <h4>{user.email}</h4>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default MyVerticallyCenteredModal;

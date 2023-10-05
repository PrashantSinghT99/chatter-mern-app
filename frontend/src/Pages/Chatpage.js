import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Image } from "react-bootstrap";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ChatBox from "../Components/ChatBox";
import MyChats from "../Components/MyChats";
import ListGroup from "react-bootstrap/ListGroup";
import MyVerticallyCenteredModal from "../Miscellaneous/MyVerticallyCenteredModal";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../Context/ChatProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Logo from "../Assests/logo.svg";
const Chatpage = () => {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [modalShow, setModalShow] = React.useState(false);
  const navigate = useNavigate();
  const { user, chats, setSelectedChat, setChats } = ChatState();
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
  const handleSearch = async () => {
    if (!search) {
      toast.warn("Search cannot be empty", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setResult(data);
    } catch (error) {
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      handleClose();
    } catch (error) {
      toast.error("Please enter all the fields", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
  };
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <ToastContainer />
      <Navbar className="bg-body-tertiary" style={{ width: "100vw" }}>
        <Container
          fluid
          className="d-flex justify-content-between align-items-center"
          style={{ width: "100%" }}
        >
          <div style={{ width: "25%" }}>
            <Button variant="primary" onClick={handleShow}>
              Search
            </Button>
            <Offcanvas show={show} onHide={handleClose}>
              <Offcanvas.Body>
                <div className="searchBar">
                  <Form>
                    <Form.Label htmlFor="searchbox">
                      Chat with your friends
                    </Form.Label>
                    <Form.Control
                      type="text"
                      id="searchbox"
                      placeholder="Enter user name or email"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button
                      variant="primary"
                      className="mt-3"
                      onClick={handleSearch}
                    >
                      Search
                    </Button>
                  </Form>
                </div>
                <ListGroup>
                  {result.map((res) => (
                    <ListGroup.Item
                      key={res._id}
                      className="mx-auto mt-1 hover-bg-color"
                      style={{ width: "98%", border: "0" }}
                      onClick={() => {
                        setSearch("");
                        accessChat(res);
                      }}
                    >
                      <div className="searchUserResults d-flex justify-content-between align-items-center shadow">
                        <div className="d-flex flex-row align-items-center">
                          <img
                            src={res.pic}
                            alt="userprofile"
                            style={{
                              width: "40px",
                              height: "40px",
                              marginLeft: "10px",
                            }}
                          />
                          <div className="d-flex flex-column p-2">
                            <span>{res.username}</span>
                            <span>{res.email}</span>
                          </div>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Offcanvas.Body>
            </Offcanvas>
          </div>
          <div style={{ width: "60%", textAlign: "center" }}>
            <Navbar.Brand>
              <img src={Logo} alt="logo" />
              Chatter
            </Navbar.Brand>
          </div>

          <div className="d-flex align-items-center" style={{ width: "18%" }}>
            {user && (
              <Image
                src={user.pic}
                style={{ width: "40px", height: "40px" }}
                roundedCircle
              />
            )}

            <Nav>
              <NavDropdown
                title="Settings"
                id="basic-nav-dropdown"
                className="mr-4"
              >
                <NavDropdown.Item onClick={() => setModalShow(true)}>
                  My Profile
                </NavDropdown.Item>

                <MyVerticallyCenteredModal
                  show={modalShow}
                  onHide={() => setModalShow(false)}
                  user={user}
                />
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </div>
        </Container>
      </Navbar>
      <div style={{ height: "80vh", marginTop: "5px", padding: "10px" }}>
        <Container fluid style={{ height: "100%" }}>
          <Row>
            <Col
              xs={12}
              md={3}
              style={{
                height: "80vh",
                border: "1px solid rgba(0, 0, 0, 0.5)",
                marginRight: "10px",
              }}
            >
              {user && <MyChats fetchAgain={fetchAgain} />}
            </Col>
            <Col
              xs={12}
              md={8}
              style={{ height: "80vh", border: "1px solid rgba(0, 0, 0, 0.5)" }}
            >
              {user && (
                <ChatBox
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Chatpage;

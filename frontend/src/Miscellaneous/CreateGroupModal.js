import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Badge, ListGroup } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Spinner } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import { ChatState } from "../Context/ChatProvider";
import "../App.css";
const CreateGroupModal = ({ show, handleClose }) => {
  const { user, chats, setChats } = ChatState();
  const [search, setSearch] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupChatName, setGroupChatName] = useState("");

  const handleSearch = async (e) => {
    if (search === "") return;
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

  const addUsersToGroup = (res) => {
    if (selectedUsers.includes(res)) {
      toast.warn("User is already added !", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    } else {
      setSelectedUsers([...selectedUsers, res]);
      setSearch("")
    }
  };

  const removeSelectedUsers = (u) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== u._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast.warn("Please enter all the fields !", {
        position: "top-right",
        autoClose: 2000,
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
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      resetForm();
      handleClose();
      toast.success("New Group Chat created", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
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
    }
  };

  const resetForm = () => {
    setGroupChatName("");
    setSelectedUsers([]);
  };

  useEffect(() => {
    handleSearch();
  }, [search]);

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
      {/* Same as */}
      <ToastContainer />
      <Modal centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Group Chat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="modalChatName">
              <Form.Label>Chat Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter chat name"
                autoFocus
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="modalAddUser">
              <Form.Label>Add Users</Form.Label>
              <Form.Control
                value={search}
                type="text"
                placeholder="Enter user name"
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </Form.Group>
          </Form>
          {/* display selected user */}
          {selectedUsers.map((u) => (
            <Badge
              key={u._id}
              bg="success"
              style={{ marginLeft: "5px" }}
              onClick={() => removeSelectedUsers(u)}
            >
              {u.username}❌
            </Badge>
          ))}
          {/* display selected user */}
        </Modal.Body>
        <ListGroup>
          {result?.slice(0, 4).map((res) => (
            <ListGroup.Item
              key={res._id}
              className="bg-light mx-auto mt-1 hover-bg-color"
              style={{ borderRadius: "10px", width: "90%" }}
              onClick={() => addUsersToGroup(res)}
            >
              Name: {res.username} Email:{res.email}
            </ListGroup.Item>
          ))}
        </ListGroup>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSubmit}>
            Create Chat
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CreateGroupModal;

//CreateGroupModal

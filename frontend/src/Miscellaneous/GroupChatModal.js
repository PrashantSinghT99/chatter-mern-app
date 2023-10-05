import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import { ChatState } from "../Context/ChatProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
const GroupChatModal = ({
  showModal,
  toggleModal,
  GroupName,
  fetchAllMessages,
  fetchAgain,
  setFetchAgain,
}) => {
  const { user, setSelectedChat, selectedChat } = ChatState();
  const [groupName, setGroupName] = useState("");
  const [renameloading, setRenameLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [result, setResult] = useState([]);

  const handleGroupNameUpdate = async () => {
    if (!groupName) return;
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      console.log(config);
      const { data } = await axios.put(
        "/api/chat/rename",
        { chatId: selectedChat._id, chatName: groupName },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
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
      setRenameLoading(false);
    }
    setGroupName("");
  };

  const handleGroupUserDelete = async (u) => {
    if (selectedChat.groupAdmin._id !== user._id && u._id !== user._id) {
      toast.error("Only admins can remove someone!", {
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
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: u._id,
        },
        config
      );

      u._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchAllMessages();
      setLoading(false);
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
    setGroupName("");
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
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
      console.log(data);
      setLoading(false);
      setResult(data);
    } catch (error) {
      toast.error("Error Occured !", {
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

  const handleAddUser = async (ele) => {
    if (selectedChat.users.find((u) => u._id === ele._id)) {
      toast.error("User already in the group!", {
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

    if (selectedChat.groupAdmin._id !== user._id) {
      toast.error("Only admins can remove someone!", {
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
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: ele._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast.error("Error occured !", {
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
    setGroupName("");
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast.error("Only admins can remove someone!", {
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
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchAllMessages();
      setLoading(false);
    } catch (error) {
      toast.error("Error occured!", {
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
    setGroupName("");
  };
  return (
    <>
      <Modal show={showModal} onHide={toggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>{GroupName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedChat.users.map((user) => (
            <Badge
              key={user._id}
              bg="primary"
              style={{ marginLeft: "8px", cursor: "pointer" }}
              onClick={() => handleGroupUserDelete(user)}
            >
              {user.username.toUpperCase()}❌
            </Badge>
          ))}
          <Form>
            <Form.Group className="mb-3" controlId="modalChatName">
              <Form.Label>Chat Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter chat name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                autoFocus
              />
            </Form.Group>
            <Button variant="secondary" onClick={handleGroupNameUpdate}>
              Update
            </Button>
            <Form.Group className="mb-3" controlId="modalAddUser">
              <Form.Label>Add User To Group</Form.Label>
              <Form.Control
                type="text"
                placeholder="Add User To Group"
                autoFocus
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </Form.Group>
            <ListGroup>
              {result.map((ele) => (
                <ListGroup.Item
                  className="bg-light mx-auto"
                  style={{ borderRadius: "10px", width: "98%",cursor: "pointer"  }}
                  onClick={() => handleAddUser(ele)}
                >
                  {ele.username} Email: {ele.email}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => handleRemove(user)}>Leave Group</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default GroupChatModal;

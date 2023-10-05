import React, { useEffect, useState ,useRef} from "react";
import GroupChatModal from "../Miscellaneous/GroupChatModal";
import { Button } from "react-bootstrap";
import MyVerticallyCenteredModal from "../Miscellaneous/MyVerticallyCenteredModal";
import FormControl from "react-bootstrap/FormControl";
import { ChatState } from "../Context/ChatProvider";
import { getSender, getSenderFull } from "../Utility/Chat";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import Conversations from "./Conversations";
import { io } from "socket.io-client";
const API = "http://localhost:5000";
var socket, selectedChatCompare;
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [socketConnected, setSocketConnected] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { selectedChat, setSelectedChat, user } = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const toggleModal = () => {
    setShowModal(!showModal);
  };


  const fetchAllMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
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

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        console.log("message",data);
        setMessages([...messages, data]);
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
      }
    }
  };

  useEffect(() => {
    socket = io(API);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
  }, []);

  useEffect(() => {
    fetchAllMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        // notifications
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

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
      <div
        className="eyeIcon mt-1"
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h5 style={{ marginBottom: "0" }}>
          {selectedChat.isGroupChat
            ? selectedChat.chatName.toUpperCase()
            : getSender(user, selectedChat.users)}
        </h5>
        <div>
          {selectedChat.isGroupChat ? (
            <>
              <Button style={{ background: "#c6c7c8" }} onClick={toggleModal}>
                <i className="fa-solid fa-eye" style={{ color: "#030303" }}></i>
              </Button>
              <GroupChatModal
                fetchAgain={fetchAgain}
                fetchAllMessages={fetchAllMessages}
                setFetchAgain={setFetchAgain}
                showModal={showModal}
                toggleModal={toggleModal}
                GroupName={
                  selectedChat.isGroupChat
                    ? selectedChat.chatName.toUpperCase()
                    : ""
                }
              />
            </>
          ) : (
            <>
              <Button
                style={{ background: "#c6c7c8" }}
                onClick={() => setModalShow(true)}
              >
                <i className="fa-solid fa-eye" style={{ color: "#030303" }}></i>
              </Button>
              <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                user={getSenderFull(user, selectedChat.users)}
              />
            </>
          )}
        </div>
      </div>
      <div
        className="mt-2"
        style={{ background: "#E8E8E8", height: "78%", overflowY: "scroll" }}
      >
        <Conversations messages={messages}></Conversations>
      </div>
      <div className="mt-1">
        <FormControl
          type="text"
          placeholder="Enter a message"
          onKeyDown={sendMessage}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
      </div>
    </>
  );
};

export default SingleChat;

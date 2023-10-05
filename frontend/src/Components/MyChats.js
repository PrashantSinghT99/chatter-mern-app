import { useEffect, useState } from "react";
import axios from "axios";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import { ChatState } from "../Context/ChatProvider";
import { ToastContainer, toast } from "react-toastify";
import { Spinner } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import CreateGroupModal from "../Miscellaneous/CreateGroupModal";
import { getSender } from "../Utility/Chat";
import '../App.css'
const MyChats = ({ fetchAgain }) => {
  const { user, setUser, chats, setChats, selectedChat, setSelectedChat } =
    ChatState();
  const [loggedUser, setLoggedUser] = useState();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  //console.log(typeof selectedChat._id);
  const fetchAllChats = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
      setLoading(false);
      return;
    } catch (error) {
      toast.error("Error Occured!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setLoading(false);
      return;
    }
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchAllChats();
  }, [fetchAgain]);
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
      <div className="d-flex justify-content-between align-items-center my-2">
        <h4 className="p-2">My Chats</h4>
        <Button
          className="p-2"
          style={{ background: "#E8E8E8", color: "black", border: "0" }}
          onClick={handleShow}
        >
          New Group Chat➕
        </Button>
        <CreateGroupModal show={show} handleClose={handleClose} />
      </div>
      <div>
        {loading ? (
          <div className="text-center mt-5">
            <Spinner animation="border" variant="success" />
            <p>Loading...</p>
          </div>
        ) : (
          <ListGroup>
            <ListGroup>
              {chats.map((chat) => (
                <ListGroup.Item
                  className={`bg-light my-1 rounded ${chat === selectedChat ? 'selected' : ''}`}
                  key={chat?._id}
                  onClick={() => {
                    setSelectedChat(chat);
                  }}
                  style={{cursor:"pointer" }}

                >
                  {chat.isGroupChat
                    ? chat?.chatName
                    : getSender(loggedUser, chat.users)}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </ListGroup>
        )}
      </div>
    </>
  );
};

export default MyChats;

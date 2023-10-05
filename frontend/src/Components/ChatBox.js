import React, { useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import SingleChat from "./SingleChat";
const ChatBox = ({fetchAgain,setFetchAgain}) => {
  const { selectedChat } = ChatState();
  return (
    <>
      {selectedChat ? (
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}  />
      ) : (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100%" }}
        >
          <h4>Click on a user to start chatting</h4>
        </div>
      )}
    </>
  );
};

export default ChatBox;

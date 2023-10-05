import React from "react";
import { ChatState } from "../Context/ChatProvider";
import {
  isLastMessage,
  isDifferentSender,
  isSameUser,
  isSameSenderMargin,
} from "../Utility/Chat";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";

const Conversations = ({ messages }) => {
  const { user } = ChatState();

  return (
    <div>
      {messages &&
        messages.map((msg, i) => (
          <div
            key={msg._id}
            style={{
              display: "flex",
              justifyContent: `${
                msg.sender._id === user._id ? "flex-end" : "flex-start"
              }`,
            }}
          >
            {(isDifferentSender(messages, msg, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <span>
                <Col>
                  <Image
                    src={msg.sender.pic}
                    roundedCircle
                    style={{
                      width: "35px",
                      height: "35px",
                      marginLeft: "5px",
                    }}
                  />
                </Col>
              </span>
            )}
            <span
              style={{
                backgroundColor: `${
                  msg.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, msg, i, user._id),
                marginTop: isSameUser(messages, msg, i, user._id) ? 3 : 10,
                marginBottom: "5px",
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {msg.content}
            </span>
          </div>
        ))}
    </div>
  );
};

export default Conversations;

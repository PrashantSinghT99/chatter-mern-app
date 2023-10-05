import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Login from "../Components/Login";
import Register from "../Components/Register";
import Container from "react-bootstrap/Container";
import Stack from 'react-bootstrap/Stack';
const Homepage = () => {

  return (
    <div className="app-container">
      <Stack gap={3}>
      <Container className="my-auto p-4 bg-light rounded-panel" style={{ width: "50%" }}>
        <Tabs
          defaultActiveKey="login"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab eventKey="login" title="Login">
            <Login />
          </Tab>
          <Tab eventKey="register" title="Register">
            <Register />
          </Tab>
        </Tabs>
      </Container>
      </Stack>
    </div>
  );
};

export default Homepage;

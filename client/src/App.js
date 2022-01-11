import React, { Component, useState, setState } from "react";
import { Routes, Route } from "react-router-dom";
import {
  Navbar,
  Button,
  InputGroup,
  Form,
  Card,
  ListGroup,
  CardGroup,
  Container,
} from "react-bootstrap";
import "./App.css";
import Home from "./components/Home";
import Login from "./components/login";
// import config from "./config";
import axios from "axios";
import CardHeader from "react-bootstrap/esm/CardHeader";

function App() {
  const [data, setData] = useState([]);
  const [token, setToken] = useState();
  if (!token?.token) {
    return <Login setToken={setToken} />;
  }

  let state = {
    val: "week",
    fromDate: "",
    toDate: "",
  };

  function ConvertDate(timestamp) {
    var date = new Date(timestamp);
    const fulldate =
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1 <= 9
        ? "0" + String(date.getMonth() + 1)
        : String(date.getMonth() + 1)) +
      "-" +
      (date.getDate() <= 9
        ? "0" + String(date.getDate())
        : String(date.getDate()));
    const time = date.getHours() + date.getMinutes() + date.getSeconds();
    return { fulldate, time };
  }

  function subtractDays(dateString, days = 1) {
    let date = new Date(dateString);
    let newDate = new Date(dateString);
    newDate.setDate(date.getDate() - days);
    return ConvertDate(newDate).fulldate;
  }

  const getUserDate = () => {
    // calculate toDate and fromDate from user inputs
    if (state.val === "week") {
      state.toDate = ConvertDate(new Date()).fulldate;
      state.fromDate = subtractDays(state.toDate, 7);
    } else if (state.val === "month") {
      state.toDate = ConvertDate(new Date()).fulldate;
      state.fromDate = subtractDays(state.toDate, 30);
    }
    console.log("val", state.val); // ! remove
    console.log("fromdate", state.fromDate); // ! remove
    console.log("toDate", state.toDate); // ! remove
  };

  const getAndShowData = async () => {
    getUserDate();
    let results = await axios.post(
      "/api/topPerformers/topFiveGainersAndLosers",
      {
        fromDate: state.fromDate,
        toDate: state.toDate,
      }
    );
    console.log(results);
    setData(results.data);
  };
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home user={token.username} />} />
      </Routes>
      <Navbar bg="light" expand="lg">
        <InputGroup className="mb-1">
          <Button variant="outline-primary">
            <Form.Check
              type={"radio"}
              id={"week"}
              label={"Last Week"}
              inline
              name="group1"
              defaultChecked
              onChange={(e) => (state.val = "week")}
            />
          </Button>
          <Button variant="outline-primary">
            <Form.Check
              type={"radio"}
              id={"month"}
              label={"Last Month"}
              inline
              name="group1"
              onChange={(e) => (state.val = "month")}
            />
          </Button>
          <Button variant="outline-primary">
            <Form.Check
              type={"radio"}
              id={"custom"}
              label={"Custom Date"}
              inline
              name="group1"
              onChange={(e) => (state.val = "custom")}
            />
          </Button>
          <Form.Control
            type="date"
            id="fromDate"
            name="dfrom"
            placeholder="fromDate"
            onChange={(e) => (state.fromDate = e.target.value)}
          />
          <Form.Control
            type="date"
            id="toDate"
            name="dto"
            placeholder="toDate"
            onChange={(e) => (state.toDate = e.target.value)}
          />
          <Button variant="outline-primary" onClick={getAndShowData}>
            Show Results
          </Button>
        </InputGroup>
      </Navbar>
      <Container className="App-header" fluid>
        <CardGroup>
          <Card style={{ width: "18rem" }} className=".card;" bg="danger">
            <CardHeader>Top Five Losers</CardHeader>
            <ListGroup variant="flush">
              {data?.losers?.map((value, index) => {
                return (
                  <ListGroup.Item key={index}>{`${
                    value.Symbol
                  }/${value.Gain.toFixed(2)}`}</ListGroup.Item>
                );
              })}
            </ListGroup>
          </Card>

          <Card style={{ width: "18rem" }} className=".card" bg="success">
            <CardHeader>Top Five Gainers</CardHeader>
            <ListGroup variant="flush">
              {data?.gainers?.map((value, index) => {
                return (
                  <ListGroup.Item key={index}>{`${
                    value.Symbol
                  }/${value.Gain.toFixed(2)}`}</ListGroup.Item>
                );
              })}
            </ListGroup>
          </Card>
        </CardGroup>
      </Container>
    </div>
  );
}

export default App;

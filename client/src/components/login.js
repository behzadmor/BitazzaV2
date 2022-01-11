import React, { useState } from "react";
import PropTypes from "prop-types";
import Logo from "../static/logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import "./login.css";

var connection;

function loginUser(credentials) {
  return new Promise((resolve, reject) => {
    const WEBSOCKETHOST = "wss://apexapi.bitazza.com/WSGateway"; 
    const conn = new WebSocket(WEBSOCKETHOST); // create WebSocket Object
    let u = JSON.stringify(credentials);

    conn.onopen = function () {
      console.log("state:", conn.readyState);
      conn.send(JSON.stringify({ m: 0, i: 0, n: "AuthenticateUser", o: u })); // user Authentication
    };

    conn.onmessage = function (message) {
      connection = conn;
      let response = JSON.parse(message.data);
      if (response.n === "AuthenticateUser") {
        let authInfo = JSON.parse(response["o"]);
        if (!authInfo.Authenticated) {
          resolve(null);
          conn.close();
        }
        resolve(authInfo);
        console.log(authInfo);
      }
    };
  });
}

// async function loginUser(credentials) { // fake login
//   return fetch("http://localhost:1337/login", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(credentials),
//   }).then((data) => data.json());
// }

export default function Login({ setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await loginUser({
      username,
      password,
    });
    setToken({ token, username, password });
    if (!token) alert("Invalid username or password");
  };

  return (
    <div className="wrapper">
      <div className="logo">
        {" "}
        <img src={Logo} alt="" />{" "}
      </div>
      <div className="text-center mt-4 name">Sign In</div>
      <form className="p-3 mt-3" onSubmit={handleSubmit}>
        <label>
          <p>Email</p>
          <span className="far fa-user"></span>
          <input
            className="form-field d-flex align-items-center"
            type="text"
            onChange={(e) => setUserName(e.target.value)}
          />
        </label>
        <label>
          <p>Password</p>
          <span className="far fa-user"></span>
          <input
            className="form-field d-flex align-items-center"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <div>
          <button className="btn" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};

export { connection as conn };

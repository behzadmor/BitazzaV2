import { Col, Container, Image, Row } from "react-bootstrap";
import accountLogo from "../static/usericon.svg";
import logoutLogo from "../static/logout.svg";
import { Button } from "react-bootstrap";
import { conn } from "./login";
import axios from "axios";
import "./home.css";

async function logout() {
  const loc = await axios.get("/api/topPerformers/login");
  try {
    const u = JSON.stringify({});
    conn.send(JSON.stringify({ m: 0, i: 0, n: "LogOut", o: u })); // user LogOut
    conn.onmessage = function (message) {
      let response = JSON.parse(message.data);
      if (response.n === "LogOut") {
        let logoutInfo = JSON.parse(response["o"]);
        if (logoutInfo.result) {
          alert("You're logged out successfully\n " + logoutInfo);
          window.location = loc.data;
        }
      }
    };
  } catch (e) {
    alert("problem in logging out.\n" + e.message);
    window.location = loc.data;
  }
}

function Home(props) {
  return (
    <div className="Home-header">
      <Container className="Home-header">
        <Row>
          <Col>
            <Button variant="warning" size="lg" onClick={logout}>
              Logout <Image src={logoutLogo} style={{ height: 35 + "px" }} />
            </Button>{" "}
            <Button variant="warning" size="lg">
              {props.user}{" "}
              <Image src={accountLogo} style={{ height: 35 + "px" }} />
            </Button>{" "}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Home;

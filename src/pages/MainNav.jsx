import { useState } from "react";
import { Nav, Navbar } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import { Link, useLocation } from "react-router-dom";
import styles from "./mainnav.module.css";

export default function MainNav() {
  const { pathname } = useLocation();
  const path = pathname.split("/")[1];
  const [activeMenu, setActiveMenu] = useState(path === "" ? "home" : path);
  const activeHome = () => {
    setActiveMenu("home");
  };
  const activeAgenda = () => {
    setActiveMenu("agendas");
  };
  const activeUser = () => {
    setActiveMenu("users");
  };
  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Navbar.Brand href="#">Company Logo</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="m-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Link
              to="/"
              className={`${styles.navLink} ${
                activeMenu === "home" ? styles.activeNav : ""
              }`}
              onClick={activeHome}
            >
              Home
            </Link>
            <Link
              to="/agendas"
              className={`${styles.navLink} ${
                activeMenu === "agendas" ? styles.activeNav : ""
              }`}
              onClick={activeAgenda}
            >
              Agendas
            </Link>
            <Link
              to="/users"
              className={`${styles.navLink} ${
                activeMenu === "users" ? styles.activeNav : ""
              }`}
              onClick={activeUser}
            >
              Users
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

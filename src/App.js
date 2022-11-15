import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Agendas from "./pages/agenda/Agendas";
import MainNav from "./pages/MainNav";
import Home from "./pages/meeting/Home";
import Users from "./pages/user/Users";

function App() {
  return (
    <>
      <Router>
        <MainNav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/agendas" element={<Agendas />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import TelaCadastrar from "./pages/TelaCadastrar";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import HomeLogado from "./pages/HomeLogado";
import Notificacao from "./pages/Notificacao";
import Perfil from "./pages/Perfil";


export default function App() {
  return (
    <Router>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/TelaCadastrar" element={<TelaCadastrar />} />
        <Route path="/Cadastro" element={<Cadastro />}/>
        <Route path="/Login" element={<Login />}/>
        <Route path="/HomeLogado" element={<HomeLogado />}/>
        <Route path="/Notificacao" element={<Notificacao />}/>
        <Route path="/Perfil" element={<Perfil />}/>"
      </Routes>
    </Router>
  );
}

import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import sescsenac from "../assets/sescsenac.png"
export default function TelaInicial() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#004C99] relative overflow-hidden">
      <div className="relative z-10 text-center flex flex-col items-center">
        <div className="bg-white rounded-lg px-6 py-3 shadow-md mb-6">
          <img
            src={sescsenac}
            alt="Logo Sesc Senac"
            className="h-40"
          />
        </div>
        <h1 className="text-white text-xl font-semibold mb-6">
          Lanchonete Sesc Senac
        </h1>
        <div className="flex flex-row gap-3 w-100">
          <Link to="/Cadastro"
            className="flex-1 bg-[#F6BE00] hover:bg-yellow-500 text-black py-3 rounded-lg font-semibold text-center">
            Criar conta
          </Link>
          <Link to="/Login"
            className="flex-1 bg-[#F6BE00] hover:bg-yellow-500 text-black py-3 rounded-lg font-semibold text-center">
            Já tenho conta
          </Link>
        </div>
      </div>
    </div>
  );
}

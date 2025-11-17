import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

export default function TelaInicial() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0b2a8d] relative overflow-hidden">
      {/* Fundo com imagem semi-transparente */}
      <img
        src="./src/assets/fundologa.png" // substitua pelo caminho da sua imagem
        alt="Imagem de fundo"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      {/* Conteúdo central */}
      <div className="relative z-10 text-center flex flex-col items-center">
        {/* Logo Sesc Senac */}
        <div className="bg-white rounded-lg px-6 py-3 shadow-md mb-6">
          <img
            src="./src/assets/sescsenac.png" // substitua pelo caminho da sua logo
            alt="Logo Sesc Senac"
            className="h-40"
          />
        </div>

        {/* Texto */}
        <h1 className="text-white text-xl font-semibold mb-6">
          Lanchonete Sesc Senac
        </h1>

        {/* Botões */}
        <div className="flex flex-row gap-3 w-100">
          <Link to="/Cadastro"
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black py-3 rounded-lg font-semibold text-center">
            Criar conta
          </Link>
          <Link to="/Login"
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black py-3 rounded-lg font-semibold text-center">
            Já tenho conta
          </Link>
        </div>
      </div>
    </div>
  );
}

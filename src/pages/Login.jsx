import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleEntrarConta = () => {
    console.log("Entrar na conta:", { email, senha });
  };

  const handleCriarConta = () => {
    console.log("Ir para criar conta");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-900">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm text-center">
        {/* Logo */}
        <img
          src="./src/assets/sescsenac.png" // substitua pelo caminho correto da logo Sesc/Senac
          alt="Sesc Senac"
          className="mx-auto mb-6"
        />

        <h1 className="text-xl font-medium mb-6 text-blue-900">
          Lanchonete Sesc Senac
        </h1>

        {/* Campos */}
        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* Botões */}
        <div className="flex gap-4 mt-6">
            <Link to="/Cadastro"
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black py-2 rounded-full font-semibold text-center">
            Criar conta
          </Link>

         <Link to="/HomeLogado"
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black py-2 rounded-full font-semibold text-center">
            Entrar na conta
          </Link>
        </div>
      </div>
    </div>
  );
}

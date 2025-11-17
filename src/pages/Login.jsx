import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [errors, setErrors] = useState({ email: "", senha: "" });
  const [signingIn, setSigningIn] = useState(false);
  const [serverError, setServerError] = useState("");

  function validarCampos() {
    const next = { email: "", senha: "" };
    let ok = true;

    if (!email.trim()) {
      next.email = "Por favor, informe seu e-mail.";
      ok = false;
    } else {
      const re = /^\S+@\S+\.\S+$/;
      if (!re.test(email)) {
        next.email = "E-mail inválido.";
        ok = false;
      }
    }

    if (!senha) {
      next.senha = "Por favor, informe sua senha.";
      ok = false;
    }

    setErrors(next);
    return ok;
  }

  const handleEntrarConta = async () => {
    setServerError("");
    if (!validarCampos()) return;

    setSigningIn(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });

      if (error) {
        setServerError(error.message || JSON.stringify(error));
        console.error("Erro ao entrar:", error);
        setSigningIn(false);
        return;
      }

      console.log("Login bem sucedido:", data);
      navigate("/");
    } catch (err) {
      console.error("Erro inesperado no login:", err);
      setServerError(err.message || String(err));
    } finally {
      setSigningIn(false);
    }
  };

  const handleCriarConta = () => {
    navigate("/Cadastro");
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
        <div className="flex flex-col gap-3">
          <div>
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`px-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 ${errors.email ? 'border-red-400' : ''}`}
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className={`px-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 ${errors.senha ? 'border-red-400' : ''}`}
            />
            {errors.senha && <p className="text-xs text-red-600 mt-1">{errors.senha}</p>}
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleEntrarConta}
            disabled={signingIn}
            className={`flex-1 ${signingIn ? 'bg-yellow-300' : 'bg-yellow-400 hover:bg-yellow-500'} text-black py-2 rounded-full font-semibold`}
          >
            {signingIn ? 'Entrando...' : 'Entrar na conta'}
          </button>
        </div>

        {serverError && <p className="text-sm text-red-600 mt-3">{serverError}</p>}
      </div>
    </div>
  );
}
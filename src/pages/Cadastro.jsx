import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
 
export default function Login() {
  const navigate = useNavigate();
 
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
 
  const [errors, setErrors] = useState({ nome: "", email: "", senha: "" });
  const [signingUp, setSigningUp] = useState(false);
  const [serverError, setServerError] = useState("");
  const [serverMessage, setServerMessage] = useState("");
 
  function validarCampos() {
    const next = { nome: "", email: "", senha: "" };
    let ok = true;
 
    if (!nome.trim()) {
      next.nome = "Por favor, informe seu nome.";
      ok = false;
    }
 
    if (!email.trim()) {
      next.email = "Por favor, informe seu e-mail.";
      ok = false;
    } else {
      // validação simples de e-mail
      const re = /^\S+@\S+\.\S+$/;
      if (!re.test(email)) {
        next.email = "E-mail inválido.";
        ok = false;
      }
    }
 
    if (!senha) {
      next.senha = "Por favor, informe uma senha.";
      ok = false;
    } else if (senha.length < 6) {
      next.senha = "A senha deve ter ao menos 6 caracteres.";
      ok = false;
    }
 
    setErrors(next);
    return ok;
  }
 
  const handleCriarConta = async () => {
    if (!validarCampos()) return;
 
    setSigningUp(true);
    setServerError("");
    setServerMessage("");
 
    try {
      // Supabase JS v2: signUp signature uses options for additional user metadata
      const { data, error } = await supabase.auth.signUp({ email, password: senha, options: { data: { nome } } });
 
      if (error) {
        const msg = error.message || JSON.stringify(error);
        setServerError(msg);
        console.error("Erro ao criar conta:", error);
        setSigningUp(false);
        return;
      }
 
      // sucesso
      setServerMessage("Cadastro realizado. Verifique seu e-mail para confirmar (se aplicável).");
      console.log("SignUp result:", data);
 
      // Navegar após curto delay para mostrar a mensagem (ou direto se preferir)
      setTimeout(() => navigate("/HomeLogado"), 800);
    } catch (err) {
      console.error("Erro inesperado no handleCriarConta:", err);
      setServerError(err.message || String(err));
    } finally {
      setSigningUp(false);
    }
  };
 
  const handleEntrarConta = () => {
    console.log("Entrar na conta:", { email, senha });
    navigate("/Login");
  };
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-900">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm text-center">
        <img
          src="./src/assets/sescsenac.png" // Substitua pelo caminho da logo Sesc/Senac
          alt="Sesc Senac"
          className="mx-auto mb-6"
        />
        <h1 className="text-xl font-medium mb-6 text-blue-900">
          Lanchonete Sesc Senac
        </h1>
        <div className="flex flex-col gap-2">
          <div>
            <input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className={`px-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 ${errors.nome ? 'border-red-400' : ''}`}
            />
            {errors.nome && <p className="text-xs text-red-600 mt-1">{errors.nome}</p>}
          </div>
 
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
            onClick={handleCriarConta}
            disabled={signingUp}
            className={`flex-1 ${signingUp ? 'bg-yellow-300' : 'bg-yellow-400 hover:bg-yellow-500'} text-black py-2 rounded-full font-semibold`}
          >
            {signingUp ? 'Cadastrando...' : 'Criar conta'}
          </button>
 
          <button
            onClick={handleEntrarConta}
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black py-2 rounded-full font-semibold"
          >
            Entrar na conta
          </button>
        </div>
 
        {serverError && <p className="text-sm text-red-600 mt-3">{serverError}</p>}
        {serverMessage && <p className="text-sm text-green-600 mt-3">{serverMessage}</p>}
      </div>
    </div>
  );
}
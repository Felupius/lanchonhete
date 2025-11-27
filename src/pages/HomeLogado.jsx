
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

import { supabase } from "../supabaseClient";
import ProductCard from "../components/ProductCard";

export default function App() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [filtroSesc, setFiltroSesc] = useState("Todos");
  const [filtroSenac, setFiltroSenac] = useState("Todos");
  const [mostrarFiltroSesc, setMostrarFiltroSesc] = useState(false);
  const [mostrarFiltroSenac, setMostrarFiltroSenac] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  const [produtosSesc, setProdutosSesc] = useState([]);
  const [produtosSenac, setProdutosSenac] = useState([]);

  const categorias = [
    { nome: "Salgados", icone: "🥐" },
    { nome: "Opções para Vegetariano", icone: "🥗" },
    { nome: "Bebidas", icone: "🧃" },
    { nome: "Doces", icone: "🍰" }
  ];

  useEffect(() => {
    async function carregarDados() {
      const { data, error } = await supabase
        .from("produto")
        .select("*");

      if (error) {
        console.log("Erro ao carregar produtos:", error);
        return;
      }

      console.log(data);

      const sesc = data.filter((p) => p.local === "Sesc");
      const senac = data.filter((p) => p.local === "Senac");

      setProdutosSesc(sesc);
      setProdutosSenac(senac);
    }

    carregarDados();
  }, []);

  const filtrarProdutos = (produtos, filtro) =>
    filtro === "Todos" ? produtos : produtos.filter((p) => p.tipo === filtro);

  return (
    <div className="min-h-screen flex flex-col bg-white">

      <header className="bg-[#003366] flex items-center justify-between px-6 py-3 relative">
        <div className="flex items-center gap-3">
          <img src="./src/assets/sesc.png" alt="Logo Sesc" className="h-12" />
          <img src="./src/assets/senac.png" alt="Logo Senac" className="h-12" />
        </div>

        <div className="relative">
          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-1.5 rounded-full font-semibold text-sm shadow-md"
          >
            ☰ Menu
          </button>

          {menuAberto && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-fadeIn">
              <Link to="/Perfil" className="block px-4 py-2 text-sm hover:bg-gray-100">👤 Perfil</Link>
              <Link to="/contato" className="block px-4 py-2 text-sm hover:bg-gray-100">📞 Contato</Link>
              <Link to="/notificacoes" className="block px-4 py-2 text-sm hover:bg-gray-100">🔔 Notificações</Link>
            </div>
          )}
        </div>
      </header>

      <div className="from-[#4A90E2] to-[#005BBB] text-white px-5 py-3 rounded-lg text-center mx-auto mt-6 shadow-md w-[90%] max-w-md bg-linear-to-r">
        <p className="text-base font-medium">
          Seja bem-vindo à lanchonete do Sesc e Senac.
        </p>
      </div>

      <MenuSection
        titulo="MENU DO SESC"
        produtos={filtrarProdutos(produtosSesc, filtroSesc)}
        categorias={categorias}
        filtro={filtroSesc}
        setFiltro={setFiltroSesc}
        mostrarFiltro={mostrarFiltroSesc}
        setMostrarFiltro={setMostrarFiltroSesc}
        setProdutoSelecionado={setProdutoSelecionado}
      />

      <MenuSection
        titulo="MENU DO SENAC"
        produtos={filtrarProdutos(produtosSenac, filtroSenac)}
        categorias={categorias}
        filtro={filtroSenac}
        setFiltro={setFiltroSenac}
        mostrarFiltro={mostrarFiltroSenac}
        setMostrarFiltro={setMostrarFiltroSenac}
        setProdutoSelecionado={setProdutoSelecionado}
      />

      {produtoSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-[90%] text-center">
            <img src={produtoSelecionado.img} alt={produtoSelecionado.nome} className="w-24 h-24 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">{produtoSelecionado.nome_produto}</h2>
            <p className="text-gray-700 mb-2">{produtoSelecionado.descricao}</p>
            <p className="text-lg font-semibold mb-4">{produtoSelecionado.preco}</p>
            <button
              onClick={() => setProdutoSelecionado(null)}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-full font-semibold"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuSection({
  titulo,
  produtos,
  categorias,
  filtro,
  setFiltro,
  mostrarFiltro,
  setMostrarFiltro,
  setProdutoSelecionado,
}) {
  return (
    <section className="mt-16 px-6 relative">
      <div className="flex items-center justify-between max-w-6xl mx-auto mb-4 relative">
        <div className="relative">
          <button
            onClick={() => setMostrarFiltro(!mostrarFiltro)}
            className="bg-linear-to-r from-yellow-300 to-yellow-500 text-black px-5 py-2 rounded-full font-semibold shadow-lg hover:scale-105 transition"
          >
            🔍 Filtrar
          </button>

          {mostrarFiltro && (
            <div className="absolute left-0 mt-2 w-60 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-fadeIn">
              {categorias.map((cat) => (
                <button
                  key={cat.nome}
                  onClick={() => {
                    setFiltro(cat.nome);
                    setMostrarFiltro(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  {cat.icone} {cat.nome}
                </button>
              ))}

              <button
                onClick={() => {
                  setFiltro("Todos");
                  setMostrarFiltro(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-gray-100"
              >
                Mostrar Todos
              </button>
            </div>
          )}
        </div>

        <h1 className="text-3xl font-bold text-center flex-1">{titulo}</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto animate-fadeIn">
        {produtos.map((p, index) => (
          <ProductCard
            key={index}
            product={p}
            onBuy={(prod) => {
              // Placeholder: implementar lógica de compra/adicionar ao carrinho
              console.log("Comprar:", prod);
            }}
            onShow={(prod) => setProdutoSelecionado(prod)}
          />
        ))}
      </div>
    </section>
  );
}

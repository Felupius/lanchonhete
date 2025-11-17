import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function App() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState("todos");

  useEffect(() => {
    carregarProdutos("todos");
  }, []);

  async function carregarProdutos(tipoSelecionado) {
    setCarregando(true);
    let query = supabase.from("produto").select("*");

    if (tipoSelecionado !== "todos") {
      query = query.eq("tipo", tipoSelecionado);
    }

    const { data, error } = await query;

    if (error) {
      console.error(error);
      setProdutos([]);
    } else {
      setProdutos(data || []);
    }

    setCarregando(false);
  }

  const categorias = ["todos", "doce", "salgado", "bebida"];

  return (
    <div className="min-h-screen bg-white flex flex-col">

      <header className="bg-[#003366] flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <img src="./src/assets/sesc.png" alt="Logo Sesc" className="h-8" />
          <img src="./src/assets/senac.png" alt="Logo Senac" className="h-8" />
        </div>

        <Link to="/TelaCadastrar">
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-1.5 rounded-full font-semibold text-sm">
            🔍 Entrar/Cadastrar-se
          </button>
        </Link>
      </header>

      <h1 className="text-3xl font-bold text-center mt-8">MENU DE PRODUTOS</h1>

      <div className="flex justify-center flex-wrap gap-3 mt-6">
        {categorias.map((tipo) => (
          <button
            key={tipo}
            onClick={() => {
              setFiltro(tipo);
              carregarProdutos(tipo);
            }}
            className={`px-4 py-2 border rounded-xl font-bold transition-all 
              ${filtro === tipo
                ? "bg-yellow-400 text-white border-yellow-600"
                : "bg-white text-black border-yellow-400"
              }`}
          >
            {filtro === tipo && carregando
              ? "Atualizando..."
              : tipo.toUpperCase()}
          </button>
        ))}
      </div>

      {carregando && (
        <div className="flex flex-col items-center mt-10">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-yellow-400 border-t-transparent"></div>
          <p className="mt-3">Carregando produtos...</p>
        </div>
      )}
      {!carregando && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 mt-8 pb-20 max-w-6xl mx-auto">
          {produtos.length === 0 ? (
            <p className="text-center col-span-full text-lg font-medium">
              Nenhum produto encontrado.
            </p>
          ) : (
            produtos.map((p) => (
              <div
                key={p.id_produto}
                className="bg-[#FFC400] rounded-2xl shadow-lg p-5 flex flex-col items-center
  w-full h-[340px] justify-between"
              >
                <img
                  src={p.image}
                  alt={p.nome_produto}
                  className="w-28 h-28 object-cover rounded-lg mb-2"
                />

                <p className="text-white text-xl font-bold text-center line-clamp-2">
                  {p.nome_produto}
                </p>

                <p className="text-[#002D85] text-2xl font-bold">
                  R$ {Number(p.preco).toFixed(2)}
                </p>

                <div className="w-full flex flex-col gap-2 mt-2">
                  <button className="bg-white rounded-xl py-2 px-6 font-bold text-black shadow-md w-full">
                    Comprar
                  </button>

                  <button className="bg-white rounded-xl py-2 px-6 font-bold text-black shadow-md w-full">
                    Descrição
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

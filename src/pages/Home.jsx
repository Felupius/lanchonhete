import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function App() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState("todos");
  const [menuAberto, setMenuAberto] = useState(false);

  const categorias = ["todos", "doce", "salgado", "bebida"];

  useEffect(() => {
    async function verificarLogin() {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user;

      if (user) {
        const { data: perfilData, error } = await supabase
          .from("perfil")
          .select("nome")
          .eq("id_user", user.id)
          .single();

        if (error) {
          console.error("Erro ao buscar perfil:", error.message);
          setUsuario({ ...user, nome: user.email });
        } else {
          setUsuario({ ...user, nome: perfilData.nome });
        }
      } else {
        setUsuario(null);
      }
    }
    verificarLogin();
    carregarProdutos("todos");
  }, []);

  async function carregarProdutos(tipoSelecionado) {
    setCarregando(true);
    let query = supabase.from("produto").select("*");
    if (tipoSelecionado !== "todos") {
      query = query.eq("tipo", tipoSelecionado);
    }
    const { data, error } = await query;
    if (!error) setProdutos(data || []);
    setCarregando(false);
  }
  const [saindo, setSaindo] = useState(false);

  async function handleSair() {
    setSaindo(true);

    const { error } = await supabase.auth.signOut();

    setSaindo(false);

    if (error) {
      console.error("Erro ao sair:", error.message);
    } else {
      setUsuario(null);
    }
  }

  async function salvarProdutoLocal(produto) {
    try {
      const { data } = await supabase.auth.getUser();
      const user = data?.user ?? null;

      if (!user) {
        alert("Você precisa estar logado para comprar produtos!");
        return;
      }

      const chaveUsuario = `produtos_local_${user.id}`;
      const json = localStorage.getItem(chaveUsuario);
      const listaAtual = json ? JSON.parse(json) : [];

      // Verifica se o produto já existe
      const jaExiste = listaAtual.some(item => item.id_produto === produto.id_produto);
      if (jaExiste) {
        alert("Você já adicionou este produto. Altere a quantidade no carrinho.");
        return;
      }

      // Adiciona produto
      const novoProduto = {
        id_produto: produto.id_produto,
        nome_produto: produto.nome_produto,
        preco: produto.preco,
        quantidade: 1,
        image: produto.image,
      };
      const novaLista = [...listaAtual, novoProduto];
      localStorage.setItem(chaveUsuario, JSON.stringify(novaLista));

      alert("Produto adicionado ao carrinho!");
    } catch (e) {
      console.error("Erro ao salvar produto:", e);
      alert("Não foi possível salvar o produto.");
    }
  }
  const adicionarAoCarrinho = (produto) => {
    if (!usuario) {
      alert("Você precisa estar logado para comprar produtos!");
      return;
    }

    const chaveUsuario = `produtos_local_${usuario.id}`;
    const json = localStorage.getItem(chaveUsuario);
    const listaAtual = json ? JSON.parse(json) : [];

    const jaExiste = listaAtual.some(item => item[1] === produto.id_produto);
    if (jaExiste) {
      alert("Você já adicionou este produto. Altere a quantidade no carrinho.");
      return;
    }

    const produtoArray = [
      produto.nome_produto,
      produto.id_produto,
      produto.preco,
      1,
      produto.image
    ];

    const novaLista = [...listaAtual, produtoArray];
    localStorage.setItem(chaveUsuario, JSON.stringify(novaLista));
    alert("Produto adicionado ao carrinho!");
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-yellow-50 flex flex-col">
      <Header usuario={usuario} handleSair={handleSair} />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex justify-center mt-8"
      >
        <div className="bg-gradient-to-r from-[#80BBFF] to-[#004C99] text-white rounded-2xl p-6 shadow-xl text-center max-w-3xl transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-xl md:text-2xl font-bold tracking-wide">
            Seja bem-vindo à lanchonete do Sesc e Senac
          </h2>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex justify-center mt-6"
      >
        <button
          onClick={() => navigate("/contato")}
          className="bg-gradient-to-r from-[#80BBFF] to-[#004C99] text-white px-8 py-3 rounded-2xl font-bold shadow-lg transform hover:scale-105 hover:shadow-2xl transition duration-300"
        >
          Fale Conosco
        </button>
      </motion.div>
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-3xl md:text-4xl font-bold text-center mt-8 text-gray-800"
      >
        MENU DE PRODUTOS
      </motion.h1>
      <div className="flex justify-center flex-wrap gap-3 mt-6 overflow-x-auto px-4 scrollbar-hide">
        {categorias.map((tipo) => (
          <button
            key={tipo}
            onClick={() => {
              setFiltro(tipo);
              carregarProdutos(tipo);
            }}
            className={`px-5 py-2 border rounded-full font-bold transition-all whitespace-nowrap
        ${filtro === tipo
                ? "bg-yellow-400 text-white border-yellow-600"
                : "bg-white text-black border-yellow-400 hover:bg-yellow-100"
              }`}
          >
            {tipo.toUpperCase()}
          </button>
        ))}
      </div>
      {!carregando && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 mt-8 pb-20 max-w-6xl mx-auto">
          {produtos.map((p, index) => (
            <motion.div
              key={p.id_produto}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-[#F6BE00] rounded-3xl shadow-xl p-6 flex flex-col items-center w-full h-[360px] justify-between hover:-translate-y-2 transform transition-all duration-300"
            >
              <img
                src={p.image}
                className="w-32 h-32 object-cover rounded-xl mb-3 shadow-md"
              />
              <p className="text-white text-lg md:text-xl font-bold text-center">
                {p.nome_produto}
              </p>
              <p className="text-[#002D85] text-xl md:text-2xl font-bold">
                R$ {Number(p.preco).toFixed(2)}
              </p>
              <button
                onClick={() => adicionarAoCarrinho(p)}
                className="bg-white rounded-full py-2 px-6 font-bold text-black shadow-md w-full hover:bg-yellow-100 transition-colors"
              >
                Comprar
              </button>

              <button className="bg-white rounded-full py-2 px-6 font-bold text-black shadow-md w-full hover:bg-yellow-100 transition-colors">
                Descrição
              </button>
            </motion.div>
          ))}
        </div>
      )}
      <Footer/>
    </div>
  );
}

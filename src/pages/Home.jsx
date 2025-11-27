import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function App() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState("todos");
  const [quantidadeCarrinho, setQuantidadeCarrinho] = useState(0);

  const [notificacao, setNotificacao] = useState(null);

  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  const handleSair = async () => {
    if (!usuario) return;
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUsuario(null);
      setQuantidadeCarrinho(0);
      navigate("/TelaCadastrar");
    } catch (err) {
      mostrarNotificacao("Erro ao sair da conta.");
      console.error(err);
    }
  };

  function mostrarNotificacao(msg) {
    setNotificacao(msg);
    setTimeout(() => setNotificacao(null), 2500);
  }

  const categorias = ["todos", "doce", "salgado", "bebida"];

  useEffect(() => {
    async function verificarLogin() {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user;

      if (user) {
        const { data: perfilData } = await supabase
          .from("perfil")
          .select("nome, adm")
          .eq("id_user", user.id)
          .single();

        setUsuario({
          ...user,
          nome: perfilData?.nome || user.email,
          adm: perfilData?.adm || false,
        });

        const chaveUsuario = `produtos_local_${user.id}`;
        const lista = JSON.parse(localStorage.getItem(chaveUsuario)) || [];
        setQuantidadeCarrinho(lista.length);

      } else {
        setUsuario(null);
        setQuantidadeCarrinho(0);
      }
    }

    verificarLogin();
    carregarProdutos("todos");
  }, []);

  async function carregarProdutos(tipoSelecionado) {
    setCarregando(true);
    let query = supabase.from("produto").select("*");
    if (tipoSelecionado !== "todos") query = query.eq("tipo", tipoSelecionado);

    const { data } = await query;
    setProdutos(data || []);
    setCarregando(false);
  }

  const adicionarAoCarrinho = (produto) => {
    if (!usuario) {
      mostrarNotificacao("Você precisa estar logado!");
      return;
    }

    const chaveUsuario = `produtos_local_${usuario.id}`;
    const listaAtual = JSON.parse(localStorage.getItem(chaveUsuario)) || [];

    if (listaAtual.some(item => item[1] === produto.id_produto)) {
      mostrarNotificacao("Esse produto já está no carrinho!");
      return;
    }

    const produtoArray = [
      produto.nome_produto,
      produto.id_produto,
      produto.preco,
      1,
      produto.image,
    ];

    const novaLista = [...listaAtual, produtoArray];
    localStorage.setItem(chaveUsuario, JSON.stringify(novaLista));
    setQuantidadeCarrinho(novaLista.length);

    mostrarNotificacao("Produto adicionado ao carrinho!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 via-white flex flex-col">
      <Header
        usuario={usuario}
        quantidadeCarrinho={quantidadeCarrinho}
        handleSair={handleSair}
      />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex justify-center mt-10 px-4"
      >
        <div className="bg-gradient-to-r from-[#003A73] to-[#005FBA] text-white rounded-3xl p-8 shadow-2xl text-center w-full max-w-3xl transform hover:scale-[1.03] transition-all duration-300">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-wide drop-shadow-lg">
            Bem-vindo à Lanchonete do Sesc e Senac!
          </h2>
          <p className="text-white/90 mt-2 text-lg">
            Escolha seus produtos e aproveite!
          </p>
        </div>
      </motion.div>
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-4xl md:text-5xl font-extrabold text-center mt-10 text-gray-900 drop-shadow-sm"
      >
        Menu de Produtos
      </motion.h1>
      <div className="flex justify-center flex-wrap gap-3 mt-6 px-4">
        {categorias.map((tipo) => (
          <button
            key={tipo}
            onClick={() => {
              setFiltro(tipo);
              carregarProdutos(tipo);
            }}
            className={`
              px-5 py-2 text-sm md:text-md rounded-full font-bold transition-all shadow-md
              ${filtro === tipo
                ? "bg-yellow-500 text-white shadow-lg scale-105"
                : "bg-white text-gray-700 hover:bg-yellow-100 hover:shadow-lg"}
            `}
          >
            {tipo.toUpperCase()}
          </button>
        ))}
      </div>
      {!carregando && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6 mt-10 pb-24 max-w-7xl mx-auto">
          {produtos.map((p, index) => (
            <motion.div
              key={p.id_produto}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-3xl shadow-xl p-6 flex flex-col items-center relative hover:-translate-y-2 hover:shadow-2xl transform transition-all duration-300 border border-yellow-300/40"
            >
              <div className="w-32 h-32 bg-gray-100 rounded-2xl overflow-hidden shadow-md mb-4">
                <img src={p.image} className="w-full h-full object-cover" />
              </div>
              <p className="text-gray-900 text-lg font-bold text-center">
                {p.nome_produto}
              </p>
              <p className="text-[#003A73] text-2xl font-extrabold my-2">
                R$ {Number(p.preco).toFixed(2)}
              </p>
              <div className="flex flex-col w-full mt-2 gap-2">
                <button
                  onClick={() => adicionarAoCarrinho(p)}
                  className="bg-gradient-to-r from-yellow-400 to-[#F6BE00] text-black font-bold py-2 rounded-full shadow-md hover:shadow-xl active:scale-95 transition-all"
                >
                  🛒 Comprar
                </button>

                <button
                  onClick={() => setProdutoSelecionado(p)}
                  className="bg-white border border-gray-300 text-gray-700 font-bold py-2 rounded-full shadow-sm hover:bg-gray-100 active:scale-95 transition-all"
                >
                  ℹ️ Descrição
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      <AnimatePresence>
        {produtoSelecionado && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <img
                src={produtoSelecionado.image}
                className="w-full h-52 object-cover rounded-xl shadow-md mb-4"
              />
              <h2 className="text-gray-900 text-lg font-bold">
                {produtoSelecionado.nome_produto}
              </h2>
              <p className="text-[#003A73] text-2xl font-extrabold mb-4">
                R$ {Number(produtoSelecionado.preco).toFixed(2)}
              </p>
              <p className="text-gray-700 whitespace-pre-line mb-4">
                {produtoSelecionado.descricao}
              </p>
              <button
                onClick={() => adicionarAoCarrinho(produtoSelecionado)}
                className="w-full bg-yellow-500 text-black font-bold py-2 rounded-full shadow-md hover:shadow-lg mb-3"
              >
                🛒 Comprar
              </button>
              <button
                onClick={() => setProdutoSelecionado(null)}
                className="w-full bg-gray-300 text-black font-bold py-2 rounded-full shadow-md hover:bg-gray-400"
              >
                Fechar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {notificacao && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 bg-[#F6BE00] text-black font-semibold px-4 py-3 rounded-xl shadow-lg z-[999]"
          >
            {notificacao}
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
}

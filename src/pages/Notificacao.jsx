import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";

export default function Carrinho() {
    const [usuario, setUsuario] = useState(null);
    const [pedidos, setPedidos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [notificacao, setNotificacao] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function verificarLogin() {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                navigate("/TelaCadastrar");
            } else {
                const { data: perfilData, error } = await supabase
                    .from("perfil")
                    .select("*")
                    .eq("id_user", user.id)
                    .single();

                if (!error) {
                    setUsuario({ ...user, ...perfilData });
                } else {
                    setUsuario({ ...user, nome: user.email });
                }

                buscarPedidosLocais(user.id);
            }
        }
        verificarLogin();
    }, [navigate]);

    function mostrarNotificacao(msg) {
        setNotificacao(msg);
        setTimeout(() => setNotificacao(null), 2500);
    }

    const buscarPedidosLocais = (userId) => {
        try {
            const STORAGE_KEY = `produtos_local_${userId}`;
            const json = localStorage.getItem(STORAGE_KEY);
            const data = json ? JSON.parse(json) : [];

            const pedidosConvertidos = data.map((item) => ({
                nome_produto: item[0],
                id_produto: item[1],
                preco: Number(item[2]),
                quantidade: item[3] || 1,
                image: item[4],
            }));

            setPedidos(pedidosConvertidos);
        } catch (e) {
            console.error("Erro ao buscar pedidos locais:", e);
        }
        setCarregando(false);
    };

    const salvarPedidosLocais = (novaLista) => {
        if (!usuario) return;
        const STORAGE_KEY = `produtos_local_${usuario.id}`;
        const dataParaSalvar = novaLista.map((item) => [
            item.nome_produto,
            item.id_produto,
            item.preco,
            item.quantidade,
            item.image,
        ]);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataParaSalvar));
    };

    const deletarPedido = (id_produto) => {
        const novaLista = pedidos.filter((p) => p.id_produto !== id_produto);
        setPedidos(novaLista);
        salvarPedidosLocais(novaLista);
        mostrarNotificacao("Produto removido do carrinho!");
    };

    const alterarQuantidade = (id_produto, delta) => {
        const novaLista = pedidos.map((item) => {
            if (item.id_produto === id_produto) {
                const novaQtd = Math.max(1, item.quantidade + delta);
                return { ...item, quantidade: novaQtd };
            }
            return item;
        });
        setPedidos(novaLista);
        salvarPedidosLocais(novaLista);
        mostrarNotificacao("Quantidade atualizada!");
    };

    const total = pedidos.reduce((soma, item) => soma + item.preco * item.quantidade, 0);

    const finalizarCompra = async (id_lanchonete) => {
        if (pedidos.length === 0) {
            mostrarNotificacao("Carrinho vazio. Adicione produtos antes de finalizar.");
            return;
        }

        try {
            const preco_total = pedidos.reduce((soma, item) => soma + item.preco * item.quantidade, 0);

            const { data: pedidoData, error: pedidoError } = await supabase
                .from("pedido")
                .insert([{ id_lanchonete, preco_total, id_user_cliente: usuario.id }])
                .select("id_pedido")
                .single();

            if (pedidoError) throw pedidoError;

            const id_pedido = pedidoData.id_pedido;

            for (const item of pedidos) {
                const { error: insertError } = await supabase
                    .from("itens_pedido")
                    .insert({ id_pedido, id_produto: item.id_produto, quantidade: item.quantidade });

                if (insertError) throw insertError;
            }

            setPedidos([]);
            localStorage.removeItem(`produtos_local_${usuario.id}`);
            mostrarNotificacao("Pedido finalizado com sucesso!");
        } catch (error) {
            console.error("Erro ao finalizar pedido:", error);
            mostrarNotificacao("Não foi possível finalizar o pedido.");
        }
    };

    const handleSair = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Erro ao sair:", error.message);
        } else {
            setUsuario(null);
            navigate("/TelaCadastrar");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white flex flex-col">
            <Header usuario={usuario} handleSair={handleSair} />
            <div className="p-6 max-w-4xl mx-auto w-full">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Meu Carrinho</h1>
                {carregando ? (
                    <p className="text-gray-500">Carregando...</p>
                ) : pedidos.length === 0 ? (
                    <div className="text-center text-gray-500 py-20">
                        <p>Sem pedidos</p>
                        <p>:(</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
                        <p className="text-right text-lg font-semibold text-gray-700">
                            Total: <span className="text-blue-700">R${total.toFixed(2)}</span>
                        </p>
                        {pedidos.map((item) => (
                            <div
                                key={item.id_produto}
                                className="flex items-center p-4 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors shadow-sm"
                            >
                                <img
                                    src={item.image}
                                    alt={item.nome_produto}
                                    className="w-24 h-24 rounded-lg object-cover mr-4"
                                />
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800 text-lg">{item.nome_produto}</p>
                                    <p className="text-gray-600 mt-1">
                                        R$ {(item.preco * item.quantidade).toFixed(2)}
                                    </p>
                                    <div className="flex items-center mt-2">
                                        <button
                                            className="px-3 py-1 bg-[#F6BE00] rounded-md text-white font-bold hover:bg-yellow-500 transition-colors"
                                            onClick={() => alterarQuantidade(item.id_produto, -1)}
                                        >
                                            -
                                        </button>
                                        <span className="mx-3 font-medium">{item.quantidade}</span>
                                        <button
                                            className="px-3 py-1 bg-[#F6BE00] rounded-md text-white font-bold hover:bg-yellow-500 transition-colors"
                                            onClick={() => alterarQuantidade(item.id_produto, 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <button
                                    className="text-red-500 font-bold text-xl ml-4 hover:text-red-600 transition-colors"
                                    onClick={() => deletarPedido(item.id_produto)}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <div className="flex items-center justify-center my-8">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <span className="mx-4 font-semibold text-gray-600">Finalizar Compra</span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                </div>
                <div className="flex flex-col sm:flex-row justify-evenly gap-4">
                    <button
                        className="bg-[#F6BE00] text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={() => finalizarCompra(2)}
                    >
                        Lanchonete Sesc
                    </button>
                    <button
                        className="bg-[#F6BE00] text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors"
                        onClick={() => finalizarCompra(3)}
                    >
                        Lanchonete Senac
                    </button>
                </div>
            </div>
            <AnimatePresence>
                {notificacao && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        transition={{ duration: 0.3 }}
                        className="fixed bottom-6 right-6 bg-yellow-400 text-black font-semibold px-4 py-3 rounded-xl shadow-lg z-[999]"
                    >
                        {notificacao}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

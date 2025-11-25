import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminUsuarios() {
    const [usuario, setUsuario] = useState(null);
    const [listaUsuarios, setListaUsuarios] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [loading, setLoading] = useState(true);

    const [pedidos, setPedidos] = useState([]);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
    const [loadingPedidos, setLoadingPedidos] = useState(false);

    const [statusAtualizadoId, setStatusAtualizadoId] = useState(null);
    const [statusTemporario, setStatusTemporario] = useState({});
    const [notificacao, setNotificacao] = useState(null);

    const navigate = useNavigate();

    async function loadAdmin() {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (!user || authError) {
            navigate("/TelaCadastrar");
            return null;
        }

        const { data: perfil, error } = await supabase
            .from("perfil")
            .select("*")
            .eq("id_user", user.id)
            .single();

        if (!perfil?.adm) {
            navigate("/");
            return null;
        }

        setUsuario({ ...user, nome: perfil.nome || "Administrador", adm: perfil.adm });
        return user;
    }

    async function loadUsuarios() {
        setLoading(true);
        try {
            const { data, error } = await supabase.rpc("listar_usuarios_completos");
            if (error) throw error;
            setListaUsuarios(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        async function init() {
            const admin = await loadAdmin();
            if (admin) loadUsuarios();
        }
        init();
    }, []);

    const handleSair = async () => {
        await supabase.auth.signOut();
        navigate("/TelaCadastrar");
    };

    function mostrarNotificacao(msg) {
        setNotificacao(msg);
        setTimeout(() => setNotificacao(null), 2500);
    }

    async function verPedidos(id_user) {
        setLoadingPedidos(true);
        setUsuarioSelecionado(id_user);
        try {
            const { data, error } = await supabase
                .from("pedido")
                .select("*")
                .eq("id_user_cliente", id_user)
                .order("id_pedido", { ascending: true });
            if (error) throw error;
            setPedidos(data);
        } catch (err) {
            console.error(err);
            setPedidos([]);
        } finally {
            setLoadingPedidos(false);
        }
    }

    async function atualizarStatusPedido(id_pedido, novoStatus) {
        try {
            const { data, error } = await supabase
                .from("pedido")
                .update({ status_pedido: novoStatus })
                .eq("id_pedido", id_pedido);

            if (error) throw error;

            setPedidos(prev =>
                prev.map(p => (p.id_pedido === id_pedido ? { ...p, status_pedido: novoStatus } : p))
            );

            setStatusAtualizadoId(id_pedido);
            setTimeout(() => setStatusAtualizadoId(null), 3000);

            setStatusTemporario(prev => {
                const newState = { ...prev };
                delete newState[id_pedido];
                return newState;
            });

            mostrarNotificacao("Status atualizado com sucesso!");
        } catch (err) {
            console.error(err);
            mostrarNotificacao("Erro ao atualizar status do pedido!");
        }
    }

    const usuariosFiltrados = listaUsuarios
        .filter(u => !u.adm)
        .filter(u => (u.nome || "").toLowerCase().includes(filtro.toLowerCase()));

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-200 via-white flex flex-col">
            {usuario && <Header usuario={usuario} handleSair={handleSair} />}

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex justify-center mt-10 px-4"
            >
                <div>
                    <h2 className="text-2xl md:text-3xl font-extrabold tracking-wide drop-shadow-lg">
                        Painel de Administração
                    </h2>
                    <p className="text-black mt-2 text-lg">
                        Gerencie usuários e pedidos com facilidade
                    </p>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="max-w-7xl mx-auto w-full px-6 py-8"
            >
                <div className="flex justify-center mb-6">
                    <input
                        type="text"
                        placeholder="Buscar por nome..."
                        value={filtro}
                        onChange={e => setFiltro(e.target.value)}
                        className="w-full max-w-md px-4 py-2 text-center rounded-full bg-white shadow-md border border-gray-300 focus:ring-2 focus:ring-yellow-400 outline-none transition"
                    />
                </div>

                <div className="overflow-x-auto rounded-2xl shadow-xl bg-white">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                            <tr>
                                <th className="px-6 py-3 text-left">Nome</th>
                                <th className="px-6 py-3 text-left">Email</th>
                                <th className="px-6 py-3 text-left">Telefone</th>
                                <th className="px-6 py-3 text-left">Cidade</th>
                                <th className="px-6 py-3 text-left">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-10">
                                        <div className="animate-spin w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto"></div>
                                    </td>
                                </tr>
                            ) : usuariosFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-gray-500">
                                        Nenhum usuário encontrado
                                    </td>
                                </tr>
                            ) : (
                                usuariosFiltrados.map(u => (
                                    <tr
                                        key={u.id_user}
                                        className="hover:bg-blue-50 transition"
                                    >
                                        <td className="px-6 py-3 font-semibold text-gray-700">{u.nome}</td>
                                        <td className="px-6 py-3 text-gray-600">{u.email}</td>
                                        <td className="px-6 py-3 text-gray-600">{u.telefone || "—"}</td>
                                        <td className="px-6 py-3 text-gray-600">{u.cidade || "—"}</td>
                                        <td className="px-6 py-3">
                                            <button
                                                onClick={() => verPedidos(u.id_user)}
                                                className="px-4 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-full shadow-md hover:shadow-lg transition"
                                            >
                                                Ver Pedidos
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {usuarioSelecionado && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mt-8 rounded-3xl shadow-2xl bg-white p-6"
                    >
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
                            Pedidos de {listaUsuarios.find(u => u.id_user === usuarioSelecionado)?.nome}
                        </h2>

                        {loadingPedidos ? (
                            <div className="flex justify-center py-10">
                                <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                            </div>
                        ) : pedidos.length === 0 ? (
                            <p className="text-gray-600">Nenhum pedido encontrado.</p>
                        ) : (
                            <div className="overflow-x-auto rounded-2xl shadow-md">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                                        <tr>
                                            <th className="px-4 py-2">ID Pedido</th>
                                            <th className="px-4 py-2">Lanchonete</th>
                                            <th className="px-4 py-2">Status</th>
                                            <th className="px-4 py-2">Preço Total</th>
                                            <th className="px-4 py-2">Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pedidos.map(p => (
                                            <tr
                                                key={p.id_pedido}
                                                className={`hover:bg-blue-50 transition ${statusAtualizadoId === p.id_pedido ? "bg-green-100" : ""
                                                    }`}
                                            >
                                                <td className="px-4 py-2">{p.id_pedido}</td>
                                                <td className="px-4 py-2">{p.id_lanchonete === 2 ? "Sesc" : p.id_lanchonete === 3 ? "Senac" : p.id_lanchonete}</td>
                                                <td className="px-4 py-2">
                                                    <select
                                                        value={statusTemporario[p.id_pedido] || p.status_pedido}
                                                        onChange={(e) =>
                                                            setStatusTemporario(prev => ({
                                                                ...prev,
                                                                [p.id_pedido]: e.target.value
                                                            }))
                                                        }
                                                        className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                                    >
                                                        <option value="pendente">Pendente</option>
                                                        <option value="em preparo">Em preparo</option>
                                                        <option value="entregue">Entregue</option>
                                                        <option value="cancelado">Cancelado</option>
                                                    </select>
                                                </td>
                                                <td className="px-4 py-2">R$ {p.preco_total.toFixed(2)}</td>
                                                <td className="px-4 py-2">
                                                    <button
                                                        onClick={() => {
                                                            const novoStatus = statusTemporario[p.id_pedido];
                                                            if (!novoStatus) return mostrarNotificacao("Selecione um status!");
                                                            atualizarStatusPedido(p.id_pedido, novoStatus);
                                                        }}
                                                        className="px-3 py-1 bg-green-500 text-white rounded-full shadow-md hover:shadow-lg transition"
                                                    >
                                                        Salvar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </motion.div>
                )}
            </motion.div>

            <AnimatePresence>
                {notificacao && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        transition={{ duration: 0.3 }}
                        className="fixed bottom-6 right-6 bg-yellow-500 text-black font-semibold px-4 py-3 rounded-xl shadow-lg z-[999]"
                    >
                        {notificacao}
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}

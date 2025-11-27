import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import Header from "../components/Header";

export default function Pedidos() {
    const [usuario, setUsuario] = useState(null);
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);

    // ============================
    //  CARREGA PERFIL + ADM
    // ============================
    async function loadProfile() {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return null;

        let profile = null;

        // Tenta carregar da tabela "profiles"
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("full_name, adm")
                .eq("id", user.id)
                .single();

            if (!error) profile = data;
        } catch {}

        // Se não achar, tenta da tabela "perfil"
        if (!profile) {
            try {
                const { data, error } = await supabase
                    .from("perfil")
                    .select("nome, adm")
                    .eq("id_user", user.id)
                    .single();
                if (!error) profile = data;
            } catch {}
        }

        return {
            id: user.id,
            email: user.email,
            nome:
                profile?.full_name ||
                profile?.nome ||
                user.user_metadata?.nome ||
                "",
            adm: profile?.adm || false, // <-- 🔥 AQUI ESTÁ O ADM
        };
    }

    // ============================
    //  BUSCAR PEDIDOS
    // ============================
    async function buscarPedidos() {
        setLoading(true);

        const userData = await loadProfile();
        setUsuario(userData);

        if (!userData) {
            setLoading(false);
            return;
        }

        const { data: pedidosData, error } = await supabase
            .from("pedido")
            .select("*")
            .eq("id_user_cliente", userData.id)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Erro ao buscar pedidos:", error);
            setLoading(false);
            return;
        }

        const pedidosComItens = await Promise.all(
            pedidosData.map(async (pedido) => {
                const { data: itens } = await supabase
                    .from("itens_pedido")
                    .select(
                        `
                        id_produto,
                        quantidade,
                        produto!fk_itens_pedido_id_produto(
                            nome_produto,
                            image,
                            preco
                        )
                        `
                    )
                    .eq("id_pedido", pedido.id_pedido);

                return { ...pedido, itens };
            })
        );

        setPedidos(pedidosComItens);
        setLoading(false);
    }

    useEffect(() => {
        buscarPedidos();
    }, []);

    async function handleSair() {
        await supabase.auth.signOut();
        window.location.href = "/TelaCadastrar";
    }

    // ============================
    //  RENDER
    // ============================
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white pb-10">
            <Header usuario={usuario} handleSair={handleSair} />

            <div className="max-w-3xl mx-auto px-4 mt-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    Meus Pedidos
                </h1>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin h-10 w-10 border-4 border-yellow-400 border-t-transparent rounded-full"></div>
                    </div>
                ) : pedidos.length === 0 ? (
                    <div className="text-center text-gray-500 py-20">
                        <p className="text-lg font-semibold">
                            Você ainda não fez nenhum pedido
                        </p>
                    </div>
                ) : (
                    pedidos.map((item) => (
                        <div
                            key={item.id_pedido}
                            className="bg-[#1f1f1f] rounded-xl p-5 shadow-lg mb-6"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-yellow-400 text-lg font-semibold">
                                        {item.status_pedido}
                                    </p>
                                    <p className="text-gray-300 text-sm mt-1">
                                        Pedido #{item.id_pedido}
                                    </p>
                                    <p className="text-white mt-2 font-bold">
                                        Total: R$ {item.preco_total}
                                    </p>
                                </div>

                                <button
                                    onClick={() =>
                                        setExpanded(
                                            expanded === item.id_pedido
                                                ? null
                                                : item.id_pedido
                                        )
                                    }
                                >
                                    <span className="text-white text-3xl">
                                        {expanded === item.id_pedido ? "▲" : "▼"}
                                    </span>
                                </button>
                            </div>

                            {expanded === item.id_pedido && (
                                <div className="bg-white rounded-xl mt-4 p-4">
                                    {item.itens?.map((i, index) => (
                                        <div
                                            key={index}
                                            className="flex bg-gray-100 rounded-xl p-3 mb-3"
                                        >
                                            <img
                                                src={i.produto?.image}
                                                className="w-20 h-20 object-cover rounded-lg mr-3"
                                            />
                                            <div className="flex-1">
                                                <p className="font-bold text-gray-800">
                                                    {i.produto?.nome_produto}
                                                </p>
                                                <p className="text-gray-600 text-sm">
                                                    Quantidade: {i.quantidade}
                                                </p>
                                                <p className="text-gray-800 text-sm mt-1 font-semibold">
                                                    R$ {i.produto?.preco}
                                                </p>
                                                <a
                                                    href="/Produtos"
                                                    className="inline-block bg-yellow-400 text-black px-4 py-1 rounded-full mt-2 font-semibold"
                                                >
                                                    Ver produto
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

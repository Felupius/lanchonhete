import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

export default function AdminUsuarios() {
    const [usuario, setUsuario] = useState(null);
    const [listaUsuarios, setListaUsuarios] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    async function loadAdmin() {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (!user || authError) {
            console.error("Erro ao obter usuário logado:", authError);
            navigate("/TelaCadastrar");
            return null;
        }

        const { data: perfil, error } = await supabase
            .from("perfil")
            .select("*")
            .eq("id_user", user.id)
            .single();

        if (error) {
            console.error("Erro carregando perfil:", error);
            navigate("/");
            return null;
        }

        if (!perfil?.adm) {
            console.warn("Acesso negado: usuário não é administrador");
            navigate("/");
            return null;
        }

        const admin = {
            id: user.id,
            email: user.email,
            nome: perfil?.nome || "Administrador",
            adm: perfil.adm,
        };

        setUsuario(admin);
        return admin;
    }

    async function loadUsuarios() {
        setLoading(true);
        const { data, error } = await supabase
            .from("perfil")
            .select("*")
            .order("nome", { ascending: true });

        if (error) {
            console.error("Erro ao buscar usuários:", error);
            setLoading(false);
            return;
        }

        setListaUsuarios(data);
        setLoading(false);
    }

    useEffect(() => {
        async function init() {
            const admin = await loadAdmin();
            if (admin) {
                await loadUsuarios();
            }
        }
        init();
    }, []);

    async function handleSair() {
        await supabase.auth.signOut();
        navigate("/TelaCadastrar");
    }

    const usuariosFiltrados = listaUsuarios.filter((u) =>
        (u.nome || "").toLowerCase().includes(filtro.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white flex flex-col">
            {usuario && <Header usuario={usuario} handleSair={handleSair} />}

            <main className="max-w-5xl mx-auto w-full px-6 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Painel de Administração – Usuários
                </h1>

                <div className="flex justify-center mb-6">
                    <input
                        type="text"
                        placeholder="Buscar por nome..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        className="w-full max-w-md px-4 py-2 rounded-xl bg-white shadow border border-gray-300
              focus:ring-2 focus:ring-yellow-400 outline-none transition"
                    />
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full bg-white shadow-lg rounded-xl overflow-hidden">
                            <thead className="bg-yellow-400 text-black">
                                <tr>
                                    <th className="px-4 py-3 text-left">Nome</th>
                                    <th className="px-4 py-3 text-left">Email</th>
                                    <th className="px-4 py-3 text-left">Telefone</th>
                                    <th className="px-4 py-3 text-left">Cidade</th>
                                </tr>
                            </thead>

                            <tbody>
                                {usuariosFiltrados.map((u) => (
                                    <tr
                                        key={u.id_user}
                                        className="border-b border-gray-200 hover:bg-yellow-100 transition"
                                    >
                                        <td className="px-4 py-3 font-semibold text-gray-700">{u.nome}</td>
                                        <td className="px-4 py-3 text-gray-600">{u.email}</td>
                                        <td className="px-4 py-3 text-gray-600">{u.telefone || "—"}</td>
                                        <td className="px-4 py-3 text-gray-600">{u.cidade || "—"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}

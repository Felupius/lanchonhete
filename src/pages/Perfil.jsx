import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Header from "../components/Header";

const BUCKET_NAME = import.meta.env.VITE_SUPABASE_BUCKET || 'perfil_fotos';

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");
  const [serverMessage, setServerMessage] = useState("");
  const navigate = useNavigate();

  async function loadProfile() {
    setServerError("");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/TelaCadastrar");
        return;
      }

      let profile = null;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (!error) profile = data;
      } catch { }

      if (!profile) {
        try {
          const { data: dataPt, error: errorPt } = await supabase
            .from("perfil")
            .select("*")
            .eq("id_user", user.id)
            .single();
          if (!errorPt) profile = dataPt;
        } catch { }
      }

      setUsuario({
        id: user.id,
        email: user.email,
        nome: profile?.full_name || profile?.nome || user.user_metadata?.nome || "",
        data_nascimento: profile?.dob || profile?.data_nascimento || "",
        telefone: profile?.phone || profile?.telefone || "",
        cpf: profile?.cpf || "",
        cep: profile?.cep || "",
        estado: profile?.state || profile?.estado || "",
        cidade: profile?.city || profile?.cidade || "",
        rua: profile?.street || profile?.rua || "",
        bairro: profile?.neighborhood || profile?.bairro || "",
      });

    } catch (err) {
      console.error("Erro ao carregar perfil:", err);
      setServerError(err.message || String(err));
    }
  }

  useEffect(() => {
    loadProfile();

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
        loadProfile();
      }
      if (event === 'SIGNED_OUT') {
        setUsuario(null);
        navigate("/TelaCadastrar");
      }
    });

    return () => listener?.subscription?.unsubscribe?.();
  }, []);

  async function salvarPerfil() {
    if (!usuario) return;
    setSaving(true);
    setServerError("");
    setServerMessage("");

    try {
      const updatesProfiles = {
        id: usuario.id,
        full_name: usuario.nome,
        email: usuario.email,
        dob: usuario.data_nascimento || null,
        phone: usuario.telefone,
        cpf: usuario.cpf,
        cep: usuario.cep,
        state: usuario.estado,
        city: usuario.cidade,
        street: usuario.rua,
        neighborhood: usuario.bairro,
        updated_at: new Date().toISOString(),
      };

      try {
        const { error } = await supabase.from("profiles").upsert(updatesProfiles);
        if (error) throw error;
        setServerMessage("Perfil salvo com sucesso!");
      } catch (err) {
        const updatesPt = {
          id_user: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          data_nascimento: usuario.data_nascimento || null,
          telefone: usuario.telefone,
          cpf: usuario.cpf,
          cep: usuario.cep,
          estado: usuario.estado,
          cidade: usuario.cidade,
          rua: usuario.rua,
          bairro: usuario.bairro,
          updated_at: new Date().toISOString(),
        };
        const { error: errPt } = await supabase.from("perfil").upsert(updatesPt);
        if (errPt) throw errPt;
        setServerMessage("Perfil salvo com sucesso!");
      }

      await loadProfile();
    } catch (err) {
      console.error("Erro ao salvar perfil:", err);
      setServerError(err.message || String(err));
    } finally {
      setSaving(false);
    }
  }

  const handleEditar = async () => {
    if (editando) await salvarPerfil();
    setEditando(!editando);
  };

  const handleSair = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Erro ao sair:", error.message);
    else navigate("/TelaCadastrar");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white flex flex-col">
      <Header usuario={usuario} handleSair={handleSair} />
      <main className="flex flex-col items-center p-6">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 border-b pb-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm font-medium">
              Foto
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-semibold text-gray-800">{usuario?.nome || "Carregando..."}</h2>
              <p className="text-gray-500 text-sm">{usuario?.email || ""}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Nome Usuário</label>
              <input
                type="text"
                disabled={!editando}
                value={usuario?.nome || ""}
                onChange={(e) => setUsuario({ ...usuario, nome: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-yellow-400 outline-none transition"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Email do Aluno</label>
              <input
                type="email"
                disabled={!editando}
                value={usuario?.email || ""}
                onChange={(e) => setUsuario({ ...usuario, email: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-yellow-400 outline-none transition"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Data de Nascimento</label>
              <input
                type="date"
                disabled={!editando}
                value={usuario?.data_nascimento || ""}
                onChange={(e) => setUsuario({ ...usuario, data_nascimento: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-yellow-400 outline-none transition"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Telefone</label>
              <input
                type="tel"
                disabled={!editando}
                value={usuario?.telefone || ""}
                onChange={(e) => setUsuario({ ...usuario, telefone: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-yellow-400 outline-none transition"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm text-gray-600">CPF</label>
              <input
                type="text"
                disabled={!editando}
                value={usuario?.cpf || ""}
                onChange={(e) => setUsuario({ ...usuario, cpf: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-yellow-400 outline-none transition"
              />
            </div>
          </div>

          <h3 className="mt-8 mb-2 text-lg font-semibold text-gray-800 border-b pb-1">Complementos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {["cep", "estado", "cidade", "rua", "bairro"].map((campo) => (
              <div key={campo}>
                <label className="text-sm text-gray-600">{campo.charAt(0).toUpperCase() + campo.slice(1)}</label>
                <input
                  type="text"
                  disabled={!editando}
                  value={usuario?.[campo] || ""}
                  onChange={(e) => setUsuario({ ...usuario, [campo]: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-yellow-400 outline-none transition"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <button
              onClick={handleEditar}
              disabled={saving}
              className={`${editando ? "bg-green-500 hover:bg-green-600" : "bg-black hover:bg-gray-800"
                } text-white px-6 py-2 rounded-full font-semibold shadow-md transition ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {saving ? "Salvando..." : editando ? "Salvar alterações" : "Editar perfil"}
            </button>
          </div>

          {serverError && <p className="mt-4 text-center text-red-600">{serverError}</p>}
          {serverMessage && <p className="mt-4 text-center text-green-600">{serverMessage}</p>}
        </div>
      </main>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Header from "../components/Header";

const BUCKET_NAME = import.meta.env.VITE_SUPABASE_BUCKET || "perfil_fotos";

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");
  const [serverMessage, setServerMessage] = useState("");

  const [fotoFile, setFotoFile] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);

  const navigate = useNavigate();

  // ============================
  // Carrega perfil + campo ADM
  // ============================
  async function loadProfile() {
    setServerError("");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/TelaCadastrar");
        return;
      }

      let profile = null;

      // Tenta tabela "profiles"
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (!error) profile = data;
      } catch {}

      // Se não existir, tenta tabela "perfil"
      if (!profile) {
        try {
          const { data, error } = await supabase
            .from("perfil")
            .select("*")
            .eq("id_user", user.id)
            .single();
          if (!error) profile = data;
        } catch {}
      }

      setUsuario({
        id: user.id,
        email: user.email,
        nome: profile?.full_name || profile?.nome || "",
        data_nascimento: profile?.dob || profile?.data_nascimento || "",
        telefone: profile?.phone || profile?.telefone || "",
        cpf: profile?.cpf || "",
        cep: profile?.cep || "",
        estado: profile?.estado || profile?.state || "",
        cidade: profile?.cidade || profile?.city || "",
        rua: profile?.rua || profile?.street || "",
        bairro: profile?.bairro || profile?.neighborhood || "",
        complemento: profile?.complemento || "",
        foto: profile?.foto || null,
        adm: profile?.adm || false,
      });

      setFotoPreview(
        profile?.foto ? profile.foto + "?t=" + Date.now() : null
      );
    } catch (err) {
      setServerError(err.message);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  // ============================
  // Upload da foto
  // ============================
  async function uploadFoto(userId, file) {
    if (!file) return null;

    const ext = file.name.split(".").pop();
    const fileName = `${userId}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, arrayBuffer, { contentType: file.type, upsert: true });

    if (uploadError) {
      console.error(uploadError);
      return null;
    }

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
    return data.publicUrl;
  }

  // ============================
  // Salvar perfil
  // ============================
  async function salvarPerfil() {
    if (!usuario) return;

    setSaving(true);
    setServerError("");
    setServerMessage("");

    try {
      let fotoPublica = usuario.foto;

      if (fotoFile) {
        const url = await uploadFoto(usuario.id, fotoFile);
        if (url) {
          fotoPublica = url;
          setFotoPreview(url + "?t=" + Date.now()); // Atualiza preview imediatamente
        }
      }

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
        complemento: usuario.complemento,
        foto: fotoPublica,
        updated_at: new Date().toISOString(),
      };

      try {
        const { error } = await supabase.from("profiles").upsert(updatesProfiles);
        if (error) throw error;
      } catch {
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
          complemento: usuario.complemento,
          foto: fotoPublica,
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase.from("perfil").upsert(updatesPt);
        if (error) throw error;
      }

      setServerMessage("Perfil salvo com sucesso!");
      setFotoFile(null);
    } catch (err) {
      setServerError(err.message);
    }

    setSaving(false);
  }

  const handleEditar = async () => {
    if (editando) await salvarPerfil();
    setEditando(!editando);
  };

  const handleSair = async () => {
    await supabase.auth.signOut();
    navigate("/TelaCadastrar");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white flex flex-col">
      <Header usuario={usuario} handleSair={handleSair} />

      <main className="flex flex-col items-center p-6">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 border-b pb-6">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={!editando}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  setFotoFile(file);

                  // libera URL antiga
                  if (fotoPreview) URL.revokeObjectURL(fotoPreview);

                  setFotoPreview(URL.createObjectURL(file));
                }}
              />
              <img
                src={fotoPreview || "/default-avatar.png"}
                alt="foto"
                className="w-24 h-24 rounded-full object-cover bg-gray-300"
              />
            </label>
            <div>
              <h2 className="text-xl font-semibold">{usuario?.nome || "..."}</h2>
              <p className="text-gray-500">{usuario?.email}</p>
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
                className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Email do aluno</label>
              <input
                type="email"
                disabled={!editando}
                value={usuario?.email || ""}
                onChange={(e) => setUsuario({ ...usuario, email: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Data de Nascimento</label>
              <input
                type="date"
                disabled={!editando}
                value={usuario?.data_nascimento || ""}
                onChange={(e) =>
                  setUsuario({ ...usuario, data_nascimento: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Telefone</label>
              <input
                type="tel"
                disabled={!editando}
                value={usuario?.telefone || ""}
                onChange={(e) => setUsuario({ ...usuario, telefone: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm text-gray-600">CPF</label>
              <input
                type="text"
                disabled={!editando}
                value={usuario?.cpf || ""}
                onChange={(e) => setUsuario({ ...usuario, cpf: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100"
              />
            </div>
          </div>

          <h3 className="mt-8 mb-2 text-lg font-semibold border-b pb-1">
            Complementos
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {["cep", "estado", "cidade", "rua", "bairro", "complemento"].map(
              (campo) => (
                <div key={campo}>
                  <label className="text-sm text-gray-600">
                    {campo.charAt(0).toUpperCase() + campo.slice(1)}
                  </label>
                  <input
                    type="text"
                    disabled={!editando}
                    value={usuario?.[campo] || ""}
                    onChange={(e) =>
                      setUsuario({ ...usuario, [campo]: e.target.value })
                    }
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100"
                  />
                </div>
              )
            )}
          </div>

          <div className="flex justify-center mt-10">
            <button
              onClick={handleEditar}
              disabled={saving}
              className={`px-6 py-2 rounded-full text-white font-semibold shadow-md 
                ${editando ? "bg-green-500" : "bg-black"}`}
            >
              {saving ? "Salvando..." : editando ? "Salvar alterações" : "Editar perfil"}
            </button>
          </div>

          {serverError && <p className="text-red-600 text-center mt-4">{serverError}</p>}
          {serverMessage && <p className="text-green-600 text-center mt-4">{serverMessage}</p>}
        </div>
      </main>
    </div>
  );
}

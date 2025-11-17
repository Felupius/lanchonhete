import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Perfil() {
  const [editando, setEditando] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  const handleEditar = () => setEditando(!editando);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Cabeçalho */}
      <header className="bg-[#003366] flex items-center justify-between px-6 py-3 relative shadow-md">
        <div className="flex items-center gap-3">
          <img
            src="./src/assets/sesc.png"
            alt="Logo Sesc"
            className="h-14"
          />
          <img
            src="./src/assets/senac.png"
            alt="Logo Senac"
            className="h-14"
          />
        </div>

        {/* Botão do menu */}
        <div className="relative">
          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2 rounded-full font-semibold text-md shadow-md transition"
          >
            ☰ Menu
          </button>

          {menuAberto && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-fade-in">
              <Link
                to="/HomeLogado"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => setMenuAberto(false)}
              >
                👤 Início
              </Link>
              <Link
                to="/contato"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => setMenuAberto(false)}
              >
                📞 Contato
              </Link>
              <Link
                to="/notificacoes"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => setMenuAberto(false)}
              >
                🔔 Notificações
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="flex flex-col items-center p-6">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-6">
          {/* Seção de perfil */}
          <div className="flex flex-col sm:flex-row items-center gap-6 border-b pb-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm font-medium">
              Foto
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-semibold text-gray-800">Nome do Usuário</h2>
              <p className="text-gray-500 text-sm">email@doaluno.com</p>
            </div>
          </div>

          {/* Informações principais */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Nome Usuário</label>
              <input
                type="text"
                disabled={!editando}
                defaultValue="Nome do Usuário"
                className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-yellow-400 outline-none transition"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Email do Aluno</label>
              <input
                type="email"
                disabled={!editando}
                defaultValue="email@doaluno.com"
                className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-yellow-400 outline-none transition"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Data de Nascimento</label>
              <input
                type="date"
                disabled={!editando}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-yellow-400 outline-none transition"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Número de Telefone</label>
              <input
                type="tel"
                disabled={!editando}
                defaultValue="(00) 00000-0000"
                className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-yellow-400 outline-none transition"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm text-gray-600">CPF</label>
              <input
                type="text"
                disabled={!editando}
                defaultValue="000.000.000-00"
                className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-yellow-400 outline-none transition"
              />
            </div>
          </div>

          {/* Complementos */}
          <h3 className="mt-8 mb-2 text-lg font-semibold text-gray-800 border-b pb-1">
            Complementos
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-600">CEP</label>
              <input
                type="text"
                disabled={!editando}
                defaultValue="00000-000"
                className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-yellow-400 outline-none transition"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Estado</label>
              <input
                type="text"
                disabled={!editando}
                defaultValue="SP"
                className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-yellow-400 outline-none transition"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Cidade</label>
              <input
                type="text"
                disabled={!editando}
                defaultValue="São Paulo"
                className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-yellow-400 outline-none transition"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Rua</label>
              <input
                type="text"
                disabled={!editando}
                defaultValue="Rua das Flores"
                className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-yellow-400 outline-none transition"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Bairro</label>
              <input
                type="text"
                disabled={!editando}
                defaultValue="Centro"
                className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-yellow-400 outline-none transition"
              />
            </div>
          </div>

          {/* Botão Editar */}
          <div className="flex justify-center mt-10">
            <button
              onClick={handleEditar}
              className={`${
                editando
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-black hover:bg-gray-800"
              } text-white px-6 py-2 rounded-full font-semibold shadow-md transition`}
            >
              {editando ? "Salvar alterações" : "Editar perfil"}
            </button>
          </div>
        </div>
      </main>

      {/* Animação suave para menu dropdown */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}

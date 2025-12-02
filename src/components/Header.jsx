import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Header({ usuario, handleSair, quantidadeCarrinho }) {

  const [menuAberto, setMenuAberto] = useState(false);
  const [saindo, setSaindo] = useState(false);

  return (
    <header className="bg-gradient-to-r from-[#003A73] to-[#005FBA] px-6 py-4 flex items-center justify-between shadow-xl border-b border-white/10 sticky top-0 z-50 relative backdrop-blur-md">
      <div className="flex items-center gap-4">
        <Link to="/" className="group">
          <img
            src="../assets/sesc.png"
            className="h-10 transition-transform duration-300 group-hover:scale-110 drop-shadow-lg"
          />
        </Link>
        <Link to="/" className="group">
          <img
            src="../assets/senac.png"
            className="h-10 transition-transform duration-300 group-hover:scale-110 drop-shadow-lg"
          />
        </Link>
      </div>

      <div className="relative">
        {usuario ? (
          <div className="flex items-center gap-4">
            <p className="text-white font-semibold tracking-wide drop-shadow-md">
              Olá, <span className="font-bold">{usuario.nome}</span>
            </p>

            <button
              onClick={() => setMenuAberto(!menuAberto)}
              disabled={saindo}
              className="relative bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-full font-bold text-sm shadow-md hover:shadow-xl transition-all active:scale-95"
            >
              {saindo ? "Saindo..." : "Menu"}

              {quantidadeCarrinho > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 12 }}
                  className="absolute -top-2 -right-1.5 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md border border-white"
                >
                  {quantidadeCarrinho}
                </motion.span>
              )}
            </button>

            {menuAberto && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="absolute top-0.25 right-0 mt-12 w-60 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-yellow-400/40 overflow-hidden z-50"
              >
                <div className="absolute -top-2 right-5 w-4 h-4 bg-white/95 rotate-45 border-l border-t border-yellow-400/40"></div>

                {usuario?.adm === true && (
                  <>
                    <hr className="border-yellow-300/40" />
                    <Link
                      to="/AdminUsuarios"
                      onClick={() => setMenuAberto(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-yellow-100 transition-all"
                    >
                      <span className="text-lg">⚙️</span> Administração
                    </Link>
                  </>
                )}

                <Link
                  to="/"
                  onClick={() => setMenuAberto(false)}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-yellow-100 transition-all"
                >
                  <span className="text-lg">🏠</span> Home
                </Link>

                <Link
                  to="/Pedidos"
                  onClick={() => setMenuAberto(false)}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-yellow-100 transition-all"
                >
                  <span className="text-lg">🙋‍♂️</span> Pedidos
                </Link>

                <Link
                  to="/Perfil"
                  onClick={() => setMenuAberto(false)}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-yellow-100 transition-all"
                >
                  <span className="text-lg">👤</span> Perfil
                </Link>

                <hr className="border-yellow-300/40" />

                <Link
                  to="/Notificacao"
                  onClick={() => setMenuAberto(false)}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-yellow-100 transition-all"
                >
                  <span className="text-lg">🛒</span> Carrinho
                  {quantidadeCarrinho > 0 && (
                    <span className="ml-auto bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {quantidadeCarrinho}
                    </span>
                  )}
                </Link>

                <hr className="border-yellow-300/40" />

                <button
                  onClick={() => {
                    handleSair();
                    setMenuAberto(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-100 transition-all"
                >
                  <span className="text-lg">🚪</span> Sair
                </button>
              </motion.div>
            )}
          </div>
        ) : (
          <Link to="/TelaCadastrar">
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2 rounded-full font-bold text-sm shadow-md hover:shadow-xl transition-all active:scale-95">
              Entrar / Cadastrar-se
            </button>
          </Link>
        )}
      </div>
    </header>
  );
}

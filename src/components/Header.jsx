import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Header({ usuario, handleSair }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [saindo, setSaindo] = useState(false);

  return (
    <header className="bg-[#004C99] px-6 py-3 flex items-center justify-between shadow-md sticky top-0 z-50 relative">
      <div className="flex items-center gap-3">
        <Link to="/">
          <img src="./src/assets/sesc.png" className="h-10 cursor-pointer" />
        </Link>
        <Link to="/">
          <img src="./src/assets/senac.png" className="h-10 cursor-pointer" />
        </Link>
      </div>
      <div className="relative">
        {usuario ? (
          <div className="flex items-center gap-4">
            <p className="text-white font-medium">Olá, {usuario.nome}</p>
            <button
              onClick={() => setMenuAberto(!menuAberto)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-full font-semibold text-sm relative"
              disabled={saindo}
            >
              {saindo ? "Saindo..." : "Menu"}
            </button>
            {menuAberto && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute top-0.25 right-0 mt-10 w-52 bg-gradient-to-b from-[#F6BE00] to-[#ffcc23] text-black rounded-2xl shadow-2xl overflow-hidden z-50"
              >
                <div className="absolute -top-2 right-4 w-4 h-4 bg-gradient-to-b from-[#F6BE00] to-[#ffcc23] rotate-45 shadow-[0_2px_6px_rgba(0,0,0,0.2)]"></div>
                <Link
                  to="/"
                  className="flex items-center gap-2 px-4 py-3 text-sm font-semibold hover:bg-white hover:text-[#004C99] transition-colors"
                  onClick={() => setMenuAberto(false)}
                >
                  <span className="text-lg">🏠</span> Home
                </Link>
                <Link
                  to="/Perfil"
                  className="flex items-center gap-2 px-4 py-3 text-sm font-semibold hover:bg-white hover:text-[#004C99] transition-colors"
                  onClick={() => setMenuAberto(false)}
                >
                  <span className="text-lg">👤</span> Perfil
                </Link>
                <hr className="border-white/30 mx-4" />
                <Link
                  to="/contato"
                  className="flex items-center gap-2 px-4 py-3 text-sm font-semibold hover:bg-white hover:text-[#004C99] transition-colors"
                  onClick={() => setMenuAberto(false)}
                >
                  <span className="text-lg">📞</span> Contato
                </Link>
                <hr className="border-white/30 mx-4" />
                <Link
                  to="/Notificacao"
                  className="flex items-center gap-2 px-4 py-3 text-sm font-semibold hover:bg-white hover:text-[#004C99] transition-colors"
                  onClick={() => setMenuAberto(false)}
                >
                  <span className="text-lg">🛒</span> Carrinho
                </Link>
                <hr className="border-white/30 mx-4" />
                <button
                  onClick={() => {
                    handleSair();
                    setMenuAberto(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold hover:bg-white hover:text-red-500 transition-colors"
                >
                  <span className="text-lg">🚪</span> Sair
                </button>
              </motion.div>
            )}
          </div>
        ) : (
          <Link to="/TelaCadastrar">
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-1.5 rounded-full font-semibold text-sm transition">
              🔍 Entrar/Cadastrar-se
            </button>
          </Link>
        )}
      </div>
    </header>
  );
}

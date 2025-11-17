import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";


export default function App() {
  const produtosSesc = [         
    { nome: "Pão de queijo 160g", preco: "R$3,00", img: "https://cdn-icons-png.flaticon.com/512/4729/4729426.png" },
    { nome: "Misto quente", preco: "R$5,00", img: "https://cdn-icons-png.flaticon.com/512/857/857681.png" },
    { nome: "Bauru de queijo e presunto", preco: "R$5,50", img: "https://cdn-icons-png.flaticon.com/512/2921/2921822.png" },
    { nome: "Sanduíche natural", preco: "R$7,50", img: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png" },
    { nome: "Suco natural", preco: "R$7,00", img: "https://cdn-icons-png.flaticon.com/512/415/415733.png" },
    { nome: "Suco de lata", preco: "R$6,00", img: "https://cdn-icons-png.flaticon.com/512/805/805852.png" },
    { nome: "Água", preco: "R$3,50", img: "https://cdn-icons-png.flaticon.com/512/1046/1046857.png" },
    { nome: "Bolo de chocolate", preco: "R$6,25", img: "https://cdn-icons-png.flaticon.com/512/857/857681.png" },
    { nome: "Achocolatado", preco: "R$4,00", img: "https://cdn-icons-png.flaticon.com/512/1046/1046787.png" },
    { nome: "Chá mate", preco: "R$6,00", img: "https://cdn-icons-png.flaticon.com/512/1046/1046855.png" },
    { nome: "Salada de frutas", preco: "R$5,50", img: "https://cdn-icons-png.flaticon.com/512/706/706164.png" },
    { nome: "Café com leite", preco: "R$3,70", img: "https://cdn-icons-png.flaticon.com/512/1046/1046782.png" },
  ];

  const produtosSenac = [
    { nome: "Coxinha", preco: "R$4,00", img: "https://cdn-icons-png.flaticon.com/512/1046/1046796.png" },
    { nome: "Empada de frango", preco: "R$4,50", img: "https://cdn-icons-png.flaticon.com/512/520/520421.png" },
    { nome: "Pastel de carne", preco: "R$5,00", img: "https://cdn-icons-png.flaticon.com/512/857/857681.png" },
    { nome: "Enroladinho de salsicha", preco: "R$4,50", img: "https://cdn-icons-png.flaticon.com/512/2738/2738855.png" },
    { nome: "Hambúrguer artesanal", preco: "R$10,00", img: "https://cdn-icons-png.flaticon.com/512/1046/1046787.png" },
    { nome: "Suco de polpa", preco: "R$6,50", img: "https://cdn-icons-png.flaticon.com/512/805/805852.png" },
    { nome: "Refrigerante", preco: "R$5,00", img: "https://cdn-icons-png.flaticon.com/512/1046/1046857.png" },
    { nome: "Torta de limão", preco: "R$6,00", img: "https://cdn-icons-png.flaticon.com/512/4729/4729426.png" },
    { nome: "Brownie", preco: "R$7,00", img: "https://cdn-icons-png.flaticon.com/512/706/706164.png" },
    { nome: "Café expresso", preco: "R$3,50", img: "https://cdn-icons-png.flaticon.com/512/1046/1046782.png" },
    { nome: "Pão com mortadela", preco: "R$4,00", img: "https://cdn-icons-png.flaticon.com/512/2921/2921822.png" },
    { nome: "Água", preco: "R$3,00", img: "https://cdn-icons-png.flaticon.com/512/1046/1046857.png" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Cabeçalho */}
      <header className="bg-[#003366] flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Sesc_logo.svg"
            alt="Logo Sesc"
            className="h-8"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/69/Senac_logo.svg"
            alt="Logo Senac"
            className="h-8"
          />
          
        </div>
        <Link to="/TelaCadastrar">
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-1.5 rounded-full font-semibold text-sm">
            🔍 Entrar/Cadastrar-se
          </button>
        </Link>

      </header>

      {/* Saldo */}
      <section className="flex justify-center mt-4 flex-wrap gap-3">
        <p className="text-lg font-semibold">Saldo Atual: R$0,00</p>
        <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded-full font-medium">
          Inserir saldo
        </button>
      </section>

      {/* Mensagem de boas-vindas */}
      <div className=" from-[#4A90E2] to-[#005BBB] text-white px-5 py-3 rounded-lg text-center mx-auto mt-6 shadow-md w-[90%] max-w-md">
        <p className="text-base font-medium">
          Seja bem-vindo à lanchonete do Sesc e Senac.
        </p>
      </div>

      {/* Menu principal */}
      <main className="flex justify-center items-start gap-16 mt-12 flex-wrap">
        {/* Menu */}
        <div className="flex flex-col items-center text-center max-w-[200px]">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2921/2921822.png"
            alt="Menu"
            className="w-24 h-24 mb-3"
          />
          <p className="text-sm font-medium mb-3">
            Veja nosso menu de lanches e bebidas.
          </p>
          <div className="flex gap-2">
            <button className="bg-yellow-400 hover:bg-yellow-500 text-sm font-semibold px-4 py-1 rounded-full">
              SESC
            </button>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-sm font-semibold px-4 py-1 rounded-full">
              SENAC
            </button>
          </div>
        </div>

        {/* Pedidos */}
        <div className="flex flex-col items-center text-center max-w-[200px]">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png"
            alt="Pedidos"
            className="w-24 h-24 mb-3"
          />
          <p className="text-sm font-medium">
            Veja aqui seus pedidos pendentes e pedidos passados.
          </p>
        </div>
      </main>

      {/* MENU DO SESC */}
      <section className="mt-16 px-6">
        <div className="flex items-center justify-between max-w-6xl mx-auto mb-4">
          <button className="bg-blue-100 hover:bg-blue-200 text-[#003366] px-3 py-1 rounded-md text-sm border border-blue-400">
            Filtrar ⮟
          </button>
          <h1 className="text-3xl font-bold text-center flex-1">MENU DO SESC</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {produtosSesc.map((p, index) => (
            <div key={index} className="bg-yellow-400 rounded-lg p-4 flex flex-col items-center shadow-md">
              <img src={p.img} alt={p.nome} className="w-24 h-24 mb-3" />
              <p className="text-center font-medium mb-1">{p.nome}</p>
              <p className="text-sm mb-2">{p.preco}</p>
              <button className="bg-white hover:bg-gray-100 text-black font-semibold py-1 w-full rounded-full mb-1">
                Comprar
              </button>
              <button className="bg-white hover:bg-gray-100 text-black font-semibold py-1 w-full rounded-full">
                Descrição
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* MENU DO SENAC */}
      <section className="mt-20 px-6 pb-16">
        <div className="flex items-center justify-between max-w-6xl mx-auto mb-4">
          <button className="bg-blue-100 hover:bg-blue-200 text-[#003366] px-3 py-1 rounded-md text-sm border border-blue-400">
            Filtrar ⮟
          </button>
          <h1 className="text-3xl font-bold text-center flex-1">MENU DO SENAC</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {produtosSenac.map((p, index) => (
            <div key={index} className="bg-yellow-400 rounded-lg p-4 flex flex-col items-center shadow-md">
              <img src={p.img} alt={p.nome} className="w-24 h-24 mb-3" />
              <p className="text-center font-medium mb-1">{p.nome}</p>
              <p className="text-sm mb-2">{p.preco}</p>
              <button className="bg-white hover:bg-gray-100 text-black font-semibold py-1 w-full rounded-full mb-1">
                Adicionar
              </button>
              <button className="bg-white hover:bg-gray-100 text-black font-semibold py-1 w-full rounded-full">
                Descrição
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

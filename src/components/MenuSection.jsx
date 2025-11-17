import React from "react";

export default function MenuSection({
  titulo,
  produtos,
  categorias,
  filtro,
  setFiltro,
  mostrarFiltro,
  setMostrarFiltro,
  setProdutoSelecionado,
}) {
  return (
    <section className="mt-16 px-6 relative">
      <div className="flex items-center justify-between max-w-6xl mx-auto mb-4 relative">
        <div className="relative">
          <button
            onClick={() => setMostrarFiltro(!mostrarFiltro)}
            className="bg-linear-to-r from-yellow-300 to-yellow-500 text-black px-5 py-2 rounded-full font-semibold shadow-lg hover:scale-105 transition"
          >
            🔍 Filtrar
          </button>

          {mostrarFiltro && (
            <div className="absolute left-0 mt-2 w-60 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-fadeIn">
              {categorias.map((cat) => (
                <button
                  key={cat.nome}
                  onClick={() => {
                    setFiltro(cat.nome);
                    setMostrarFiltro(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  {cat.icone} {cat.nome}
                </button>
              ))}
              <button
                onClick={() => {
                  setFiltro("Todos");
                  setMostrarFiltro(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-gray-100"
              >
                Mostrar Todos
              </button>
            </div>
          )}
        </div>
        <h1 className="text-3xl font-bold text-center flex-1">{titulo}</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto animate-fadeIn">
        {produtos.map((p, index) => (
          <div
            key={index}
            className="bg-yellow-400 rounded-lg p-4 flex flex-col items-center shadow-md hover:shadow-xl transition"
          >
            <img src={p.img} alt={p.nome} className="w-24 h-24 mb-3" />
            <p className="text-center font-medium mb-1">{p.nome}</p>
            <p className="text-sm mb-2">{p.preco}</p>
            <button className="bg-white hover:bg-gray-100 text-black font-semibold py-1 w-full rounded-full mb-1">
              Comprar
            </button>
            <button
              onClick={() => setProdutoSelecionado(p)}
              className="bg-white hover:bg-gray-100 text-black font-semibold py-1 w-full rounded-full"
            >
              Descrição
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

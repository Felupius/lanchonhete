import React from "react";

export default function ProductCard({ product = {}, onBuy, onShow }) {
  // Compatibilidade com diferentes nomes de campos do Supabase
  const nome = product.nome || product.nome_produto || "Produto";
  const descricao = product.descricao || product.desc || "Sem descrição disponível";
  const preco = product.preco || product.price || "-";
  const img = product.img || product.imagem || product.foto || "/src/assets/fundo.png";

  return (
    <div className="bg-white rounded-lg p-4 flex flex-col items-center shadow-md hover:shadow-xl transition transform hover:-translate-y-1">
      <div className="w-28 h-28 mb-3 flex items-center justify-center overflow-hidden rounded-md bg-gray-100">
        <img src={img} alt={nome} className="object-cover w-full h-full" />
      </div>

      <h3 className="text-center font-semibold text-sm">{nome}</h3>

      <p className="text-xs text-gray-600 text-center mt-1" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {descricao}
      </p>

      <p className="text-lg font-bold mt-2">{preco}</p>

      <div className="mt-3 w-full flex gap-2">
        <button
          onClick={() => onBuy && onBuy(product)}
          className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black py-2 rounded-full font-semibold"
        >
          Comprar
        </button>

        <button
          onClick={() => onShow && onShow(product)}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-black py-2 rounded-full font-semibold"
        >
          Descrição
        </button>
      </div>
    </div>
  );
}

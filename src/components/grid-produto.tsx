'use client'
import ProductCard from "./card-produto";
import { TypeProduct } from "../lib/firebase/models/product";
import { use } from "react";

// type Produto = {
//   id: number;
//   nome: string;
//   descricao: string;
//   preco: number;
//   categoria: string;
//   imagem: string;
// };

// type GridProps = {
//   produtos: Produto[];
// };

export default function Grid({produtos}: any) {
  return (
    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      
      {produtos.map((produto: TypeProduct) => (
        <ProductCard
          key={produto.imgName}
          nome={produto.name}
          descricao={produto.description}
          preco={produto.value}
          categoria={produto.category}
          imagem={produto.imgUrl}
        />
      ))}

    </section>
  );
}
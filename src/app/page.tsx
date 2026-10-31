"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/src/components/Header";

import productService from "@/src/lib/firebase/models/product";
import { addToCart, money, ShopProduct } from "@/src/lib/cart-service/shop";
export default function Home() {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [category, setCategory] = useState("Todas");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [attempt, setAttempt] = useState(0);
  const router = useRouter();
  useEffect(() => {
    let active = true;
    productService
      .getData()
      .then((data) => {
        if (active) {
          setProducts(
            data
              .filter((p) => p.hidden !== true)
              .filter(
                (p) =>
                  typeof p.name === "string" &&
                  Number.isFinite(p.value) &&
                  p.value >= 0,
              )
              .map((p) => ({
                ...p,
                id: p.id || `${p.name}-${p.imgName || p.category}`,
              })),
          );
          setLoading(false);
          setError("");
        }
      })
      .catch(() => {
        if (active) {
          setError(
            "Não foi possível carregar os produtos. Tente novamente em instantes.",
          );
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [attempt]);
  const filtered = products.filter(
    (p) => category === "Todas" || p.category === category,
  );
  function add(p: ShopProduct, checkout = false) {
    try {
      addToCart(p);
      setNotice(`${p.name} adicionado ao carrinho.`);
      if (checkout) router.push("/cart");
    } catch {
      setNotice("Não foi possível salvar o carrinho neste navegador.");
    }
  }
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <p className="text-sm text-[#8a2819]">
          Dádiva · Aromaterapia & Aromacologia
        </p>
        <h1 className="mt-2 text-3xl font-semibold">
          Cuidado e bem-estar para o seu dia
        </h1>
        <p className="mt-3 text-gray-600">
          Escolha seus aromas favoritos e monte seu carrinho.
        </p>
        <div className="my-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#f7f5f3] p-4">
          <label
            className="flex items-center gap-3 text-sm font-medium"
            htmlFor="category"
          >
            Tipo de produto
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="min-h-11 rounded-lg border border-gray-300 bg-white px-3"
            >
              <option>Todas</option>
              {[...new Set(products.map((p) => p.category))]
                .filter(Boolean)
                .map((c) => (
                  <option key={c}>{c}</option>
                ))}
            </select>
          </label>
          <span className="text-sm text-gray-600">
            {filtered.length} produtos
          </span>
        </div>
        <p role="status" className="mb-4 text-sm text-[#8a2819]">
          {notice}
        </p>
        {loading ? (
          <p role="status">Carregando produtos…</p>
        ) : error ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-100 bg-red-50 p-6"
          >
            <p>{error}</p>
            <button
              className="shop-button mt-4"
              onClick={() => {
                setLoading(true);
                setError("");
                setAttempt((v) => v + 1);
              }}
            >
              Tentar novamente
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <p className="rounded-2xl bg-[#f7f5f3] p-8">
            Nenhum produto disponível nesta categoria.
          </p>
        ) : (
          <section
            aria-label="Produtos"
            className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3"
          >
            {filtered.map((p) => (
              <article
                key={p.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white"
              >
                <div className="flex aspect-square items-center justify-center bg-[#f7f5f3]">
                  {p.imgUrl ? (
                    <img
                      src={p.imgUrl}
                      alt={p.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-sm text-gray-500">Sem imagem</span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-3 sm:p-5">
                  <p className="text-xs text-gray-500">{p.category}</p>
                  <h2 className="mt-1 font-semibold sm:text-lg">{p.name}</h2>
                  <p className="my-2 text-sm text-gray-600">{p.description}</p>
                  <p className="mt-auto mb-4 text-lg font-semibold text-[#8a2819]">
                    {money(p.value)}
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      className="shop-button flex-1"
                      onClick={() => add(p, true)}
                    >
                      Comprar
                    </button>
                    <button
                      className="shop-button shop-secondary flex-1"
                      onClick={() => add(p)}
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </>

  );
}


// 'use client'
// import Grid from "@/src/components/grid-produto";
// import CategoryFilter from "@/src/components/filtro-categoria";
// import Header from "@/src/components/Header";
// import productService, {TypeProduct} from "../lib/firebase/models/product";
// import { useState, useEffect, Suspense } from "react";

// // const produtos = [
// //   {
// //     id: 1,
// //     nome: "Óleo essencial",
// //     descricao: "Aroma para o seu ambiente",
// //     preco: 39.9,
// //     categoria: "Aromaterapia",
// //     imagem: "/images/oleo-essencial.jpg",
// //   },
// //   {
// //     id: 2,
// //     nome: "Vela aromática",
// //     descricao: "Perfume e aconchego para sua casa",
// //     preco: 29.9,
// //     categoria: "Aromatização",
// //     imagem: "/images/vela-aromatica.jpg",
// //   },
// //   {
// //     id: 3,
// //     nome: "Sabonete artesanal",
// //     descricao: "Cuidado especial para a pele",
// //     preco: 19.9,
// //     categoria: "Cuidados pessoais",
// //     imagem: "/images/sabonete-artesanal.jpg",
// //   },
// //   {
// //     id: 4,
// //     nome: "Banho de Ano Novo 2027",
// //     descricao: "Purifica o corpo e a mente, trazendo boas energias e prosperidade, equilíbrio e bem-estar",
// //     preco: 15,
// //     categoria: "Cuidados pessoais",
// //     imagem: "/images/banho-ano-novo-2027.jpg",
// //   },
// //   {
// //     id: 5,
// //     nome: "Teste",
// //     descricao: "Teste",
// //     preco: 15,
// //     categoria: "Aromaterapia",
// //     imagem: "Teste",
// //   },
// //   {
// //     id: 6,
// //     nome: "Teste",
// //     descricao: "Teste",
// //     preco: 15,
// //     categoria: "Aromaterapia",
// //     imagem: "Teste",
// //   },
// //   {
// //     id: 7,
// //     nome: "Teste",
// //     descricao: "Teste",
// //     preco: 15,
// //     categoria: "Aromatização",
// //     imagem: "Teste",
// //   },
// // ];

// export default function Home() {
//   const products = productService.getData();

//   // const [categoriaSelecionada, setCategoriaSelecionada] =
//   //   useState("Todas");

//   // const categorias = [
//   //   ...new Set(produtos.map((produto) => produto.category)),
//   // ];

//   // const produtosFiltrados =
//   //   categoriaSelecionada === "Todas"
//   //     ? produtos
//   //     : produtos.filter(
//   //         (produto) => produto.categoria === categoriaSelecionada
//   //       );

//   return (
//     <main className="mx-auto max-w-6xl p-6">
//       <Header />

//       <h1 className="mb-6 text-2xl font-bold">
//         Filtros
//       </h1>


//       <Suspense fallback={
//         <div>
//           loading...
//         </div>
//       }
      
//       >
//         <Grid produtos={products} />
//       </Suspense>
      

//     </main>
//   );
// }

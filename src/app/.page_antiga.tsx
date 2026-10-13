import productService, {TypeProduct} from "../lib/firebase/models/product";
import { useState, useEffect, Suspense } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<TypeProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState("");


  useEffect(() => {
    if (!isLoading) return;

    productService.getData()
      .then((objs: TypeProduct[]) => {

        setProducts(objs);
        
        readCategories(objs);

        setIsLoading(false);
      })
      .catch(() => {
        // if (active) {}
        setError(
          "Não foi possível carregar os produtos. Tente novamente em instantes.",
        );
        setLoading(false);
      }
      );
  });


  // por enquanto filtragem manual
  function readCategories(objs: TypeProduct[]) {
    
    let newCategories = [
      ...new Set(objs.map((produto) => produto.category)),
    ];


    setCategorias(newCategories);
  }

  const produtosFiltrados = categoriaSelecionada === "Todas" ? 
    products
    : 
    products.filter(
      (produto) => produto.category === categoriaSelecionada
    );


  return (
    <main className="mx-auto max-w-6xl p-6">

      {!isLoading && 
        <div>

          <Header />
    
          <h1 className="mb-6 text-2xl font-bold">
            Filtros
          </h1>

          <CategoryFilter
            categorias={categorias}
            categoriaSelecionada={categoriaSelecionada}
            onSelecionarCategoria={setCategoriaSelecionada}
          />
          
          <Grid produtos={produtosFiltrados} />   

        </div>
      }

    </main>
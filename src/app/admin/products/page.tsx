'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/src/components/Button";
import { parseCurrency } from "@/src/lib/utils/formatters";
import imageService from "@/src/lib/firebase/storage/image-service";
import productService, { TypeProduct } from "@/src/lib/firebase/models/product";

export default function AdminProductsPage() {
  const router = useRouter();
  const [img, setImg] = useState<string | null>(null);
  const [displayPrice, setDisplayPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericFloat = parseCurrency(value);
    
    setDisplayPrice(
      numericFloat.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
    );
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setSuccessMessage("");

    try {
      const form = event.currentTarget;
      const fileInput = form.elements.namedItem('input_imagem_produto') as HTMLInputElement;
      const nameInput = form.elements.namedItem('input_nome_produto') as HTMLInputElement;
      const categoryInput = form.elements.namedItem('input_categoria_produto') as HTMLInputElement;
      const descriptionInput = form.elements.namedItem('input_descricao_produto') as HTMLInputElement;
      const valueInput = form.elements.namedItem('input_valor_produto') as HTMLInputElement;

      const imgFile = fileInput?.files?.[0];

      if (!imgFile) {
        throw new Error("Imagem não inserida");
      }

      const productId = productService.getNewRandomId();

      // TODO
      // fazer uma verificação se o arquivo realmente é imagem
      // limitar também o tamanho da imagem talvez no maximo uns 2 mb

      const imgUrl = await imageService.uploadNewImage(productId, imgFile);

      const objProduct: TypeProduct = {
        name: nameInput.value,
        category: categoryInput.value,
        description: descriptionInput.value,
        value: parseCurrency(valueInput.value),
        imgUrl,
      } 

      await productService.save(productId, objProduct);

      setImg(imgUrl);

      setSuccessMessage("Produto cadastrado com sucesso!");
      form.reset();
      setDisplayPrice("");
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Erro salvando produto:", error.message);
      alert("Erro ao criar produto: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col p-6 md:p-10">
      <div className="max-w-4xl w-full mx-auto">
        
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Novo Produto (Modo Simulação)</h1>
            <p className="text-sm text-gray-500 mt-1">Cadastre itens para testar o fluxo visual do catálogo.</p>
          </div>
          <Button variant="secondary" onClick={() => router.push('/admin')}>
            Voltar ao Painel
          </Button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">

          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm font-medium">
              {successMessage}
            </div>
          )}

          {img && (
            <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-lg shadow-sm">
                <img src={img} alt="Preview" content="fill" className="object-cover" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Imagem carregada com sucesso:</p>
                <p className="text-xs text-gray-500">Pronta para exibição na vitrine</p>
              </div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label htmlFor="input_nome_produto" className="block text-sm font-medium text-gray-700">Nome do Produto</label>
                <input 
                  required
                  type="text" 
                  id="input_nome_produto" 
                  name="input_nome_produto"
                  placeholder="Ex: Óleo Essencial de Lavanda"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900/20 focus:border-red-900 transition text-sm bg-white text-gray-900"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="input_categoria_produto" className="block text-sm font-medium text-gray-700">Categoria</label>
                <input 
                  required
                  type="text" 
                  id="input_categoria_produto" 
                  name="input_categoria_produto"
                  placeholder="Ex: Aromaterapia"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900/20 focus:border-red-900 transition text-sm bg-white text-gray-900"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="input_descricao_produto" className="block text-sm font-medium text-gray-700">Descrição</label>
              <textarea
                required
                id="input_descricao_produto" 
                name="input_descricao_produto"
                rows={3}
                placeholder="Descreva os benefícios, aroma e modo de uso..."
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900/20 focus:border-red-900 transition text-sm bg-white text-gray-900 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label htmlFor="input_valor_produto" className="block text-sm font-medium text-gray-700">Valor (R$)</label>
                <input 
                  required
                  type="text"
                  id="input_valor_produto" 
                  name="input_valor_produto"
                  value={displayPrice}
                  onChange={handlePriceChange}
                  placeholder="R$ 0,00"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900/20 focus:border-red-900 transition text-sm bg-white text-gray-900 font-semibold text-red-900"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="input_imagem_produto" className="block text-sm font-medium text-gray-700">Imagem do Produto</label>
                <input 
                  type="file" 
                  id="input_imagem_produto"
                  name="input_imagem_produto"
                  accept="image/*"
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-900 hover:file:bg-red-100 transition cursor-pointer border border-gray-300 rounded-lg p-1 bg-white"
                />
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" disabled={loading} className="w-full py-3 text-base">
                {loading ? "Processando..." : "Criar Produto (Simulação)"}
              </Button>
            </div>

          </form>

        </div>

      </div>
    </main>
  );
}
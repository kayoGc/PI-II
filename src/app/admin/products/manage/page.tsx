"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/src/components/admin/card-produto";
import productService, { TypeProduct } from "@/src/lib/firebase/models/product";

type Product = TypeProduct & { id: string };

export default function ManageProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [createdMessage, setCreatedMessage] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await productService.getData();
      setProducts(data.filter((product): product is Product => Boolean(product.id)));
    } catch {
      setError("Não foi possível carregar os produtos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
    if (sessionStorage.getItem("admin-product-created") === "true") {
      sessionStorage.removeItem("admin-product-created");
      setCreatedMessage(true);
    }
  }, [loadProducts]);

  async function toggleVisibility(product: Product) {
    setBusyId(product.id);
    setError("");
    try {
      const hidden = !product.hidden;
      await productService.updateObj(product.id, { hidden });
      setProducts((current) => current.map((item) => item.id === product.id ? { ...item, hidden } : item));
    } catch {
      setError(`Não foi possível ${product.hidden ? "mostrar" : "ocultar"} ${product.name}.`);
    } finally {
      setBusyId("");
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setBusyId(deleting.id);
    setError("");
    try {
      await productService.removeObj(deleting.id);
      setProducts((current) => current.filter((item) => item.id !== deleting.id));
      setDeleting(null);
    } catch {
      setError(`Não foi possível excluir ${deleting.name}.`);
    } finally {
      setBusyId("");
    }
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const form = new FormData(event.currentTarget);
    const updated: Product = {
      ...editing,
      name: String(form.get("name") || "").trim(),
      category: String(form.get("category") || "").trim(),
      description: String(form.get("description") || "").trim(),
      value: Number(form.get("value")),
    };
    if (!updated.name || !updated.category || !updated.description || !Number.isFinite(updated.value) || updated.value < 0) {
      setError("Preencha todos os campos com valores válidos.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await productService.updateObj(updated.id, {
        name: updated.name,
        category: updated.category,
        description: updated.description,
        value: updated.value,
      });
      setProducts((current) => current.map((item) => item.id === updated.id ? updated : item));
      setEditing(null);
    } catch {
      setError("Não foi possível salvar as alterações. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 md:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-[#8a2819]">Painel administrativo</p>
            <h1 className="mt-1 text-2xl font-semibold text-gray-900">Gerenciar produtos</h1>
            <p className="mt-2 text-sm text-gray-600">Edite as informações, remova produtos ou controle o que aparece na loja.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin" className="inline-flex min-h-11 items-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-100">Voltar ao painel</Link>
            <Link href="/admin/products" className="inline-flex min-h-11 items-center rounded-lg bg-[#861d10] px-4 text-sm font-medium text-white hover:bg-[#6d170d]">Cadastrar produto</Link>
          </div>
        </header>

        {error && <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>}
        {createdMessage && <p role="status" className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-800">Produto cadastrado com sucesso.</p>}
        {loading ? <p role="status" className="py-10 text-center text-gray-600">Carregando produtos…</p> : products.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center text-gray-600">Ainda não há produtos cadastrados.</div>
        ) : (
          <section aria-label="Produtos cadastrados" className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
            {products.map((product) => (
              <div key={product.id} className={busyId === product.id ? "pointer-events-none opacity-60" : ""}>
                <ProductCard
                  nome={product.name}
                  categoria={product.category}
                  descricao={product.description}
                  preco={product.value}
                  imagem={product.imgUrl}
                  oculto={product.hidden === true}
                  onEditar={() => setEditing(product)}
                  onExcluir={() => setDeleting(product)}
                  onAlternarVisibilidade={() => void toggleVisibility(product)}
                />
              </div>
            ))}
          </section>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) setEditing(null); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="edit-title" className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 id="edit-title" className="text-xl font-semibold">Editar produto</h2>
            <form className="mt-5 space-y-4" onSubmit={saveProduct}>
              <label className="block text-sm font-medium text-gray-700">Nome<input name="name" required defaultValue={editing.name} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5" /></label>
              <label className="block text-sm font-medium text-gray-700">Categoria<input name="category" required defaultValue={editing.category} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5" /></label>
              <label className="block text-sm font-medium text-gray-700">Descrição<textarea name="description" required rows={3} defaultValue={editing.description} className="mt-1 w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5" /></label>
              <label className="block text-sm font-medium text-gray-700">Preço (R$)<input name="value" required type="number" min="0" step="0.01" defaultValue={editing.value} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5" /></label>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" disabled={saving} onClick={() => setEditing(null)} className="min-h-11 rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
                <button type="submit" disabled={saving} className="min-h-11 rounded-lg bg-[#861d10] px-4 text-sm font-medium text-white hover:bg-[#6d170d]">{saving ? "Salvando…" : "Salvar alterações"}</button>
              </div>
            </form>
          </section>
        </div>
      )}

      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <section role="alertdialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-description" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 id="delete-title" className="text-xl font-semibold text-gray-900">Excluir produto?</h2>
            <p id="delete-description" className="mt-2 text-sm text-gray-600">“{deleting.name}” será removido permanentemente do catálogo.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" disabled={busyId === deleting.id} onClick={() => setDeleting(null)} className="min-h-11 rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
              <button type="button" disabled={busyId === deleting.id} onClick={() => void confirmDelete()} className="min-h-11 rounded-lg bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700">{busyId === deleting.id ? "Excluindo…" : "Excluir produto"}</button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import '@/src/lib/firebase/auth/auth-service';

// Importações das funções do Realtime Database
import { getDatabase, ref, get, child } from 'firebase/database';

import Header from '@/src/components/Header';
import {
  CartItem,
  money,
  readCart,
  writeCart,
} from '@/src/lib/cart-service/shop';

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState('');

  // Novo estado para guardar as configurações vindas do Firebase
  const [whatsappConfig, setWhatsappConfig] = useState({
    phone: '',
    template: 'Olá! Gostaria de adquirir:\n\n{items}\n\nTotal: {total}'
  });

  useEffect(() => {
    const sync = () => {
      setItems(readCart());
      setReady(true);
    };

    sync();

    window.addEventListener('cart-updated', sync);
    window.addEventListener('storage', sync);

    return () => {
      window.removeEventListener('cart-updated', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  // Novo useEffect exclusivo para buscar os dados do Firebase assim que a página carrega
  useEffect(() => {
    const fetchWhatsappConfig = async () => {
      try {
        const dbRef = ref(getDatabase());
        const snapshot = await get(child(dbRef, 'configuracoes/whatsapp'));
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          setWhatsappConfig({
            phone: (data.numero || '').replace(/\D/g, ''),
            template: data.mensagemPadrao || 'Olá! Gostaria de adquirir:\n\n{items}\n\nTotal: {total}'
          });
        }
      } catch (error) {
        console.error("Erro ao buscar configurações do WhatsApp no Firebase:", error);
      }
    };

    fetchWhatsappConfig();
  }, []);

  function update(next: CartItem[]) {
    try {
      writeCart(next);
      setItems(next);
      setNotice('');
    } catch {
      setNotice(
        'Não foi possível salvar a alteração neste navegador.'
      );
    }
  }

  const total = items.reduce(
    (sum, item) => sum + item.value * item.quantity,
    0
  );

  const count = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // O telefone agora vem do nosso estado que leu o Firebase, não mais do process.env
  const phone = whatsappConfig.phone;

  // Texto dos itens e do total
  const itemsText = items
    .map(
      (item) =>
        `${item.quantity} × ${item.name} — ${money(
          item.value * item.quantity
        )}`
    )
    .join('\n');

  const totalText = money(total);

  // Substituí as marcações {items} e {total} do modelo salvo lá no Admin
  const message = whatsappConfig.template
    .replace('{items}', itemsText)
    .replace('{total}', totalText);

  return (
    <>
      <Header />

      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <Link
          href="/"
          className="text-sm text-[#8a2819]"
        >
          ← Continuar comprando
        </Link>

        <h1 className="my-6 text-3xl font-semibold">
          Seu carrinho ({count})
        </h1>

        <p
          role="status"
          className="mb-4 text-sm text-[#8a2819]"
        >
          {notice}
        </p>

        {!ready ? (
          <p>Carregando carrinho…</p>
        ) : items.length === 0 ? (
          <div className="rounded-2xl bg-[#f7f5f3] p-10 text-center">
            <h2 className="text-xl font-medium">
              Seu carrinho está vazio
            </h2>

            <p className="mt-2 mb-6 text-gray-600">
              Escolha seus produtos favoritos para começar.
            </p>

            <Link
              href="/"
              className="shop-button inline-block"
            >
              Ver produtos
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            <section
              aria-label="Itens do carrinho"
              className="space-y-4"
            >
              {items.map((item) => (
                <article
                  key={item.id}
                  className="flex gap-4 rounded-2xl border border-gray-200 p-4"
                >
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#f7f5f3]">
                    {item.imgUrl && (
                      <img
                        src={item.imgUrl}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500">
                      {item.category}
                    </p>

                    <h2 className="font-semibold">
                      {item.name}
                    </h2>

                    <p className="mt-1 text-sm">
                      {money(item.value)} / unidade
                    </p>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center rounded-lg border border-gray-300">
                        <button
                          aria-label={`Diminuir quantidade de ${item.name}`}
                          disabled={item.quantity === 1}
                          className="h-11 w-11 disabled:opacity-30"
                          onClick={() =>
                            update(
                              items.map((product) =>
                                product.id === item.id
                                  ? {
                                      ...product,
                                      quantity: product.quantity - 1,
                                    }
                                  : product
                              )
                            )
                          }
                        >
                          −
                        </button>

                        <span className="min-w-6 text-center">
                          {item.quantity}
                        </span>

                        <button
                          aria-label={`Aumentar quantidade de ${item.name}`}
                          className="h-11 w-11"
                          onClick={() =>
                            update(
                              items.map((product) =>
                                product.id === item.id
                                  ? {
                                      ...product,
                                      quantity: product.quantity + 1,
                                    }
                                  : product
                              )
                            )
                          }
                        >
                          +
                        </button>
                      </div>

                      <strong>
                        {money(item.value * item.quantity)}
                      </strong>
                    </div>

                    <button
                      className="mt-2 min-h-11 text-sm text-[#8a2819] underline"
                      aria-label={`Remover ${item.name}`}
                      onClick={() =>
                        update(
                          items.filter(
                            (product) => product.id !== item.id
                          )
                        )
                      }
                    >
                      Remover
                    </button>
                  </div>
                </article>
              ))}
            </section>

            <aside className="h-fit rounded-2xl bg-[#f7f5f3] p-6">
              <h2 className="text-xl font-semibold">
                Resumo da compra
              </h2>

              <div className="my-6 flex justify-between border-b border-gray-300 pb-5">
                <span>Total dos produtos</span>
                <strong>{money(total)}</strong>
              </div>

              <p className="mb-5 text-sm text-gray-600">
                Frete e disponibilidade serão combinados pelo WhatsApp.
              </p>

              {phone.length >= 10 ? (
                <a
                  href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shop-button block text-center"
                >
                  Finalizar pelo WhatsApp
                </a>
              ) : (
                <>
                  <button
                    disabled
                    className="shop-button w-full disabled:opacity-50"
                  >
                    Finalizar pelo WhatsApp
                  </button>

                  <p className="mt-3 text-sm text-gray-600">
                    O contato da loja ainda não está disponível.
                  </p>
                </>
              )}

              <p className="mt-4 text-xs text-gray-500">
                Você poderá revisar a mensagem antes de enviar.
              </p>
            </aside>
          </div>
        )}
      </main>
    </>
  );
}
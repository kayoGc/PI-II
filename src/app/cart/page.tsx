'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { database } from '@/src/lib/firebase/firebase-config';
import { ref, get, child } from 'firebase/database';

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

  // Estados para a API do ViaCEP e Validação
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState<any>(null);
  const [addressNumber, setAddressNumber] = useState('');
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepError, setCepError] = useState('');

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

  useEffect(() => {
    const fetchWhatsappConfig = async () => {
      try {
        const dbRef = ref(database);
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

  // Função que valida e consome a API do ViaCEP
  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setCep(value);
    setCepError('');
    setAddress(null);
    setAddressNumber(''); // Reseta o número se o CEP mudar

    // Quando completar 8 dígitos, dispara a validação na API
    if (value.length === 8) {
      setLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${value}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setAddress(data);
          setCepError('');
        } else {
          setCepError('CEP não encontrado na base de dados.');
          setAddress(null);
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        setCepError('Erro ao validar o CEP. Tente novamente.');
      } finally {
        setLoadingCep(false);
      }
    } else if (value.length > 0 && value.length < 8) {
      setCepError('O CEP deve conter 8 dígitos.');
    }
  };

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

  const phone = whatsappConfig.phone;

  const itemsText = items
    .map(
      (item) =>
        `${item.quantity} × ${item.name} — ${money(
          item.value * item.quantity
        )}`
    )
    .join('\n');

  const totalText = money(total);

  // Injeta o endereço validado pela API e o número digitado na mensagem do WhatsApp
  const addressText = address 
    ? `\n\n*Endereço de Entrega:* ${address.logradouro}, ${addressNumber} - ${address.bairro} - ${address.localidade}/${address.uf} (CEP: ${cep})` 
    : '';

  const message = whatsappConfig.template
    .replace('{items}', itemsText)
    .replace('{total}', totalText)
    .replace(/\\n/g, '\n') + addressText;

  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message).replace(/%0A/g, '%0D%0A')}`;

  // Condição para o formulário estar válido: telefone configurado, endereço validado pela API e número preenchido
  const isFormValid = phone.length >= 10 && address !== null && addressNumber.trim() !== '';

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
          <div className="rounded-2xl bg-card-light dark:bg-card-dark p-10 text-center">
            <h2 className="text-xl font-medium">
              Seu carrinho está vazio
            </h2>

            <p className="mt-2 mb-6 text-gray-600 dark:text-gray-400">
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
                  className="flex gap-4 rounded-2xl border border-gray-200 dark:border-gray-600 p-4"
                >

                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-card-light dark:bg-card-dark">
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
                      <div className="flex items-center rounded-lg border border-gray-300 dark:border-gray-600">
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

            <aside className="h-fit rounded-2xl bg-card-light dark:bg-card-dark p-6">
              <h2 className="text-xl font-semibold">
                Resumo da compra
              </h2>

              <div className="my-6 flex justify-between border-b border-gray-300 dark:border-gray-600 pb-5">
                <span>Total dos produtos</span>
                <strong>{money(total)}</strong>
              </div>

              {/* Validação de CEP integrada antes do botão */}
              <div className="mb-5 space-y-3">
                <div>
                  <label htmlFor="cepInput" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Informe seu CEP para entrega: <span className="text-red-700">*</span>
                  </label>
                  
                  <input
                    id="cepInput"
                    type="text"
                    maxLength={8}
                    placeholder="Digite o CEP (8 dígitos)"
                    value={cep}
                    onChange={handleCepChange}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark px-3 py-2 text-sm text-gray-900 dark:text-gray-200 focus:border-red-900 focus:outline-none"
                  />
                </div>

                {loadingCep && (
                  <p className="text-xs text-gray-500 dark:text-gray-200">Validando CEP na API...</p>
                )}

                {cepError && (
                  <p className="text-xs text-red-600 font-medium">{cepError}</p>
                )}

                {address && (
                  <div className="space-y-3">
                    <div className="rounded-lg bg-light dark:bg-dark p-3 text-xs text-gray-600 border border-emerald-800">
                      <p className="font-medium text-emerald-500">✓ Endereço validado:</p>
                      <p className="text-gray-800 dark:text-gray-200 mt-0.5">{address.logradouro}, {address.bairro}</p>
                      <p className="text-gray-600 dark:text-gray-400">{address.localidade} - {address.uf}</p>
                    </div>

                    <div>
                      <label htmlFor="addressNumber" className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">
                        Número e Complemento: <span className="text-red-700">*</span>
                      </label>

                      <input
                        id="addressNumber"
                        type="text"
                        placeholder="Ex: 123, Apto 45"
                        value={addressNumber}
                        onChange={(e) => setAddressNumber(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-light dark:bg-dark px-3 py-2 text-sm text-gray-900 dark:text-gray-300 focus:border-red-900 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {isFormValid ? (
                <a
                  href={whatsappUrl}
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

                  <p className="mt-3 text-xs text-amber-800 dark:text-amber-500">
                    {!address 
                      ? "⚠️ Informe um CEP válido para liberar o envio." 
                      : addressNumber.trim() === '' 
                        ? "⚠️ Preencha o número do endereço."
                        : "O contato da loja não está configurado."}
                  </p>
                </>
              )}

              <p className="mt-4 text-xs text-gray-500 dark:text-gray-300">
                Você poderá revisar a mensagem antes de enviar.
              </p>
            </aside>
          </div>
        )}
      </main>
    </>
  );
}
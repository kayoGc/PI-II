'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/src/components/Button';
import { database } from '@/src/lib/firebase/firebase-config';
import { ref, set, get, child } from 'firebase/database';
import ModeToggle from '@/src/components/mode-toggle';

export default function AdminBuyMessagePage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('5511999999999');
  const [messageTemplate, setMessageTemplate] = useState(
    'Olá, Dádiva Aromaterapia! Gostaria de fazer o seguinte pedido:\n\n{items}\n\n*Total:* {total}\n\nPor favor, confiram a disponibilidade e o valor do frete.'
  );
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        // 3. Usamos a constante 'database' diretamente
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, 'configuracoes/whatsapp'));
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          if (data.numero) setPhoneNumber(data.numero);
          if (data.mensagemPadrao) setMessageTemplate(data.mensagemPadrao);
        }
      } catch (error) {
        console.error("Erro ao buscar configurações:", error);
      }
    };

    fetchConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');

    try {
      // Usei a constante 'database' diretamente
      await set(ref(database, 'configuracoes/whatsapp'), {
        numero: phoneNumber,
        mensagemPadrao: messageTemplate
      });
      
      setSuccessMessage('✨ Configurações de atendimento salvas com sucesso!');
    } catch (error) {
      console.error("Erro ao salvar no Firebase:", error);
      alert("Erro ao salvar as configurações. Verifique o console.");
    } finally {
      setLoading(false);
    }
  };

  const samplePreview = messageTemplate
    .replace('{items}', `1x Óleo Essencial de Lavanda (R$ 45,90)\n1x Vela Aromática de Baunilha (R$ 34,90)`)
    .replace('{total}', 'R$ 80,80');

  return (
    <main className="min-h-screen flex flex-col bg-light dark:bg-dark p-6 md:p-10">
      <div className="mx-auto w-full max-w-4xl">
        
        <div className="mb-8 flex flex-col gap-4 border-b dark:border-gray-600 pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200">Configuração do WhatsApp</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Defina o número oficial da loja e personalize o texto padrão dos pedidos.</p>
          </div>

          <div>
            <ModeToggle/>

            <Button variant="secondary" onClick={() => router.push('/admin')}>
              Voltar ao Painel
            </Button>
          </div>
        </div>

        {successMessage && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 dark:bg-emerald-700 p-4 text-sm font-medium text-green-800 dark:text-green-200">
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          
          <div className="rounded-2xl border border-gray-100 dark:border-gray-600 bg-small-light dark:bg-small-dark p-6 shadow-sm md:col-span-2 md:p-8">
            <form onSubmit={handleSave} className="space-y-5">
              
              <div className="space-y-1">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Número do WhatsApp da Loja (com DDI e DDD)
                </label>
                <input 
                  required
                  type="text" 
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Ex: 5511999999999"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-small-light dark:bg-small-dark px-4 py-2.5 text-sm text-gray-900 dark:text-gray-300 transition focus:border-red-900 focus:outline-none focus:ring-2 focus:ring-red-900/20"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="messageTemplate" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Modelo da Mensagem do Pedido
                </label>
                <textarea
                  required
                  id="messageTemplate"
                  rows={6}
                  value={messageTemplate}
                  onChange={(e) => setMessageTemplate(e.target.value)}
                  className="w-full resize-none font-mono text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-small-light dark:bg-small-dark  px-4 py-2.5 text-gray-900 dark:text-gray-300 transition focus:border-red-900 focus:outline-none focus:ring-2 focus:ring-red-900/20"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" disabled={loading} className="w-full py-3">
                  {loading ? "Salvando..." : "Salvar Configurações"}
                </Button>
              </div>

            </form>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-gray-100 dark:border-gray-600 bg-small-light dark:bg-small-dark p-6 shadow-sm">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-green-700">
                Preview no WhatsApp
              </div>
              <div className="whitespace-pre-wrap rounded-xl border border-emerald-300 bg-emerald-100 dark:bg-emerald-700 p-4 font-sans text-xs leading-relaxed text-gray-800 dark:text-gray-300 shadow-inner">
                {samplePreview}
              </div>
            </div>

            <div className="mt-6 border-t dark:border-gray-600 border-gray-100 pt-4">
              <p className="text-center text-xs text-gray-400 dark:text-gray-200">
                Destino: <span className="font-semibold text-gray-600 dark:text-gray-400">+{phoneNumber}</span>
              </p>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
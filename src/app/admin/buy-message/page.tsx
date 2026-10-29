'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/src/components/Button';
import authService from '@/src/lib/firebase/auth/auth-service';

// 1. Importações do Firebase Realtime Database
import { getDatabase, ref, set, get, child } from 'firebase/database';

export default function AdminBuyMessagePage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('5511999999999');
  const [messageTemplate, setMessageTemplate] = useState(
    'Olá, Dádiva Aromaterapia! Gostaria de fazer o seguinte pedido:\n\n{items}\n\n*Total:* {total}\n\nPor favor, confiram a disponibilidade e o valor do frete.'
  );
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. Busca os dados atuais do Firebase ao carregar a página
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const dbRef = ref(getDatabase());
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

  /* 
  // Mantive seu código de auth comentado como estava
  useEffect(() => {
    authService.isUserLogged()
    .then((isLogged) => {
      if (!isLogged) {
        router.push('/');
      }
    })
    .catch((err: any) => {
      console.error("Erro verificando usuário", err.message);
      router.push('/');
    })
  }, [])
  */

  // 3. Atualiza a função handleSave para gravar no Firebase
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');

    try {
      const db = getDatabase();
      // Salva no nó "configuracoes/whatsapp"
      await set(ref(db, 'configuracoes/whatsapp'), {
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

  // Correção aqui: usando template strings (crases) para múltiplas linhas
  const samplePreview = messageTemplate
    .replace('{items}', `1x Óleo Essencial de Lavanda (R$ 45,90)\n1x Vela Aromática de Baunilha (R$ 34,90)`)
    .replace('{total}', 'R$ 80,80');

  return (
    <main className="min-h-screen flex flex-col bg-gray-50 p-6 md:p-10">
      <div className="mx-auto w-full max-w-4xl">
        
        {/* Cabeçalho Limpo da Seção */}
        <div className="mb-8 flex flex-col gap-4 border-b pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configuração do WhatsApp</h1>
            <p className="mt-1 text-sm text-gray-500">Defina o número oficial da loja e personalize o texto padrão dos pedidos.</p>
          </div>
          <Button variant="secondary" onClick={() => router.push('/admin')}>
            Voltar ao Painel
          </Button>
        </div>

        {successMessage && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-800">
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:col-span-2 md:p-8">
            <form onSubmit={handleSave} className="space-y-5">
              
              <div className="space-y-1">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                  Número do WhatsApp da Loja (com DDI e DDD)
                </label>
                <input 
                  required
                  type="text" 
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Ex: 5511999999999"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition focus:border-red-900 focus:outline-none focus:ring-2 focus:ring-red-900/20"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="messageTemplate" className="block text-sm font-medium text-gray-700">
                  Modelo da Mensagem do Pedido
                </label>
                <textarea
                  required
                  id="messageTemplate"
                  rows={6}
                  value={messageTemplate}
                  onChange={(e) => setMessageTemplate(e.target.value)}
                  className="w-full resize-none font-mono text-xs rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 transition focus:border-red-900 focus:outline-none focus:ring-2 focus:ring-red-900/20"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" disabled={loading} className="w-full py-3">
                  {loading ? "Salvando..." : "Salvar Configurações"}
                </Button>
              </div>

            </form>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-green-700">
                Preview no WhatsApp
              </div>
              <div className="whitespace-pre-wrap rounded-xl border border-emerald-100 bg-emerald-50 p-4 font-sans text-xs leading-relaxed text-gray-800 shadow-inner">
                {samplePreview}
              </div>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-4">
              <p className="text-center text-xs text-gray-400">
                Destino: <span className="font-semibold text-gray-600">+{phoneNumber}</span>
              </p>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
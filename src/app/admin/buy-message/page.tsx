'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/src/components/Button';
import { useEffect } from 'react';
import authService from '@/src/lib/firebase/auth/auth-service';

export default function AdminBuyMessagePage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('5511999999999');
  const [messageTemplate, setMessageTemplate] = useState(
    'Olá, Dádiva Aromaterapia! Gostaria de fazer o seguinte pedido:\n\n{items}\n\n*Total:* {total}\n\nPor favor, confiram a disponibilidade e o valor do frete.'
  );
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // analisa se tem um usuário logado
  // se não tiver manda para a página inicial
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');

    setTimeout(() => {
      setLoading(false);
      setSuccessMessage('✨ Configurações de atendimento salvas com sucesso!');
    }, 800);
  };

  const samplePreview = messageTemplate
    .replace('{items}', '- 1x Óleo Essencial de Lavanda (R$ 45,90)\n- 1x Vela Aromática de Baunilha (R$ 34,90)')
    .replace('{total}', 'R$ 80,80');

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col p-6 md:p-10">
      <div className="max-w-4xl w-full mx-auto">
        
        {/* Cabeçalho Limpo da Seção */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configuração do WhatsApp</h1>
            <p className="text-sm text-gray-500 mt-1">Defina o número oficial da loja e personalize o texto padrão dos pedidos.</p>
          </div>
          <Button variant="secondary" onClick={() => router.push('/admin')}>
            Voltar ao Painel
          </Button>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm font-medium">
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
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
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900/20 focus:border-red-900 transition text-sm bg-white text-gray-900"
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
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900/20 focus:border-red-900 transition text-sm bg-white text-gray-900 resize-none font-mono text-xs"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" disabled={loading} className="w-full py-3">
                  {loading ? "Salvando..." : "Salvar Configurações"}
                </Button>
              </div>

            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3 text-green-700 font-semibold text-sm">
                Preview no WhatsApp
              </div>
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 text-xs text-gray-800 whitespace-pre-wrap font-sans leading-relaxed shadow-inner">
                {samplePreview}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center">
                Destino: <span className="font-semibold text-gray-600">+{phoneNumber}</span>
              </p>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
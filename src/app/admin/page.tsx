'use client'

import { useRouter } from 'next/navigation';
import Button from '@/src/components/Button';
import { useEffect } from 'react';
import authService from '@/src/lib/firebase/auth/auth-service';

export default function AdminDashboardPage() {
  const router = useRouter();

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

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        
        {/* Cabeçalho do Painel */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
            <p className="text-sm text-gray-600">Gerencie o catálogo, preços e mensagens da Dádiva Aromaterapia.</p>
          </div>
          <Button 
            variant="secondary" 
            onClick={() => router.push('/')}
            className="w-full md:w-auto"
          >
            Ver Loja (Home)
          </Button>
        </div>

        {/* Grid de Atalhos / Módulos do Admin */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          
          {/* Card: Gestão de Produtos */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 text-red-900">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m7.5 4.27 9 5.15" />
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                  <path d="m3.3 7 8.7 5 8.7-5" />
                  <path d="M12 22V12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Produtos (Catálogo)</h3>
              <p className="mt-2 text-sm text-gray-600">
                Adicione novos óleos, velas e aromatizadores, altere preços ou remova itens da vitrine.
              </p>
            </div>
            <div className="mt-6">
              <Button 
                onClick={() => router.push('/admin/products/manage')}
                className="w-full"
              >
                Gerenciar Produtos
              </Button>
            </div>
          </div>

          {/* Card: Mensagem de Compra / WhatsApp */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-green-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Mensagem do WhatsApp</h3>
              <p className="mt-2 text-sm text-gray-600">
                Configure o texto padrão e o número de telefone que recebem os pedidos consolidados dos clientes.
              </p>
            </div>
            <div className="mt-6">
              <Button 
                variant="secondary"
                onClick={() => router.push('/admin/buy-message')}
                className="w-full bg-gray-100 hover:bg-gray-200"
              >
                Configurar Mensagem
              </Button>
            </div>
          </div>

          {/* Card: Contas Administrativas */}
          {/* <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-900">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Contas de Acesso</h3>
              <p className="mt-2 text-sm text-gray-600">
                Visualize os administradores cadastrados e gerencie as permissões de acesso ao painel.
              </p>
            </div>
            <div className="mt-6">
              <Button 
                variant="secondary"
                onClick={() => router.push('/admin/accounts')}
                className="w-full bg-gray-100 hover:bg-gray-200"
              >
                Gerenciar Contas
              </Button>
            </div>
          </div> */}

        </div>

      </div>
    </main>
  );
}

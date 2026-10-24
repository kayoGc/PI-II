'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/src/components/Button';
import { useEffect } from 'react';
import authService from '@/src/lib/firebase/auth/auth-service';

type AdminAccount = {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

// Lista inicial genérica / vazia ou pronta para novos cadastros
const initialAccounts: AdminAccount[] = [
  {
    id: 1,
    name: 'Administrador Principal',
    email: 'admin@dadiva.com',
    role: 'Super Administrador',
    createdAt: '14/10/2026',
  },
];

export default function AdminAccountsPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<AdminAccount[]>(initialAccounts);
  const [notice, setNotice] = useState('');

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

  const handleDelete = (id: number) => {
    if (accounts.length <= 1) {
      setNotice('Não é possível remover o último administrador ativo do sistema.');
      return;
    }
    setAccounts(accounts.filter((acc) => acc.id !== id));
    setNotice('Conta administrativa removida com sucesso.');
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col p-6 md:p-10">
      <div className="max-w-5xl w-full mx-auto">
        
        {/* Cabeçalho Limpo da Seção */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contas de Acesso</h1>
            <p className="text-sm text-gray-500 mt-1">Gerencie os operadores autorizados a acessar o painel restrito.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => router.push('/admin')}>
              Voltar ao Painel
            </Button>
            <Button onClick={() => router.push('/admin/add-admin')}>
              + Novo Administrador
            </Button>
          </div>
        </div>

        {notice && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium">
            {notice}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="p-4 sm:px-6">Nome</th>
                  <th className="p-4 sm:px-6">E-mail</th>
                  <th className="p-4 sm:px-6">Função</th>
                  <th className="p-4 sm:px-6">Criado em</th>
                  <th className="p-4 sm:px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {accounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-gray-50/50 transition">
                    <td className="p-4 sm:px-6 font-medium text-gray-900">{acc.name}</td>
                    <td className="p-4 sm:px-6 text-gray-600">{acc.email}</td>
                    <td className="p-4 sm:px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-900">
                        {acc.role}
                      </span>
                    </td>
                    <td className="p-4 sm:px-6 text-gray-500 text-xs">{acc.createdAt}</td>
                    <td className="p-4 sm:px-6 text-right">
                      <button
                        onClick={() => handleDelete(acc.id)}
                        className="text-xs text-red-600 hover:text-red-800 font-medium px-3 py-1.5 rounded bg-red-50 hover:bg-red-100 transition cursor-pointer"
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {accounts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-sm">Nenhuma conta administrativa cadastrada.</p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
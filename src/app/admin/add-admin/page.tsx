'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/src/components/Button';
import Input from '@/src/components/Input';

export default function AdminAddAdminPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Administrador');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve conter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess('✨ Administrador cadastrado com sucesso!');
      setName('');
      setEmail('');
      setPassword('');
    }, 900);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col p-6 md:p-10">
      <div className="max-w-2xl w-full mx-auto">
        
        {/* Cabeçalho Limpo da Seção */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Novo Administrador</h1>
            <p className="text-sm text-gray-500 mt-1">Conceda acesso restrito a um novo operador do painel.</p>
          </div>
          <Button variant="secondary" onClick={() => router.push('/admin/accounts')}>
            Voltar às Contas
          </Button>
        </div>

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm font-medium">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm font-medium">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <Input
              id="name"
              label="Nome Completo"
              type="text"
              placeholder="Ex: Maria Silva"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              id="email"
              label="E-mail de Acesso"
              type="email"
              placeholder="Ex: maria@dadiva.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              id="password"
              label="Senha Temporária"
              type="password"
              placeholder="Mínimo de 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex flex-col gap-1.5 w-full">
              <label htmlFor="role" className="text-sm font-semibold text-gray-700 ml-1">
                Nível de Permissão
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-red-900 transition-all bg-gray-50 focus:bg-white text-sm text-gray-900"
              >
                <option value="Administrador">Administrador (Catálogo e Ajustes)</option>
                <option value="Super Administrador">Super Administrador (Acesso Total)</option>
              </select>
            </div>

            <div className="pt-4">
              <Button type="submit" disabled={loading} className="w-full py-3 text-base">
                {loading ? 'Cadastrando...' : 'Salvar Novo Administrador'}
              </Button>
            </div>

          </form>
        </div>

      </div>
    </main>
  );
}
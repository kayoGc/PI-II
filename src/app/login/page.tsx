'use client'

import { useState } from 'react';
import Image from 'next/image';
import Button from '@/src/components/Button';
import Input from '@/src/components/Input';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import authService from '@/src/lib/firebase/auth/auth-service';

// TODO
// adicionar mensagem de erro quando login der errado

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ username: '', password: '' });
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ username: '', password: '' });

    let hasError = false;
    const newErrors = { username: '', password: '' };

    if (!username.trim()) {
      newErrors.username = 'Por favor, informe seu usuário.';
      hasError = true;
    }

    if (!password.trim()) {
      newErrors.password = 'Por favor, informe sua senha.';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      // await new Promise(resolve => setTimeout(resolve, 1500));

      await authService.login(username, password);
      
      router.push('/admin');
    } catch (error) {
      console.error('Erro de autenticação:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="w-full max-w-sm flex flex-col items-center">
        
        <div className="mb-8 w-full flex justify-center">
          <Link href="/" aria-label="Voltar para a página inicial">
            <Image
              src="/images/Logo.svg"
              alt="Logo da Dádiva Aromaterapia"
              width={280}
              height={100}
              priority
              className="h-auto w-64 md:w-80 object-contain"
            />
          </Link>
        </div>

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-5" noValidate>
          
          <Input 
            id="username"
            label="Usuário"
            type="text"
            placeholder="Digite seu usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={errors.username}
          />

          <Input 
            id="password"
            label="Senha"
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />

          <Button type="submit" disabled={loading} className="w-full py-3 text-lg font-medium">
            {loading ? 'Aguarde...' : 'Entrar'}
          </Button>
        </form>

      </div>
    </main>
  );
}
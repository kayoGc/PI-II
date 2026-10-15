'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function AdminHeader() {
  return (
    <header className="w-full border-b border-gray-200 bg-[#F7F7F7]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">

        {/* Logo */}
        <Link
          href="/admin"
          aria-label="Voltar para a página inicial admin"
          className="shrink-0"
        >
          <Image
            src="/images/Logo.svg"
            alt="Dádiva Aromaterapia"
            width={180}
            height={65}
            priority
            className="h-auto w-36 sm:w-44 object-contain"
          />
        </Link>

        {/* Navegação administrativa */}
        <nav className="flex flex-wrap items-center justify-end gap-2 sm:gap-4">
          <Link
            href="/admin/products"
            className="rounded-md bg-red-900 px-3 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-red-800 sm:px-5 sm:py-3"
          >
            Cadastro de produtos
          </Link>

          <Link
            href="/admin/products"
            className="rounded-md border border-red-900 px-3 py-2 text-center text-sm font-medium text-red-900 transition-colors hover:bg-red-50 sm:px-5 sm:py-3"
          >
            Editar produtos
          </Link>
        </nav>

      </div>
    </header>
  );
}
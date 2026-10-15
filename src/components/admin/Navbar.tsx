'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function AdminNavbar() {
  return (
    <header className="w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        
        <Link href="/admin" className="flex items-center gap-3">
          <Image
            src="/images/Logo.svg"
            alt="Dádiva Aromaterapia"
            width={140}
            height={50}
            priority
            className="h-10 w-auto object-contain"
          />
          <span className="text-xs font-semibold uppercase tracking-wider bg-red-50 text-red-900 px-2.5 py-1 rounded-md">
            Painel Admin
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/admin"
            className="text-sm font-medium text-gray-700 hover:text-red-900 transition px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            Início
          </Link>
          <Link
            href="/admin/products"
            className="text-sm font-medium text-gray-700 hover:text-red-900 transition px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            Produtos
          </Link>
          <Link
            href="/admin/buy-message"
            className="text-sm font-medium text-gray-700 hover:text-red-900 transition px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            WhatsApp
          </Link>
          <Link
            href="/admin/accounts"
            className="text-sm font-medium text-gray-700 hover:text-red-900 transition px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            Contas
          </Link>
          <Link
            href="/"
            className="ml-2 text-sm font-medium text-red-900 border border-red-900/30 px-3.5 py-2 rounded-lg hover:bg-red-50 transition"
          >
            Ver Loja ↗
          </Link>
        </nav>

      </div>
    </header>
  );
}
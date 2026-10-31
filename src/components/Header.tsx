"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { readCart } from "@/src/lib/cart-service/shop";
import ModeToggle from "./mode-toggle";

export default function Header() {
  const [count, setCount] = useState(0);

  // Atualiza a quantidade de itens no carrinho
  useEffect(() => {
    const sync = () => setCount(readCart().reduce((s, i) => s + i.quantity, 0));
    sync();
    window.addEventListener("cart-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("cart-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return (
    <header className="border-b dark:border-gray-600 dark:bg-dark dark:text-white" >
      <div className="mx-auto flex max-w-6xl items-center  justify-between gap-4 py-3 ">
        {/* Logo da loja */}
        <Link href="/" aria-label="Página inicial">
          <Image
            src="/images/Logo.svg"
            alt="Dádiva Aromaterapia"
            width={180}
            height={70}
            priority
            className="h-16 w-40 object-contain sm:w-48"
          />
        </Link>

        {/* Ações do lado direito */}
        <nav className="flex items-center gap-4">
          {/* Produtos */}
          {/* <Link href="/" className="hidden text-sm sm:block hover:bg-gray-800 transition rounded-full px-4">
            Produtos
          </Link> */}

          {/* Carrinho */}
          <Link
            href="/cart"
            aria-label={`Carrinho com ${count} itens`}
            className="flex min-h-11 items-center gap-2 rounded-full px-4 text-sm hover:bg-gray-800 transition"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              aria-hidden="true"
            >
              <path d="M2 3h3l3 12h11l3-9H6" />
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>
            ({count})
          </Link>

          <ModeToggle />
          {/* <Link href="/login" className="flex min-h-11 items-center text-sm">
            Entrar
          </Link> */}
        </nav>
      </div>
    </header>
  );
}


// export default function Header() {
//   return (
//     <header className="w-full border-b border-gray-200 bg-[#F7F7F7]">
//       <div className="mx-auto flex max-w-6xl items-center justify-between px-1 py-2">

//         {/* Logo da loja */}
//         <a href="/" aria-label="Página inicial da Dádiva">
//             <Image
//                 src="/images/Logo Dádiva.jpeg"
//                 alt="Logo da Dádiva"
//                 width={160}
//                 height={60}
//                 priority
//                 className="h-auto w-60 object-contain"
//             />
//         </a>

//         {/* Ações do lado direito */}
//         <div className="flex items-center gap-5">

//           {/* Carrinho */}
//           <button
//             type="button"
//             aria-label="Abrir carrinho"
//             className="text-gray-700 transition hover:text-red-900"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="26"
//               height="26"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="1.7"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <circle cx="9" cy="21" r="1" />
//               <circle cx="20" cy="21" r="1" />
//               <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
//             </svg>
//           </button>

//         </div>
//       </div>
//     </header>
//   );
// }
type ProductCardProps = {
  nome: string;
  descricao: string;
  preco: number | null | undefined;
  categoria: string;
  imagem: string | null;
  onEditar?: () => void;
  onExcluir?: () => void;
  onAlternarVisibilidade?: () => void;
  oculto?: boolean;
};

export default function ProductCard({
  nome,
  descricao,
  preco,
  categoria,
  imagem,
  onEditar,
  onExcluir,
  onAlternarVisibilidade,
  oculto = false,
}: ProductCardProps) {
  const precoNumerico = typeof preco === "number" ? preco : Number(preco);
  const precoFormatado = Number.isFinite(precoNumerico)
    ? precoNumerico.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
    : "Preço indisponível";

  return (
    <article className={`flex flex-col overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-600 bg-small-light dark:bg-small-dark ${oculto ? "opacity-70" : ""}`}>

      {/* Imagem e ações administrativas */}
      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-[#f7f5f3]">

        <img
          src={imagem || ""}
          alt={nome}
          className="h-full w-full object-cover"
        />

        {oculto && <span className="absolute bottom-3 left-3 rounded-full bg-gray-900/80 px-3 py-1 text-xs font-medium text-white">Oculto da loja</span>}

        {/* Botão excluir */}
        <button
          type="button"
          onClick={onExcluir}
          aria-label={`Excluir ${nome}`}
          title="Excluir produto"
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-600 shadow transition hover:bg-red-600 hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        {/* Botão editar */}
        <button
          type="button"
          onClick={onEditar}
          aria-label={`Editar ${nome}`}
          title="Editar produto"
          className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow transition hover:bg-gray-100 hover:text-red-900"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
          </svg>
        </button>
      </div>

      {/* Informações do produto */}
      <div className="flex flex-1 flex-col p-3 sm:p-5">
      <p className="text-xs text-gray-500">{categoria}</p>
      <h3 className="mt-1 font-semibold sm:text-lg">{nome}</h3>
      <p className="my-2 text-sm text-gray-600">
        {descricao}
      </p>
      <p className="mt-auto pt-2 text-lg font-semibold text-[#8a2819]">
        {precoFormatado}
      </p>
      <button
        type="button"
        onClick={onAlternarVisibilidade}
        aria-pressed={oculto}
        aria-label={`${oculto ? "Mostrar" : "Ocultar"} ${nome} na loja`}
        className={`mt-4 flex min-h-11 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${oculto ? "border-green-200 bg-green-50 text-green-800 hover:bg-green-100" : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"}`}
      >
        {oculto ? (
          <><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>Mostrar na loja</>
        ) : (
          <><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 3 18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.2A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a16 16 0 0 1-3.1 3.9"/><path d="M6.6 6.6C3.6 8.4 2 12 2 12s3.5 7 10 7c1 0 1.9-.2 2.8-.5"/></svg>Ocultar da loja</>
        )}
      </button>
      </div>
    </article>
  );
}

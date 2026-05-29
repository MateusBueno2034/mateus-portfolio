export function Footer() {
  return (
    <footer className="border-t border-white/5 py-10 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-600/80 to-blue-900/80 flex items-center justify-center border border-white/10">
            <span className="text-white text-xs">M</span>
          </div>
          <span className="text-sm text-zinc-500">
            Desenvolvido por{" "}
            <span className="text-zinc-300">
              Mateus Henrique Bueno de Carvalho
            </span>
          </span>
        </div>
        <div className="text-xs text-zinc-600">
          © {new Date().getFullYear()} — Todos os direitos reservados
        </div>
      </div>
    </footer>
  );
}

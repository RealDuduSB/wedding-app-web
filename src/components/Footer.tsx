export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-wedding-primary text-white py-6 sm:py-8 mt-auto" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-base sm:text-lg font-serif mb-2">Andressa & Eduardo</p>
          <p className="text-xs sm:text-sm text-gray-300">
            © {currentYear} Todos os direitos reservados
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Feito com 💙 pelo noivo{' '}
            <a
              href="https://github.com/RealDuduSB"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-wedding-sky transition-colors"
              aria-label="GitHub do Eduardo (abre em nova aba)"
            >
              Eduardo
            </a>
            {' '}— porque além de casar, ele ainda colocou isso no GitHub 🤦
          </p>
        </div>
      </div>
    </footer>
  );
}

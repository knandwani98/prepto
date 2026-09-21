export function SiteFooter() {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-40 bg-background/30 backdrop-blur-2xl">
      <p className="px-4 py-3.5 text-center text-[13px] font-medium tracking-[0.12em] text-disabled uppercase">
        <a
          href="https://kushalnandwani.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5"
        >
          Made with
          <span className="inline-block origin-center text-[14px] leading-none normal-case drop-shadow-[0_0_8px_rgba(116,167,255,0.5)] transition-transform duration-300 ease-out group-hover:scale-125 group-hover:drop-shadow-[0_0_12px_rgba(116,167,255,0.85)]">
            💙
          </span>
          by
          <span className="font-bold text-muted transition-colors duration-300 group-hover:text-foreground-secondary">
            Kushal Nandwani
          </span>
        </a>
      </p>
    </footer>
  );
}

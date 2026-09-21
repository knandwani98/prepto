"use client";

import type { ReactNode } from "react";

export function HashLink({
  href,
  className,
  children,
}: {
  href: `#${string}`;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        const target = document.getElementById(href.slice(1));
        if (!target) return;
        event.preventDefault();
        const scroller = target.closest("main") ?? document.documentElement;
        const headerOffset = 72;
        const top =
          target.getBoundingClientRect().top +
          scroller.scrollTop -
          headerOffset;
        scroller.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
        history.replaceState(null, "", href);
      }}
    >
      {children}
    </a>
  );
}

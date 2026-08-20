import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { SocialLinks } from "./SocialLinks";


const navItems = [
  { to: "/", key: "nav_home", label: "Home" },
  { to: "/scritti", key: "nav_scritti", label: "Blog" },
  { to: "/fotografie", key: "nav_foto", label: "Fotografie" },
  { to: "/fiabe", key: "nav_fiabe", label: "Fiabe sonore" },
  { to: "/chi-sono", key: "nav_chi", label: "Chi Sono" },
  { to: "/contatti", key: "nav_contatti", label: "Contatti" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);


  return (
    <header className="surface-bordeaux sticky top-0 z-40 border-b border-primary-foreground/15 text-primary-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-baseline gap-2" onClick={() => setOpen(false)}>
          <span className="font-serif text-xl font-semibold tracking-tight text-primary-foreground">
            Pierina Gallina
          </span>
          <span className="hidden text-[10px] uppercase tracking-[0.18em] text-primary-foreground/60 sm:inline">
            Codroipo · Friuli
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="rounded-md px-3 py-1.5 text-[15px] font-medium text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
              activeProps={{ className: "text-primary-foreground bg-primary-foreground/15" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1 lg:flex">
          <SocialLinks variant="dark-prominent" size={18} />
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-primary-foreground/25 bg-primary-foreground/10 text-primary-foreground"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

      </div>

      {open && (
        <nav className="surface-bordeaux border-t border-primary-foreground/15 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-2 sm:px-6">
            {navItems.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-[16px] font-medium text-primary-foreground/85 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                activeProps={{ className: "text-primary-foreground bg-primary-foreground/15" }}
              >
                {n.label}
              </Link>
            ))}
            <div className="mt-3 flex items-center gap-2 border-t border-primary-foreground/15 px-2 py-3">
              <SocialLinks variant="dark-prominent" size={20} />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}

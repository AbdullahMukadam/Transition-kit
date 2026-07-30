import { Link } from "@tanstack/react-router";
import { Github, Menu, Moon, Sun, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getCurrentTheme,
  triggerLiveTransition,
  TRANSITION_CSS,
} from "#/registry/animated-theme-toggler";

const THEME_TRANSITIONS = Object.keys(TRANSITION_CSS);

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const transitionIndexRef = useRef(0);

  useEffect(() => {
    setIsDark(getCurrentTheme() === "dark");
    const observer = new MutationObserver(() =>
      setIsDark(getCurrentTheme() === "dark")
    );
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const handleToggleTheme = useCallback(() => {
    const name = THEME_TRANSITIONS[transitionIndexRef.current];
    const css = TRANSITION_CSS[name];
    if (css) {
      triggerLiveTransition(css, 500, "ease-in-out");
    }
    transitionIndexRef.current =
      (transitionIndexRef.current + 1) % THEME_TRANSITIONS.length;
  }, []);

  return (
    <div
      className="sticky top-0 z-50 rise-in"
      style={{ animationDelay: "0ms" }}
    >
      <header className="mx-auto max-w-7xl backdrop-blur-2xl rounded-lg bg-[var(--background)]/70 border border-[var(--border)] relative">
        <div className="flex items-center justify-between px-2 py-3">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)] no-underline"
            >
              <img src="/favicon.ico" className="w-4 h-4" />
              Transition Kit
            </Link>

            <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-[var(--muted-foreground)]">
              <Link
                to="/"
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors no-underline"
                activeOptions={{ exact: true }}
                activeProps={{
                  className: "text-[var(--foreground)] bg-[var(--muted)]",
                }}
              >
                Home
              </Link>
              <Link
                to="/templates"
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors no-underline"
                activeProps={{
                  className: "text-[var(--foreground)] bg-[var(--muted)]",
                }}
              >
                Templates
              </Link>
              <Link
                to="/components/$"
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors no-underline"
                activeProps={{
                  className: "text-[var(--foreground)] bg-[var(--muted)]",
                }}
              >
                Components
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleTheme}
              aria-label="Toggle theme"
              className="flex items-center justify-center size-8 rounded-md border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)] transition-colors text-[var(--foreground)]"
            >
              {isDark ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
            </button>

            <a
              href="https://github.com/nicholasgriffintn/page-transitions"
              className="flex items-center justify-center size-8 rounded-md hover:bg-[var(--muted)] transition-colors text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <Github className="size-4" />
            </a>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="flex md:hidden items-center justify-center size-8 rounded-md hover:bg-[var(--muted)] transition-colors text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              <div className="relative size-4">
                <Menu
                  className={
                    "absolute inset-0 size-4 transition-all duration-300" +
                    (mobileOpen
                      ? " opacity-0 rotate-90 scale-75"
                      : " opacity-100 rotate-0 scale-100")
                  }
                  style={{
                    transitionTimingFunction:
                      "cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                />
                <X
                  className={
                    "absolute inset-0 size-4 transition-all duration-300" +
                    (mobileOpen
                      ? " opacity-100 rotate-0 scale-100"
                      : " opacity-0 -rotate-90 scale-75")
                  }
                  style={{
                    transitionTimingFunction:
                      "cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                />
              </div>
            </button>
          </div>
        </div>

        <nav
          className={
            "absolute left-0 right-0 top-full z-50 border-x border-b border-[var(--border)]/50 rounded-b-lg bg-[var(--background)] overflow-hidden transition-all duration-300" +
            (mobileOpen
              ? " opacity-100 translate-y-0"
              : " opacity-0 -translate-y-2 pointer-events-none")
          }
          style={{
            transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <div className="flex flex-col gap-1 px-2 py-3">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors no-underline"
              activeOptions={{ exact: true }}
              activeProps={{
                className: "text-[var(--foreground)] bg-[var(--muted)]",
              }}
            >
              Home
            </Link>
            <Link
              to="/templates"
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors no-underline"
              activeProps={{
                className: "text-[var(--foreground)] bg-[var(--muted)]",
              }}
            >
              Templates
            </Link>
            <Link
              to="/components/$"
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors no-underline"
              activeProps={{
                className: "text-[var(--foreground)] bg-[var(--muted)]",
              }}
            >
              Components
            </Link>
          </div>
        </nav>
      </header>
    </div>
  );
}

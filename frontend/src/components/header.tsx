
import { Link, useLocation } from "react-router-dom";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden md:flex gap-6">
          {isAuthenticated ? (
            <>
              <Link 
                to="/boards" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname.includes("/boards") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Доски
              </Link>
              <Link 
                to="/account" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === "/account" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Аккаунт
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === "/login" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Войти
              </Link>
              <Link 
                to="/register" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === "/register" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Регистрация
              </Link>
            </>
          )}
        </nav>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Button
              variant="outline"
              onClick={() => {
                logout();
                window.location.href = "/";
              }}
            >
              Выйти
            </Button>
          ) : (
            <Button asChild>
              <Link to="/login">Войти</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

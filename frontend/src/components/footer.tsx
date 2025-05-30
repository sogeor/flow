
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <Logo />
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Sogeor Flow. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}

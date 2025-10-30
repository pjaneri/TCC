import { Recycle } from "lucide-react";
import type { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="flex w-full max-w-sm flex-col items-center">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex items-center justify-center rounded-full bg-primary p-4 text-primary-foreground">
            <Recycle className="h-10 w-10" />
          </div>
          <h1 className="font-headline text-5xl font-bold text-primary">
            Recycle+
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">Sua jornada de reciclagem começa aqui.</p>
        </div>
        {children}
      </div>
    </main>
  );
}

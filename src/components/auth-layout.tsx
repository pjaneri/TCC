import { Recycle } from "lucide-react";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";

type AuthLayoutProps = {
  children: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4">
       <Link href="/" passHref className="absolute top-4 left-4">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Início
          </Button>
        </Link>
      <div className="flex w-full max-w-sm flex-col items-center">
        <Link href="/" className="mb-6 flex flex-col items-center text-center focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md">
            <div className="mb-4 flex items-center justify-center rounded-full bg-primary p-4 text-primary-foreground">
                <Recycle className="h-10 w-10" />
            </div>
            <h1 className="font-headline text-5xl font-bold text-primary">
                Recycle+
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">Sua jornada de reciclagem começa aqui.</p>
        </Link>
        {children}
      </div>
    </main>
  );
}

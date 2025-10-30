import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/auth-layout";

export default function LoginPage() {
  return (
    <AuthLayout>
      <Card>
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="font-headline text-2xl">Acessar Conta</CardTitle>
          <CardDescription>
            Entre com seu nome de usuário e senha
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Nome de usuário</Label>
            <Input id="username" type="text" placeholder="seu.nome" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" placeholder="********" />
          </div>
          <Link href="/dashboard" passHref>
            <Button className="w-full" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>Entrar</Button>
          </Link>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 text-center text-sm">
          <Link href="/reset-password" passHref>
             <span className="cursor-pointer text-muted-foreground underline-offset-4 hover:text-primary hover:underline">
              Esqueceu sua senha?
            </span>
          </Link>
          <div className="text-muted-foreground">
            Não tem uma conta?{" "}
            <Link href="/signup" passHref>
              <span className="cursor-pointer font-semibold text-primary underline-offset-4 hover:underline">
                Crie uma agora
              </span>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}

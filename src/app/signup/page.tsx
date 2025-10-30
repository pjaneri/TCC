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

export default function SignupPage() {
  return (
    <AuthLayout>
      <Card>
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="font-headline text-2xl">Criar Conta</CardTitle>
          <CardDescription>
            Preencha os campos abaixo para criar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="seu@email.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="username">Nome de usuário</Label>
            <Input id="username" type="text" placeholder="seu.nome" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" placeholder="********" />
          </div>
          <Link href="/dashboard" passHref>
            <Button className="w-full" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>Criar Conta</Button>
          </Link>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-center text-sm">
          <div className="text-muted-foreground">
            Já tem uma conta?{" "}
            <Link href="/login" passHref>
              <span className="cursor-pointer font-semibold text-primary underline-offset-4 hover:underline">
                Faça login
              </span>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}

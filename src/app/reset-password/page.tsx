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

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <Card>
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="font-headline text-2xl">Redefinir Senha</CardTitle>
          <CardDescription>
            Digite seu email para receber um link de redefinição
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="seu@email.com" />
          </div>
           <Button className="w-full" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>Enviar Link</Button>
        </CardContent>
        <CardFooter className="flex justify-center text-sm">
          <Link href="/login" passHref>
            <span className="cursor-pointer text-muted-foreground underline-offset-4 hover:text-primary hover:underline">
              Voltar para o login
            </span>
          </Link>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}

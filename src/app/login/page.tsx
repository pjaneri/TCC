"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  signInWithEmailAndPassword,
  getAuth,
  AuthError,
} from "firebase/auth";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input, PasswordInput } from "@/components/ui/input";
import { AuthLayout } from "@/components/auth-layout";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/firebase";
import { useEffect } from "react";

const loginSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  password: z.string().min(1, { message: "A senha é obrigatória." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const auth = getAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (user && !isUserLoading) {
      router.replace("/dashboard");
    }
  }, [user, isUserLoading, router]);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      router.push("/dashboard");
    } catch (error) {
      const authError = error as AuthError;
      let message = "Ocorreu um erro ao fazer login. Tente novamente.";
      if (
        authError.code === "auth/user-not-found" ||
        authError.code === "auth/wrong-password" ||
        authError.code === 'auth/invalid-credential'
      ) {
        message = "Email ou senha inválidos.";
      }
      toast({
        variant: "destructive",
        title: "Erro de autenticação",
        description: message,
      });
    }
  };

  if (isUserLoading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        {/* You can replace this with a proper loader component */}
        <p>Carregando...</p>
      </div>
    );
  }


  return (
    <AuthLayout>
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="font-headline text-3xl">Acessar Conta</CardTitle>
          <CardDescription>
            Entre com seu email e senha para continuar
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <Button type="submit" className="w-full font-bold" disabled={form.formState.isSubmitting} style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                {form.formState.isSubmitting ? "Entrando..." : "Entrar"}
              </Button>
            </CardContent>
          </form>
        </Form>
        <CardFooter className="flex flex-col gap-4 text-center text-sm">
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


"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { sendPasswordResetEmail, AuthError } from "firebase/auth";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AuthLayout } from "@/components/auth-layout";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/firebase";
import { Loader2 } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um email válido." }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    if (!auth) return;
    try {
      await sendPasswordResetEmail(auth, data.email);
      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para as instruções de redefinição de senha.",
      });
      router.push("/login");
    } catch (error) {
      const authError = error as AuthError;
      let message = "Ocorreu um erro. Tente novamente.";
      if (authError.code === "auth/user-not-found") {
        message = "Nenhuma conta encontrada com este email.";
      }
      toast({
        variant: "destructive",
        title: "Erro ao enviar email",
        description: message,
      });
    }
  };

  return (
    <AuthLayout>
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="font-headline text-3xl">Recuperar Senha</CardTitle>
          <CardDescription>
            Insira seu email para receber o link de recuperação
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
               <Button type="submit" className="w-full font-bold" disabled={form.formState.isSubmitting} style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                {form.formState.isSubmitting ? <><Loader2 className="mr-2"/>Enviando...</> : "Enviar Email de Recuperação"}
              </Button>
            </CardContent>
          </form>
        </Form>
        <CardFooter className="flex justify-center text-sm">
             <Link href="/login" passHref>
              <span className="cursor-pointer font-semibold text-primary underline-offset-4 hover:underline">
                Voltar para o Login
              </span>
            </Link>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}

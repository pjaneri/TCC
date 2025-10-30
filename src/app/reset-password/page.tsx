"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { sendPasswordResetEmail, getAuth, AuthError } from "firebase/auth";

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
import { Input } from "@/components/ui/input";
import { AuthLayout } from "@/components/auth-layout";
import { useToast } from "@/hooks/use-toast";

const resetSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um email válido." }),
});

type ResetFormValues = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const { toast } = useToast();
  const auth = getAuth();

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ResetFormValues) => {
    try {
      await sendPasswordResetEmail(auth, data.email);
      toast({
        title: "Link enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
      form.reset();
    } catch (error) {
      const authError = error as AuthError;
      let message = "Ocorreu um erro. Tente novamente.";
      // This error code may not exist on the type, but it is a possible value.
      if (authError.code === "auth/user-not-found" || (authError as any).code === 'auth/invalid-credential') {
        message = "Nenhum usuário encontrado com este email.";
      }
      toast({
        variant: "destructive",
        title: "Erro",
        description: message,
      });
    }
  };

  return (
    <AuthLayout>
      <Card>
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="font-headline text-2xl">Redefinir Senha</CardTitle>
          <CardDescription>
            Digite seu email para receber um link de redefinição
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
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting} style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                {form.formState.isSubmitting ? "Enviando..." : "Enviar Link"}
              </Button>
            </CardContent>
          </form>
        </Form>
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


"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  createUserWithEmailAndPassword,
  AuthError,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

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
import { useFirestore, useAuth } from "@/firebase";

const signupSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  username: z.string().min(3, { message: "O nome de usuário deve ter pelo menos 3 caracteres." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    if (!auth || !firestore) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      // Only update the auth profile display name here
      await updateProfile(user, {
        displayName: data.username,
      });

      // The user profile in Firestore will be created by the dashboard layout
      // This simplifies the signup flow and centralizes profile creation.

      toast({
        title: "Conta criada com sucesso!",
        description: "Você será redirecionado para o seu painel.",
      });

      router.push("/dashboard");
    } catch (error) {
      const authError = error as AuthError;
      let message = "Ocorreu um erro ao criar a conta. Tente novamente.";
      if (authError.code === "auth/email-already-in-use") {
        message = "Este email já está em uso.";
      }
      toast({
        variant: "destructive",
        title: "Erro de cadastro",
        description: message,
      });
    }
  };

  return (
    <AuthLayout>
      <Card>
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="font-headline text-2xl">Criar Conta</CardTitle>
          <CardDescription>
            Preencha os campos abaixo para criar sua conta
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
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome de usuário</FormLabel>
                    <FormControl>
                      <Input placeholder="seu.nome" {...field} />
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
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting} style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                {form.formState.isSubmitting ? "Criando..." : "Criar Conta"}
              </Button>
            </CardContent>
          </form>
        </Form>
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


"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  signInWithEmailAndPassword,
  AuthError,
  signInWithPopup,
  GoogleAuthProvider,
  User,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

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
import { useUser, useFirestore, useAuth } from "@/firebase";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  password: z.string().min(1, { message: "A senha é obrigatória." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.658-3.317-11.28-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.021,35.846,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const [isProcessingGoogle, setIsProcessingGoogle] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    if (auth) {
      setIsAuthReady(true);
    }
  }, [auth]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const checkAndCreateUserProfile = async (user: User) => {
    if (!firestore) return;
    const userDocRef = doc(firestore, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        id: user.uid,
        username: user.displayName || 'Usuário Google',
        email: user.email,
        registrationDate: serverTimestamp(),
        totalPoints: 0,
        lifetimePoints: 0,
      });
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    setIsProcessingGoogle(true);
    try {
      const result = await signInWithPopup(auth, provider);
      await checkAndCreateUserProfile(result.user);
    } catch (error) {
      console.error("Popup Sign-In Error:", error);
      toast({
        variant: "destructive",
        title: "Erro de autenticação",
        description: "Não foi possível completar o login com o Google.",
      });
    } finally {
      setIsProcessingGoogle(false);
    }
  };

  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, isUserLoading, router]);

  const onSubmit = async (data: LoginFormValues) => {
    if (!auth) return;
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
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
        <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p>Carregando...</p>
        </div>
      </div>
    );
  }

  const isLoading = form.formState.isSubmitting || isProcessingGoogle || !isAuthReady;

  return (
    <AuthLayout>
        <div className="absolute top-4 right-4">
            <ThemeToggle />
        </div>
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
                    <div className="flex items-center justify-between">
                        <FormLabel>Senha</FormLabel>
                    </div>
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
               <Button type="submit" className="w-full font-bold" disabled={isLoading} style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                {isLoading && !isProcessingGoogle ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? "Aguarde..." : "Entrar"}
              </Button>
            </CardContent>
          </form>
        </Form>

         <div className="relative my-4 px-6">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                Ou continue com
                </span>
            </div>
        </div>
        
        <CardContent>
             <Button variant="outline" className="w-full font-bold" onClick={handleGoogleSignIn} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-4 w-4" />}
                 {isLoading ? "Aguarde..." : "Google"}
              </Button>
        </CardContent>

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

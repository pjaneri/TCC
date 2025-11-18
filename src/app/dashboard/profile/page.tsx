
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input, PasswordInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser, useFirestore, useDoc, useMemoFirebase, errorEmitter, FirestorePermissionError, useAuth } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, ChangeEvent } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const profileSchema = z.object({
    username: z.string().min(3, { message: "O nome de usuário deve ter pelo menos 3 caracteres." }),
    birthday: z.string().optional(),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(1, { message: "A senha atual é obrigatória." }),
    newPassword: z.string().min(6, { message: "A nova senha deve ter pelo menos 6 caracteres." }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const auth = useAuth();
    const { toast } = useToast();

    const userProfileRef = useMemoFirebase(() => {
        if (!user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);
    const { data: userProfile, isLoading: isProfileLoading } = useDoc(userProfileRef);

    const profileForm = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            username: "",
            birthday: "",
        },
    });
    
    const passwordForm = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
        },
    });

    useEffect(() => {
        if (user) {
            profileForm.reset({
                username: user.displayName || '',
                birthday: userProfile?.birthday || '',
            });
        }
    }, [user, userProfile, profileForm]);

    const onProfileSubmit = async (data: ProfileFormValues) => {
        if (!user || !firestore) return;
    
        const userDocRef = doc(firestore, "users", user.uid);

        const updateData: {
            username: string;
            birthday?: string;
        } = {
            username: data.username,
        };

        if (data.birthday) {
            updateData.birthday = data.birthday;
        }

        try {
            if (user && user.displayName !== data.username) {
                await updateProfile(user, {
                    displayName: data.username,
                });
            }
            updateDoc(userDocRef, updateData).catch(e => {
                const permissionError = new FirestorePermissionError({
                    path: userDocRef.path,
                    operation: 'update',
                    requestResourceData: updateData
                });
                errorEmitter.emit('permission-error', permissionError);
            });

            toast({
                title: "Perfil atualizado!",
                description: "Suas informações foram salvas com sucesso.",
            });
        } catch (error) {
            console.error("Error updating profile: ", error);
            toast({
                variant: "destructive",
                title: "Uh oh! Algo deu errado.",
                description: "Não foi possível atualizar seu perfil.",
            });
        }
    };
    
    const onPasswordSubmit = async (data: PasswordFormValues) => {
        if (!user || !user.email) return;

        const credential = EmailAuthProvider.credential(user.email, data.currentPassword);

        try {
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, data.newPassword);
            toast({
                title: "Senha alterada!",
                description: "Sua senha foi atualizada com sucesso.",
            });
            passwordForm.reset();
        } catch (error: any) {
             let description = "Não foi possível alterar sua senha. Tente novamente.";
             if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                description = "A senha atual está incorreta.";
                passwordForm.setError("currentPassword", {
                    type: "manual",
                    message: "Senha incorreta."
                });
            }
            toast({
                variant: "destructive",
                title: "Erro ao alterar senha",
                description: description,
            });
        }
    };

    const handleResetPoints = async () => {
      if (!user || !firestore) return;

      const userDocRef = doc(firestore, "users", user.uid);
      const resetData = { totalPoints: 0 };
      try {
        await updateDoc(userDocRef, resetData);
        toast({
          title: "Pontos resetados!",
          description: "Sua pontuação foi zerada com sucesso.",
        });
      } catch (error) {
        const permissionError = new FirestorePermissionError({
          path: userDocRef.path,
          operation: 'update',
          requestResourceData: resetData
        });
        errorEmitter.emit('permission-error', permissionError);
      }
    };

    const handleDateMask = (e: ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      value = value.replace(/\D/g, ''); 
      value = value.replace(/(\d{2})(\d)/, '$1/$2');
      value = value.replace(/(\d{2})(\d)/, '$1/$2'); 
      e.target.value = value.slice(0, 10);
      profileForm.setValue('birthday', e.target.value);
    }

    if (isUserLoading || isProfileLoading) {
        return <div className="flex justify-center items-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    const isGoogleProvider = user?.providerData.some(
        (provider) => provider.providerId === "google.com"
    );

  return (
    <div className="flex w-full flex-col gap-8">
        <div className="flex flex-col items-center gap-4 rounded-xl bg-gradient-to-r from-primary to-green-400 p-8 text-primary-foreground text-center md:flex-row md:text-left">
            <Avatar className="h-24 w-24 border-4 border-background/50">
                <AvatarImage src={user?.photoURL || undefined} />
                <AvatarFallback className="text-4xl font-bold text-primary">
                {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
            </Avatar>
            <div>
                <h2 className="text-3xl font-bold">{profileForm.watch('username')}</h2>
                <p className="text-lg opacity-90">{user?.email}</p>
                 <p className="text-xs opacity-70 mt-2 font-mono bg-black/20 rounded px-2 py-1 inline-block">UID: {user?.uid}</p>
            </div>
        </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="danger">Zona de Perigo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
              <CardDescription>Gerencie seus dados pessoais.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <FormField
                    control={profileForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Nome de usuário</Label>
                        <FormControl>
                          <Input placeholder="Seu nome de usuário" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                      control={profileForm.control}
                      name="birthday"
                      render={({ field }) => (
                          <FormItem>
                          <Label>Data de Nascimento</Label>
                            <FormControl>
                                <Input 
                                  placeholder="DD/MM/AAAA" 
                                  {...field}
                                  onChange={(e) => {
                                    handleDateMask(e);
                                    field.onChange(e);
                                  }}
                                  maxLength={10}
                                />
                            </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                  />
                  <Button
                    type="submit"
                    className="font-bold"
                    disabled={profileForm.formState.isSubmitting}
                  >
                    {profileForm.formState.isSubmitting ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
              <CardDescription>
                {isGoogleProvider
                  ? "Você está logado com o Google. Para alterar sua senha, acesse as configurações da sua conta Google."
                  : "Defina uma nova senha para sua conta."}
              </CardDescription>
            </CardHeader>
            {!isGoogleProvider && (
            <CardContent>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Senha Atual</Label>
                        <FormControl>
                            <PasswordInput placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Nova Senha</Label>
                        <FormControl>
                            <PasswordInput placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <Button type="submit" className="font-bold" disabled={passwordForm.formState.isSubmitting}>
                    {passwordForm.formState.isSubmitting ? "Alterando..." : "Alterar Senha"}
                  </Button>
                </form>
              </Form>
            </CardContent>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="danger" className="mt-6">
            <Card className="border-destructive">
            <CardHeader>
                <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
                <CardDescription>
                Ações permanentes que não podem ser desfeitas.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <p className="mb-2 text-sm font-medium">Resetar Pontuação</p>
                    <p className="text-sm text-muted-foreground mb-4">
                    Isso irá zerar todos os seus pontos de reciclagem acumulados. Seus registros de atividades permanecerão.
                    </p>
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">Resetar Meus Pontos</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta ação não pode ser desfeita. Isso irá resetar permanentemente
                                sua pontuação para <strong>0</strong>.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleResetPoints} className={cn(buttonVariants({variant: "destructive"}))}>
                                Sim, resetar meus pontos
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

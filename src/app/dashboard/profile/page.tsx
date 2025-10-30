
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
  CardFooter,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser, useFirestore, useDoc, useMemoFirebase, errorEmitter, FirestorePermissionError } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { updateProfile, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
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


const profileSchema = z.object({
    username: z.string().min(3, { message: "O nome de usuário deve ter pelo menos 3 caracteres." }),
    birthday: z.date().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, { message: "A senha atual é obrigatória." }),
  newPassword: z.string().min(6, { message: "A nova senha deve ter pelo menos 6 caracteres." }),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "As novas senhas não correspondem.",
  path: ["confirmPassword"],
});


type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
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
            birthday: undefined,
        },
    });

    const passwordForm = useForm<PasswordFormValues>({
      resolver: zodResolver(passwordSchema),
      defaultValues: {
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }
    });

    useEffect(() => {
        if (userProfile) {
            profileForm.reset({
                username: userProfile.username || '',
                birthday: userProfile.birthday ? new Date(userProfile.birthday) : undefined,
            });
        }
    }, [userProfile, profileForm]);

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
            updateData.birthday = data.birthday.toISOString().split('T')[0]; // Store as YYYY-MM-DD
        }

        try {
            await updateProfile(user, {
                displayName: data.username,
            });
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

      try {
        const credential = EmailAuthProvider.credential(user.email, data.currentPassword);
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
        }
        
        toast({
          variant: "destructive",
          title: "Erro ao alterar senha",
          description,
        });
        // Only log unexpected errors
        if (error.code !== 'auth/wrong-password' && error.code !== 'auth/invalid-credential') {
             console.error("Password change error:", error);
        }
      }
    };

    const handleResetPoints = async () => {
      if (!user || !firestore) return;

      const userDocRef = doc(firestore, "users", user.uid);
      try {
        await updateDoc(userDocRef, { totalPoints: 0 });
        toast({
          title: "Pontos resetados!",
          description: "Sua pontuação foi zerada com sucesso.",
        });
      } catch (error) {
        const permissionError = new FirestorePermissionError({
          path: userDocRef.path,
          operation: 'update',
          requestResourceData: { totalPoints: 0 }
        });
        errorEmitter.emit('permission-error', permissionError);
      }
    };

    if (isUserLoading || isProfileLoading) {
        return <div className="flex justify-center items-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

  return (
    <div className="grid gap-8 md:grid-cols-1">
      <Card>
        <CardHeader>
          <CardTitle>Informações do Perfil</CardTitle>
          <CardDescription>Gerencie seus dados pessoais.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-8">
              <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.photoURL || undefined} />
                  <AvatarFallback>{user?.displayName?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                  <h2 className="text-2xl font-bold">{profileForm.watch('username')}</h2>
                  <p className="text-muted-foreground">{user?.email}</p>
              </div>
          </div>

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
                      <FormItem className="flex flex-col">
                      <Label>Data de Nascimento</Label>
                      <Popover>
                          <PopoverTrigger asChild>
                          <FormControl>
                              <Button
                              variant={"outline"}
                              className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                              )}
                              >
                              {field.value ? (
                                  format(field.value, "dd/MM/yyyy")
                              ) : (
                                  <span>Escolha uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                          </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                  date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                          />
                          </PopoverContent>
                      </Popover>
                      <FormMessage />
                      </FormItem>
                  )}
              />
              <Button
                type="submit"
                className="font-bold"
                disabled={profileForm.formState.isSubmitting}
                style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}
              >
                {profileForm.formState.isSubmitting ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Segurança da Conta</CardTitle>
          <CardDescription>Altere sua senha de acesso.</CardDescription>
        </CardHeader>
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
                      <Input type="password" {...field} />
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
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <Label>Confirmar Nova Senha</Label>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="font-bold"
                disabled={passwordForm.formState.isSubmitting}
              >
                {passwordForm.formState.isSubmitting ? "Alterando..." : "Alterar Senha"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
          <CardDescription>
            Ações permanentes que não podem ser desfeitas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-2 text-sm font-medium">Resetar Pontuação</p>
          <p className="text-sm text-muted-foreground mb-4">
            Isso irá zerar todos os seus pontos de reciclagem acumulados. Seus registros de atividades permanecerão.
          </p>
        </CardContent>
        <CardFooter className="bg-destructive/10">
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
        </CardFooter>
      </Card>

    </div>
  );
}

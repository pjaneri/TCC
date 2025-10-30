
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser, useFirestore, useDoc, useMemoFirebase, errorEmitter, FirestorePermissionError } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
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


const profileSchema = z.object({
    username: z.string().min(3, { message: "O nome de usuário deve ter pelo menos 3 caracteres." }),
    photoUrl: z.string().url({ message: "Por favor, insira uma URL válida." }).or(z.literal("")),
    birthday: z.date().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const userProfileRef = useMemoFirebase(() => {
        if (!user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);
    const { data: userProfile, isLoading: isProfileLoading } = useDoc(userProfileRef);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            username: "",
            photoUrl: "",
            birthday: undefined,
        },
    });

    useEffect(() => {
        if (userProfile) {
            form.reset({
                username: userProfile.username || '',
                photoUrl: userProfile.photoUrl || '',
                birthday: userProfile.birthday ? new Date(userProfile.birthday) : undefined,
            });
        }
    }, [userProfile, form]);

    const onSubmit = async (data: ProfileFormValues) => {
        if (!user || !firestore) return;
    
        const userDocRef = doc(firestore, "users", user.uid);

        const updateData: {
            username: string;
            photoUrl: string;
            birthday?: string;
        } = {
            username: data.username,
            photoUrl: data.photoUrl,
        };

        if (data.birthday) {
            updateData.birthday = data.birthday.toISOString().split('T')[0]; // Store as YYYY-MM-DD
        }

        try {
            await updateProfile(user, {
                displayName: data.username,
                photoURL: data.photoUrl,
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
    
    if (isUserLoading || isProfileLoading) {
        return <div className="flex justify-center items-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil de Usuário</CardTitle>
        <CardDescription>Gerencie as informações da sua conta.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-8">
            <Avatar className="h-20 w-20">
                <AvatarImage src={form.watch('photoUrl') || user?.photoURL || undefined} />
                <AvatarFallback>{user?.displayName?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            <div>
                <h2 className="text-2xl font-bold">{form.watch('username')}</h2>
                <p className="text-muted-foreground">{user?.email}</p>
            </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
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
              control={form.control}
              name="photoUrl"
              render={({ field }) => (
                <FormItem>
                  <Label>URL da Foto de Perfil</Label>
                  <FormControl>
                    <Input placeholder="https://exemplo.com/sua-foto.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
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
              disabled={form.formState.isSubmitting}
              style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}
            >
              {form.formState.isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

    
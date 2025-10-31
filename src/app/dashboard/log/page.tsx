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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore, errorEmitter, FirestorePermissionError } from "@/firebase";
import { collection, doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { Loader2 } from "lucide-react";

const materialPoints: Record<string, number> = {
  Plástico: 20,
  Papel: 15,
  Vidro: 10,
  Metal: 75,
  Outros: 5,
};

const materials = Object.keys(materialPoints);

const logSchema = z.object({
  materialType: z.string().min(1, { message: "Selecione o tipo de material." }),
  quantity: z.coerce.number().min(0.1, { message: "A quantidade deve ser maior que zero." }),
  unit: z.string().optional().default("un"),
});

type LogFormValues = z.infer<typeof logSchema>;

export default function LogRecyclingPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const form = useForm<LogFormValues>({
    resolver: zodResolver(logSchema),
    defaultValues: {
      materialType: "",
      quantity: 1,
      unit: "un",
    },
  });

  const onSubmit = async (data: LogFormValues) => {
    if (!user || !firestore) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Você precisa estar logado para registrar.",
      });
      return;
    }
    
    const pointsEarned = (materialPoints[data.materialType] || 0);

    const userDocRef = doc(firestore, "users", user.uid);
    const recyclingLogColRef = collection(userDocRef, "recycling_records");
    const newRecordRef = doc(recyclingLogColRef);
    
    const newRecordData = {
        id: newRecordRef.id,
        userId: user.uid,
        materialType: data.materialType,
        quantity: data.quantity,
        unit: data.unit,
        recyclingDate: serverTimestamp(),
        pointsEarned: pointsEarned,
    };

    try {
        await runTransaction(firestore, async (transaction) => {
            const userDoc = await transaction.get(userDocRef);
            if (!userDoc.exists()) {
                throw "Usuário não encontrado.";
            }

            const currentPoints = userDoc.data().totalPoints || 0;
            const newTotalPoints = currentPoints + pointsEarned;
            
            transaction.update(userDocRef, { totalPoints: newTotalPoints });
            transaction.set(newRecordRef, newRecordData);
        });

        toast({
            title: "Reciclagem registrada!",
            description: `Você ganhou ${pointsEarned} pontos.`,
        });
        form.reset();

    } catch (e) {
         const permissionError = new FirestorePermissionError({
            path: newRecordRef.path,
            operation: 'create',
            requestResourceData: newRecordData
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
            variant: "destructive",
            title: "Erro ao registrar",
            description: "Não foi possível salvar seu registro. Verifique suas permissões."
        })
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Registrar Reciclagem</CardTitle>
        <CardDescription>
          Selecione o material, a quantidade e salve para ganhar pontos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="materialType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Material</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um material" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {materials.map((material) => (
                        <SelectItem key={material} value={material}>
                          {material}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Quantidade</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem className="w-24">
                    <FormLabel>Unidade</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="un">un</SelectItem>
                            <SelectItem value="kg">kg</SelectItem>
                            <SelectItem value="g">g</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              className="w-full font-bold"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Registro"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

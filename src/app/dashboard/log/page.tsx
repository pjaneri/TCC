'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter, FirestorePermissionError, useFirestore, useUser } from '@/firebase';
import { collection, doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

const materialPoints: Record<string, number> = {
  'Plástico': 20,
  'Papel': 15,
  'Vidro': 10,
  'Metal': 75,
  'Outros': 5,
};

const logRecyclingSchema = z.object({
  materialType: z.enum(['Plástico', 'Papel', 'Vidro', 'Metal', 'Outros'], {
    required_error: "Você precisa selecionar um tipo de material.",
  }),
  quantity: z.coerce.number().min(1, { message: 'A quantidade deve ser pelo menos 1.' }),
  description: z.string().optional(),
});

type LogRecyclingFormValues = z.infer<typeof logRecyclingSchema>;

export default function LogRecyclingPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LogRecyclingFormValues>({
    resolver: zodResolver(logRecyclingSchema),
    defaultValues: {
      quantity: 1,
    }
  });

  const onSubmit = async (data: LogRecyclingFormValues) => {
    if (!user || !firestore) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Você precisa estar logado para registrar.",
      });
      return;
    }

    setIsSubmitting(true);

    const points = materialPoints[data.materialType] * data.quantity;
    const userDocRef = doc(firestore, "users", user.uid);
    const recyclingLogColRef = collection(userDocRef, "recycling_records");
    const newRecordRef = doc(recyclingLogColRef);
    
    const newRecordData = {
      id: newRecordRef.id,
      userId: user.uid,
      materialType: data.materialType,
      quantity: data.quantity,
      recyclingDate: serverTimestamp(),
      pointsEarned: points,
      description: data.description || "",
    };

    try {
      await runTransaction(firestore, async (transaction) => {
        const userDoc = await transaction.get(userDocRef);
        if (!userDoc.exists()) {
          throw "Usuário não encontrado.";
        }

        const currentPoints = userDoc.data().totalPoints || 0;
        const newTotalPoints = currentPoints + points;
        
        transaction.update(userDocRef, { totalPoints: newTotalPoints });
        transaction.set(newRecordRef, newRecordData);
      });

      toast({
        title: "Reciclagem registrada!",
        description: `Você ganhou ${points} pontos.`,
      });
      form.reset();

    } catch (e) {
      const permissionError = new FirestorePermissionError({
        path: newRecordRef.path,
        operation: 'create',
        requestResourceData: newRecordData
      });
      errorEmitter.emit('permission-error', permissionError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Registrar Reciclagem</CardTitle>
        <CardDescription>
          Adicione manualmente seus itens reciclados para ganhar pontos.
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um material" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(materialPoints).map((material) => (
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

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: 5 garrafas PET, 3 caixas de papelão..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Registrando..." : "Registrar e Ganhar Pontos"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

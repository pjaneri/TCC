'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { Loader2, Package, FileText, GlassWater, Wrench } from 'lucide-react';

const materialData = [
  {
    name: 'Plástico',
    description: 'Garrafas PET, embalagens, etc.',
    icon: Package,
    unit: 'un',
    points: 20,
  },
  {
    name: 'Papel',
    description: 'Jornais, revistas, caixas de papelão.',
    icon: FileText,
    unit: 'kg',
    points: 15,
  },
  {
    name: 'Vidro',
    description: 'Garrafas, potes, frascos.',
    icon: GlassWater,
    unit: 'un',
    points: 10,
  },
  {
    name: 'Metal',
    description: 'Latinhas de alumínio, aço.',
    icon: Wrench,
    unit: 'un',
    points: 75,
  },
];

const logSchema = z.object({
  quantity: z.coerce.number().min(1, { message: 'A quantidade deve ser pelo menos 1.' }),
});

type LogFormValues = z.infer<typeof logSchema>;

interface MaterialLogCardProps {
  material: typeof materialData[0];
}

function MaterialLogCard({ material }: MaterialLogCardProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LogFormValues>({
    resolver: zodResolver(logSchema),
    defaultValues: {
      quantity: 0,
    },
  });

  const onSubmit: SubmitHandler<LogFormValues> = async (data) => {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Você precisa estar logado para registrar.',
      });
      return;
    }
     if (data.quantity <= 0) {
      form.setError("quantity", { type: "manual", message: "A quantidade deve ser maior que zero." });
      return;
    }

    setIsSubmitting(true);

    const points = material.points * data.quantity;
    const userDocRef = doc(firestore, 'users', user.uid);
    const recyclingLogColRef = collection(userDocRef, 'recycling_records');
    const newRecordRef = doc(recyclingLogColRef);

    const newRecordData = {
      id: newRecordRef.id,
      userId: user.uid,
      materialType: material.name,
      quantity: data.quantity,
      recyclingDate: serverTimestamp(),
      pointsEarned: points,
    };

    try {
      await runTransaction(firestore, async (transaction) => {
        const userDoc = await transaction.get(userDocRef);
        if (!userDoc.exists()) {
          throw 'Usuário não encontrado.';
        }
        const newTotalPoints = (userDoc.data().totalPoints || 0) + points;
        transaction.update(userDocRef, { totalPoints: newTotalPoints });
        transaction.set(newRecordRef, newRecordData);
      });

      toast({
        title: 'Reciclagem registrada!',
        description: `Você ganhou ${points} pontos reciclando ${material.name}.`,
      });
      form.reset({ quantity: 0 });
    } catch (e) {
      console.error('Transaction failed: ', e);
      const permissionError = new FirestorePermissionError({
        path: newRecordRef.path,
        operation: 'create',
        requestResourceData: newRecordData,
      });
      errorEmitter.emit('permission-error', permissionError);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Algo deu errado.',
        description:
          'Não foi possível registrar a reciclagem. Verifique suas permissões ou tente novamente.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const Icon = material.icon;

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Icon className="h-8 w-8 text-primary" />
          <div>
            <CardTitle>{material.name}</CardTitle>
            <CardDescription>{material.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade</FormLabel>
                    <div className="flex items-center gap-2">
                        <FormControl>
                            <Input type="number" min="0" {...field} />
                        </FormControl>
                        <span className="text-sm text-muted-foreground">{material.unit}</span>
                    </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full font-bold" style={{ backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isSubmitting ? 'Salvando...' : 'Salvar Registro'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function LogRecyclingPage() {
    return (
        <div className="w-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Registrar Reciclagem</h1>
                <p className="text-muted-foreground">
                    Adicione os itens que você reciclou para ganhar pontos.
                </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {materialData.map((material) => (
                    <MaterialLogCard key={material.name} material={material} />
                ))}
            </div>
        </div>
    );
}

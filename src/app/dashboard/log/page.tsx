
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
import { Package, FileText, GlassWater, Wrench } from "lucide-react";
import { useUser, useFirestore, errorEmitter, FirestorePermissionError } from "@/firebase";
import { collection, doc, runTransaction } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const recyclableCategories = [
  {
    name: "Plástico",
    description: "Garrafas PET, embalagens, etc.",
    icon: <Package className="h-8 w-8 text-primary" />,
    unit: "gm",
    pointsPerUnit: 0.02,
  },
  {
    name: "Papel",
    description: "Jornais, revistas, caixas de papelão.",
    icon: <FileText className="h-8 w-8 text-primary" />,
    unit: "gm",
    pointsPerUnit: 0.015,
  },
  {
    name: "Vidro",
    description: "Garrafas, potes, frascos.",
    icon: <GlassWater className="h-8 w-8 text-primary" />,
    unit: "unidades",
    pointsPerUnit: 10,
  },
  {
    name: "Metal",
    description: "Latinhas de alumínio, aço.",
    icon: <Wrench className="h-8 w-8 text-primary" />,
    unit: "gm",
    pointsPerUnit: 0.075,
  },
];

const logSchema = z.object({
  quantity: z.coerce.number().positive({ message: "A quantidade deve ser positiva." }),
});

type LogFormValues = z.infer<typeof logSchema>;

export default function LogRecyclingPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-muted-foreground">
          Adicione os itens que você reciclou para ganhar pontos.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {recyclableCategories.map((category) => (
          <RecyclingCard key={category.name} category={category} />
        ))}
      </div>
    </div>
  );
}

function RecyclingCard({ category }: { category: typeof recyclableCategories[0] }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<LogFormValues>({
    resolver: zodResolver(logSchema),
    defaultValues: {
      quantity: 0,
    },
  });

  const onSubmit = (data: LogFormValues) => {
    if (!user || !firestore) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Você precisa estar logado para registrar.",
      });
      return;
    }

    const pointsEarned = Math.round(data.quantity * category.pointsPerUnit);
    const userDocRef = doc(firestore, "users", user.uid);
    const recyclingLogColRef = collection(userDocRef, "recycling_records");
    const newRecordRef = doc(recyclingLogColRef);
    const newRecordData = {
        id: newRecordRef.id,
        userId: user.uid,
        materialType: category.name,
        quantity: data.quantity,
        unit: category.unit,
        recyclingDate: new Date().toISOString(),
        pointsEarned: pointsEarned,
        type: 'log'
    };

    runTransaction(firestore, async (transaction) => {
        const userDoc = await transaction.get(userDocRef);
        if (!userDoc.exists()) {
          throw "Documento do usuário não existe!";
        }

        const newTotalPoints = (userDoc.data().totalPoints || 0) + pointsEarned;
        transaction.update(userDocRef, { totalPoints: newTotalPoints });
        transaction.set(newRecordRef, newRecordData);
    }).then(() => {
      toast({
          title: "Sucesso!",
          description: `${data.quantity} ${category.unit} de ${category.name} registrados. Você ganhou ${pointsEarned} pontos!`,
      });
      form.reset();
    }).catch((e) => {
        if (e instanceof Error && e.name === 'FirebaseError') {
          // This is likely a permission error, let the global handler manage it.
          const permissionError = new FirestorePermissionError({
            path: newRecordRef.path,
            operation: 'create',
            requestResourceData: newRecordData,
          });
          errorEmitter.emit('permission-error', permissionError);
        } else {
            console.error("Transaction failed: ", e);
            toast({
                variant: "destructive",
                title: "Uh oh! Algo deu errado.",
                description: "Não foi possível registrar a reciclagem.",
            });
        }
    });
  };

  return (
    <Card className="transform-gpu transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
        <div className="mt-1">{category.icon}</div>
        <div>
          <CardTitle className="font-headline text-xl">
            {category.name}
          </CardTitle>
          <CardDescription>{category.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor={`quantity-${category.name.toLowerCase()}`}>
                    Quantidade ({category.unit})
                  </Label>
                  <FormControl>
                    <Input
                      id={`quantity-${category.name.toLowerCase()}`}
                      type="number"
                      min="0"
                      step={category.unit === 'gm' ? '10' : '1'}
                      placeholder={category.unit === 'gm' ? "Ex: 500" : "Ex: 5"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full font-bold"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Registrando..." : "Registrar"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

    
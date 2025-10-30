"use client";

import { useForm, Controller } from "react-hook-form";
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
import { useUser, useFirestore } from "@/firebase";
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
    unit: "kg",
    pointsPerUnit: 20,
  },
  {
    name: "Papel",
    description: "Jornais, revistas, caixas de papelão.",
    icon: <FileText className="h-8 w-8 text-primary" />,
    unit: "kg",
    pointsPerUnit: 15,
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
    unit: "kg",
    pointsPerUnit: 75,
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
        <h1 className="font-headline text-3xl font-bold">
          Registrar Reciclagem
        </h1>
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

  const onSubmit = async (data: LogFormValues) => {
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

    try {
        await runTransaction(firestore, async (transaction) => {
            const userDoc = await transaction.get(userDocRef);
            if (!userDoc.exists()) {
              throw "Documento do usuário não existe!";
            }
    
            const newTotalPoints = (userDoc.data().totalPoints || 0) + pointsEarned;
            transaction.update(userDocRef, { totalPoints: newTotalPoints });

            const newRecordRef = doc(recyclingLogColRef);
            transaction.set(newRecordRef, {
                id: newRecordRef.id,
                userId: user.uid,
                materialType: category.name,
                quantity: data.quantity,
                unit: category.unit,
                recyclingDate: new Date().toISOString(),
                pointsEarned: pointsEarned,
            });
        });

        toast({
            title: "Sucesso!",
            description: `${data.quantity} ${category.unit} de ${category.name} registrados. Você ganhou ${pointsEarned} pontos!`,
        });
        form.reset();
    } catch (e) {
        console.error("Transaction failed: ", e);
        toast({
            variant: "destructive",
            title: "Uh oh! Algo deu errado.",
            description: "Não foi possível registrar a reciclagem.",
        });
    }
  };

  return (
    <Card className="transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
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
                      step="0.1"
                      placeholder="Ex: 2.5"
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
              style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}
            >
              {form.formState.isSubmitting ? "Registrando..." : "Registrar"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

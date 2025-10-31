
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
import { collection, doc, serverTimestamp, runTransaction } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const recyclableCategories = [
  {
    name: "Plástico",
    description: "Garrafas PET, embalagens, etc.",
    icon: <Package className="h-8 w-8 text-primary" />,
    units: { gm: 0.02, kg: 20 },
    defaultUnit: "gm",
  },
  {
    name: "Papel",
    description: "Jornais, revistas, caixas de papelão.",
    icon: <FileText className="h-8 w-8 text-primary" />,
    units: { gm: 0.015, kg: 15 },
    defaultUnit: "gm",
  },
  {
    name: "Vidro",
    description: "Garrafas, potes, frascos.",
    icon: <GlassWater className="h-8 w-8 text-primary" />,
    units: { unidades: 10 },
    defaultUnit: "unidades",
  },
  {
    name: "Metal",
    description: "Latinhas de alumínio, aço.",
    icon: <Wrench className="h-8 w-8 text-primary" />,
    units: { gm: 0.075, kg: 75 },
    defaultUnit: "gm",
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
         <h2 className="text-2xl font-bold tracking-tight">Registrar Reciclagem</h2>
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
  const [selectedUnit, setSelectedUnit] = useState(category.defaultUnit);

  const form = useForm<LogFormValues>({
    resolver: zodResolver(logSchema),
    defaultValues: {
      quantity: 0,
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: LogFormValues) => {
    if (!user || !firestore) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Você precisa estar logado para registrar.",
      });
      return;
    }

    const pointsCalculated = Math.round(data.quantity * (category.units as any)[selectedUnit]);
    
    const userDocRef = doc(firestore, "users", user.uid);
    const recyclingLogColRef = collection(userDocRef, "recycling_records");
    const newRecordRef = doc(recyclingLogColRef);

    try {
        const newRecordData = {
            id: newRecordRef.id,
            userId: user.uid,
            materialType: category.name,
            quantity: data.quantity,
            unit: selectedUnit,
            recyclingDate: serverTimestamp(),
            pointsEarned: pointsCalculated,
        };

        await runTransaction(firestore, async (transaction) => {
            const userDoc = await transaction.get(userDocRef);
            if (!userDoc.exists()) {
                throw "Usuário não encontrado.";
            }

            const currentPoints = userDoc.data().totalPoints || 0;
            const newTotalPoints = currentPoints + pointsCalculated;
            
            transaction.update(userDocRef, { totalPoints: newTotalPoints });
            transaction.set(newRecordRef, newRecordData);
        });

        toast({
            title: "Registro Salvo!",
            description: `Você ganhou ${pointsCalculated} pontos por reciclar ${category.name}.`,
        });
        form.reset();

    } catch(e) {
        console.error("Error creating record: ", e);
        const permissionError = new FirestorePermissionError({
          path: newRecordRef.path,
          operation: 'create',
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
            variant: "destructive",
            title: "Uh oh! Algo deu errado.",
            description: "Não foi possível salvar seu registro de reciclagem.",
        });
    }
  };

  const unitOptions = Object.keys(category.units);
  const showUnitSelector = unitOptions.length > 1;

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
                  <Label>Quantidade</Label>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step={selectedUnit === 'gm' ? '10' : '0.1'}
                        placeholder={selectedUnit === 'gm' ? "Ex: 500" : "Ex: 1.5"}
                        {...field}
                      />
                    </FormControl>
                    {showUnitSelector && (
                      <Select value={selectedUnit} onValueChange={setSelectedUnit} disabled={isSubmitting}>
                          <SelectTrigger className="w-[100px]">
                              <SelectValue placeholder="Unidade" />
                          </SelectTrigger>
                          <SelectContent>
                              {unitOptions.map(unit => (
                                  <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                              ))}
                          </SelectContent>
                      </Select>
                    )}
                    {!showUnitSelector && <span className="text-sm text-muted-foreground">{selectedUnit}</span>}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full font-bold"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Salvar Registro"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

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

const recyclableCategories = [
  {
    name: "Plástico",
    description: "Garrafas PET, embalagens, etc.",
    icon: <Package className="h-8 w-8 text-primary" />,
    unit: "kg",
  },
  {
    name: "Papel",
    description: "Jornais, revistas, caixas de papelão.",
    icon: <FileText className="h-8 w-8 text-primary" />,
    unit: "kg",
  },
  {
    name: "Vidro",
    description: "Garrafas, potes, frascos.",
    icon: <GlassWater className="h-8 w-8 text-primary" />,
    unit: "unidades",
  },
  {
    name: "Metal",
    description: "Latinhas de alumínio, aço.",
    icon: <Wrench className="h-8 w-8 text-primary" />,
    unit: "kg",
  },
];

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
          <Card key={category.name}>
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
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`quantity-${category.name.toLowerCase()}`}>
                    Quantidade ({category.unit})
                  </Label>
                  <Input
                    id={`quantity-${category.name.toLowerCase()}`}
                    type="number"
                    min="0"
                    placeholder="Ex: 2.5"
                  />
                </div>
                <Button className="w-full" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                  Registrar
                </Button>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

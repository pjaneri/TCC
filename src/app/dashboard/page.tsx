import { Coins, Package, FileText, GlassWater, Wrench } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const userPoints = 4280;

const recentActivities = [
  { id: 1, type: "Plástico", quantity: "2.5 kg", points: 50, date: "2 dias atrás" },
  { id: 2, type: "Papel", quantity: "5 kg", points: 75, date: "4 dias atrás" },
  { id: 3, type: "Vidro", quantity: "10 garrafas", points: 100, date: "1 semana atrás" },
  { id: 4, type: "Metal", quantity: "1.2 kg", points: 90, date: "1 semana atrás" },
  { id: 5, type: "Plástico", quantity: "3 kg", points: 60, date: "2 semanas atrás" },
];

const materialIcons: { [key: string]: React.ElementType } = {
  "Plástico": Package,
  "Papel": FileText,
  "Vidro": GlassWater,
  "Metal": Wrench,
};

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <h1 className="font-headline text-3xl font-bold">Visão Geral</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Pontos
            </CardTitle>
            <Coins className="h-5 w-5 text-primary-foreground/80" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {userPoints.toLocaleString("pt-BR")}
            </div>
            <p className="text-xs text-primary-foreground/80">
              Continue reciclando para ganhar mais!
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Atividade Recente</CardTitle>
          <CardDescription>
            Seus registros de reciclagem mais recentes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead className="hidden sm:table-cell">Quantidade</TableHead>
                <TableHead className="hidden md:table-cell">Data</TableHead>
                <TableHead className="text-right">Pontos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivities.map((activity) => {
                 const Icon = materialIcons[activity.type] || Package;
                 return (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{activity.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{activity.quantity}</TableCell>
                    <TableCell className="hidden md:table-cell">{activity.date}</TableCell>
                    <TableCell className="text-right">
                       <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        +{activity.points}
                      </Badge>
                    </TableCell>
                  </TableRow>
                 )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

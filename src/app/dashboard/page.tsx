"use client";

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
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit, doc } from "firebase/firestore";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const materialIcons: { [key: string]: React.ElementType } = {
  "Plástico": Package,
  "Papel": FileText,
  "Vidro": GlassWater,
  "Metal": Wrench,
};

export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);
  const { data: userProfile } = useDoc(userProfileRef);

  const recyclingRecordsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(firestore, 'users', user.uid, 'recycling_records'),
      orderBy('recyclingDate', 'desc'),
      limit(5)
    );
  }, [firestore, user]);

  const { data: recentActivities, isLoading } = useCollection(recyclingRecordsQuery);

  const userPoints = userProfile?.totalPoints || 0;

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
          {isLoading ? <p>Carregando atividades...</p> : (
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
              {recentActivities && recentActivities.map((activity) => {
                 const Icon = materialIcons[activity.materialType] || Package;
                 return (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{activity.materialType}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{activity.quantity} {activity.unit || 'kg'}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDistanceToNow(new Date(activity.recyclingDate), { addSuffix: true, locale: ptBR })}
                    </TableCell>
                    <TableCell className="text-right">
                       <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        +{activity.pointsEarned}
                      </Badge>
                    </TableCell>
                  </TableRow>
                 )
              })}
              {(!recentActivities || recentActivities.length === 0) && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">Nenhuma atividade recente.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useMemo } from "react";
import { Coins, Package, FileText, GlassWater, Wrench, Gift } from "lucide-react";
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
import { collection, query, orderBy, limit, doc, Timestamp, where } from "firebase/firestore";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const materialIcons: { [key: string]: React.ElementType } = {
  "Plástico": Package,
  "Papel": FileText,
  "Vidro": GlassWater,
  "Metal": Wrench,
};

// Helper function to convert Firestore Timestamp or ISO String to Date
const toDate = (date: Timestamp | string | Date): Date => {
  if (date instanceof Timestamp) {
    return date.toDate();
  }
  return new Date(date);
};

export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);
  const { data: userProfile } = useDoc(userProfileRef);

  const recentActivitiesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'recycling_records_all'),
      where('userId', '==', user.uid),
      orderBy('recyclingDate', 'desc'),
      limit(5)
    );
  }, [firestore, user]);
  
  const { data: recentRecords, isLoading: recordsLoading } = useCollection(recentActivitiesQuery);

  const redemptionsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
        collection(firestore, 'users', user.uid, 'redemptions'),
        orderBy('redemptionDate', 'desc'),
        limit(5)
    );
}, [firestore, user]);

  const { data: recentRedemptions, isLoading: redemptionsLoading } = useCollection(redemptionsQuery);

  const combinedActivities = useMemo(() => {
    const records = recentRecords?.map(r => ({ ...r, date: toDate(r.recyclingDate), type: 'log' })) || [];
    const redemptions = recentRedemptions?.map(r => ({ ...r, date: toDate(r.redemptionDate), type: 'redemption' })) || [];
    
    return [...records, ...redemptions]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);
  }, [recentRecords, recentRedemptions]);


  const userPoints = userProfile?.totalPoints || 0;
  const isLoading = recordsLoading || redemptionsLoading;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Aprovado</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pendente</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejeitado</Badge>;
      default:
        return <Badge variant="outline">N/A</Badge>;
    }
  };


  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-primary text-primary-foreground transform-gpu transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg">
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

      <Card className="transform-gpu transition-all duration-300 ease-out hover:shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline">Atividade Recente</CardTitle>
          <CardDescription>
            Seus registros de reciclagem e resgates mais recentes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? <p>Carregando atividades...</p> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="hidden sm:table-cell">Detalhes</TableHead>
                <TableHead className="hidden md:table-cell">Data</TableHead>
                <TableHead>Status / Pontos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {combinedActivities && combinedActivities.map((activity) => {
                 if (activity.type === 'log') {
                    const Icon = materialIcons[activity.materialType] || Package;
                    return (
                      <TableRow key={`log-${activity.id}`} className="transition-colors hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{activity.materialType}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">{activity.quantity} {activity.unit || 'kg'}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {formatDistanceToNow(activity.date, { addSuffix: true, locale: ptBR })}
                        </TableCell>
                        <TableCell className="text-right">
                           {getStatusBadge(activity.status)}
                        </TableCell>
                      </TableRow>
                    )
                 }
                 if (activity.type === 'redemption') {
                  return (
                    <TableRow key={`redemption-${activity.id}`} className="transition-colors hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Gift className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{activity.rewardName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">Prêmio Resgatado</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDistanceToNow(activity.date, { addSuffix: true, locale: ptBR })}
                      </TableCell>
                      <TableCell className="text-right">
                         <Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          -{activity.pointsDeducted}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                }
                return null;
              })}
              {(!combinedActivities || combinedActivities.length === 0) && (
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

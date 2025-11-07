'use client';

import { useMemo, useState } from 'react';
import {
  Coins,
  Package,
  FileText,
  GlassWater,
  Wrench,
  Gift,
  Trash2,
  Loader2
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  useUser,
  useFirestore,
  useCollection,
  useDoc,
  useMemoFirebase,
  FirestorePermissionError,
  errorEmitter
} from '@/firebase';
import {
  collection,
  query,
  orderBy,
  limit,
  doc,
  Timestamp,
  runTransaction,
} from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button, buttonVariants } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const materialIcons: { [key: string]: React.ElementType } = {
  Plástico: Package,
  Papel: FileText,
  Vidro: GlassWater,
  Metal: Wrench,
  Outros: Package,
};

// Helper function to convert Firestore Timestamp or ISO String to Date
const toDate = (date: any): Date | null => {
  if (!date) return null;
  if (date instanceof Timestamp) {
    return date.toDate();
  }
  if (typeof date === 'string') {
    return new Date(date);
  }
  if (typeof date === 'object' && date.seconds) {
    return new Timestamp(date.seconds, date.nanoseconds).toDate();
  }
  return null;
};

// Stable options object for useCollection to prevent re-renders
const snapshotOptions = { includeMetadataChanges: true };

export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);


  const userProfileRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);
  const { data: userProfile, isLoading: profileLoading } =
    useDoc(userProfileRef);

  const recentActivitiesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'users', user.uid, 'recycling_records'),
      orderBy('recyclingDate', 'desc'),
      limit(5)
    );
  }, [firestore, user]);

  const { data: recentRecords, isLoading: recordsLoading } = useCollection(
    recentActivitiesQuery,
    snapshotOptions
  );

  const redemptionsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'users', user.uid, 'redemptions'),
      orderBy('redemptionDate', 'desc'),
      limit(5)
    );
  }, [firestore, user]);

  const { data: recentRedemptions, isLoading: redemptionsLoading } =
    useCollection(redemptionsQuery, snapshotOptions);

  const combinedActivities = useMemo(() => {
    const records = (recentRecords || []).map((r: any) => ({
      ...r,
      date: toDate(r.recyclingDate),
      type: 'log' as const,
    }));
    const redemptions = (recentRedemptions || []).map((r: any) => ({
      ...r,
      date: toDate(r.redemptionDate),
      type: 'redemption' as const,
    }));

    return [...records, ...redemptions]
       .filter(activity => activity.date !== null || activity.metadata?.hasPendingWrites)
      .sort((a, b) => {
        const aIsPending = a.metadata?.hasPendingWrites;
        const bIsPending = b.metadata?.hasPendingWrites;

        if (aIsPending && !bIsPending) return -1;
        if (!aIsPending && bIsPending) return 1;

        const dateA = a.date ? a.date.getTime() : Date.now();
        const dateB = b.date ? b.date.getTime() : Date.now();
        
        return dateB - dateA;
      })
      .slice(0, 5);
  }, [recentRecords, recentRedemptions]);
  
  const handleDeleteActivity = async (activity: any) => {
    if (!user || !firestore) return;

    setIsDeleting(activity.id);

    const userDocRef = doc(firestore, 'users', user.uid);
    let activityDocRef;
    let pointsToAdjust = 0;

    if (activity.type === 'log') {
      activityDocRef = doc(firestore, 'users', user.uid, 'recycling_records', activity.id);
      pointsToAdjust = -activity.pointsEarned; // Subtract points earned
    } else { // redemption
      activityDocRef = doc(firestore, 'users', user.uid, 'redemptions', activity.id);
      pointsToAdjust = activity.pointsDeducted; // Add back points deducted
    }

    try {
      await runTransaction(firestore, async (transaction) => {
        const userDoc = await transaction.get(userDocRef);
        if (!userDoc.exists()) {
          throw 'Usuário não encontrado.';
        }
        const currentPoints = userDoc.data().totalPoints || 0;
        const newTotalPoints = currentPoints + pointsToAdjust;

        transaction.update(userDocRef, { totalPoints: newTotalPoints });
        transaction.delete(activityDocRef);
      });

      toast({
        title: "Atividade excluída!",
        description: "A atividade foi removida e sua pontuação foi ajustada.",
      });

    } catch (error) {
        const permissionError = new FirestorePermissionError({
            path: activityDocRef.path,
            operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
          variant: "destructive",
          title: "Erro ao excluir",
          description: "Não foi possível excluir a atividade.",
        });
    } finally {
        setIsDeleting(null);
    }
  };


  const userPoints = userProfile?.totalPoints || 0;
  const isLoading = profileLoading || recordsLoading || redemptionsLoading;

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="transform-gpu bg-primary text-primary-foreground transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Pontos
            </CardTitle>
            <Coins className="h-5 w-5 text-primary-foreground/80" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {userPoints.toLocaleString('pt-BR')}
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
          {isLoading && (!combinedActivities || combinedActivities.length === 0) ? (
            <p>Carregando atividades...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Detalhes
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Data</TableHead>
                  <TableHead className="text-right">Pontos</TableHead>
                  <TableHead className="w-[50px] text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {combinedActivities &&
                  combinedActivities.map((activity) => {
                    const activityDate = activity.date;
                    const isPending = activity.metadata?.hasPendingWrites;

                    if (activity.type === 'log') {
                      const Icon =
                        materialIcons[activity.materialType] || Package;
                      return (
                        <TableRow
                          key={`log-${activity.id}`}
                          className="transition-colors hover:bg-muted/50"
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">
                                {activity.materialType}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {activity.quantity} {activity.unit || 'un'}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {isPending
                              ? 'Agora mesmo'
                              : activityDate
                              ? formatDistanceToNow(activityDate, {
                                  addSuffix: true,
                                  locale: ptBR,
                                })
                              : 'Registrando...'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            >
                              +{activity.pointsEarned}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                           <AlertDialog>
                             <AlertDialogTrigger asChild>
                               <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isDeleting === activity.id}>
                                 {isDeleting === activity.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />}
                               </Button>
                             </AlertDialogTrigger>
                             <AlertDialogContent>
                               <AlertDialogHeader>
                                 <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                                 <AlertDialogDescription>
                                   Esta ação não pode ser desfeita. A atividade será excluída e os pontos serão ajustados.
                                 </AlertDialogDescription>
                               </AlertDialogHeader>
                               <AlertDialogFooter>
                                 <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                 <AlertDialogAction onClick={() => handleDeleteActivity(activity)} className={cn(buttonVariants({variant: "destructive"}))}>Excluir</AlertDialogAction>
                               </AlertDialogFooter>
                             </AlertDialogContent>
                           </AlertDialog>
                          </TableCell>
                        </TableRow>
                      );
                    }
                    if (activity.type === 'redemption') {
                      return (
                        <TableRow
                          key={`redemption-${activity.id}`}
                          className="transition-colors hover:bg-muted/50"
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Gift className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">
                                {activity.rewardName || 'Prêmio Resgatado'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            Prêmio Resgatado
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                             {isPending
                              ? 'Agora mesmo'
                              : activityDate
                              ? formatDistanceToNow(activityDate, {
                                  addSuffix: true,
                                  locale: ptBR,
                                })
                              : 'Resgatando...'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant="destructive"
                              className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            >
                              -{activity.pointsDeducted}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                           <AlertDialog>
                             <AlertDialogTrigger asChild>
                               <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isDeleting === activity.id}>
                                 {isDeleting === activity.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />}
                               </Button>
                             </AlertDialogTrigger>
                             <AlertDialogContent>
                               <AlertDialogHeader>
                                 <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                                 <AlertDialogDescription>
                                  Esta ação não pode ser desfeita. A atividade será excluída e os pontos serão ajustados.
                                 </AlertDialogDescription>
                               </AlertDialogHeader>
                               <AlertDialogFooter>
                                 <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                 <AlertDialogAction onClick={() => handleDeleteActivity(activity)} className={cn(buttonVariants({variant: "destructive"}))}>Excluir</AlertDialogAction>
                               </AlertDialogFooter>
                             </AlertDialogContent>
                           </AlertDialog>
                          </TableCell>
                        </TableRow>
                      );
                    }
                    return null;
                  })}
                {!isLoading &&
                  (!combinedActivities || combinedActivities.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        Nenhuma atividade recente.
                      </TableCell>
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

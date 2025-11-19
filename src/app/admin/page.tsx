'use client';

import { useState, useEffect } from 'react';
import {
  collectionGroup,
  query,
  where,
  orderBy,
  doc,
  runTransaction,
  serverTimestamp,
  Query,
} from 'firebase/firestore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useCollection, useFirestore } from '@/firebase';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Check, X, ShieldQuestion } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ValidationTable = ({
  firestoreQuery,
  onValidate,
  emptyState,
}: {
  firestoreQuery: Query;
  onValidate: (record: any, newStatus: 'approved' | 'rejected') => void;
  emptyState: React.ReactNode;
}) => {
  const { data: records, isLoading } = useCollection(firestoreQuery);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!records || records.length === 0) {
    return emptyState;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Usuário</TableHead>
          <TableHead>Item</TableHead>
          <TableHead className="hidden md:table-cell">Data</TableHead>
          <TableHead className="text-right">Pontos</TableHead>
          <TableHead className="text-center">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map((record) => (
          <TableRow key={record.id}>
            <TableCell>
              <div className="font-medium">{record.userName}</div>
              <div className="text-xs text-muted-foreground hidden sm:inline">
                {record.userId}
              </div>
            </TableCell>
            <TableCell>
              {record.materialType} ({record.quantity} un)
            </TableCell>
            <TableCell className="hidden md:table-cell">
              {record.recyclingDate?.toDate
                ? format(record.recyclingDate.toDate(), 'dd/MM/yyyy HH:mm', {
                    locale: ptBR,
                  })
                : 'N/A'}
            </TableCell>
            <TableCell className="text-right">
              <Badge variant="secondary">+{record.pointsEarned}</Badge>
            </TableCell>
            <TableCell className="flex justify-center gap-2">
              {record.status === 'pending' && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                    onClick={() => onValidate(record, 'approved')}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    onClick={() => onValidate(record, 'rejected')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              )}
              {record.status !== 'pending' && (
                <Badge
                  variant={record.status === 'approved' ? 'default' : 'destructive'}
                >
                  {record.status === 'approved' ? 'Aprovado' : 'Recusado'}
                </Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default function AdminPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('pending');
  
  const [pendingQuery, setPendingQuery] = useState<Query | null>(null);
  const [validatedQuery, setValidatedQuery] = useState<Query | null>(null);
  
  // Effect to create queries only when firestore is available
  useEffect(() => {
    if (firestore) {
      setPendingQuery(
        query(
          collectionGroup(firestore, 'recycling_records'),
          where('status', '==', 'pending'),
          orderBy('recyclingDate', 'asc')
        )
      );
      setValidatedQuery(
         query(
          collectionGroup(firestore, 'recycling_records'),
          where('status', 'in', ['approved', 'rejected']),
          orderBy('validatedAt', 'desc')
        )
      );
    }
  }, [firestore]);


  const handleValidate = async (
    record: any,
    newStatus: 'approved' | 'rejected'
  ) => {
    if (!firestore || processingId) return;
    setProcessingId(record.id);

    const recordRef = doc(
      firestore,
      'users',
      record.userId,
      'recycling_records',
      record.id
    );
    const userRef = doc(firestore, 'users', record.userId);

    try {
      await runTransaction(firestore, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists()) {
          throw new Error('User not found!');
        }

        // Update the record's status
        transaction.update(recordRef, {
          status: newStatus,
          validatedAt: serverTimestamp(),
        });

        // If approved, update user's points
        if (newStatus === 'approved') {
          const currentTotalPoints = userDoc.data().totalPoints || 0;
          const currentLifetimePoints = userDoc.data().lifetimePoints || 0;
          const newTotalPoints = currentTotalPoints + record.pointsEarned;
          const newLifetimePoints = currentLifetimePoints + record.pointsEarned;

          transaction.update(userRef, {
            totalPoints: newTotalPoints,
            lifetimePoints: newLifetimePoints,
          });
        }
      });

      toast({
        title: `Registro ${
          newStatus === 'approved' ? 'aprovado' : 'recusado'
        }!`,
        description: `O registro de ${record.userName} foi atualizado.`,
      });
    } catch (error) {
      console.error('Validation transaction failed: ', error);
      toast({
        variant: 'destructive',
        title: 'Erro na validação',
        description: 'Não foi possível validar o registro. Tente novamente.',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const pendingEmptyState = (
    <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
      <ShieldQuestion className="h-16 w-16 text-muted-foreground" />
      <h3 className="text-xl font-semibold">Tudo certo por aqui!</h3>
      <p className="text-muted-foreground">
        Não há registros pendentes de validação no momento.
      </p>
    </div>
  );

  const historyEmptyState = (
    <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
      <ShieldQuestion className="h-16 w-16 text-muted-foreground" />
      <h3 className="text-xl font-semibold">Nenhum registro validado.</h3>
      <p className="text-muted-foreground">
        O histórico de validações aparecerá aqui.
      </p>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Validação de Reciclagem</CardTitle>
        <CardDescription>
          Aprove ou recuse os registros de reciclagem enviados pelos usuários.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="pending"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-4 grid w-full grid-cols-2">
            <TabsTrigger value="pending">Pendentes</TabsTrigger>
            <TabsTrigger value="validated">Histórico</TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            {pendingQuery ? (
              <ValidationTable
                firestoreQuery={pendingQuery}
                onValidate={handleValidate}
                emptyState={pendingEmptyState}
              />
            ) : (
               <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
            )}
          </TabsContent>
          <TabsContent value="validated">
            {validatedQuery ? (
              <ValidationTable
                firestoreQuery={validatedQuery}
                onValidate={handleValidate}
                emptyState={historyEmptyState}
              />
            ) : (
               <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

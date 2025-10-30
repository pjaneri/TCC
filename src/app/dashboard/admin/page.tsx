"use client";

import { useMemo } from "react";
import { useFirestore, useCollection, useUser, useDoc, useMemoFirebase } from "@/firebase";
import { collection, query, where, orderBy, doc, runTransaction } from "firebase/firestore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";


export default function AdminPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const router = useRouter();
    const { toast } = useToast();

    const adminRoleRef = useMemoFirebase(() => {
        if (!user) return null;
        return doc(firestore, 'roles_admin', user.uid);
    }, [firestore, user]);
    const { data: adminRole, isLoading: isAdminLoading } = useDoc(adminRoleRef);
    const isAdmin = adminRole?.exists;
    
    const pendingRecordsQuery = useMemoFirebase(() => {
        if (!isAdmin) return null;
        return query(
            collection(firestore, "recycling_records_all"),
            where("status", "==", "pending"),
            orderBy("recyclingDate", "desc")
        );
    }, [firestore, isAdmin]);

    const { data: pendingRecords, isLoading: recordsLoading } = useCollection(pendingRecordsQuery);

    const handleApproval = async (recordId: string, newStatus: 'approved' | 'rejected') => {
        if (!firestore) return;

        const recordRef = doc(firestore, "recycling_records_all", recordId);

        try {
            await runTransaction(firestore, async (transaction) => {
                const recordDoc = await transaction.get(recordRef);
                if (!recordDoc.exists() || recordDoc.data().status !== 'pending') {
                    throw new Error("Registro não encontrado ou já processado.");
                }

                const recordData = recordDoc.data();
                transaction.update(recordRef, { status: newStatus });

                if (newStatus === 'approved') {
                    const userRef = doc(firestore, "users", recordData.userId);
                    const userDoc = await transaction.get(userRef);
                    if (userDoc.exists()) {
                        const currentPoints = userDoc.data().totalPoints || 0;
                        const newTotalPoints = currentPoints + recordData.pointsCalculated;
                        transaction.update(userRef, { totalPoints: newTotalPoints });
                    }
                }
            });

            toast({
                title: "Sucesso!",
                description: `O registro foi ${newStatus === 'approved' ? 'aprovado' : 'rejeitado'}.`,
            });
        } catch (error) {
            console.error("Transaction failed: ", error);
            toast({
                variant: "destructive",
                title: "Uh oh! Algo deu errado.",
                description: (error as Error).message || "Não foi possível processar o registro.",
            });
        }
    };

    if (isAdminLoading) {
        return <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }
    
    if (!isAdmin) {
        // This is a failsafe, the route guard should be in the layout, but good to have
        // router.replace('/dashboard');
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Acesso Negado</CardTitle>
                    <CardDescription>Você não tem permissão para acessar esta página.</CardDescription>
                </CardHeader>
            </Card>
        );
    }
    
  return (
    <div className="grid gap-6">
        <Card className="transform-gpu transition-all duration-300 ease-out hover:shadow-xl">
            <CardHeader>
            <CardTitle className="font-headline">Aprovação de Reciclagem</CardTitle>
            <CardDescription>
                Revise e aprove ou rejeite os registros de reciclagem pendentes.
            </CardDescription>
            </CardHeader>
            <CardContent>
            {recordsLoading ? <p>Carregando registros...</p> : (
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Pontos</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {pendingRecords && pendingRecords.map((record) => (
                    <TableRow key={record.id}>
                        <TableCell>{record.username || record.userId}</TableCell>
                        <TableCell>{record.materialType}</TableCell>
                        <TableCell>{record.quantity} {record.unit}</TableCell>
                        <TableCell>
                            {record.recyclingDate ? format(record.recyclingDate.toDate(), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : 'N/A'}
                        </TableCell>
                        <TableCell>
                            <Badge variant="secondary">{record.pointsCalculated}</Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                             <Button size="sm" variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white" onClick={() => handleApproval(record.id, 'approved')}>Aprovar</Button>
                             <Button size="sm" variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white" onClick={() => handleApproval(record.id, 'rejected')}>Rejeitar</Button>
                        </TableCell>
                    </TableRow>
                ))}
                {(!pendingRecords || pendingRecords.length === 0) && (
                    <TableRow>
                    <TableCell colSpan={6} className="text-center">Nenhum registro pendente.</TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
            )}
            </CardContent>
        </Card>
        </div>
    </div>
  );
}

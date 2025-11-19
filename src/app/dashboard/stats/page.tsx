
'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
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
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where, Timestamp } from 'firebase/firestore';
import { subDays, format, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Loader2, Package, Bot, Popcorn } from 'lucide-react';

const materialIcons: { [key: string]: React.ElementType } = {
  'Garrafa': Bot,
  'Tampinha + Lacre': Popcorn,
  'default': Package
};

export default function StatsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const sevenDaysAgo = useMemo(() => {
    const now = new Date();
    return startOfDay(subDays(now, 6));
  }, []);

  const recentRecordsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'users', user.uid, 'recycling_records'),
      where('status', '==', 'approved'),
      where('recyclingDate', '>=', Timestamp.fromDate(sevenDaysAgo))
    );
  }, [user, firestore, sevenDaysAgo]);

  const { data: recentRecords, isLoading } = useCollection(recentRecordsQuery);

  const chartData = useMemo(() => {
    const dataByDay: { [key: string]: number } = {};

    for (let i = 0; i < 7; i++) {
      const date = startOfDay(subDays(new Date(), i));
      const formattedDate = format(date, 'dd/MM', { locale: ptBR });
      dataByDay[formattedDate] = 0;
    }

    if (recentRecords) {
      recentRecords.forEach((record: any) => {
        if (record.recyclingDate?.toDate) {
            const date = startOfDay(record.recyclingDate.toDate());
            const formattedDate = format(date, 'dd/MM', { locale: ptBR });
            if (dataByDay.hasOwnProperty(formattedDate)) {
                dataByDay[formattedDate] += record.quantity;
            }
        }
      });
    }

    return Object.entries(dataByDay).map(([name, total]) => ({ name, total })).reverse();
  }, [recentRecords]);

  const materialTotals = useMemo(() => {
    const totals: { [key: string]: { quantity: number, points: number } } = {};
    if (recentRecords) {
        recentRecords.forEach((record: any) => {
            if (!totals[record.materialType]) {
                totals[record.materialType] = { quantity: 0, points: 0 };
            }
            totals[record.materialType].quantity += record.quantity;
            totals[record.materialType].points += record.pointsEarned;
        });
    }
    return Object.entries(totals).map(([name, data]) => ({ name, ...data }));
  }, [recentRecords]);


  if (isLoading) {
    return <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Atividade de Reciclagem (Últimos 7 dias)</CardTitle>
          <CardDescription>
            Quantidade de itens reciclados (aprovados) por dia.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentRecords && recentRecords.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                  }}
                />
                <Bar dataKey="total" fill="hsl(var(--primary))" name="Itens" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[300px] items-center justify-center text-muted-foreground">
              <p>Nenhum registro de reciclagem aprovado nos últimos 7 dias.</p>
            </div>
          )}
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle>Resumo de Materiais</CardTitle>
          <CardDescription>
            Total de itens e pontos por tipo de material nos últimos 7 dias.
          </CardDescription>
        </CardHeader>
        <CardContent>
           {recentRecords && recentRecords.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead className="text-right">Quantidade Total</TableHead>
                <TableHead className="text-right">Pontos Ganhos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materialTotals.map((material) => {
                const Icon = materialIcons[material.name] || materialIcons.default;
                return (
                  <TableRow key={material.name}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span>{material.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">{material.quantity}</TableCell>
                    <TableCell className="text-right font-medium text-primary">+{material.points.toLocaleString('pt-BR')}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
           ) : (
             <div className="flex h-[100px] items-center justify-center text-muted-foreground">
              <p>Nenhum material para exibir.</p>
            </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}

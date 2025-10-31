
"use client";

import { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, Timestamp } from 'firebase/firestore';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Loader2, Recycle, Package } from 'lucide-react';
import { parseISO } from 'date-fns';

const COLORS = {
  "Plástico": "hsl(var(--chart-1))",
  "Papel": "hsl(var(--chart-2))",
  "Vidro": "hsl(var(--chart-3))",
  "Metal": "hsl(var(--chart-4))",
};

const toDate = (date: Timestamp | string | Date | undefined): Date | null => {
  if (!date) return null;
  if (date instanceof Timestamp) return date.toDate();
  if (typeof date === 'string') return parseISO(date);
  return date;
};

export default function StatisticsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const recordsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(firestore, 'users', user.uid, 'recycling_records'),
      orderBy('recyclingDate', 'asc')
    );
  }, [firestore, user]);

  const { data: records, isLoading } = useCollection(recordsQuery);

  const stats = useMemo(() => {
    if (!records || records.length === 0) {
      return {
        materialDistribution: [],
        totalItems: 0,
      };
    }

    const materialMap = new Map<string, number>();
    let totalItems = 0;
    records.forEach((record) => {
      materialMap.set(record.materialType, (materialMap.get(record.materialType) || 0) + record.quantity);
      totalItems += record.quantity;
    });

    const materialDistribution = Array.from(materialMap.entries()).map(([name, value]) => ({
      name,
      value,
    }));

    return { materialDistribution, totalItems };
  }, [records]);


  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!records || records.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        <Recycle className="mx-auto h-12 w-12" />
        <h3 className="mt-4 text-lg font-semibold">Sem dados para exibir</h3>
        <p className="mt-1 text-sm">
          Comece a registrar suas reciclagens para ver suas estatísticas.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-1">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        <span>Total de Itens Reciclados</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold">{stats.totalItems.toLocaleString('pt-BR')}</p>
                </CardContent>
            </Card>
        </div>

      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Materiais</CardTitle>
          <CardDescription>
            A proporção de cada tipo de material que você reciclou.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={stats.materialDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {stats.materialDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${(value as number).toLocaleString('pt-BR')}`}/>
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
    </div>
  );
}

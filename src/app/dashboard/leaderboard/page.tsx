
"use client";

import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Crown, Medal, Trophy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function LeaderboardPage() {
  const firestore = useFirestore();

  const leaderboardQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'users'),
      orderBy('totalPoints', 'desc'),
      limit(10)
    );
  }, [firestore]);

  const { data: topUsers, isLoading } = useCollection(leaderboardQuery);
  
  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="h-6 w-6 text-yellow-500" />;
    if (index === 1) return <Medal className="h-6 w-6 text-gray-400" />;
    if (index === 2) return <Trophy className="h-6 w-6 text-yellow-700" />;
    return <span className="w-6 text-center font-bold">{index + 1}</span>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Placar de Líderes</CardTitle>
        <CardDescription>
          Veja quem são os maiores recicladores da nossa comunidade!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Posição</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead className="text-right">Pontuação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                    <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-3/4" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-6 w-1/2 ml-auto" /></TableCell>
                </TableRow>
            ))}
            {!isLoading && topUsers?.map((user, index) => (
              <TableRow key={user.id} className="font-medium transition-colors hover:bg-muted/50">
                <TableCell>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        {getRankIcon(index)}
                    </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                       <AvatarFallback>{user.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                    <span>{user.username}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right text-lg">
                  {user.totalPoints.toLocaleString("pt-BR")}
                </TableCell>
              </TableRow>
            ))}
             {!isLoading && (!topUsers || topUsers.length === 0) && (
                <TableRow>
                    <TableCell colSpan={3} className="text-center">Ainda não há usuários no placar.</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

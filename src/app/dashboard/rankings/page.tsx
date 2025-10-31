"use client";

import { useMemo } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useFirestore, useCollection, useMemoFirebase, useUser } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { Crown, Trophy, Sparkles } from "lucide-react";

export default function RankingsPage() {
  const firestore = useFirestore();
  const { user } = useUser();

  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, "users"),
      orderBy("totalPoints", "desc"),
      limit(10)
    );
  }, [firestore]);

  const { data: users, isLoading } = useCollection(usersQuery);

  const rankedUsers = useMemo(() => {
    return users?.map((user, index) => ({ ...user, rank: index + 1 })) || [];
  }, [users]);

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <Badge className="bg-amber-400 text-amber-900 hover:bg-amber-400">
            <Crown className="mr-1 h-4 w-4" /> {rank}º
          </Badge>
        );
      case 2:
        return (
          <Badge className="bg-slate-300 text-slate-800 hover:bg-slate-300">
            <Trophy className="mr-1 h-4 w-4" /> {rank}º
          </Badge>
        );
      case 3:
        return (
          <Badge className="bg-yellow-600 text-yellow-100 hover:bg-yellow-600">
            <Sparkles className="mr-1 h-4 w-4" /> {rank}º
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="w-12 justify-center">
            {rank}º
          </Badge>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Placar de Líderes</CardTitle>
        <CardDescription>
          Veja os usuários que mais reciclaram e ganharam pontos!
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && rankedUsers.length === 0 ? (
          <p>Carregando ranking...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Rank</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead className="text-right">Pontos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rankedUsers.map((rankedUser) => (
                <TableRow
                  key={rankedUser.id}
                  className={
                    rankedUser.id === user?.uid
                      ? "bg-primary/10 hover:bg-primary/20"
                      : ""
                  }
                >
                  <TableCell className="font-bold">
                    {getRankBadge(rankedUser.rank)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={rankedUser.photoURL || ""}
                          alt={rankedUser.username}
                        />
                        <AvatarFallback>
                          {rankedUser.username?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{rankedUser.username}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold">
                    {rankedUser.totalPoints.toLocaleString("pt-BR")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {!isLoading && rankedUsers.length === 0 && (
          <div className="text-center text-muted-foreground pt-4">
            Ainda não há ninguém no ranking. Seja o primeiro a registrar!
          </div>
        )}
      </CardContent>
    </Card>
  );
}

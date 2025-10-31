"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFirestore, useCollection, useMemoFirebase, useUser } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { Crown, Shield, Star, Leaf, Award, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";


type UserProfile = {
  id: string;
  username: string;
  totalPoints: number;
  photoURL?: string;
};

const ranks = [
  { name: "Campeão da Reciclagem", minPoints: 10000, Icon: Crown, color: "text-amber-400" },
  { name: "Mestre", minPoints: 5000, Icon: Award, color: "text-slate-400" },
  { name: "Guardião", minPoints: 1000, Icon: Shield, color: "text-yellow-600" },
  { name: "Aprendiz", minPoints: 200, Icon: Star, color: "text-sky-500" },
  { name: "Novato", minPoints: 0, Icon: Leaf, color: "text-green-500" },
];

export const getRank = (points: number) => {
  return ranks.find(rank => points >= rank.minPoints) ?? ranks[ranks.length - 1];
};

const UserRankCard = ({ user, rankPosition }: { user: UserProfile, rankPosition: number }) => {
    const rank = getRank(user.totalPoints);
    const { user: currentUser } = useUser();
    const isCurrentUser = currentUser?.uid === user.id;

    return (
        <Card className={cn(
            "transform-gpu transition-all duration-300 ease-out hover:shadow-xl",
            isCurrentUser ? "bg-primary/10 border-primary" : ""
        )}>
            <CardContent className="flex items-center gap-4 p-4">
                <div className="flex items-center gap-4">
                    <span className="text-xl font-bold text-muted-foreground w-8 text-center">{rankPosition}º</span>
                    <Avatar className="h-12 w-12 border-2 border-muted">
                        <AvatarImage src={user.photoURL || ""} alt={user.username} />
                        <AvatarFallback>{user.username?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                </div>
                <div className="flex-1">
                    <p className="font-bold text-lg truncate">{user.username}</p>
                    <div className="flex items-center gap-2">
                        <rank.Icon className={cn("h-4 w-4", rank.color)} />
                        <p className={cn("text-sm font-semibold", rank.color)}>{rank.name}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xl font-bold font-mono">{user.totalPoints.toLocaleString("pt-BR")}</p>
                    <p className="text-xs text-muted-foreground">pontos</p>
                </div>
            </CardContent>
        </Card>
    )
}


export default function RankingsPage() {
  const firestore = useFirestore();
  const { user: currentUser } = useUser();

  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, "users"),
      orderBy("totalPoints", "desc"),
      limit(50) // Fetch more users to find current user's rank if not in top 10
    );
  }, [firestore]);

  const { data: users, isLoading } = useCollection<UserProfile>(usersQuery);

  const { topUsers, currentUserRank, currentUserWithRank } = useMemo(() => {
    if (!users) return { topUsers: [], currentUserRank: null, currentUserWithRank: null };
    
    const rankedUsers = users.map((user, index) => ({ ...user, rankPosition: index + 1 }));
    const topUsers = rankedUsers.slice(0, 10);
    let currentUserRank = null;
    let currentUserWithRank = null;

    const currentUserData = rankedUsers.find(u => u.id === currentUser?.uid);
    if (currentUserData) {
        currentUserRank = currentUserData.rankPosition;
        currentUserWithRank = currentUserData;
    }

    return { topUsers, currentUserRank, currentUserWithRank };

  }, [users, currentUser]);


  return (
    <div className="flex flex-col gap-6">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Placar de Líderes</h2>
            <p className="text-muted-foreground">
            Veja sua posição e as patentes dos melhores recicladores!
            </p>
        </div>

        {isLoading && (!users || users.length === 0) ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {currentUserWithRank && !topUsers.some(u => u.id === currentUser?.uid) && (
                 <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-semibold">Sua Posição</h3>
                    <UserRankCard user={currentUserWithRank} rankPosition={currentUserRank!} />
                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-dashed" />
                        </div>
                    </div>
                </div>
            )}
             <div className="flex flex-col gap-4">
                {topUsers.length > 0 && <h3 className="text-lg font-semibold">Top 10 Recicladores</h3>}
                {topUsers.map((user) => (
                    <UserRankCard key={user.id} user={user} rankPosition={user.rankPosition} />
                ))}
             </div>
          </>
        )}

        {!isLoading && (!users || users.length === 0) && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              Ainda não há ninguém no ranking. Seja o primeiro a registrar!
            </CardContent>
          </Card>
        )}
    </div>
  );
}

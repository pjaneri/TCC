
"use client";

import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { Flame, Leaf, Shield, ShieldCheck, Sprout, Star, Sun, TreePine } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const ranks = [
  { level: 7, name: "Lenda", points: 50000, icon: <Flame className="h-6 w-6" /> },
  { level: 6, name: "Herói", points: 20000, icon: <Star className="h-6 w-6" /> },
  { level: 5, name: "Campeão", points: 10000, icon: <Sun className="h-6 w-6" /> },
  { level: 4, name: "Defensor", points: 5000, icon: <ShieldCheck className="h-6 w-6" /> },
  { level: 3, name: "Guardião", points: 3000, icon: <TreePine className="h-6 w-6" /> },
  { level: 2, name: "Coletor", points: 1500, icon: <Leaf className="h-6 w-6" /> },
  { level: 1, name: "Aprendiz", points: 500, icon: <Sprout className="h-6 w-6" /> },
  { level: 0, name: "Novato", points: 0, icon: <Shield className="h-6 w-6" /> },
].sort((a, b) => b.level - a.level);

const getCurrentRank = (points: number) => {
  // Ranks are sorted descending, so find the first one the user qualifies for.
  return ranks.find(rank => points >= rank.points) || ranks[ranks.length - 1];
};

const getNextRank = (currentLevel: number) => {
  // Since ranks are sorted descending by level, the next rank is the one with a higher level.
  // We need to find the rank with level + 1. The array is sorted from high to low level.
  const reversedRanks = [...ranks].reverse(); // from 0 to 7
  return reversedRanks.find(r => r.level === currentLevel + 1);
};

export default function RankingsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);
  const { data: userProfile } = useDoc(userProfileRef);
  
  const userPoints = userProfile?.totalPoints || 0;
  const currentRank = getCurrentRank(userPoints);
  const nextRank = getNextRank(currentRank.level);
  
  const progressToNextRank = nextRank 
    ? ((userPoints - currentRank.points) / (nextRank.points - currentRank.points)) * 100 
    : 100;

  return (
    <div className="grid gap-6">
       <Card className="transform-gpu transition-all duration-300 ease-out hover:shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-4">
             <div className="text-primary">{currentRank.icon}</div>
             <div>
                <CardTitle className="font-headline text-2xl">Sua Patente: {currentRank.name}</CardTitle>
                <CardDescription>Você acumulou {userPoints.toLocaleString()} pontos.</CardDescription>
             </div>
          </div>
        </CardHeader>
        {nextRank && (
          <CardContent>
            <div className="space-y-2">
                <p className="text-sm font-medium">Progresso para a próxima patente: {nextRank.name}</p>
                <Progress value={progressToNextRank} className="w-full" />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{userPoints.toLocaleString()} pts</span>
                    <span>{nextRank.points.toLocaleString()} pts</span>
                </div>
                <p className="text-center text-sm text-muted-foreground mt-2">
                    Faltam {(nextRank.points - userPoints).toLocaleString()} pontos para você se tornar um {nextRank.name}!
                </p>
            </div>
          </CardContent>
        )}
        {!nextRank && currentRank && (
            <CardContent>
                <p className="text-center font-semibold text-primary">Parabéns! Você alcançou a patente máxima de {currentRank.name}!</p>
            </CardContent>
        )}
      </Card>
      
      <Card className="transform-gpu transition-all duration-300 ease-out hover:shadow-xl">
        <CardHeader>
          <CardTitle>Patentes de Reciclagem</CardTitle>
          <CardDescription>
            Continue reciclando para subir de patente e mostrar seu impacto.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {[...ranks].reverse().map((rank) => (
              <li key={rank.level} className={`flex items-center justify-between rounded-lg p-4 transition-colors ${currentRank.level === rank.level ? 'bg-accent/50 border border-accent' : 'bg-muted/30'}`}>
                <div className="flex items-center gap-4">
                  <div className="text-primary">{rank.icon}</div>
                  <div>
                    <p className="font-semibold text-lg">{rank.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Requer {rank.points.toLocaleString()} pontos
                    </p>
                  </div>
                </div>
                {currentRank.level === rank.level && (
                    <Badge>Sua Patente</Badge>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

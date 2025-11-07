
"use client";

import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, Shield, Star, Gem, Crown, Loader2 } from "lucide-react";
import React from "react";

const ranks = [
    { name: "Novato", points: 0, icon: <Award className="h-12 w-12 text-yellow-500" />, color: "text-yellow-500" },
    { name: "Aprendiz", points: 1000, icon: <Shield className="h-12 w-12 text-blue-500" />, color: "text-blue-500" },
    { name: "Guardião", points: 5000, icon: <Star className="h-12 w-12 text-green-500" />, color: "text-green-500" },
    { name: "Mestre", points: 15000, icon: <Gem className="h-12 w-12 text-purple-500" />, color: "text-purple-500" },
    { name: "Campeão", points: 30000, icon: <Crown className="h-12 w-12 text-red-500" />, color: "text-red-500" },
];

export default function RankingsPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const userProfileRef = useMemoFirebase(() => {
        if (!user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);

    const { data: userProfile, isLoading: profileLoading } = useDoc(userProfileRef);

    if (profileLoading || !userProfile) {
        return <div className="flex justify-center items-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    const userPoints = userProfile.lifetimePoints || 0;
    
    const currentRankIndex = ranks.slice().reverse().findIndex(rank => userPoints >= rank.points);
    const currentRank = ranks[ranks.length - 1 - currentRankIndex];
    
    const nextRank = ranks[ranks.length - currentRankIndex] || null;

    const progressPercentage = nextRank
        ? ((userPoints - currentRank.points) / (nextRank.points - currentRank.points)) * 100
        : 100;
        
    const pointsToNextRank = nextRank ? nextRank.points - userPoints : 0;

    return (
        <div className="flex flex-col gap-8">
            <Card className="transform-gpu transition-all duration-300 ease-out hover:shadow-xl">
                <CardHeader className="text-center">
                    <div className="flex justify-center items-center mb-4">
                        {React.cloneElement(currentRank.icon, { className: `h-20 w-20 ${currentRank.color}` })}
                    </div>
                    <CardTitle className={`text-4xl font-bold ${currentRank.color}`}>{currentRank.name}</CardTitle>
                    <CardDescription className="text-lg">Sua patente atual</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center mb-6">
                        <p className="text-2xl font-semibold">{userPoints.toLocaleString('pt-BR')} Pontos Ganhos</p>
                    </div>

                    {nextRank && (
                        <div className="space-y-2">
                             <div className="flex justify-between text-sm text-muted-foreground">
                                <span>{currentRank.name} ({currentRank.points.toLocaleString('pt-BR')})</span>
                                <span>{nextRank.name} ({nextRank.points.toLocaleString('pt-BR')})</span>
                            </div>
                            <Progress value={progressPercentage} className="h-3"/>
                            <p className="text-center text-sm text-muted-foreground mt-2">
                                Faltam <strong>{pointsToNextRank.toLocaleString('pt-BR')}</strong> pontos para {nextRank.name}!
                            </p>
                        </div>
                    )}
                    {currentRank.name === "Campeão" && (
                         <p className="text-center font-semibold text-primary">Parabéns! Você alcançou a patente máxima!</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Todas as Patentes</CardTitle>
                    <CardDescription>Esta é a trilha de progressão no Recycle+.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {ranks.map((rank) => (
                            <li key={rank.name} className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50">
                                {React.cloneElement(rank.icon, { className: `h-10 w-10 ${rank.color}` })}
                                <div>
                                    <p className={`font-semibold ${rank.color}`}>{rank.name}</p>
                                    <p className="text-sm text-muted-foreground">Requer {rank.points.toLocaleString('pt-BR')} pontos</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}

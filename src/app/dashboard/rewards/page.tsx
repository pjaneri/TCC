"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Coins } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from "@/firebase";
import { collection, query, where, doc, runTransaction } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
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

export default function RewardsPage() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const rewardsQuery = useMemoFirebase(() => {
    return query(collection(firestore, "rewards"), where("material", "==", "plastic"));
  }, [firestore]);

  const { data: rewards, isLoading: rewardsLoading } = useCollection(rewardsQuery);

  const userProfileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: userLoading } = useDoc(userProfileRef);

  const handleRedemption = async (reward: any) => {
    if (!user || !userProfile) {
        toast({ variant: "destructive", title: "Erro", description: "Você precisa estar logado." });
        return;
    }
    if (userProfile.totalPoints < reward.requiredPoints) {
        toast({ variant: "destructive", title: "Pontos insuficientes", description: "Você não tem pontos suficientes para resgatar este prêmio." });
        return;
    }

    const userDocRef = doc(firestore, "users", user.uid);
    const redemptionColRef = collection(userDocRef, "redemptions");

    try {
        await runTransaction(firestore, async (transaction) => {
            const userDoc = await transaction.get(userDocRef);
            if (!userDoc.exists() || userDoc.data().totalPoints < reward.requiredPoints) {
                throw "Pontos insuficientes ou usuário não encontrado.";
            }

            const newTotalPoints = userDoc.data().totalPoints - reward.requiredPoints;
            transaction.update(userDocRef, { totalPoints: newTotalPoints });

            const newRedemptionRef = doc(redemptionColRef);
            transaction.set(newRedemptionRef, {
                id: newRedemptionRef.id,
                userId: user.uid,
                rewardId: reward.id,
                rewardName: reward.name,
                redemptionDate: new Date().toISOString(),
                pointsDeducted: reward.requiredPoints,
            });
        });

        toast({
            title: "Prêmio resgatado!",
            description: `Você resgatou "${reward.name}" por ${reward.requiredPoints} pontos.`,
        });

    } catch (e) {
        console.error("Transaction failed: ", e);
        toast({
            variant: "destructive",
            title: "Uh oh! Algo deu errado.",
            description: "Não foi possível resgatar o prêmio.",
        });
    }
  };


  const rewardsWithData = rewards
  ? rewards.map((reward) => {
      const placeholder = PlaceHolderImages.find((p) => p.id === reward.id);
      return { ...reward, ...placeholder };
    })
  : [];


  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Resgatar Prêmios</h1>
        <p className="text-muted-foreground">
          Use seus pontos para resgatar prêmios incríveis! (Somente itens de plástico são mostrados)
        </p>
      </div>
      {rewardsLoading || userLoading ? (
        <p>Carregando prêmios...</p>
      ) : (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rewardsWithData.map((reward) => (
          <Card key={reward.id} className="flex flex-col">
            <CardHeader className="p-0">
              {reward.imageUrl && (
                <Image
                  src={reward.imageUrl}
                  alt={reward.name || "Prêmio"}
                  width={400}
                  height={300}
                  className="rounded-t-lg object-cover"
                  data-ai-hint={reward.imageHint}
                />
              )}
            </CardHeader>
            <CardContent className="flex-1 p-4">
              <CardTitle className="font-headline text-lg">
                {reward.name}
              </CardTitle>
              <CardDescription>{reward.description}</CardDescription>
              <div className="mt-2 flex items-center">
                 <Badge variant="outline" className="flex items-center gap-1 border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  <Coins className="h-4 w-4" />
                  <span>{reward.requiredPoints.toLocaleString("pt-BR")} pontos</span>
                 </Badge>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
               <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button className="w-full" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }} disabled={(userProfile?.totalPoints || 0) < reward.requiredPoints}>
                        {(userProfile?.totalPoints || 0) < reward.requiredPoints ? "Pontos insuficientes" : "Resgatar"}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar Resgate</AlertDialogTitle>
                    <AlertDialogDescription>
                        Você tem certeza que quer resgatar "{reward.name}" por {reward.requiredPoints} pontos? Essa ação não pode ser desfeita.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleRedemption(reward)}>
                        Confirmar
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
          </Card>
        ))}
      </div>
      )}
    </div>
  );
}

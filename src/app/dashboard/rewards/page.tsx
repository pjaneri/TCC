
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
import { Coins } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUser, useFirestore, useDoc, useMemoFirebase, errorEmitter, FirestorePermissionError } from "@/firebase";
import { collection, doc, runTransaction, serverTimestamp } from "firebase/firestore";
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
import rewardsData from '@/lib/placeholder-images.json';


const allRewards = rewardsData.placeholderImages.map(reward => ({
  ...reward,
  requiredPoints:
    reward.id.includes("kit-cracha-chaveiros") ? 40000 :
    reward.id.includes("kit-saboneteira-cumbuca-tupperware") ? 35000 :
    reward.id.includes("kit-espatula-caneca-garrafa") ? 30000 :
    reward.id.includes("espremedor") || reward.id.includes("cumbuca-hashi") ? 20000 :
    reward.id.includes("chaveiro-id") || reward.id.includes("tupperware") || reward.id.includes("garrafa") ? 15000 :
    reward.id.includes("saboneteira") || reward.id.includes("porta-cracha") || reward.id.includes("espatula") || reward.id.includes("caneca") ? 10000 :
    5000
}));


export default function RewardsPage() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const userProfileRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: userLoading } = useDoc(userProfileRef);

  const handleRedemption = (reward: any) => {
    if (!user || !userProfile || !firestore) {
        toast({ variant: "destructive", title: "Erro", description: "Você precisa estar logado." });
        return;
    }
    if (userProfile.totalPoints < reward.requiredPoints) {
        toast({ variant: "destructive", title: "Pontos insuficientes", description: "Você não tem pontos suficientes para resgatar este prêmio." });
        return;
    }

    const userDocRef = doc(firestore, "users", user.uid);
    const redemptionColRef = collection(userDocRef, "redemptions");
    const newRedemptionRef = doc(redemptionColRef);
    const newRedemptionData = {
        id: newRedemptionRef.id,
        userId: user.uid,
        rewardId: reward.id,
        rewardName: reward.name,
        redemptionDate: serverTimestamp(),
        pointsDeducted: reward.requiredPoints,
    };

    runTransaction(firestore, async (transaction) => {
        const userDoc = await transaction.get(userDocRef);
        if (!userDoc.exists() || (userDoc.data().totalPoints || 0) < reward.requiredPoints) {
            throw "Pontos insuficientes ou usuário não encontrado.";
        }

        const newTotalPoints = (userDoc.data().totalPoints || 0) - reward.requiredPoints;
        // Lifetime points are not affected by redemptions
        transaction.update(userDocRef, { totalPoints: newTotalPoints });
        transaction.set(newRedemptionRef, newRedemptionData);
    }).then(() => {
        toast({
            title: "Prêmio resgatado!",
            description: `Você resgatou "${reward.name}" por ${reward.requiredPoints} pontos.`,
        });
    }).catch((e) => {
        if (e instanceof Error && e.name === 'FirebaseError') {
          // This is likely a permission error, let the global handler manage it.
          const permissionError = new FirestorePermissionError({
            path: newRedemptionRef.path,
            operation: 'create',
            requestResourceData: newRedemptionData
          });
          errorEmitter.emit('permission-error', permissionError);
        } else {
            console.error("Transaction failed: ", e);
            toast({
                variant: "destructive",
                title: "Uh oh! Algo deu errado.",
                description: "Não foi possível resgatar o prêmio.",
            });
        }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-muted-foreground">
          Use seus pontos para resgatar prêmios incríveis feitos de plástico!
        </p>
      </div>
      {userLoading ? (
        <p>Carregando...</p>
      ) : (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {allRewards.map((reward) => (
          <Card key={reward.id} className="flex flex-col transform-gpu transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl">
            <CardHeader className="p-0">
              {reward.imageUrl && (
                <Image
                  src={reward.imageUrl}
                  alt={reward.name || "Prêmio"}
                  width={400}
                  height={300}
                  className="aspect-[4/3] rounded-t-lg object-cover"
                  data-ai-hint={reward.imageHint}
                />
              )}
            </CardHeader>
            <CardContent className="flex flex-1 flex-col p-4">
              <CardTitle className="font-headline text-lg">
                {reward.name}
              </CardTitle>
              <CardDescription className="flex-1">{reward.description}</CardDescription>
              <div className="mt-4 flex items-center">
                 <Badge variant="outline" className="flex items-center gap-1 border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  <Coins className="h-4 w-4" />
                  <span>{reward.requiredPoints.toLocaleString("pt-BR")} pontos</span>
                 </Badge>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
               <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button className="w-full font-bold" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }} disabled={(userProfile?.totalPoints || 0) < reward.requiredPoints}>
                        {(userProfile?.totalPoints || 0) < reward.requiredPoints ? "Pontos insuficientes" : "Resgatar"}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar Resgate</AlertDialogTitle>
                    <AlertDialogDescription>
                        Você tem certeza que quer resgatar "{reward.name}" por ${reward.requiredPoints.toLocaleString("pt-BR")} pontos? Essa ação não pode ser desfeita.
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
         {allRewards.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground">
              <p>Nenhum prêmio de plástico disponível no momento. Novos prêmios estão sendo adicionados!</p>
            </div>
          )}
      </div>
      )}
    </div>
  );
}

    

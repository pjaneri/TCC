
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
import { collection, doc, runTransaction } from "firebase/firestore";
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


const rewardsData = [
  { id: "reward-1", name: "Garrafa de Água", requiredPoints: 1000, description: "Uma garrafa de água esportiva reutilizável feita de plástico reciclado, perfeita para se manter hidratado.", imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx3YXRlciUyMGJvdHRsZXxlbnwwfHx8fDE3NjE3ODc3NDd8MA&ixlib=rb-4.1.0&q=80&w=1080", imageHint: "water bottle" },
  { id: "reward-3", name: "Vaso de Planta", requiredPoints: 750, description: "Vaso de planta pequeno e moderno, ideal para suculentas, feito 100% de plástico reciclado.", imageUrl: "https://images.unsplash.com/photo-1528475563668-e15742001b92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxwbGFudCUyMHBvdHxlbnwwfHx8fDE3NjE4MzM0MzN8MA&ixlib=rb-4.1.0&q=80&w=1080", imageHint: "plant pot" },
  { id: "reward-4", name: "Lancheira Ecológica", requiredPoints: 1200, description: "Uma lancheira durável e ecológica feita de plástico reciclado, com compartimentos para seus lanches.", imageUrl: "https://images.unsplash.com/photo-1508170754725-6e9a5cfbcabf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxsdW5jaCUyMGJveHxlbnwwfHx8fDE3NjE3NTE2MTB8MA&ixlib=rb-4.1.0&q=80&w=1080", imageHint: "lunch box" },
  { id: "reward-9", name: "Pente de Cabelo Reciclado", requiredPoints: 400, description: "Um pente de cabelo resistente e elegante, fabricado a partir de plásticos reciclados.", imageUrl: "https://images.unsplash.com/photo-1702569258559-e0b4d469b2c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxoYWlyJTIwY29tYnxlbnwwfHx8fDE3NjE4NTc2MDh8MA&ixlib=rb-4.1.0&q=80&w=1080", imageHint: "hair comb" },
  { id: "reward-7", name: "Kit de Talheres de Viagem", requiredPoints: 800, description: "Conjunto de talheres de viagem reutilizáveis (garfo, faca, colher) em um estojo compacto, tudo de plástico reciclado.", imageUrl: "https://images.unsplash.com/photo-1666475877314-4df0b366a51c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxyZXVzYWJsZSUyMGN1dGxlcnl8ZW58MHx8fHwxNzYxODU3NjA4fDA&ixlib=rb-4.1.0&q=80&w=1080", imageHint: "reusable cutlery" },
  { id: "reward-8", name: "Potes de Armazenamento (Kit com 3)", requiredPoints: 1500, description: "Kit com 3 potes de armazenamento de alimentos de tamanhos variados, feitos de plástico reciclado e seguros para alimentos.", imageUrl: "https://images.unsplash.com/photo-1569419904069-081571452242?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxmb29kJTIwY29udGFpbmVyc3xlbnwwfHx8fDE3NjE4NTc2MDh8MA&ixlib-rb-4.1.0&q=80&w=1080", imageHint: "food containers" },
  { id: "reward-10", name: "Organizador de Mesa", requiredPoints: 900, description: "Organizador de mesa com compartimentos para canetas e clipes, feito de plástico reciclado para um escritório mais verde.", imageUrl: "https://images.unsplash.com/photo-1644463589256-02679b9c0767?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxkZXNrJTIwb3JnYW5pemVyfGVufDB8fHx8MTc2MTgzMjA3OXww&ixlib.rb-4.1.0&q=80&w=1080", imageHint: "desk organizer" },
  { id: "reward-2", name: "Frisbee Reciclado", requiredPoints: 600, description: "Um frisbee divertido e durável, feito 100% de plástico reciclado, perfeito para jogar ao ar livre.", imageUrl: "https://images.unsplash.com/photo-1596706225212-323a01397d9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxmcmlzYmVlfGVufDB8fHx8MTc2MjA5MzYxN3ww&ixlib=rb-4.1.0&q=80&w=1080", imageHint: "recycled frisbee"},
];


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
        redemptionDate: new Date().toISOString(),
        pointsDeducted: reward.requiredPoints,
        type: 'redemption'
    };

    runTransaction(firestore, async (transaction) => {
        const userDoc = await transaction.get(userDocRef);
        if (!userDoc.exists() || (userDoc.data().totalPoints || 0) < reward.requiredPoints) {
            throw "Pontos insuficientes ou usuário não encontrado.";
        }

        const newTotalPoints = (userDoc.data().totalPoints || 0) - reward.requiredPoints;
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
        {rewardsData.map((reward) => (
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
         {rewardsData.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground">
              <p>Nenhum prêmio de plástico disponível no momento. Novos prêmios estão sendo adicionados!</p>
            </div>
          )}
      </div>
      )}
    </div>
  );
}

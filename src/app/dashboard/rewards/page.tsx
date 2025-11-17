
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


const rewardsData = [
    { id: "reward-prato", name: "Prato", requiredPoints: 5000, description: "Prato de plástico reciclado, durável e ecológico.", imageUrl: "https://picsum.photos/seed/plate/400/300", imageHint: "recycled plate" },
    { id: "reward-vaso", name: "Vaso de Planta", requiredPoints: 5000, description: "Vaso de planta de plástico reciclado para suas plantas.", imageUrl: "https://picsum.photos/seed/plantpot/400/300", imageHint: "plant pot" },
    { id: "reward-quebra-cabeca", name: "Quebra-cabeça Carrinho", requiredPoints: 5000, description: "Divertido quebra-cabeça 3D de um carrinho, feito de plástico reciclado.", imageUrl: "https://picsum.photos/seed/puzzlecar/400/300", imageHint: "puzzle car" },
    { id: "reward-saboneteira", name: "Saboneteira", requiredPoints: 10000, description: "Saboneteira elegante feita de plástico reciclado para o seu banheiro.", imageUrl: "https://picsum.photos/seed/soapdish/400/300", imageHint: "soap dish" },
    { id: "reward-porta-cracha", name: "Porta Crachá", requiredPoints: 10000, description: "Porta crachá de plástico reciclado, ideal para o trabalho ou eventos.", imageUrl: "https://picsum.photos/seed/badgeholder/400/300", imageHint: "badge holder" },
    { id: "reward-espatula", name: "Espátula", requiredPoints: 10000, description: "Espátula de cozinha de plástico reciclado resistente ao calor.", imageUrl: "https://picsum.photos/seed/spatula/400/300", imageHint: "kitchen spatula" },
    { id: "reward-caneca", name: "Caneca", requiredPoints: 10000, description: "Caneca de plástico reciclado para suas bebidas quentes ou frias.", imageUrl: "https://picsum.photos/seed/mug/400/300", imageHint: "recycled mug" },
    { id: "reward-chaveiro-id", name: "Chaveiro de Identificação", requiredPoints: 15000, description: "Chaveiro de identificação personalizável feito de plástico reciclado.", imageUrl: "https://picsum.photos/seed/keychain/400/300", imageHint: "id keychain" },
    { id: "reward-tupperware", name: "Tupperware", requiredPoints: 15000, description: "Conjunto de potes Tupperware de plástico reciclado para armazenar alimentos.", imageUrl: "https://picsum.photos/seed/tupperware/400/300", imageHint: "food container" },
    { id: "reward-garrafa", name: "Garrafa", requiredPoints: 15000, description: "Garrafa de água reutilizável de plástico reciclado.", imageUrl: "https://picsum.photos/seed/bottle/400/300", imageHint: "water bottle" },
    { id: "reward-espremedor", name: "Espremedor e Jarrinha", requiredPoints: 20000, description: "Kit de espremedor de frutas e jarrinha, ambos de plástico reciclado.", imageUrl: "https://picsum.photos/seed/juicer/400/300", imageHint: "juicer pitcher" },
    { id: "reward-chaveiro-pers", name: "Chaveiro Personalizado", requiredPoints: 20000, description: "Chaveiro de plástico reciclado com personalização.", imageUrl: "https://picsum.photos/seed/customkeychain/400/300", imageHint: "custom keychain" },
    { id: "reward-cumbuca-hashi", name: "Cumbuca de Hashi", requiredPoints: 20000, description: "Cumbuca com suporte para hashi, ideal para comida asiática, de plástico reciclado.", imageUrl: "https://picsum.photos/seed/hashibowl/400/300", imageHint: "hashi bowl" },
    { id: "reward-kit-espatula-caneca-garrafa", name: "Kit: Espátula + Caneca + Garrafa", requiredPoints: 30000, description: "Kit completo com espátula, caneca e garrafa de plástico reciclado.", imageUrl: "https://picsum.photos/seed/kitchenset/400/300", imageHint: "recycled kitchenware" },
    { id: "reward-kit-saboneteira-cumbuca-tupperware", name: "Kit: Saboneteira + Cumbuca + Tupperware", requiredPoints: 35000, description: "Kit com saboneteira, cumbuca de hashi e pote Tupperware de plástico reciclado.", imageUrl: "https://picsum.photos/seed/homeset/400/300", imageHint: "recycled homeware" },
    { id: "reward-kit-cracha-chaveiros", name: "Kit: Porta Crachá + Chaveiros", requiredPoints: 40000, description: "Kit com porta crachá, chaveiro de identificação e chaveiro personalizado.", imageUrl: "https://picsum.photos/seed/holderset/400/300", imageHint: "recycled accessories" }
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

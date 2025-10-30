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

const rewards = [
  { id: "reward-1", points: 1000 },
  { id: "reward-2", points: 2500 },
  { id: "reward-3", points: 5000 },
  { id: "reward-4", points: 800 },
  { id: "reward-5", points: 1500 },
  { id: "reward-6", points: 1200 },
];

export default function RewardsPage() {
  const rewardsWithData = rewards.map((reward) => {
    const placeholder = PlaceHolderImages.find((p) => p.id === reward.id);
    return { ...reward, ...placeholder };
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Resgatar Prêmios</h1>
        <p className="text-muted-foreground">
          Use seus pontos para resgatar prêmios incríveis!
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rewardsWithData.map((reward) => (
          <Card key={reward.id} className="flex flex-col">
            <CardHeader className="p-0">
              {reward.imageUrl && (
                <Image
                  src={reward.imageUrl}
                  alt={reward.description || "Prêmio"}
                  width={400}
                  height={300}
                  className="rounded-t-lg object-cover"
                  data-ai-hint={reward.imageHint}
                />
              )}
            </CardHeader>
            <CardContent className="flex-1 p-4">
              <CardTitle className="font-headline text-lg">
                {reward.description}
              </CardTitle>
              <div className="mt-2 flex items-center">
                 <Badge variant="outline" className="flex items-center gap-1 border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  <Coins className="h-4 w-4" />
                  <span>{reward.points.toLocaleString("pt-BR")} pontos</span>
                 </Badge>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button className="w-full" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                Resgatar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

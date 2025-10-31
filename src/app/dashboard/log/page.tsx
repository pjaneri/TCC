
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bot } from "lucide-react";

export default function LogRecyclingPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Nova Forma de Registrar!
          </CardTitle>
          <CardDescription>
            Estamos introduzindo uma nova maneira mais segura de registrar sua
            reciclagem usando nosso chatbot com IA.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Para garantir a validade dos registros, agora você precisará enviar uma
            foto dos itens que está reciclando. Nosso chatbot irá guiá-lo
            através do processo.
          </p>
          <Button
            onClick={() => router.push("/dashboard/recycling-chatbot")}
            className="w-full font-bold"
            size="lg"
          >
            <Bot className="mr-2 h-5 w-5" />
            Ir para o Chatbot de Reciclagem
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

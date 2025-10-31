
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import React, { useRef, useState } from 'react';
import {
  verifyRecycling,
  type VerifyRecyclingOutput,
} from '@/ai/flows/verify-recycling-flow';
import { Loader2, Camera, Send, CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useUser, useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, doc, runTransaction, serverTimestamp } from 'firebase/firestore';

const formSchema = z.object({
  description: z.string().min(10, {
    message: 'Por favor, descreva os itens e a quantidade (ex: 5 garrafas PET).',
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function RecyclingChatbotPage() {
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationResult, setVerificationResult] =
    useState<VerifyRecyclingOutput | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
    },
  });

  React.useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Acesso à câmera negado',
          description:
            'Por favor, habilite a permissão da câmera nas configurações do seu navegador.',
        });
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [toast]);

  const takePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUri = canvas.toDataURL('image/jpeg');
        setPhotoDataUri(dataUri);
      }
    }
  };

  const resetForm = () => {
    setPhotoDataUri(null);
    setVerificationResult(null);
    setIsSubmitting(false);
    form.reset();
  }

  const onSubmit = async (data: FormValues) => {
    if (!photoDataUri) {
      toast({
        variant: 'destructive',
        title: 'Foto necessária',
        description: 'Por favor, tire uma foto dos seus itens recicláveis.',
      });
      return;
    }
     if (!user || !firestore) {
      toast({ variant: "destructive", title: "Erro", description: "Você precisa estar logado." });
      return;
    }

    setIsSubmitting(true);
    setVerificationResult(null);

    try {
      const result = await verifyRecycling({
        photoDataUri,
        description: data.description,
      });
      setVerificationResult(result);

      if (result.isValid) {
        const userDocRef = doc(firestore, "users", user.uid);
        const recyclingLogColRef = collection(userDocRef, "recycling_records");
        const newRecordRef = doc(recyclingLogColRef);
        
        const newRecordData = {
          id: newRecordRef.id,
          userId: user.uid,
          materialType: result.materialType,
          quantity: -1, // Quantity is in the description
          unit: 'N/A',
          recyclingDate: serverTimestamp(),
          pointsEarned: result.pointsAwarded,
          imageUrl: photoDataUri, // For now, storing the data URI. In a real app, upload to storage first.
          description: data.description,
        };

        runTransaction(firestore, async (transaction) => {
            const userDoc = await transaction.get(userDocRef);
            if (!userDoc.exists()) {
                throw "Usuário não encontrado.";
            }

            const currentPoints = userDoc.data().totalPoints || 0;
            const newTotalPoints = currentPoints + result.pointsAwarded;
            
            transaction.update(userDocRef, { totalPoints: newTotalPoints });
            transaction.set(newRecordRef, newRecordData);
        }).catch(e => {
            const permissionError = new FirestorePermissionError({
                path: newRecordRef.path,
                operation: 'create',
                requestResourceData: newRecordData
            });
            errorEmitter.emit('permission-error', permissionError);
        });

        toast({
          title: 'Reciclagem Verificada!',
          description: `Você ganhou ${result.pointsAwarded} pontos.`,
        });
      }

    } catch (error) {
      console.error('Verification failed:', error);
      toast({
        variant: 'destructive',
        title: 'Ah, não! Algo deu errado.',
        description:
          'Não foi possível verificar sua reciclagem. Tente novamente.',
      });
      setVerificationResult({
        isValid: false,
        reason: 'Ocorreu um erro no sistema. Tente novamente mais tarde.',
        materialType: 'Desconhecido',
      })
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Chatbot de Reciclagem</CardTitle>
        <CardDescription>
          Tire uma foto, descreva seus itens e deixe nossa IA verificar sua
          reciclagem.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {hasCameraPermission === false && (
          <Alert variant="destructive">
            <AlertTitle>Acesso à Câmera Necessário</AlertTitle>
            <AlertDescription>
              Para continuar, por favor, habilite o acesso à câmera no seu
              navegador e atualize a página.
            </AlertDescription>
          </Alert>
        )}

        <div className="relative aspect-video w-full rounded-md border bg-muted">
          {photoDataUri ? (
            <img
              src={photoDataUri}
              alt="Itens recicláveis"
              className="h-full w-full rounded-md object-cover"
            />
          ) : (
             <>
              <video
                ref={videoRef}
                className="h-full w-full rounded-md object-cover"
                autoPlay
                muted
                playsInline
              />
              <canvas ref={canvasRef} className="hidden" />
             </>
          )}
        </div>

        <div className="flex justify-center gap-4">
          <Button
            onClick={takePicture}
            disabled={hasCameraPermission === false || isSubmitting}
            size="lg"
          >
            <Camera className="mr-2 h-5 w-5" />
            {photoDataUri ? 'Tirar Outra Foto' : 'Tirar Foto'}
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição dos Itens e Quantidade</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: 5 garrafas PET de 2L e 3 latas de alumínio."
                      {...field}
                      disabled={!photoDataUri || isSubmitting || verificationResult !== null}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full font-bold"
              disabled={!photoDataUri || isSubmitting || verificationResult !== null}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Verificar Reciclagem
                </>
              )}
            </Button>
          </form>
        </Form>
        
        {verificationResult && (
          <Alert variant={verificationResult.isValid ? 'default' : 'destructive'} className='mt-4 animate-fade-in-up'>
             {verificationResult.isValid ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            <AlertTitle>
              {verificationResult.isValid ? "Verificação Concluída!" : "Verificação Falhou"}
            </AlertTitle>
            <AlertDescription>
              {verificationResult.reason}
              {verificationResult.isValid && ` Você ganhou ${verificationResult.pointsAwarded} pontos.`}
            </AlertDescription>
             <div className="mt-4">
                <Button onClick={resetForm} variant="secondary" size="sm">Registrar Novo Item</Button>
            </div>
          </Alert>
        )}

      </CardContent>
    </Card>
  );
}

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, Loader2, Send, Sparkles, X, Check, FileImage, AlertTriangle } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  type VerifyRecyclingOutput,
  verifyRecycling,
} from '@/ai/flows/verify-recycling-flow';
import { errorEmitter, FirestorePermissionError, useFirestore, useUser } from '@/firebase';
import { collection, doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Image from 'next/image';

const verifyRecyclingSchema = z.object({
  description: z
    .string()
    .min(1, 'Please enter a description of what you are recycling.'),
});

type VerifyRecyclingFormValues = z.infer<typeof verifyRecyclingSchema>;

export default function VerifyRecyclingPage() {
  const { toast } = useToast();
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [isCameraInitializing, setIsCameraInitializing] = useState<boolean>(true);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [verificationResult, setVerificationResult] =
    useState<VerifyRecyclingOutput | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const photoCanvasRef = useRef<HTMLCanvasElement>(null);

  const { user } = useUser();
  const firestore = useFirestore();

  const form = useForm<VerifyRecyclingFormValues>({
    resolver: zodResolver(verifyRecyclingSchema),
    defaultValues: {
      description: '',
    },
  });

  const getCameraPermission = useCallback(async () => {
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
        title: 'Camera Access Denied',
        description:
          'Please enable camera permissions in your browser settings to use this feature.',
      });
    } finally {
      setIsCameraInitializing(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!photoDataUri) {
      getCameraPermission();
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [photoDataUri, getCameraPermission]);

  const handleTakePhoto = () => {
    if (videoRef.current && photoCanvasRef.current) {
      const video = videoRef.current;
      const canvas = photoCanvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      setPhotoDataUri(canvas.toDataURL('image/jpeg'));

      // Stop camera stream after taking photo
      if (video.srcObject) {
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoDataUri(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetCapture = () => {
    setPhotoDataUri(null);
    setVerificationResult(null);
    form.reset();
    getCameraPermission(); // Re-initialize camera
  };

  const onSubmit = async (data: VerifyRecyclingFormValues) => {
    if (!photoDataUri) {
      toast({
        variant: 'destructive',
        title: 'Nenhuma foto tirada',
        description: 'Por favor, tire uma foto dos seus itens recicláveis.',
      });
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const result = await verifyRecycling({
        photoDataUri: photoDataUri,
        description: data.description,
      });
      setVerificationResult(result);
    } catch (e: any) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Falha na Verificação por IA',
        description:
          e.message || 'A IA não pôde verificar sua submissão de reciclagem.',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleConfirmRecycling = async () => {
    if (!user || !firestore || !verificationResult || !photoDataUri) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar. Verifique se está logado e se a verificação foi concluída.",
      });
      return;
    }
    
    if (!verificationResult.isValid) {
        toast({
            variant: "destructive",
            title: "Registro Inválido",
            description: "Este registro de reciclagem não foi aprovado pela IA.",
        });
        return;
    }

    const { material, points } = verificationResult;
    const userDocRef = doc(firestore, "users", user.uid);
    const recyclingLogColRef = collection(userDocRef, "recycling_records");
    const newRecordRef = doc(recyclingLogColRef);
    
    const newRecordData = {
        id: newRecordRef.id,
        userId: user.uid,
        materialType: material,
        quantity: 1, // Assuming 1 batch from photo
        recyclingDate: serverTimestamp(),
        pointsEarned: points,
        imageUrl: photoDataUri, // Storing data URI for simplicity
        aiComment: verificationResult.comment,
    };

    try {
        await runTransaction(firestore, async (transaction) => {
            const userDoc = await transaction.get(userDocRef);
            if (!userDoc.exists()) {
                throw "Usuário não encontrado.";
            }

            const currentPoints = userDoc.data().totalPoints || 0;
            const newTotalPoints = currentPoints + points;
            
            transaction.update(userDocRef, { totalPoints: newTotalPoints });
            transaction.set(newRecordRef, newRecordData);
        });

        toast({
            title: "Reciclagem registrada!",
            description: `Você ganhou ${points} pontos.`,
        });
        resetCapture();

    } catch (e) {
         const permissionError = new FirestorePermissionError({
            path: newRecordRef.path,
            operation: 'create',
            requestResourceData: newRecordData
        });
        errorEmitter.emit('permission-error', permissionError);
        // We no longer show a toast here because the error listener will throw it globally.
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Registrar com IA</CardTitle>
        <CardDescription>
          Tire uma foto dos seus itens recicláveís para que a nossa IA possa
          verificar e recompensá-lo.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert variant="default" className="border-amber-500/50 bg-amber-50 text-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
          <AlertTriangle className="h-4 w-4 !text-amber-500" />
          <AlertTitle>Atenção</AlertTitle>
          <AlertDescription>
            Para uma verificação precisa, envie apenas <strong>um tipo de material</strong> por foto (Ex: apenas plásticos, apenas papéis).
          </AlertDescription>
        </Alert>

        <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
          {photoDataUri ? (
            <Image
              src={photoDataUri}
              alt="Recycling photo"
              layout="fill"
              objectFit="contain"
            />
          ) : (
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              autoPlay
              playsInline
              muted
            />
          )}
           {isCameraInitializing && !photoDataUri && (
             <div className="absolute inset-0 flex items-center justify-center bg-black/50">
               <Loader2 className="h-8 w-8 animate-spin text-white" />
             </div>
           )}
        </div>
        <canvas ref={photoCanvasRef} className="hidden" />
        
        {hasCameraPermission === false && !photoDataUri && (
          <div className="flex flex-col items-center gap-4 text-center">
            <Alert variant="destructive">
              <Camera className="h-4 w-4" />
              <AlertTitle>Câmera não disponível</AlertTitle>
              <AlertDescription>
                Não foi possível acessar sua câmera. Por favor, habilite a permissão no seu navegador ou envie uma foto.
              </AlertDescription>
            </Alert>
            <div className="relative">
              <Button asChild>
                <label htmlFor="file-upload">
                  <FileImage className="mr-2 h-4 w-4" /> Enviar Foto
                </label>
              </Button>
              <input id="file-upload" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
            </div>
          </div>
        )}
        
        {hasCameraPermission && !photoDataUri && (
          <Button onClick={handleTakePhoto} className="w-full">
            <Camera className="mr-2" />
            Tirar Foto
          </Button>
        )}

        {photoDataUri && !verificationResult && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>O que você está reciclando?</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: 5 garrafas PET, 3 latas de alumínio"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={resetCapture} type="button">
                  <X className="mr-2" />
                  Tirar Outra
                </Button>
                <Button type="submit" disabled={isVerifying}>
                  {isVerifying ? (
                    <Loader2 className="mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2" />
                  )}
                  Verificar com IA
                </Button>
              </div>
            </form>
          </Form>
        )}
        
        {isVerifying && (
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="font-medium">Nossa IA está analisando sua foto...</p>
                <p className="text-sm text-muted-foreground">Isso pode levar alguns segundos.</p>
            </div>
        )}

        {verificationResult && (
          <div className="space-y-4 rounded-lg border bg-card p-4 shadow-sm">
            <h3 className="font-semibold text-lg">Resultado da Verificação</h3>
            {verificationResult.isValid ? (
              <Alert variant="default" className="border-green-500 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-200 dark:border-green-700">
                <Check className="h-4 w-4 !text-green-500" />
                <AlertTitle>Reciclagem Aprovada!</AlertTitle>
                <AlertDescription>
                  Material: <strong>{verificationResult.material}</strong> | Pontos a serem ganhos: <strong>{verificationResult.points}</strong>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <X className="h-4 w-4" />
                <AlertTitle>Reciclagem Recusada</AlertTitle>
              </Alert>
            )}
            <p className="text-sm text-muted-foreground italic">
              "{verificationResult.comment}"
            </p>
            <div className="flex justify-end gap-2">
               <Button variant="outline" onClick={resetCapture}>
                <X className="mr-2" />
                Cancelar
              </Button>
              {verificationResult.isValid && (
                  <Button onClick={handleConfirmRecycling}>
                      <Send className="mr-2" />
                      Confirmar e Salvar
                  </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

    
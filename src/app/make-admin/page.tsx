
'use client';

import { useState } from 'react';
import { useUser, useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function MakeAdminPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useState(() => {
    if (user && firestore) {
      const checkAdmin = async () => {
        const adminRoleDoc = doc(firestore, 'roles_admin', user.uid);
        const docSnap = await getDoc(adminRoleDoc);
        setIsAdmin(docSnap.exists());
        setIsChecking(false);
      };
      checkAdmin();
    } else if (!isUserLoading) {
        setIsChecking(false);
    }
  });

  const handleMakeAdmin = async () => {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Você precisa estar logado para realizar esta ação.',
      });
      return;
    }

    setIsLoading(true);
    const adminRoleDoc = doc(firestore, 'roles_admin', user.uid);
    const adminData = { isAdmin: true };

    try {
      await setDoc(adminRoleDoc, adminData);
      toast({
        title: 'Sucesso!',
        description: 'Você agora é um administrador. Redirecionando...',
      });
      setIsAdmin(true);
       // Optional: redirect to admin page
      setTimeout(() => {
        window.location.href = '/admin';
      }, 2000);

    } catch (error) {
      console.error('Error making admin:', error);
       const permissionError = new FirestorePermissionError({
            path: adminRoleDoc.path,
            operation: 'create',
            requestResourceData: adminData
        });
        errorEmitter.emit('permission-error', permissionError);
      toast({
        variant: 'destructive',
        title: 'Falha na Operação',
        description: 'Você não tem permissão para se tornar um administrador.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isUserLoading || isChecking) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Card className="max-w-md text-center">
            <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2"><AlertTriangle className="text-destructive"/> Acesso Negado</CardTitle>
                <CardDescription>Você precisa estar logado para acessar esta página.</CardDescription>
            </CardHeader>
            <CardContent>
                <Link href="/login">
                    <Button>Ir para o Login</Button>
                </Link>
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <Card className="max-w-md text-center">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2"><ShieldCheck className="h-6 w-6 text-primary" /> Configuração de Administrador</CardTitle>
          <CardDescription>
            {isAdmin 
                ? 'Você já possui privilégios de administrador.' 
                : 'Clique no botão abaixo para se tornar o primeiro administrador do sistema. Esta ação é de uso único.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isAdmin ? (
             <Link href="/admin">
                <Button>Ir para o Painel do Admin</Button>
            </Link>
          ) : (
            <Button onClick={handleMakeAdmin} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Promovendo...' : 'Tornar-me Administrador'}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    
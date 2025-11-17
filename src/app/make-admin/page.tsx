
'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, AlertTriangle, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function MakeAdminPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [uidToMakeAdmin, setUidToMakeAdmin] = useState('');

  useEffect(() => {
    if (user && firestore) {
      const checkAdmin = async () => {
        setIsChecking(true);
        const adminRoleDoc = doc(firestore, 'roles_admin', user.uid);
        const docSnap = await getDoc(adminRoleDoc);
        setIsAdmin(docSnap.exists());
        setIsChecking(false);
      };
      checkAdmin();
    } else if (!isUserLoading) {
      setIsChecking(false);
    }
  }, [user, firestore, isUserLoading]);

  const handleMakeAdmin = async () => {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Você precisa estar logado para realizar esta ação.',
      });
      return;
    }
    if (!uidToMakeAdmin.trim()) {
        toast({
            variant: 'destructive',
            title: 'UID Inválido',
            description: 'Por favor, insira um UID de usuário válido.',
        });
        return;
    }

    setIsLoading(true);
    const adminRoleDoc = doc(firestore, 'roles_admin', uidToMakeAdmin);
    const adminData = { isAdmin: true, promotedBy: user.uid, promotedAt: new Date() };

    try {
      await setDoc(adminRoleDoc, adminData);
      toast({
        title: 'Sucesso!',
        description: `O usuário com UID ${uidToMakeAdmin.substring(0, 8)}... agora é um administrador.`,
      });
      
      // If the user made themselves an admin, update their local state
      if (uidToMakeAdmin === user.uid) {
        setIsAdmin(true);
      }
      setUidToMakeAdmin('');

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
        description: 'Você não tem permissão para adicionar administradores.',
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
      <Card className="w-full max-w-md">
        <CardHeader className='text-center'>
          <div className="flex justify-center">
            <ShieldCheck className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="mt-2">Promover Administrador</CardTitle>
          <CardDescription>
            {isAdmin 
                ? 'Você já é um administrador. Use o formulário abaixo para promover outros usuários.' 
                : 'Insira o UID do usuário que você deseja tornar um administrador.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
              <Label htmlFor="uid-input">UID do Usuário</Label>
              <Input 
                id="uid-input"
                placeholder="Cole o UID do usuário aqui"
                value={uidToMakeAdmin}
                onChange={(e) => setUidToMakeAdmin(e.target.value)}
              />
          </div>
          <Button onClick={handleMakeAdmin} disabled={isLoading} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Promovendo...' : 'Tornar Administrador'}
          </Button>

          {isAdmin && (
            <div className="mt-4 border-t pt-4 text-center">
                <p className="text-sm text-muted-foreground mb-2">Acesso ao seu painel:</p>
                <Link href="/admin">
                    <Button variant="outline">Ir para o Painel do Admin</Button>
                </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

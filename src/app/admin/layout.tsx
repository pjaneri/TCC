
'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Recycle } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { useUser, useFirestore } from '@/firebase';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);

  useEffect(() => {
    if (isUserLoading) {
      return;
    }
    if (!user) {
      router.replace('/login');
      return;
    }

    const checkAdminStatus = async () => {
      if (!user || !firestore) return;
      try {
        const adminRoleDoc = doc(firestore, 'roles_admin', user.uid);
        const docSnap = await getDoc(adminRoleDoc);
        if (docSnap.exists()) {
          setIsAdmin(true);
        } else {
          // If not an admin, redirect to dashboard
          router.replace('/dashboard');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        router.replace('/dashboard');
      } finally {
        setIsCheckingAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user, isUserLoading, router, firestore]);

  if (isUserLoading || isCheckingAdmin) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
            <Recycle className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    // This is a fallback, the redirect should have already happened
    return null;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
             <div className="flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <h1 className="font-headline text-xl font-semibold text-primary">
                Painel do Administrador
                </h1>
            </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">
            {children}
        </main>
    </div>
  );
}

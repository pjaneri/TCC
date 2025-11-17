'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Recycle,
  Gift,
  Star,
  PlusCircle,
  Trophy,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import rewardsData from '@/lib/placeholder-images.json';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';

const featuredRewards = rewardsData.placeholderImages.slice(0, 3);

const steps = [
  {
    icon: PlusCircle,
    title: 'Registre sua Reciclagem',
    description: 'Use nosso app para registrar os materiais que você separa.',
  },
  {
    icon: Star,
    title: 'Ganhe Pontos',
    description:
      'Cada item reciclado se transforma em pontos na sua conta Recycle+.',
  },
  {
    icon: Trophy,
    title: 'Resgate Prêmios',
    description:
      'Troque seus pontos por prêmios incríveis feitos de material reciclado.',
  },
];

export default function LandingPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <Recycle className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex items-center">
            <Recycle className="mr-2 h-6 w-6 text-primary" />
            <span className="font-bold">Recycle+</span>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
             <ThemeToggle />
            <nav className="flex items-center space-x-2">
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  'px-4'
                )}
              >
                Entrar
              </Link>
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ variant: 'default' }),
                  'font-bold'
                )}
              >
                Criar Conta
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 text-center md:py-32">
          <div
            aria-hidden="true"
            className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20"
          >
            <div className="h-56 bg-gradient-to-br from-primary to-green-300 blur-[106px] dark:from-primary/70"></div>
            <div className="h-32 bg-gradient-to-r from-green-400 to-primary/50 blur-[106px] dark:to-primary/30"></div>
          </div>
          <div className="container relative">
            <div className="mx-auto max-w-3xl">
              <Badge
                variant="secondary"
                className="mb-4 bg-primary/10 text-primary dark:bg-primary/20"
              >
                Sua Reciclagem Vale Prêmios!
              </Badge>
              <h1 className="font-headline text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                Transforme lixo em recompensas com o{' '}
                <span className="text-primary">Recycle+</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Junte-se à nossa comunidade, registre seus materiais
                recicláveis, acumule pontos e troque por produtos incríveis e
                sustentáveis.
              </p>
              <div className="mt-10 flex justify-center gap-4">
                <Link
                  href="/signup"
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'font-bold'
                  )}
                >
                  Comece a Reciclar
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="#como-funciona"
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'lg' })
                  )}
                >
                  Saber Mais
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Como Funciona Section */}
        <section id="como-funciona" className="py-16 sm:py-24">
          <div className="container">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
                Simples, Rápido e Recompensador
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Em apenas três passos, você começa a fazer a diferença e a ser
                recompensado por isso.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="rounded-xl border bg-card p-8 text-center shadow-sm transition-all hover:shadow-lg"
                >
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <step.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="mt-2 text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Prêmios Destaque Section */}
        <section className="bg-secondary py-16 sm:py-24">
          <div className="container">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
                Prêmios que Inspiram
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Veja alguns dos produtos feitos de material reciclado que você
                pode resgatar com seus pontos.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredRewards.map((reward) => (
                <Card
                  key={reward.id}
                  className="flex flex-col overflow-hidden transition-transform duration-300 ease-out hover:-translate-y-2"
                >
                  <Image
                    src={reward.imageUrl}
                    alt={reward.description}
                    width={400}
                    height={300}
                    className="aspect-[4/3] w-full object-cover"
                    data-ai-hint={reward.imageHint}
                  />
                  <CardContent className="flex flex-1 flex-col p-4">
                    <CardTitle className="font-headline text-lg">
                      {reward.name}
                    </CardTitle>
                    <CardDescription className="mt-1 flex-1">
                      {reward.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'font-bold'
                )}
              >
                Ver todos os prêmios e participar
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container flex flex-col items-center justify-center gap-4 py-8 md:flex-row">
          <div className="flex items-center gap-2">
            <Recycle className="h-5 w-5 text-primary" />
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Recycle+. Todos os direitos
              reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

    
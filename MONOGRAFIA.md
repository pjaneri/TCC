
# Monografia do Projeto Recycle+ (Componente de Software)

**Versão:** 1.0
**Data:** 24 de maio de 2024

---

## SUMÁRIO

1.  **[INTRODUÇÃO](#1-introdução)**
    *   1.1 [O Problema: O Desafio Global da Reciclagem de Plástico](#11-o-problema-o-desafio-global-da-reciclagem-de-plástico)
    *   1.2 [A Solução Proposta: Recycle+](#12-a-solução-proposta-recycle)
    *   1.3 [Colaboração Interdisciplinar: Software e Engenharia de Plásticos](#13-colaboração-interdisciplinar-software-e-engenharia-de-plásticos)
    *   1.4 [Objetivos do Projeto](#14-objetivos-do-projeto)

2.  **[ARQUITETURA E METODOLOGIA](#2-arquitetura-e-metodologia)**
    *   2.1 [Metodologia de Desenvolvimento](#21-metodologia-de-desenvolvimento)
    *   2.2 [Arquitetura de Software: Single Page Application com BaaS](#22-arquitetura-de-software-single-page-application-com-baas)
    *   2.3 [O Ecossistema Firebase como Backend](#23-o-ecossistema-firebase-como-backend)

3.  **[TECNOLOGIAS E FERRAMENTAS (STACK)](#3-tecnologias-e-ferramentas-stack)**
    *   3.1 [Frontend: A Camada de Interação](#31-frontend-a-camada-de-interação)
    *   3.2 [Backend: A Camada de Serviços](#32-backend-a-camada-de-serviços)
    *   3.3 [Linguagem e Ferramentas de Qualidade](#33-linguagem-e-ferramentas-de-qualidade)
    *   3.4 [Ambiente de Desenvolvimento e Controle de Versão](#34-ambiente-de-desenvolvimento-e-controle-de-versão)

4.  **[IMPLEMENTAÇÃO TÉCNICA](#4-implementação-técnica)**
    *   4.1 [Estrutura de Pastas do Projeto](#41-estrutura-de-pastas-do-projeto)
    *   4.2 [Modelo de Dados no Cloud Firestore](#42-modelo-de-dados-no-cloud-firestore)
    *   4.3 [Modelo de Segurança e Regras do Firestore](#43-modelo-de-segurança-e-regras-do-firestore)
    *   4.4 [Fluxos de Funcionalidades Críticas](#44-fluxos-de-funcionalidades-críticas)

5.  **[TESTES E VALIDAÇÃO](#5-testes-e-validação)**
    *   5.1 [Estratégia de Testes](#51-estratégia-de-testes)
    *   5.2 [Exemplo de Teste Unitário](#52-exemplo-de-teste-unitário)

6.  **[CONCLUSÃO](#6-conclusão)**
    *   6.1 [Resultados Alcançados](#61-resultados-alcançados)
    *   6.2 [Limitações e Trabalhos Futuros](#62-limitações-e-trabalhos-futuros)

---

## 1. INTRODUÇÃO

### 1.1 O Problema: O Desafio Global da Reciclagem de Plástico

A produção e o descarte inadequado de resíduos plásticos representam uma das crises ambientais mais significativas da era moderna. Dados globais indicam que uma fração mínima do plástico produzido é efetivamente reciclada. No Brasil, o cenário é particularmente alarmante: o país é um dos maiores produtores de lixo plástico do mundo, mas possui uma das menores taxas de reciclagem.

*   **Dados de Impacto (Exemplificativo):** Estima-se que o Brasil recicle apenas cerca de 1% a 3% das mais de 11 milhões de toneladas de plástico que consome anualmente. O restante contamina aterros sanitários, rios e oceanos, levando séculos para se decompor e causando danos irreparáveis à fauna, à flora e à saúde humana.

Um dos maiores entraves para a ampliação da reciclagem não é a falta de tecnologia, mas sim a **baixa adesão da população**. As barreiras incluem:
*   **Falta de Incentivo:** A percepção de que a reciclagem é uma tarefa trabalhosa e sem retorno direto.
*   **Desinformação:** Dificuldade em saber o que, como e onde reciclar.
*   **Desconexão de Impacto:** A dificuldade de visualizar o resultado coletivo do esforço individual.

É neste contexto que a tecnologia pode atuar como um catalisador para a mudança de comportamento.

### 1.2 A Solução Proposta: Recycle+

O projeto **Recycle+** nasce como uma solução de software para atacar diretamente a barreira do engajamento. Trata-se de uma aplicação web projetada para transformar a prática da reciclagem em uma experiência interativa, recompensadora e mensurável.

A premissa central é a aplicação do conceito de **gamificação**, que consiste no uso de mecânicas de jogos (pontos, rankings, recompensas) em contextos não lúdicos para motivar e sustentar o engajamento. Com o Recycle+, o ato de separar e registrar o lixo reciclável deixa de ser uma mera tarefa e se torna uma atividade que gera recompensas tangíveis e reconhecimento social (digital).

### 1.3 Colaboração Interdisciplinar: Software e Engenharia de Plásticos

Este projeto é fruto de uma colaboração entre duas áreas do conhecimento: **Engenharia de Software** e **Engenharia de Plásticos**.

*   A **equipe de Plásticos** trabalha na ponta física do processo: a coleta, a transformação e a criação de novos produtos a partir de material reciclado. Eles são responsáveis por dar um destino nobre ao plástico descartado, criando os prêmios (como vasos, chaveiros e utensílios) que materializam o valor da reciclagem.
*   A **equipe de Software** (responsável por este documento) desenvolveu a plataforma digital que conecta o usuário final a este processo. O Recycle+ funciona como a interface de engajamento, o motor que incentiva a coleta da matéria-prima (o plástico) que a equipe de Plásticos irá processar.

A sinergia é clara: sem a plataforma digital, o engajamento em larga escala é um desafio; sem o processo físico de reciclagem, os pontos acumulados na plataforma não teriam valor real.

### 1.4 Objetivos do Projeto

#### 1.4.1 Objetivo Geral

Desenvolver uma aplicação web funcional e escalável (Recycle+) que utilize a gamificação para incentivar e aumentar a taxa de reciclagem de plástico, servindo como ponte digital entre o cidadão e o processo de transformação do material.

#### 1.4.2 Objetivos Específicos (Componente de Software)

*   **Implementar um sistema de autenticação seguro** para gerenciamento de contas de usuário.
*   **Construir um módulo intuitivo para o registro** de atividades de reciclagem.
*   **Desenvolver um sistema de pontuação e ranking** para gamificar a experiência.
*   **Criar um catálogo de recompensas** onde os pontos podem ser trocados por produtos físicos (criados pela equipe de Plásticos).
*   **Garantir a privacidade e a segurança dos dados** do usuário através de regras de acesso estritas.

---

## 2. ARQUITETURA E METODOLOGIA

### 2.1 Metodologia de Desenvolvimento

A construção do Recycle+ adotou uma metodologia de **Desenvolvimento Incremental e Iterativo**, inspirada em princípios ágeis. Esta abordagem permitiu flexibilidade e entrega contínua de valor.

*   **Ciclo de Vida Iterativo:** O projeto foi decomposto em módulos funcionais (Autenticação, Perfil, Registro, etc.), que foram desenvolvidos em ciclos curtos (iterações). Cada iteração passou por fases de planejamento, desenvolvimento, teste e refinamento, permitindo ajustes constantes com base em validações parciais.
*   **Foco no MVP (Produto Mínimo Viável):** A estratégia inicial visou entregar um núcleo funcional da aplicação o mais rápido possível, contendo as funcionalidades essenciais (cadastro, login, registro de pontos). Isso validou a arquitetura técnica e a proposta de valor, criando uma base sólida para as iterações seguintes.

### 2.2 Arquitetura de Software: Single Page Application com BaaS

A arquitetura do Recycle+ é baseada em uma **Single Page Application (SPA)** com um backend desacoplado, fornecido por uma plataforma de **Backend-as-a-Service (BaaS)**.

*   **Single Page Application (Frontend):** A aplicação é renderizada em uma única página HTML. O conteúdo é atualizado dinamicamente via JavaScript conforme o usuário navega, eliminando a necessidade de recarregar a página a cada interação. Isso resulta em uma experiência de usuário mais rápida e fluida, semelhante à de um aplicativo nativo.
*   **Backend-as-a-Service (Backend):** Em vez de construir e gerenciar nossos próprios servidores, utilizamos serviços de backend prontos e escaláveis. Esta abordagem acelera o desenvolvimento, reduz custos operacionais e delega a complexidade de gerenciamento de infraestrutura a um provedor especializado.

### 2.3 O Ecossistema Firebase como Backend

A plataforma escolhida para atuar como nosso BaaS foi o **Firebase**, do Google. A escolha se deu por sua robustez, escalabilidade e ecossistema integrado de serviços.

*   **Firebase Authentication:** Utilizado para toda a gestão de identidade, oferecendo um sistema de login seguro e pronto para uso (e-mail/senha e Google Sign-In).
*   **Cloud Firestore:** Nosso banco de dados NoSQL, orientado a documentos. Ele armazena todos os dados da aplicação (perfis, registros, etc.) e oferece sincronização em tempo real, essencial para atualizar a pontuação do usuário instantaneamente.
*   **Firebase Security Rules:** Camada de autorização que protege o banco de dados, garantindo que um usuário só possa acessar e modificar seus próprios dados.

---

## 3. TECNOLOGIAS E FERRAMENTAS (STACK)

O stack tecnológico é o conjunto de tecnologias, frameworks e linguagens utilizadas para construir a aplicação.

### 3.1 Frontend: A Camada de Interação

*   **Next.js:** Framework React que serve como a estrutura principal da aplicação. Foi escolhido por seu sistema de roteamento (App Router), otimizações de performance (Server Components) e excelente experiência de desenvolvimento.
*   **React:** Biblioteca JavaScript para a construção de interfaces de usuário baseadas em componentes. É o núcleo da nossa camada de visualização, permitindo a criação de uma UI interativa e reutilizável.
*   **Tailwind CSS & ShadCN/UI:** Para a estilização, utilizamos o framework "utility-first" Tailwind CSS, que permite criar designs consistentes rapidamente. Sobre ele, usamos a biblioteca de componentes ShadCN/UI, que nos forneceu componentes React acessíveis e customizáveis (Cards, Buttons, Dialogs).

### 3.2 Backend: A Camada de Serviços

*   **Firebase SDK:** A biblioteca cliente (`firebase`) que permite a comunicação segura e direta entre nosso frontend (Next.js) e os serviços do Firebase (Authentication e Firestore).

### 3.3 Linguagem e Ferramentas de Qualidade

*   **TypeScript:** Um superset de JavaScript que adiciona tipagem estática. Foi a linguagem principal do projeto, garantindo a robustez, a manutenibilidade e a prevenção de erros em tempo de desenvolvimento.
*   **Zod & React Hook Form:** Utilizados para a validação de formulários. O Zod permite a criação de esquemas de validação de dados, garantindo que as entradas do usuário (como quantidade de material reciclado) estejam no formato correto antes de serem enviadas.
*   **Jest & React Testing Library:** Ferramentas para a implementação de testes unitários automatizados, garantindo a qualidade e a confiabilidade dos componentes da UI.

### 3.4 Ambiente de Desenvolvimento e Controle de Versão

*   **Visual Studio Code:** O principal editor de código utilizado.
*   **GitHub:** Utilizado como sistema de controle de versão para o código-fonte, permitindo o trabalho colaborativo e o rastreamento de todas as alterações no projeto.

---

## 4. IMPLEMENTAÇÃO TÉCNICA

### 4.1 Estrutura de Pastas do Projeto

A estrutura de diretórios foi organizada para promover a modularidade e seguir as convenções do Next.js App Router:

```
/
├── public/                # Arquivos estáticos (imagens, manifest.json)
├── src/
│   ├── app/               # Rotas e páginas da aplicação
│   │   ├── dashboard/     # Páginas do painel do usuário (protegidas)
│   │   ├── login/         # Página de login
│   │   ├── signup/        # Página de cadastro
│   │   ├── layout.tsx     # Layout raiz da aplicação
│   │   └── page.tsx       # Página inicial (Landing Page)
│   │
│   ├── components/        # Componentes React reutilizáveis
│   │   └── ui/            # Componentes base da biblioteca ShadCN/UI
│   │
│   ├── firebase/          # Arquivos de configuração e hooks do Firebase
│   │   ├── config.ts      # Configuração de conexão com o Firebase
│   │   └── provider.tsx   # Provedor de contexto para os serviços Firebase
│   │
│   ├── hooks/             # Hooks React customizados
│   │
│   └── lib/               # Funções utilitárias e constantes
│
├── firestore.rules        # Regras de segurança do Cloud Firestore
├── next.config.ts         # Configurações do Next.js
└── package.json           # Dependências e scripts do projeto
```

### 4.2 Modelo de Dados no Cloud Firestore

Os dados no Firestore são armazenados em coleções e documentos. A estrutura foi desenhada para ser segura e escalável:

*   **`/users/{userId}`** (Coleção `users`)
    *   Documento que armazena o perfil de um usuário específico.
    *   **Campos:** `username`, `email`, `registrationDate`, `totalPoints` (para resgate), `lifetimePoints` (para ranking).
    *   Este documento é o "pai" dos dados daquele usuário.

*   **`/users/{userId}/recycling_records/{recordId}`** (Subcoleção `recycling_records`)
    *   Cada documento representa um registro de reciclagem feito pelo usuário.
    *   **Campos:** `materialType`, `quantity`, `pointsEarned`, `recyclingDate`.
    *   Aninhar esta coleção garante que os registros só possam ser acessados através do documento do usuário, simplificando as regras de segurança.

*   **`/users/{userId}/redemptions/{redemptionId}`** (Subcoleção `redemptions`)
    *   Cada documento representa um resgate de prêmio.
    *   **Campos:** `rewardName`, `pointsDeducted`, `redemptionDate`.

*   **`/rewards/{rewardId}`** (Coleção `rewards`)
    *   Coleção global (pública) que armazena os prêmios disponíveis.
    *   **Campos:** `name`, `description`, `requiredPoints`, `imageUrl`.

### 4.3 Modelo de Segurança e Regras do Firestore

A segurança é o pilar da nossa arquitetura de dados. O arquivo `firestore.rules` define as permissões de acesso:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // REGRA 1: Um usuário só pode ler e escrever em seu próprio perfil.
    match /users/{userId} {
      allow read, update, delete: if request.auth.uid == userId;
      allow create: if request.auth.uid == userId;
    }

    // REGRA 2: Um usuário só pode criar, ler e apagar seus próprios registros.
    match /users/{userId}/recycling_records/{recordId} {
      allow list, create, delete: if request.auth.uid == userId;
      // Atualizações são proibidas para manter a imutabilidade do registro.
      allow update: if false;
    }

    // REGRA 3: A coleção de prêmios é de leitura pública.
    match /rewards/{rewardId} {
      allow get, list: if true;
      // Ninguém pode modificar os prêmios pelo lado do cliente.
      allow write: if false;
    }
  }
}
```
Este modelo garante que, mesmo que um usuário mal-intencionado tente manipular o código do frontend, o servidor do Firebase bloqueará qualquer tentativa de acesso a dados que não lhe pertencem.

### 4.4 Fluxos de Funcionalidades Críticas

#### 4.4.1 Fluxo de Registro de Reciclagem

1.  **Interação do Usuário:** O usuário preenche a quantidade de um material na página "Registrar Reciclagem" e clica no botão "Registrar".
2.  **Frontend (React):** O formulário valida os dados (a quantidade deve ser maior que zero).
3.  **Transação no Firestore:** Uma **transação atômica** é iniciada. Isso garante que as duas operações a seguir aconteçam com sucesso, ou nenhuma delas acontece.
    a.  **Atualização de Pontos:** O documento do usuário em `/users/{userId}` é lido, os pontos são calculados e os campos `totalPoints` e `lifetimePoints` são incrementados.
    b.  **Criação de Registro:** Um novo documento é criado na subcoleção `/users/{userId}/recycling_records` com os detalhes da reciclagem.
4.  **Feedback ao Usuário:** A interface exibe uma notificação de sucesso ("Toast") e os pontos na tela são atualizados em tempo real, graças à sincronização do Firestore.

#### 4.4.2 Fluxo de Resgate de Prêmio

1.  **Interação do Usuário:** O usuário clica em "Resgatar" em um prêmio para o qual possui pontos suficientes.
2.  **Frontend (React):** Uma caixa de diálogo de confirmação é exibida.
3.  **Transação no Firestore:** Se confirmado, uma transação atômica é iniciada:
    a.  **Validação e Dedução de Pontos:** O documento do usuário é lido para verificar se ele ainda tem pontos suficientes. Se sim, os pontos do prêmio são deduzidos do campo `totalPoints`. O `lifetimePoints` não é alterado.
    b.  **Criação de Histórico:** Um novo documento é criado na subcoleção `/users/{userId}/redemptions` para registrar o resgate.
4.  **Feedback ao Usuário:** O usuário recebe uma notificação de sucesso e sua pontuação de resgate é atualizada na tela.

---

## 5. TESTES E VALIDAÇÃO

### 5.1 Estratégia de Testes

Para garantir a qualidade do software, foi planejada uma estratégia de testes focada em **testes de unidade automatizados**. O objetivo é validar o comportamento de componentes individuais da interface (UI) de forma isolada, garantindo que eles se comportem conforme o esperado.

### 5.2 Exemplo de Teste Unitário

Utilizando **Jest** e **React Testing Library**, criamos testes para os componentes base da nossa UI. Abaixo, um exemplo de caso de teste para o componente `Button`:

*   **Arquivo:** `src/components/ui/__tests__/Button.test.tsx`
*   **ID do Teste:** CT01
*   **Requisito:** N/A (Teste de componente base)
*   **Descrição:** Verificar se o componente `Button` é renderizado corretamente com o texto fornecido.
*   **Procedimento (Automatizado):**
    1.  O teste renderiza o componente `<Button>` passando um texto (ex: "Clique Aqui").
    2.  Busca na árvore de elementos renderizada por um elemento com o `role` "button" e o nome acessível "Clique Aqui".
*   **Resultado Esperado:** O elemento do botão deve ser encontrado no documento virtual.
*   **Critério de Aceite:** O teste passa se a asserção `expect(buttonElement).toBeInTheDocument()` for verdadeira.

Este processo, executado pelo comando `npm test`, serve como um modelo para a criação de outros testes unitários para componentes mais complexos do sistema.

---

## 6. CONCLUSÃO

### 6.1 Resultados Alcançados

O componente de software do projeto Recycle+ foi concluído com sucesso, resultando em uma aplicação web funcional, segura e escalável, que atende a todos os requisitos funcionais e não funcionais definidos. A plataforma desenvolvida é capaz de gerenciar usuários, registrar atividades de reciclagem, atribuir pontos e permitir o resgate de recompensas, constituindo uma prova de conceito robusta para a gamificação como ferramenta de incentivo a práticas sustentáveis.

### 6.2 Limitações e Trabalhos Futuros

*   **Validação Física:** O sistema atual opera com base na autodeclaração do usuário, não havendo um mecanismo de validação física dos materiais reciclados. Uma evolução futura poderia integrar o sistema com pontos de coleta ou cooperativas que validariam o registro via QR Code.
*   **Logística de Entrega:** A aplicação gerencia o resgate de prêmios, mas não a logística de entrega. Futuramente, poderia ser integrado um sistema para notificar a equipe de Plásticos sobre os resgates para que a entrega seja efetuada.
*   **Funcionalidades Sociais:** Expansão das funcionalidades de gamificação, com a criação de rankings entre amigos, desafios comunitários e compartilhamento de conquistas em redes sociais, para potencializar o engajamento.

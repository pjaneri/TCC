# Monografia do Projeto: Recycle+ (Componente de Software)

**Versão:** 2.0
**Data:** 24 de maio de 2024

---

## SUMÁRIO

1.  **[INTRODUÇÃO](#1-introdução)**
    *   1.1 [Contextualização: O Desafio Global da Reciclagem de Plástico](#11-contextualização-o-desafio-global-da-reciclagem-de-plástico)
    *   1.2 [A Solução Proposta: A Aplicação Recycle+](#12-a-solução-proposta-a-aplicação-recycle)
    *   1.3 [Colaboração Interdisciplinar: A Sinergia entre Software e Engenharia de Plásticos](#13-colaboração-interdisciplinar-a-sinergia-entre-software-e-engenharia-de-plásticos)
    *   1.4 [Objetivos do Projeto](#14-objetivos-do-projeto)

2.  **[ENGENHARIA DE REQUISITOS](#2-engenharia-de-requisitos)**
    *   2.1 [Diagrama de Casos de Uso](#21-diagrama-de-casos-de-uso)
    *   2.2 [Requisitos Funcionais (RF)](#22-requisitos-funcionais-rf)
    *   2.3 [Requisitos Não Funcionais (RNF)](#23-requisitos-não-funcionais-rnf)

3.  **[METODOLOGIA E GESTÃO DO PROJETO](#3-metodologia-e-gestão-do-projeto)**
    *   3.1 [Metodologia de Desenvolvimento: Iterativa e Incremental](#31-metodologia-de-desenvolvimento-iterativa-e-incremental)
    *   3.2 [Ferramentas de Gestão e Comunicação: Trello](#32-ferramentas-de-gestão-e-comunicação-trello)
    *   3.3 [Controle de Versão: Git e GitHub](#33-controle-de-versão-git-e-github)

4.  **[ARQUITETURA DE SOFTWARE E TECNOLOGIAS](#4-arquitetura-de-software-e-tecnologias)**
    *   4.1 [Arquitetura: Single Page Application com Backend-as-a-Service (BaaS)](#41-arquitetura-single-page-application-com-backend-as-a-service-baas)
    *   4.2 [Backend-as-a-Service: A Plataforma Firebase](#42-backend-as-a-service-a-plataforma-firebase)
    *   4.3 [Frontend: Stack de Tecnologias](#43-frontend-stack-de-tecnologias)
    *   4.4 [Linguagem e Ferramentas de Qualidade](#44-linguagem-e-ferramentas-de-qualidade)

5.  **[IMPLEMENTAÇÃO TÉCNICA DETALHADA](#5-implementação-técnica-detalhada)**
    *   5.1 [Estrutura de Pastas do Projeto](#51-estrutura-de-pastas-do-projeto)
    *   5.2 [Modelo de Dados no Cloud Firestore](#52-modelo-de-dados-no-cloud-firestore)
    *   5.3 [Modelo de Segurança e Regras do Firestore](#53-modelo-de-segurança-e-regras-do-firestore)
    *   5.4 [Fluxos de Funcionalidades Críticas](#54-fluxos-de-funcionalidades-críticas)

6.  **[TESTES E VALIDAÇÃO](#6-testes-e-validação)**
    *   6.1 [Estratégia de Testes: Testes de Unidade](#61-estratégia-de-testes-testes-de-unidade)
    *   6.2 [Ferramentas de Teste: Jest e React Testing Library](#62-ferramentas-de-teste-jest-e-react-testing-library)
    *   6.3 [Exemplo de Caso de Teste](#63-exemplo-de-caso-de-teste)

7.  **[CONCLUSÃO](#7-conclusão)**
    *   7.1 [Resultados Alcançados](#71-resultados-alcançados)
    *   7.2 [Limitações do Projeto](#72-limitações-do-projeto)
    *   7.3 [Trabalhos Futuros e Evolução](#73-trabalhos-futuros-e-evolução)

---

## 1. INTRODUÇÃO

### 1.1 Contextualização: O Desafio Global da Reciclagem de Plástico

A proliferação de resíduos plásticos constitui uma das crises ambientais mais prementes da contemporaneidade. A produção em massa de plásticos, aliada a um ciclo de vida de consumo rápido e descarte inadequado, resulta em um acúmulo exponencial de poluição em ecossistemas terrestres e marinhos. O Brasil, como um dos maiores produtores de lixo plástico do mundo, enfrenta um cenário particularmente desafiador: dados indicam que a taxa nacional de reciclagem de plástico é alarmantemente baixa, estimada em apenas 1 a 3% do volume total consumido.

Este déficit não se deve primordialmente à ausência de tecnologia para o reprocessamento do material, mas sim a uma complexa barreira socioeconômica e cultural: a **baixa adesão da população** ao processo de separação e descarte seletivo. Os principais obstáculos identificados são:
*   **Falta de Incentivo Direto:** A percepção de que a reciclagem é um esforço sem recompensa tangível imediata.
*   **Desinformação Estrutural:** A dificuldade de acesso a informações claras sobre o que é reciclável, como separar corretamente e onde descartar.
*   **Desconexão de Impacto:** A incapacidade de visualizar o resultado coletivo e o valor gerado a partir do esforço individual, tornando a ação de reciclar abstrata.

Neste contexto, a tecnologia da informação emerge como um vetor estratégico para catalisar a mudança de comportamento e fomentar o engajamento cívico.

### 1.2 A Solução Proposta: A Aplicação Recycle+

O projeto **Recycle+** foi concebido como uma solução de software para atacar diretamente a barreira do engajamento populacional. Trata-se de uma aplicação web (Single Page Application) que emprega o conceito de **gamificação** — a aplicação de mecânicas de jogos, como pontos, rankings e recompensas, em contextos não lúdicos — para transformar a prática da reciclagem em uma experiência interativa, mensurável e recompensadora.

A premissa é simples, mas poderosa: ao permitir que o usuário registre suas atividades de reciclagem e receba pontos por isso, o Recycle+ converte uma tarefa cívica em uma jornada gratificante. Os pontos acumulados podem ser trocados por produtos reais, criando um ciclo virtuoso onde o descarte correto de um resíduo gera valor tangível para o indivíduo e matéria-prima para a indústria de reciclagem.

### 1.3 Colaboração Interdisciplinar: A Sinergia entre Software e Engenharia de Plásticos

Este projeto é o resultado de uma colaboração simbiótica entre duas áreas do conhecimento: **Engenharia de Software** e **Engenharia de Plásticos**. A interdependência das duas frentes é o que torna a solução completa.

*   A **equipe de Engenharia de Plásticos** atua na ponta física do processo: a logística de coleta do material, seu processamento e a transformação em novos produtos. São eles que dão um destino nobre ao plástico descartado, fabricando os próprios prêmios (vasos, chaveiros, utensílios, etc.) que materializam o valor da reciclagem.
*   A **equipe de Engenharia de Software** (responsável por este documento) desenvolveu a plataforma digital que serve como ponte entre o cidadão e este processo de transformação. O Recycle+ é a interface de engajamento, o motor que incentiva a coleta da matéria-prima que alimenta a operação da equipe de Plásticos.

A sinergia é clara: sem a plataforma digital, o engajamento em larga escala e a coleta consistente de matéria-prima seriam um desafio logístico e social. Sem o processo físico de reciclagem e a criação de recompensas, os pontos acumulados na plataforma não teriam valor real, esvaziando o propósito da gamificação.

### 1.4 Objetivos do Projeto

#### 1.4.1 Objetivo Geral

Desenvolver uma aplicação web funcional, escalável e segura que utilize a gamificação para incentivar e aumentar a adesão da população à prática da reciclagem de plástico, servindo como uma ponte digital entre o esforço individual do cidadão e o processo de transformação física do material.

#### 1.4.2 Objetivos Específicos (Componente de Software)

*   **Implementar um sistema de autenticação de usuários** seguro e flexível, suportando cadastro por e-mail/senha e login federado via Google.
*   **Construir um módulo intuitivo para o registro** de atividades de reciclagem, com feedback imediato de pontuação.
*   **Desenvolver um sistema de pontuação e ranking (patentes)** para gamificar a experiência e estimular a competição saudável e o progresso contínuo.
*   **Criar um catálogo de recompensas** onde os pontos podem ser trocados por produtos físicos, fechando o ciclo de valor da reciclagem.
*   **Garantir a privacidade e a segurança dos dados do usuário** através da implementação de regras de acesso estritas no backend (Firebase Security Rules).
*   **Assegurar uma arquitetura de software manutenível e escalável**, que permita a evolução futura da plataforma.

---

## 2. ENGENHARIA DE REQUISITOS

### 2.1 Diagrama de Casos de Uso

O diagrama abaixo ilustra as principais interações do usuário com o sistema Recycle+, definindo as funcionalidades centrais da aplicação a partir da perspectiva do ator "Usuário".

![Diagrama de Casos de Uso do Recycle+](https://storage.googleapis.com/studiopbf-public/tcc-diagram.png)

*   **Ações de Gestão de Conta:** O usuário pode se cadastrar, fazer login, recuperar sua senha e sair (logout).
*   **Ações Pós-Autenticação:** Uma vez logado, o usuário pode acessar as funcionalidades principais do sistema: registrar material reciclado, consultar sua pontuação, trocar pontos por recompensas e visualizar seu histórico de atividades.

### 2.2 Requisitos Funcionais (RF)

Definem o que o sistema deve fazer, especificando suas funcionalidades.

*   **RF01: Autenticação de Usuários:**
    *   **RF01.1:** Permitir cadastro de novos usuários com nome de usuário, e-mail e senha.
    *   **RF01.2:** Permitir login com e-mail/senha e login federado via Google.
    *   **RF01.3:** Gerenciar a sessão do usuário, permitindo o logout.
    *   **RF01.4:** Restringir o acesso às páginas do painel (dashboard) apenas para usuários autenticados.

*   **RF02: Gerenciamento de Perfil:**
    *   **RF02.1:** Permitir ao usuário visualizar e atualizar suas informações de perfil (nome, data de nascimento).
    *   **RF02.2:** Permitir a alteração de senha (para contas de e-mail/senha).
    *   **RF02.3:** Permitir ao usuário resetar sua pontuação de resgate.

*   **RF03: Registro de Reciclagem:**
    *   **RF03.1:** Permitir ao usuário registrar a quantidade de diferentes tipos de materiais reciclados.
    *   **RF03.2:** Creditar pontos de forma imediata ao `totalPoints` (para resgate) e `lifetimePoints` (para ranking) após o registro.
    *   **RF03.3:** Exibir um histórico de atividades recentes no painel.
    *   **RF03.4:** Permitir a exclusão de atividades com a devida reversão de pontos.

*   **RF04: Sistema de Recompensas:**
    *   **RF04.1:** Exibir um catálogo de prêmios com seus respectivos custos em pontos.
    *   **RF04.2:** Permitir ao usuário resgatar um prêmio, deduzindo os pontos do `totalPoints`.

*   **RF05: Sistema de Gamificação (Ranking):**
    *   **RF05.1:** Exibir a patente (ranking) atual do usuário com base no `lifetimePoints`.
    *   **RF05.2:** Mostrar o progresso para a próxima patente.

### 2.3 Requisitos Não Funcionais (RNF)

Definem como o sistema deve operar, estabelecendo critérios de qualidade.

*   **RNF01: Usabilidade:** A interface do usuário (UI) deve ser intuitiva, clara e de fácil utilização em dispositivos desktop e móveis (responsividade).
*   **RNF02: Performance:** A aplicação deve ter tempos de carregamento rápidos e interações fluidas, com otimizações de renderização no servidor.
*   **RNF03: Segurança:** Os dados dos usuários devem ser protegidos contra acesso não autorizado. A comunicação cliente-servidor deve ser criptografada (HTTPS). As senhas devem ser armazenadas de forma segura (hashing).
*   **RNF04: Manutenibilidade:** O código-fonte deve ser modular, organizado e documentado para facilitar futuras manutenções e evoluções.
*   **RNF05: Escalabilidade:** A arquitetura de backend (Firebase) deve ser capaz de suportar um aumento no número de usuários sem degradação significativa de performance.

---

## 3. METODOLOGIA E GESTÃO DO PROJETO

### 3.1 Metodologia de Desenvolvimento: Iterativa e Incremental

O desenvolvimento do Recycle+ adotou uma metodologia de **Desenvolvimento Incremental e Iterativo**, inspirada em princípios ágeis. Esta abordagem foi escolhida por sua flexibilidade e capacidade de entregar valor de forma contínua.

*   **Ciclo de Vida Iterativo:** O projeto foi decomposto em módulos funcionais (Autenticação, Perfil, Registro, etc.). Cada módulo foi desenvolvido em ciclos curtos (iterações), passando por fases de planejamento, desenvolvimento, teste e refinamento. Isso permitiu ajustes constantes com base em validações parciais.
*   **Foco no MVP (Produto Mínimo Viável):** A estratégia inicial visou entregar um núcleo funcional da aplicação o mais rápido possível, validando a arquitetura técnica e a proposta de valor.

### 3.2 Ferramentas de Gestão e Comunicação: Trello

Para a organização das tarefas, o acompanhamento do progresso e a colaboração entre os membros da equipe de software, foi utilizada a ferramenta **Trello**. Um quadro Kanban foi estruturado com as seguintes colunas:
*   **Backlog:** Lista de todas as funcionalidades e tarefas a serem feitas.
*   **To Do (A Fazer):** Tarefas priorizadas para a iteração atual.
*   **In Progress (Em Andamento):** Tarefas que estão sendo desenvolvidas ativamente.
*   **Done (Concluído):** Tarefas finalizadas e validadas.
Esta abordagem visual facilitou o gerenciamento do fluxo de trabalho e garantiu a transparência sobre o status do projeto.

### 3.3 Controle de Versão: Git e GitHub

O controle de versão do código-fonte foi gerenciado com **Git**, e o repositório central foi hospedado no **GitHub**. Esta combinação permitiu um trabalho colaborativo eficiente, o rastreamento de todas as alterações, a criação de branches para novas funcionalidades e a fusão segura de código.

---

## 4. ARQUITETURA DE SOFTWARE E TECNOLOGIAS

### 4.1 Arquitetura: Single Page Application com Backend-as-a-Service (BaaS)

A arquitetura do Recycle+ é baseada em uma **Single Page Application (SPA)** com um backend desacoplado, fornecido por uma plataforma de **Backend-as-a-Service (BaaS)**.

*   **Single Page Application (Frontend):** A aplicação é renderizada em uma única página HTML. O conteúdo é atualizado dinamicamente via JavaScript, proporcionando uma experiência de usuário mais rápida e fluida.
*   **Backend-as-a-Service (Backend):** Em vez de construir e gerenciar servidores próprios, utilizamos serviços de backend prontos e escaláveis. Esta abordagem acelera o desenvolvimento e delega a complexidade de infraestrutura a um provedor especializado.

### 4.2 Backend-as-a-Service: A Plataforma Firebase

A plataforma escolhida foi o **Firebase**, do Google, por sua robustez, escalabilidade e ecossistema integrado.
*   **Firebase Authentication:** Utilizado para toda a gestão de identidade.
*   **Cloud Firestore:** Nosso banco de dados NoSQL orientado a documentos.
*   **Firebase Security Rules:** Camada de autorização que protege o banco de dados.

### 4.3 Frontend: Stack de Tecnologias

*   **Next.js:** Framework React que serve como a estrutura principal da aplicação, escolhido por seu sistema de roteamento (App Router) e otimizações de performance (Server Components).
*   **React:** Biblioteca JavaScript para a construção de interfaces de usuário baseadas em componentes.
*   **Tailwind CSS & ShadCN/UI:** Para a estilização, utilizamos o framework "utility-first" Tailwind CSS e a biblioteca de componentes ShadCN/UI.

### 4.4 Linguagem e Ferramentas de Qualidade

*   **TypeScript:** Superset de JavaScript que adiciona tipagem estática, garantindo a robustez e a prevenção de erros.
*   **Zod & React Hook Form:** Utilizados para a validação de formulários, garantindo a integridade dos dados de entrada do usuário.

---

## 5. IMPLEMENTAÇÃO TÉCNICA DETALHADA

### 5.1 Estrutura de Pastas do Projeto

A estrutura de diretórios foi organizada para promover a modularidade e seguir as convenções do Next.js App Router:

```
/
├── public/                # Arquivos estáticos (imagens, ícones)
├── src/
│   ├── app/               # Rotas e páginas da aplicação (App Router)
│   │   ├── dashboard/     # Páginas do painel do usuário (protegidas)
│   │   ├── login/         # Página de login
│   │   ├── signup/        # Página de cadastro
│   │   ├── layout.tsx     # Layout raiz da aplicação
│   │   └── page.tsx       # Página inicial (Landing Page)
│   │
│   ├── components/        # Componentes React reutilizáveis
│   │   └── ui/            # Componentes base da biblioteca ShadCN/UI
│   │
│   ├── firebase/          # Configuração, hooks e provedores do Firebase
│   │   ├── config.ts      # Chaves de configuração do Firebase
│   │   └── provider.tsx   # Provedor de contexto para os serviços Firebase
│   │
│   ├── hooks/             # Hooks React customizados (ex: use-toast)
│   │
│   └── lib/               # Funções utilitárias e constantes
│
├── firestore.rules        # Regras de segurança do Cloud Firestore
├── next.config.ts         # Configurações do Next.js
└── package.json           # Dependências e scripts do projeto
```

### 5.2 Modelo de Dados no Cloud Firestore

A estrutura de dados foi desenhada para ser segura e escalável:

*   **Coleção `/users/{userId}`:**
    *   Armazena o perfil de um usuário.
    *   Campos: `username`, `email`, `registrationDate`, `totalPoints`, `lifetimePoints`.

*   **Subcoleção `/users/{userId}/recycling_records/{recordId}`:**
    *   Armazena os registros de reciclagem de um usuário.
    *   Campos: `materialType`, `quantity`, `pointsEarned`, `recyclingDate`.

*   **Subcoleção `/users/{userId}/redemptions/{redemptionId}`:**
    *   Armazena o histórico de resgates de prêmios.
    *   Campos: `rewardName`, `pointsDeducted`, `redemptionDate`.

### 5.3 Modelo de Segurança e Regras do Firestore

A segurança é garantida pelo arquivo `firestore.rules`, que define as permissões de acesso:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // REGRA 1: Um usuário só pode ler e escrever em seu próprio perfil.
    match /users/{userId} {
      allow read, update, delete: if request.auth.uid == userId;
      allow create: if request.auth.uid == userId;
    }

    // REGRA 2: Um usuário só pode gerenciar seus próprios registros de reciclagem e resgate.
    match /users/{userId}/{subcollection}/{docId} {
      allow list, create, delete: if request.auth.uid == userId;
      allow update: if false; // Registros são imutáveis
    }

    // REGRA 3 (Exemplo): Coleção de prêmios pode ser de leitura pública.
    // match /rewards/{rewardId} {
    //   allow get, list: if true;
    //   allow write: if false; // Apenas admin pode escrever
    // }
  }
}
```
Este modelo assegura que, mesmo que um usuário mal-intencionado tente manipular o código do frontend, o servidor do Firebase bloqueará qualquer acesso indevido.

### 5.4 Fluxos de Funcionalidades Críticas

#### 5.4.1 Fluxo de Registro de Reciclagem

1.  **Interação do Usuário:** O usuário preenche o formulário na página "Registrar Reciclagem" e clica em "Registrar".
2.  **Validação no Frontend:** O formulário (React Hook Form + Zod) valida os dados.
3.  **Transação no Firestore:** Uma **transação atômica** é iniciada para garantir a consistência dos dados.
    a.  **Atualização de Pontos:** O documento do usuário em `/users/{userId}` é lido, e os campos `totalPoints` e `lifetimePoints` são incrementados.
    b.  **Criação de Registro:** Um novo documento é criado na subcoleção `/users/{userId}/recycling_records`.
4.  **Feedback ao Usuário:** A interface exibe uma notificação de sucesso e os pontos na tela são atualizados em tempo real.

#### 5.4.2 Fluxo de Resgate de Prêmio

1.  **Interação do Usuário:** O usuário clica em "Resgatar" em um prêmio para o qual possui pontos suficientes.
2.  **Validação no Frontend:** O sistema verifica se `user.totalPoints >= reward.requiredPoints`.
3.  **Transação no Firestore:** Se confirmado, uma transação atômica é iniciada:
    a.  **Validação e Dedução de Pontos:** O documento do usuário é lido novamente para garantir que os pontos ainda são suficientes. Se sim, os pontos do prêmio são deduzidos do campo `totalPoints`.
    b.  **Criação de Histórico:** Um novo documento é criado em `/users/{userId}/redemptions`.
4.  **Feedback ao Usuário:** O usuário recebe uma notificação de sucesso, e sua pontuação de resgate é atualizada na tela.

---

## 6. TESTES E VALIDAÇÃO

### 6.1 Estratégia de Testes: Testes de Unidade

A estratégia de testes foi focada em **testes de unidade automatizados** para validar o comportamento de componentes individuais da UI de forma isolada.

### 6.2 Ferramentas de Teste: Jest e React Testing Library

*   **Jest:** Framework de testes para executar os testes, fazer asserções e criar mocks.
*   **React Testing Library:** Biblioteca para testar componentes React da perspectiva do usuário.

### 6.3 Exemplo de Caso de Teste

*   **Arquivo:** `src/components/ui/__tests__/Button.test.tsx`
*   **Descrição:** Verificar se o componente `Button` é renderizado corretamente e se aceita o estado `disabled`.
*   **Procedimento (Automatizado):** O teste renderiza o componente e busca por um elemento com o `role` "button" e o nome acessível correspondente, verificando também seu estado.
*   **Critério de Aceite:** A asserção `expect(buttonElement).toBeInTheDocument()` (e `toBeDisabled()`) deve ser verdadeira.

---

## 7. CONCLUSÃO

### 7.1 Resultados Alcançados

O componente de software do projeto Recycle+ foi concluído, resultando em uma aplicação web funcional, segura e escalável que atende a todos os requisitos definidos. A plataforma constitui uma prova de conceito robusta para a gamificação como ferramenta de incentivo a práticas sustentáveis.

### 7.2 Limitações do Projeto

*   **Validação Física:** O sistema opera com base na autodeclaração do usuário, sem validação física dos materiais.
*   **Logística de Entrega:** A aplicação gerencia o resgate, mas não a logística de entrega dos prêmios.

### 7.3 Trabalhos Futuros e Evolução

*   **Integração com Pontos de Coleta:** Implementar um sistema de validação (ex: QR Code) em pontos de coleta.
*   **Funcionalidades Sociais:** Adicionar rankings entre amigos, desafios comunitários e compartilhamento em redes sociais para potencializar o engajamento.
*   **Módulo Administrativo:** Criar um painel para que a equipe de Plásticos possa gerenciar o catálogo de prêmios.

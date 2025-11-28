# Monografia do Projeto: Recycle+ (Componente de Software)

**Versão:** 1.0
**Data:** 24 de maio de 2024

---

## SUMÁRIO

1.  **[INTRODUÇÃO](#1-introdução)**
    *   1.1 [Contextualização e Justificativa](#11-contextualização-e-justificativa)
    *   1.2 [A Solução Proposta: A Aplicação Recycle+](#12-a-solução-proposta-a-aplicação-recycle)

2.  **[ENGENHARIA DE REQUISITOS](#2-engenharia-de-requisitos)**
    *   2.1 [Requisitos Funcionais (RF)](#21-requisitos-funcionais-rf)
    *   2.2 [Requisitos Não Funcionais (RNF)](#22-requisitos-não-funcionais-rnf)

3.  **[METODOLOGIA E GESTÃO DO PROJETO](#3-metodologia-e-gestão-do-projeto)**
    *   3.1 [Metodologia de Desenvolvimento: Iterativa e Incremental](#31-metodologia-de-desenvolvimento-iterativa-e-incremental)

4.  **[ARQUITETURA DE SOFTWARE E TECNOLOGIAS](#4-arquitetura-de-software-e-tecnologias)**
    *   4.1 [Arquitetura: Single Page Application com Backend-as-a-Service (BaaS)](#41-arquitetura-single-page-application-com-backend-as-a-service-baas)
    *   4.2 [Backend-as-a-Service: A Plataforma Firebase](#42-backend-as-a-service-a-plataforma-firebase)
    *   4.3 [Frontend: Stack de Tecnologias](#43-frontend-stack-de-tecnologias)

---

## 1. INTRODUÇÃO

### 1.1 Contextualização e Justificativa

A poluição plástica representa uma das crises ambientais mais significativas da atualidade. A produção em massa e o descarte inadequado de plásticos geram um acúmulo massivo de resíduos, com impactos severos em ecossistemas terrestres e marinhos. O Brasil, um dos maiores produtores de lixo plástico, enfrenta uma taxa de reciclagem alarmantemente baixa, estimada em apenas 1 a 3%. O principal obstáculo não é a falta de tecnologia de reprocessamento, mas sim a baixa adesão da população ao processo de separação e descarte seletivo, motivada pela falta de incentivos diretos e de informação.

### 1.2 A Solução Proposta: A Aplicação Recycle+

Para endereçar a barreira do engajamento, desenvolveu-se a **Recycle+**, uma aplicação web de página única (SPA) que utiliza a **gamificação** para transformar a reciclagem em uma atividade recompensadora. Ao registrar suas atividades e acumular pontos, o usuário converte uma ação cívica em uma jornada mensurável e com valor tangível, incentivando a coleta de matéria-prima para a indústria de reciclagem.

---

## 2. ENGENHARIA DE REQUISITOS

Esta seção detalha os requisitos que nortearam o desenvolvimento da aplicação, divididos em funcionais e não funcionais.

### 2.1 Requisitos Funcionais (RF)

Definem o que o sistema deve fazer.

*   **RF01: Autenticação de Usuários:**
    *   **RF01.1:** Permitir o cadastro de novos usuários com nome, e-mail e senha.
    *   **RF01.2:** Permitir o login com e-mail/senha e login federado via Google.
    *   **RF01.3:** Gerenciar a sessão do usuário (login/logout).
    *   **RF01.4:** Restringir o acesso às páginas do painel apenas para usuários autenticados.

*   **RF02: Gerenciamento de Perfil:**
    *   **RF02.1:** Permitir ao usuário visualizar e atualizar suas informações de perfil.
    *   **RF02.2:** Permitir a alteração de senha para contas de e-mail/senha.

*   **RF03: Registro de Reciclagem:**
    *   **RF03.1:** Permitir ao usuário registrar a quantidade de diferentes tipos de materiais reciclados.
    *   **RF03.2:** Creditar pontos de forma imediata ao `totalPoints` (para resgate) e `lifetimePoints` (para ranking) após o registro.
    *   **RF03.3:** Exibir um histórico de atividades recentes.

*   **RF04: Sistema de Recompensas:**
    *   **RF04.1:** Exibir um catálogo de prêmios com seus respectivos custos em pontos.
    *   **RF04.2:** Permitir ao usuário resgatar um prêmio, deduzindo os pontos do `totalPoints`.

*   **RF05: Sistema de Gamificação (Ranking):**
    *   **RF05.1:** Exibir a patente atual do usuário com base no `lifetimePoints`.
    *   **RF05.2:** Mostrar o progresso para a próxima patente.

### 2.2 Requisitos Não Funcionais (RNF)

Definem como o sistema deve operar, estabelecendo critérios de qualidade.

*   **RNF01: Usabilidade:** A interface do usuário deve ser intuitiva, clara e responsiva (adaptável a desktops e dispositivos móveis).
*   **RNF02: Performance:** A aplicação deve ter tempos de carregamento rápidos e interações fluidas.
*   **RNF03: Segurança:** Os dados dos usuários devem ser protegidos contra acesso não autorizado, com comunicação criptografada (HTTPS) e armazenamento seguro de senhas. A privacidade é primordial.
*   **RNF04: Manutenibilidade:** O código-fonte deve ser modular, organizado e documentado para facilitar futuras manutenções e evoluções.

---

## 3. METODOLOGIA E GESTÃO DO PROJETO

### 3.1 Metodologia de Desenvolvimento: Iterativa e Incremental

O desenvolvimento do Recycle+ adotou uma metodologia de **Desenvolvimento Incremental e Iterativo**, inspirada em princípios ágeis.

*   **Ciclo de Vida:** O projeto foi decomposto em módulos funcionais (Autenticação, Perfil, Registro, etc.). Cada módulo foi desenvolvido em ciclos curtos (iterações), passando por fases de planejamento, desenvolvimento, teste e refinamento.
*   **Foco no MVP (Produto Mínimo Viável):** A estratégia inicial visou entregar um núcleo funcional da aplicação o mais rápido possível, validando a arquitetura e a proposta de valor.

---

## 4. ARQUITETURA DE SOFTWARE E TECNOLOGIAS

### 4.1 Arquitetura: Single Page Application com Backend-as-a-Service (BaaS)

A arquitetura do Recycle+ é baseada em uma **Single Page Application (SPA)** com um backend desacoplado, fornecido por uma plataforma de **Backend-as-a-Service (BaaS)**.

*   **Single Page Application (Frontend):** A aplicação é renderizada em uma única página HTML. O conteúdo é atualizado dinamicamente via JavaScript, proporcionando uma experiência de usuário mais rápida e fluida, sem recarregamentos de página.
*   **Backend-as-a-Service (Backend):** Em vez de construir e gerenciar servidores próprios, utilizamos serviços de backend prontos e escaláveis. Esta abordagem acelera o desenvolvimento e delega a complexidade de infraestrutura a um provedor especializado, neste caso, o Google.

### 4.2 Backend-as-a-Service: A Plataforma Firebase

A plataforma escolhida foi o **Firebase**, do Google, por sua robustez, escalabilidade e ecossistema integrado de serviços.

*   **Firebase Authentication:** Utilizado para toda a gestão de identidade dos usuários (cadastro, login, segurança de senhas).
*   **Cloud Firestore:** O banco de dados NoSQL, orientado a documentos e em tempo real, onde todos os dados da aplicação (usuários, registros, pontos) são armazenados.
*   **Firebase Security Rules:** Camada de autorização que protege o banco de dados, garantindo que um usuário só possa acessar e modificar seus próprios dados.

### 4.3 Frontend: Stack de Tecnologias

*   **Next.js:** Framework React que serve como a estrutura principal da aplicação, escolhido por seu sistema de roteamento (App Router) e otimizações de performance (Server Components).
*   **React:** Biblioteca JavaScript para a construção de interfaces de usuário baseadas em componentes reutilizáveis.
*   **TypeScript:** Superset de JavaScript que adiciona tipagem estática, garantindo a robustez do código e a prevenção de erros em tempo de desenvolvimento.
*   **Tailwind CSS & ShadCN/UI:** Para a estilização, utilizamos o framework "utility-first" Tailwind CSS e a biblioteca de componentes ShadCN/UI, que nos fornece componentes acessíveis e customizáveis.


# Projeto de Conclusão de Curso: Aplicação Web Recycle+

## Resumo

Este documento descreve a arquitetura e a implementação tecnológica do projeto Recycle+, uma aplicação web desenvolvida como Trabalho de Conclusão de Curso (TCC). O sistema foi concebido para endereçar a crescente necessidade de conscientização e engajamento em práticas de reciclagem, utilizando a gamificação como principal vetor de incentivo. A plataforma permite que usuários registrem o descarte de materiais recicláveis, acumulem pontos e os troquem por recompensas, fomentando um ciclo virtuoso de sustentabilidade e participação comunitária. A arquitetura do sistema é baseada em um stack tecnológico moderno, composto por Next.js para o frontend, Firebase como plataforma de Backend-as-a-Service (BaaS), e TypeScript para garantir a robustez e manutenibilidade do código.

---

## 1. Arquitetura do Sistema e Tecnologias Empregadas

A aplicação Recycle+ foi projetada sob o paradigma de uma Single Page Application (SPA) com renderização híbrida, utilizando um stack de tecnologias moderno para garantir escalabilidade, segurança e uma experiência de usuário performática. A arquitetura desacopla o frontend (interface do usuário) da lógica de backend, que é fornecida por uma plataforma de Backend-as-a-Service (BaaS).

### 1.1. Backend-as-a-Service (BaaS): Firebase Platform

A espinha dorsal da infraestrutura de backend do Recycle+ é a plataforma Firebase, um ecossistema de serviços em nuvem fornecido pelo Google. A adoção do modelo BaaS abstrai a complexidade do gerenciamento de servidores, bancos de dados e infraestrutura de autenticação, permitindo que a equipe de desenvolvimento se concentre na lógica de negócio e na experiência do usuário.

#### 1.1.1. Firebase Authentication

O gerenciamento de identidade e o controle de acesso são delegados ao **Firebase Authentication**, um serviço robusto e seguro que gerencia todo o ciclo de vida do usuário.

-   **Funcionalidades:** Suporta múltiplos provedores de autenticação, incluindo o cadastro tradicional com **e-mail e senha** e o login federado através de provedores OAuth, como o **Google Sign-In**.
-   **Segurança:** O serviço lida com o armazenamento seguro de credenciais (hashes de senhas), validação de e-mails e gerenciamento de sessões (tokens de acesso), mitigando riscos de segurança associados à implementação de um sistema de autenticação próprio.
-   **Integração:** No Recycle+, ele é responsável por criar, validar e gerenciar a sessão dos usuários, garantindo que apenas usuários autenticados possam acessar as funcionalidades do painel de controle (dashboard).

#### 1.1.2. Cloud Firestore

O **Cloud Firestore** atua como o banco de dados primário da aplicação. Trata-se de um banco de dados NoSQL, orientado a documentos e com capacidades de sincronização em tempo real.

-   **Estrutura de Dados:** Os dados são organizados em coleções de documentos, que são estruturas de dados flexíveis (semelhantes a JSON). A modelagem de dados do Recycle+ foi projetada para garantir isolamento e segurança, com as seguintes coleções principais:
    -   `/users/{userId}`: Armazena o perfil de cada usuário, incluindo informações como `username`, `email`, `totalPoints` e `lifetimePoints`.
    -   `/users/{userId}/recycling_records`: Subcoleção que armazena os registros de reciclagem de um usuário específico, garantindo que os dados sejam inerentemente particionados por proprietário.
    -   `/users/{userId}/redemptions`: Subcoleção para o histórico de resgate de prêmios.
    -   `/rewards/{rewardId}`: Coleção global que armazena os prêmios disponíveis para resgate.
-   **Sincronização em Tempo Real:** Uma das características mais poderosas do Firestore é sua capacidade de enviar atualizações de dados em tempo real para os clientes conectados. Isso permite que a interface do Recycle+ (por exemplo, a contagem de pontos) seja atualizada instantaneamente quando uma alteração ocorre no banco de dados, sem a necessidade de recarregar a página.

#### 1.1.3. Firebase Security Rules (Regras de Segurança)

As **Regras de Segurança** do Firestore constituem a camada de autorização e validação de dados do lado do servidor. Escritas em uma linguagem declarativa, elas protegem o banco de dados contra acessos não autorizados ou maliciosos.

-   **Modelo de Segurança:** No Recycle+, as regras impõem um modelo de propriedade estrito: um usuário só pode ler e escrever em seus próprios documentos (`/users/{userId}` e suas subcoleções). Tentativas de acessar dados de outros usuários são bloqueadas diretamente no servidor do Firebase.
-   **Validação de Dados:** Além do controle de acesso, as regras podem validar a estrutura e o tipo dos dados que estão sendo escritos, garantindo a integridade do banco de dados.

### 1.2. Frontend e Interface do Usuário

O frontend é a camada com a qual o usuário interage diretamente. Foi construído com um conjunto de tecnologias que priorizam a performance, a manutenibilidade e a experiência do desenvolvedor.

#### 1.2.1. Next.js

**Next.js** é o framework React que serve como alicerce para toda a aplicação.

-   **App Router:** Utilizamos o moderno App Router, um sistema de roteamento baseado no sistema de arquivos. Cada pasta dentro de `src/app/` corresponde a um segmento de URL (por exemplo, `src/app/dashboard/profile` é mapeado para a rota `/dashboard/profile`), simplificando a organização e a navegação.
-   **Renderização no Servidor (Server Components):** Por padrão, os componentes são renderizados no servidor, o que reduz a quantidade de JavaScript enviado ao navegador, resultando em um tempo de carregamento inicial mais rápido (First Contentful Paint) e melhor performance geral. Componentes que necessitam de interatividade, como formulários, são designados como "Client Components" (`'use client'`).

#### 1.2.2. React

**React** é a biblioteca de interface de usuário (UI) que constitui o núcleo da nossa aplicação.

-   **Componentização:** A interface é decomposta em componentes reutilizáveis e independentes (ex: `Button`, `Card`, `Sidebar`), o que promove a reutilização de código e facilita a manutenção.
-   **Hooks:** Utilizamos Hooks (`useState`, `useEffect`, `useContext`, etc.) para gerenciar o estado local dos componentes, lidar com efeitos colaterais (como requisições de dados) e compartilhar lógica entre componentes de forma limpa.

#### 1.2.3. TypeScript

**TypeScript** é um superset do JavaScript que adiciona tipagem estática ao código.

-   **Prevenção de Erros:** Ao definir tipos explícitos para os dados da aplicação (por exemplo, as interfaces `UserProfile` e `RecyclingRecord`), o TypeScript nos permite capturar uma vasta gama de erros em tempo de desenvolvimento, antes que o código seja executado no navegador.
-   **Inteligibilidade e Manutenibilidade:** O código torna-se mais auto-documentado e legível, pois as estruturas de dados e as assinaturas de funções são claramente definidas, facilitando a colaboração em equipe e a manutenção a longo prazo.

#### 1.2.4. Tailwind CSS & ShadCN/UI

A estilização da aplicação é gerenciada por uma combinação de Tailwind CSS e ShadCN/UI.

-   **Tailwind CSS:** Um framework CSS "utility-first" que permite aplicar estilos diretamente no JSX/HTML através de classes utilitárias (ex: `p-4`, `rounded-lg`, `bg-primary`). Esta abordagem acelera o desenvolvimento, garante consistência visual e evita a necessidade de escrever CSS customizado extensivo.
-   **ShadCN/UI:** Uma coleção de componentes de interface pré-construídos e acessíveis, como `Card`, `Button`, `Dialog` e `Input`. Diferentemente de outras bibliotecas de componentes, ShadCN/UI nos fornece o código-fonte dos componentes, que pode ser facilmente customizado e estendido, garantindo total controle sobre a aparência e o comportamento.

---

## 2. Testes de Software

O projeto está configurado com um ambiente de testes para garantir a qualidade e a confiabilidade do código.

### 2.1. Ferramentas de Teste

-   **Jest:** É o framework de testes utilizado para executar os testes unitários. Ele fornece um executor de testes, funcionalidades de asserção e a capacidade de criar *mocks*.
-   **React Testing Library:** É uma biblioteca que facilita o teste de componentes React da maneira como o usuário os utilizaria. Ela nos incentiva a escrever testes que interagem com a UI através de seletores acessíveis, em vez de detalhes de implementação.

### 2.2. Execução dos Testes

Para executar os testes unitários configurados no projeto, utilize o seguinte comando no terminal:

```bash
npm test
```

Este comando inicia o Jest em "modo de observação" (*watch mode*), que re-executará automaticamente os testes sempre que um arquivo for alterado. Um exemplo de teste unitário pode ser encontrado em `src/components/ui/__tests__/Button.test.tsx`, que serve como um modelo para a criação de novos testes.

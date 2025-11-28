
# **Monografia de Projeto de Software: Recycle+**

**Versão 3.0 (Detalhada)**
**Data:** 24 de Maio de 2024

---

## **SUMÁRIO EXECUTIVO**

Este documento constitui a monografia técnica do componente de software do projeto interdisciplinar **Recycle+**. Ele detalha, de forma exaustiva, a concepção, arquitetura, desenvolvimento e implementação da aplicação web Recycle+, uma plataforma digital criada para fomentar o engajamento da população com a reciclagem de plástico através de mecânicas de gamificação.

O projeto foi desenvolvido em sinergia com uma equipe de Engenharia de Plásticos, que é responsável pela logística de coleta e transformação do material reciclado em produtos de valor agregado. A aplicação de software, objeto desta monografia, serve como a ponte digital que conecta o cidadão a este ciclo de economia circular, incentivando a coleta da matéria-prima que alimenta todo o processo.

Neste documento, exploramos:
1.  A **fundamentação teórica** por trás do projeto, incluindo o problema global da poluição por plásticos e os princípios de gamificação aplicados.
2.  O processo de **engenharia de requisitos**, que definiu o escopo funcional e não funcional da aplicação.
3.  A **metodologia de gestão e desenvolvimento** ágil que permitiu a entrega iterativa e incremental de valor.
4.  Uma análise profunda da **arquitetura de software** e do **stack tecnológico** escolhido, justificando cada decisão técnica.
5.  Uma dissecção da **implementação técnica**, detalhando a estrutura de pastas, o modelo de dados no Cloud Firestore, as regras de segurança e os fluxos de funcionalidades críticas.
6.  Uma **análise detalhada da interface do usuário**, descrevendo cada tela e cada componente interativo da aplicação.
7.  A estratégia de **testes e validação** para garantir a qualidade e robustez do software.

Este trabalho representa a consolidação de todo o esforço de engenharia de software empregado para criar uma solução digital que não apenas funciona, mas que também é escalável, segura e projetada para causar um impacto socioambiental positivo.

---

## **1. INTRODUÇÃO**

### **1.1. Contextualização Aprofundada: O Desafio Global e Nacional da Reciclagem de Plástico**

A proliferação de resíduos plásticos representa uma das mais graves e visíveis crises ambientais da era moderna. A durabilidade, versatilidade e baixo custo que tornaram o plástico um material onipresente em nossa sociedade são as mesmas características que o convertem em um poluente persistente e danoso quando descartado de forma inadequada. Globalmente, a produção de plástico cresceu exponencialmente, de 2 milhões de toneladas em 1950 para mais de 460 milhões de toneladas anuais hoje, com projeções de que esse número triplicará até 2060 se nenhuma ação for tomada.

O Brasil ocupa uma posição crítica nesse cenário. Segundo o relatório "Atlas do Plástico", o país é o 4º maior produtor de lixo plástico do mundo, gerando cerca de 11,3 milhões de toneladas por ano. Destes, apenas uma fração mínima, estimada em **1,28%**, é efetivamente reciclada. Este índice alarmantemente baixo coloca o Brasil muito atrás da média global de 9%.

A raiz do problema não reside na falta de tecnologia para o reprocessamento do material. As tecnologias de reciclagem mecânica e química estão bem estabelecidas. A principal barreira é socioeconômica e cultural, centrada na **baixa adesão da população ao processo de separação e descarte seletivo**.

### **1.2. Justificativa**

A baixa adesão à reciclagem no Brasil é um problema complexo com causas multifatoriais:

*   **Falta de Incentivo Direto e Tangível:** Para o cidadão comum, o ato de separar o lixo muitas vezes é percebido como um esforço sem recompensa imediata ou visível. A ausência de um ciclo de feedback positivo torna a ação abstrata e desmotivadora. O esforço é real e imediato, mas o benefício é difuso e de longo prazo.
*   **Desinformação Estrutural:** Existe uma confusão generalizada sobre quais tipos de plástico são recicláveis, como devem ser limpos e onde devem ser descartados. A falta de padronização na comunicação e a infraestrutura de coleta seletiva, muitas vezes insuficiente, agravam o problema.
*   **Desconexão de Impacto:** O esforço individual de reciclagem parece insignificante diante da magnitude do problema. O cidadão não consegue visualizar como sua pequena ação contribui para um resultado coletivo significativo, gerando um sentimento de apatia e impotência.

É nesse ponto de inflexão — a necessidade de mudar o comportamento humano em larga escala — que a tecnologia da informação, especificamente a engenharia de software, emerge como um vetor estratégico de transformação. A engenharia de software permite criar sistemas que podem alcançar milhões de pessoas, oferecendo interfaces interativas e personalizadas que podem influenciar o comportamento de forma escalável.

O projeto **Recycle+** se justifica por atacar diretamente essa lacuna. Ele propõe o uso da **gamificação** — a aplicação de elementos de jogos em contextos não lúdicos — para transformar a prática cívica da reciclagem em uma experiência engajadora, mensurável e, acima de tudo, recompensadora. A plataforma de software não é apenas uma ferramenta, mas o catalisador que cria o incentivo que falta no ciclo tradicional da reciclagem.

Ao converter uma ação física (separar plástico) em um ativo digital (pontos) que pode ser trocado por um bem tangível (prêmios feitos do próprio material reciclado), o sistema fecha o ciclo de feedback e dá um valor imediato e pessoal ao ato de reciclar. Portanto, este projeto justifica-se pela sua abordagem inovadora de aplicar princípios de engenharia de software e design de jogos para resolver um problema socioambiental crônico, fomentando um modelo de economia circular sustentável e participativo.

### **1.3. A Solução Proposta: A Aplicação Gamificada Recycle+**

Para atacar diretamente a barreira do engajamento populacional, foi concebido o projeto de software **Recycle+**. Trata-se de uma aplicação web (Single Page Application) que emprega o conceito de **gamificação** para transformar a prática cívica da reciclagem em uma experiência interativa, mensurável e recompensadora.

A premissa da aplicação é converter o ciclo de reciclagem em um ciclo de feedback positivo:

1.  **Ação:** O usuário separa e descarta seus resíduos plásticos.
2.  **Registro:** O usuário acessa a aplicação Recycle+ e registra a quantidade e o tipo de material que reciclou.
3.  **Recompensa Imediata:** O sistema credita, instantaneamente, pontos na conta do usuário. Essa recompensa imediata e mensurável valida o esforço do usuário.
4.  **Progresso Visível:** Os pontos acumulados não apenas servem para resgate, mas também contam para um sistema de patentes (ranking), mostrando ao usuário seu progresso e sua posição dentro da comunidade.
5.  **Valor Tangível:** Os pontos acumulados podem ser trocados por produtos reais — produtos estes que são fabricados pela equipe de Engenharia de Plásticos a partir do próprio material reciclado coletado.

Este ciclo fecha a lacuna de incentivo e impacto, transformando um resíduo sem valor aparente (lixo) em um ativo digital (pontos) que pode ser convertido em um bem de consumo real (recompensa).

### **1.4. Colaboração Interdisciplinar: A Sinergia entre Software e Engenharia de Plásticos**

O projeto Recycle+ é um exemplo paradigmático de colaboração interdisciplinar, criando uma simbiose entre o mundo digital da **Engenharia de Software** e o mundo físico da **Engenharia de Plásticos**. A solução só é completa e viável através da interdependência dessas duas frentes.

*   **A Frente de Engenharia de Plásticos:** Atua na ponta física do processo. Sua responsabilidade engloba a logística de coleta do material plástico (que é viabilizada pela massa crítica de usuários engajados pela plataforma), o processo de triagem, limpeza, e a transformação desse material em novos artefatos. Eles são os responsáveis por dar um destino nobre ao resíduo, fabricando os próprios prêmios (vasos, utensílios, chaveiros) que materializam o valor da reciclagem para o usuário final.

*   **A Frente de Engenharia de Software (objeto desta monografia):** É responsável pelo desenvolvimento e manutenção da plataforma digital. O software atua como a interface de engajamento, o catalisador que motiva a coleta da matéria-prima. Sem a plataforma, a coleta em larga escala seria um desafio logístico e social insustentável. Sem o processo físico de reciclagem e a criação de recompensas, os pontos na plataforma seriam virtuais e sem valor real, esvaziando o propósito da gamificação.

Esse fluxo cria um modelo de **economia circular** em microescala, onde o resíduo gerado por uma ponta (o cidadão) é transformado em matéria-prima para outra (a Engenharia de Plásticos), que por sua vez gera um produto de valor que retorna para a ponta inicial, fechando o ciclo.

### **1.5. Objetivos do Projeto**

#### **1.5.1. Objetivo Geral**

Desenvolver e implantar uma aplicação web funcional, escalável e segura que utilize a gamificação como ferramenta estratégica para incentivar e aumentar a adesão da população à prática da reciclagem de plástico, servindo como a ponte digital que conecta o esforço individual do cidadão ao processo de transformação física do material, validando o ciclo de economia circular proposto.

#### **1.5.2. Objetivos Específicos (Componente de Software)**

*   **Implementar um Sistema de Autenticação Robusto:** Construir um módulo de gestão de identidade seguro e flexível, que suporte cadastro por e-mail/senha e login federado via provedor OAuth (Google), garantindo o controle de acesso e a personalização da experiência.
*   **Construir um Módulo de Registro de Atividades Intuitivo:** Desenvolver uma interface clara e de baixa fricção para que o usuário possa registrar suas atividades de reciclagem, com feedback imediato de pontuação para reforçar positivamente o comportamento.
*   **Desenvolver um Sistema de Gamificação (Pontuação e Ranking):** Criar um sistema de pontos duplo: `totalPoints` (para resgate de prêmios) e `lifetimePoints` (para progressão de ranking). Implementar um sistema de patentes visível para o usuário, que mostre seu progresso e o incentive a continuar participando.
*   **Criar um Catálogo de Recompensas Funcional:** Desenvolver uma vitrine de prêmios onde os usuários possam visualizar os produtos disponíveis (fabricados pela equipe de Plásticos) e resgatá-los utilizando seus pontos.
*   **Garantir a Privacidade e a Segurança dos Dados:** Implementar um modelo de segurança robusto no backend (utilizando Firebase Security Rules) que assegure que cada usuário só possa acessar e manipular seus próprios dados.
*   **Assegurar uma Arquitetura de Software Escalável e Manutenível:** Projetar o software de forma modular e utilizando tecnologias modernas para permitir a fácil adição de novas funcionalidades e suportar um crescimento no número de usuários sem degradação de performance.
*   **Validar a Qualidade do Software:** Implementar uma estratégia de testes de unidade para validar o comportamento dos componentes críticos da interface, garantindo a robustez e a confiabilidade da aplicação.

---

## **2. ENGENHARIA DE REQUISITOS**

A engenharia de requisitos é o processo de definir, documentar e manter os requisitos de um sistema. Para o Recycle+, esta fase foi crucial para traduzir a visão do projeto em especificações técnicas claras e mensuráveis.

### **2.1. Diagrama de Casos de Uso**

O Diagrama de Casos de Uso é uma representação visual das interações entre um ator (neste caso, o "Usuário") e o sistema. Ele ilustra as funcionalidades que o sistema oferece a partir da perspectiva do usuário.

![Diagrama de Casos de Uso do Recycle+](https://storage.googleapis.com/studiopbf-public/tcc-diagram.png)

**Análise do Diagrama:**

*   **Ator:** O único ator primário identificado é o **Usuário**, que representa qualquer indivíduo que interaja com a plataforma.
*   **Casos de Uso Principais:**
    *   **Gerenciar Conta:** Um caso de uso que engloba as funcionalidades de `Cadastrar-se`, `Fazer Login`, `Fazer Logout` e `Recuperar Senha`. Este é um pré-requisito para acessar as funcionalidades restritas.
    *   **Registrar Material Reciclado:** A funcionalidade central do sistema, onde o usuário informa os itens que reciclou.
    *   **Consultar Pontuação e Ranking:** Permite ao usuário visualizar seus pontos acumulados e sua patente atual.
    *   **Trocar Pontos por Recompensas:** O processo de resgate de prêmios do catálogo.
    *   **Visualizar Histórico:** Permite ao usuário ver suas atividades recentes na plataforma.

### **2.2. Requisitos Funcionais (RF)**

Os Requisitos Funcionais (RF) descrevem o que o sistema deve fazer. Eles especificam as funcionalidades e os comportamentos do software.

*   **RF01: Autenticação de Usuários**
    *   **RF01.1:** O sistema deve permitir que um novo usuário se cadastre fornecendo um nome de usuário único, um endereço de e-mail válido e uma senha segura (mínimo de 6 caracteres).
    *   **RF01.2:** O sistema deve permitir que um usuário existente se autentique utilizando seu e-mail e senha.
    *   **RF01.3:** O sistema deve permitir que um usuário existente se autentique utilizando sua conta Google (login federado via OAuth 2.0).
    *   **RF01.4:** Uma vez autenticado, o sistema deve manter a sessão do usuário ativa até que ele realize o logout explicitamente.
    *   **RF01.5:** O acesso a todas as páginas do painel de controle (dashboard) deve ser restrito apenas a usuários autenticados. Tentativas de acesso direto por usuários não autenticados devem ser redirecionadas para a página de login.
    *   **RF01.6:** O sistema deve fornecer uma funcionalidade para o usuário realizar o logout.

*   **RF02: Gerenciamento de Perfil**
    *   **RF02.1:** O usuário deve poder visualizar suas informações de perfil, incluindo nome de usuário e e-mail.
    *   **RF02.2:** O usuário deve poder alterar seu nome de usuário.
    *   **RF02.3 (para contas de e-mail/senha):** O usuário deve poder alterar sua senha, fornecendo sua senha atual e a nova senha desejada.
    *   **RF02.4:** O usuário deve ter a opção de resetar sua pontuação de resgate (`totalPoints`) para zero, como uma ação de controle em sua "zona de perigo".

*   **RF03: Registro de Reciclagem e Pontuação**
    *   **RF03.1:** O sistema deve apresentar uma interface onde o usuário possa selecionar um tipo de material plástico (ex: Garrafa PET, Tampinha) e registrar a quantidade reciclada.
    *   **RF03.2:** Após o registro, o sistema deve calcular os pontos ganhos com base na quantidade e no valor pré-definido para cada tipo de material.
    *   **RF03.3:** Os pontos calculados devem ser creditados de forma atômica e imediata a dois campos do perfil do usuário: `totalPoints` (pontuação disponível para resgate) e `lifetimePoints` (pontuação total para ranking).
    *   **RF03.4:** O sistema deve exibir um histórico de atividades recentes do usuário em seu painel principal, incluindo tanto registros de reciclagem quanto resgates de prêmios.
    *   **RF03.5:** O sistema deve permitir que o usuário exclua um registro de atividade de reciclagem. A exclusão deve reverter a pontuação correspondente de forma atômica (subtrair os pontos de `totalPoints` e `lifetimePoints`).

*   **RF04: Sistema de Recompensas**
    *   **RF04.1:** O sistema deve exibir um catálogo de prêmios, mostrando o nome, a descrição, a imagem e o custo em pontos de cada um.
    *   **RF04.2:** O sistema deve validar se o usuário possui pontos (`totalPoints`) suficientes para resgatar um prêmio. O botão de resgate deve estar desabilitado caso o usuário não possua pontos suficientes.
    *   **RF04.3:** Ao resgatar um prêmio, o sistema deve deduzir o custo em pontos do campo `totalPoints` do usuário de forma atômica. O campo `lifetimePoints` não deve ser afetado.
    *   **RF04.4:** O sistema deve criar um registro do resgate no histórico do usuário.

*   **RF05: Sistema de Gamificação (Ranking/Patentes)**
    *   **RF05.1:** O sistema deve exibir a patente (ranking) atual do usuário, que é determinada com base em sua pontuação total acumulada (`lifetimePoints`).
    *   **RF05.2:** O sistema deve mostrar visualmente o progresso do usuário para alcançar a próxima patente, exibindo uma barra de progresso e a quantidade de pontos que faltam.

### **2.3. Requisitos Não Funcionais (RNF)**

Os Requisitos Não Funcionais (RNF) definem os critérios de qualidade e as restrições operacionais do sistema. Eles descrevem como o sistema deve operar.

*   **RNF01: Usabilidade e Interface**
    *   **RNF01.1 (Intuitividade):** A interface do usuário (UI) deve ser clara, consistente e intuitiva, minimizando a carga cognitiva e permitindo que novos usuários compreendam as funcionalidades rapidamente.
    *   **RNF01.2 (Responsividade):** A aplicação deve ser totalmente responsiva, proporcionando uma experiência de uso otimizada tanto em dispositivos desktop (telas grandes) quanto em dispositivos móveis (smartphones e tablets).
    *   **RNF01.3 (Feedback ao Usuário):** O sistema deve fornecer feedback visual imediato para as ações do usuário, como notificações (toasts) para sucesso ou falha em operações, e indicadores de carregamento (loaders) durante processos assíncronos.
    *   **RNF01.4 (Acessibilidade):** A interface deve seguir práticas básicas de acessibilidade web (WCAG), como contraste de cores adequado e uso de atributos ARIA, para ser utilizável por pessoas com diferentes capacidades.

*   **RNF02: Performance**
    *   **RNF02.1 (Tempo de Carregamento):** O tempo de carregamento inicial da aplicação (First Contentful Paint) deve ser otimizado, visando ser inferior a 2 segundos em conexões de banda larga. Isso é alcançado através do uso de renderização no servidor (SSR/SSG) com Next.js.
    *   **RNF02.2 (Interatividade):** As transições entre páginas e as interações dentro da aplicação devem ser fluidas e rápidas, sem atrasos perceptíveis.

*   **RNF03: Segurança**
    *   **RNF03.1 (Confidencialidade de Dados):** Os dados dos usuários devem ser estritamente privados. Um usuário não deve ter nenhuma possibilidade de acessar ou visualizar dados de outro usuário. Esta regra é imposta no nível do backend (Firebase Security Rules).
    *   **RNF03.2 (Comunicação Criptografada):** Toda a comunicação entre o cliente (navegador) e os servidores do Firebase deve ocorrer obrigatoriamente sobre o protocolo HTTPS.
    *   **RNF03.3 (Armazenamento de Senhas):** O sistema não deve armazenar senhas em texto puro. Essa responsabilidade é delegada ao Firebase Authentication, que utiliza hashing seguro.

*   **RNF04: Manutenibilidade e Escalabilidade**
    *   **RNF04.1 (Modularidade):** O código-fonte deve ser organizado de forma modular, com uma separação clara de responsabilidades entre componentes de UI, lógica de negócio, serviços e configurações.
    *   **RNF04.2 (Legibilidade do Código):** O código deve seguir convenções de estilo consistentes e ser auto-documentado sempre que possível, facilitando a compreensão por novos desenvolvedores.
    *   **RNF04.3 (Escalabilidade do Backend):** A arquitetura de backend (Firebase) deve ser capaz de suportar um aumento significativo no número de usuários simultâneos e no volume de dados sem a necessidade de intervenção manual na infraestrutura.

---

## **3. METODOLOGIA E GESTÃO DO PROJETO**

A escolha da metodologia de desenvolvimento e das ferramentas de gestão é fundamental para o sucesso de um projeto de software. Para o Recycle+, adotamos uma abordagem pragmática e ágil, focada em colaboração, transparência e entrega de valor contínua.

### **3.1. Metodologia de Desenvolvimento: Iterativa e Incremental**

O desenvolvimento do Recycle+ foi conduzido utilizando uma metodologia de **Desenvolvimento Incremental e Iterativo**, inspirada em princípios ágeis como os do Scrum e Kanban. Esta abordagem foi escolhida por sua flexibilidade, adaptabilidade a mudanças e por sua capacidade de mitigar riscos ao entregar valor em ciclos curtos.

*   **Desenvolvimento Incremental:** O projeto foi decomposto em módulos funcionais que podem ser desenvolvidos, testados e entregues de forma independente, mas integrada. Em vez de planejar e construir a aplicação inteira de uma só vez (modelo em cascata), nós construímos e entregamos "incrementos" de funcionalidade. Por exemplo:
    *   *Incremento 1:* Sistema de Autenticação e estrutura básica do Dashboard.
    *   *Incremento 2:* Módulo de Registro de Reciclagem e sistema de pontuação.
    *   *Incremento 3:* Catálogo de Recompensas e fluxo de resgate.
    *   *Incremento 4:* Página de Ranking e perfil do usuário.

*   **Ciclo de Vida Iterativo:** Cada incremento foi desenvolvido em ciclos curtos e repetitivos chamados **iterações**. Cada iteração pode ser vista como um mini-projeto que passa por todas as fases do desenvolvimento de software:
    1.  **Planejamento da Iteração:** Selecionar um conjunto de requisitos do backlog para serem implementados na iteração atual.
    2.  **Execução (Desenvolvimento e Teste):** A equipe trabalha na implementação das funcionalidades planejadas. O desenvolvimento e o teste ocorrem em paralelo.
    3.  **Revisão da Iteração:** Ao final do ciclo, a equipe demonstra o incremento funcional. Isso permite a validação das funcionalidades e a coleta de feedback imediato.
    4.  **Retrospectiva:** A equipe reflete sobre o processo da iteração, identificando pontos de melhoria para o próximo ciclo.

*   **Foco no MVP (Produto Mínimo Viável):** A estratégia inicial concentrou-se em entregar rapidamente um MVP que contivesse o núcleo de valor da aplicação: cadastro, login, registro de reciclagem e visualização de pontos. Isso permitiu validar a arquitetura técnica e a proposta de valor com um esforço mínimo, reduzindo os riscos do projeto e fornecendo uma base sólida para as iterações subsequentes.

### **3.2. Ferramentas de Gestão e Comunicação: Trello**

Para a organização das tarefas, o acompanhamento do progresso e a promoção da transparência dentro da equipe de software, foi utilizada a ferramenta **Trello**. Um quadro visual no estilo Kanban foi configurado, permitindo um gerenciamento de fluxo de trabalho claro e eficiente.

O quadro foi estruturado com as seguintes colunas:

*   **Backlog:** Uma lista completa de todas as funcionalidades, tarefas técnicas, melhorias e bugs identificados. Cada item (cartão) no backlog representa uma unidade de trabalho.
*   **To Do (A Fazer):** Tarefas que foram priorizadas e selecionadas do backlog para serem trabalhadas na iteração atual.
*   **In Progress (Em Andamento):** Tarefas que um membro da equipe está desenvolvendo ativamente. Cada desenvolvedor só pode ter um número limitado de tarefas nesta coluna para evitar a sobrecarga e promover o foco.
*   **Done (Concluído):** Tarefas que foram finalizadas, testadas e validadas, prontas para serem integradas à versão principal do software.

Esta abordagem visual simples facilitou o gerenciamento diário, permitiu que todos na equipe tivessem uma visão clara do status do projeto e ajudou a identificar gargalos no processo de desenvolvimento.

### **3.3. Controle de Versão: Git e GitHub**

O controle de versão de todo o código-fonte do projeto foi gerenciado com o sistema de controle de versão distribuído **Git**. O repositório central de código foi hospedado na plataforma **GitHub**. Esta combinação é o padrão da indústria para desenvolvimento de software colaborativo e oferece inúmeros benefícios:

*   **Histórico de Alterações:** O Git rastreia cada mudança feita em cada arquivo do projeto. Isso cria um histórico completo, permitindo que voltemos a qualquer versão anterior do código se algo der errado.
*   **Trabalho Paralelo (Branches):** Utilizamos o modelo de *feature branches*. Para cada nova funcionalidade ou correção de bug, um novo "ramo" (branch) é criado a partir do ramo principal (`main`). O desenvolvedor trabalha isoladamente neste branch sem afetar o código estável.
*   **Revisão de Código (Pull Requests):** Uma vez que o trabalho no branch está concluído, o desenvolvedor abre um **Pull Request** (PR) no GitHub. Este é um pedido formal para mesclar as alterações do seu branch no ramo principal. O PR serve como um fórum para a revisão de código, onde outros membros da equipe podem revisar as mudanças, fazer sugestões e aprovar a integração.
*   **Integração Segura:** Somente após a aprovação, o código é mesclado (`merged`) ao ramo principal, garantindo que apenas código revisado e funcional seja integrado à base de código principal.

Essa metodologia de controle de versão foi fundamental para manter a qualidade, a organização e a integridade do código-fonte ao longo de todo o ciclo de vida do projeto.

---

## **4. ARQUITETURA DE SOFTWARE E TECNOLOGIAS**

A escolha da arquitetura de software e do stack tecnológico é uma das decisões mais impactantes em um projeto. Para o Recycle+, as escolhas foram guiadas pelos Requisitos Não Funcionais, especialmente a necessidade de desenvolvimento rápido, escalabilidade, segurança e manutenibilidade.

### **4.1. Arquitetura: Single Page Application com Backend-as-a-Service (BaaS)**

A arquitetura do Recycle+ é baseada no padrão de uma **Single Page Application (SPA)** para o frontend, que se comunica com um backend desacoplado, fornecido por uma plataforma de **Backend-as-a-Service (BaaS)**.

*   **Single Page Application (Frontend):** Uma SPA é uma aplicação web que funciona dentro do navegador e não precisa recarregar a página durante seu uso. Ao carregar a aplicação pela primeira vez, o navegador baixa todo o código necessário (HTML, CSS, JavaScript). Conforme o usuário navega e interage, o conteúdo é atualizado dinamicamente.
    *   **Vantagens:** Proporciona uma experiência de usuário mais rápida, fluida e semelhante à de um aplicativo nativo.
    *   **Como implementamos:** Utilizamos o framework Next.js, que, embora seja capaz de renderizar páginas no servidor, opera fundamentalmente como uma SPA após o carregamento inicial, gerenciando a navegação do lado do cliente.

*   **Backend-as-a-Service (Backend):** Em vez de construir, provisionar e gerenciar nossos próprios servidores, banco de dados e APIs do zero, utilizamos uma plataforma de BaaS. Esta abordagem delega toda a complexidade de infraestrutura para um provedor especializado, no nosso caso, o Google.
    *   **Vantagens:** Aceleração drástica do tempo de desenvolvimento, custos de infraestrutura iniciais mais baixos, escalabilidade automática e segurança gerenciada pelo provedor. Isso nos permitiu focar 100% na lógica de negócio e na experiência do usuário da aplicação Recycle+.

Este modelo arquitetônico de frontend desacoplado e backend como serviço é extremamente comum em aplicações web modernas, pois otimiza os esforços da equipe de desenvolvimento e aproveita a robustez das plataformas em nuvem.

### **4.2. Backend-as-a-Service: A Plataforma Firebase**

A plataforma de BaaS escolhida para o Recycle+ foi o **Firebase**, do Google. A escolha foi motivada pelo seu ecossistema integrado, facilidade de uso e generoso plano gratuito, ideal para o início de um projeto.

Os serviços do Firebase utilizados foram:

*   **Firebase Authentication:** Utilizado para toda a gestão de identidade. Ele oferece SDKs fáceis de usar para implementar fluxos de login e cadastro, tanto com e-mail/senha quanto com provedores federados (Google). Ele lida com toda a complexidade de armazenamento seguro de senhas, gerenciamento de tokens de sessão e recuperação de senha.
*   **Cloud Firestore:** Nosso banco de dados NoSQL orientado a documentos. Foi escolhido por sua flexibilidade (não exige um esquema rígido como bancos SQL), sua capacidade de escalar massivamente e, crucialmente, por suas consultas em tempo real, que permitem que a UI seja atualizada instantaneamente quando os dados mudam no backend.
*   **Firebase Security Rules:** Uma camada de autorização indispensável que protege o banco de dados contra acesso não autorizado. As regras são executadas nos servidores do Firebase e garantem que, por exemplo, um usuário só possa ler e escrever em seus próprios dados, independentemente de qualquer tentativa de manipulação no frontend.
*   **Firebase Hosting (implícito):** Embora não tenhamos usado diretamente para hospedar a aplicação (usamos o App Hosting do Firebase, que é baseado em Cloud Run), toda a infraestrutura do Firebase é hospedada na Google Cloud Platform, garantindo alta disponibilidade e baixa latência.

### **4.3. Frontend: Stack de Tecnologias Detalhado**

O frontend é a face do nosso projeto. A escolha das tecnologias foi feita para criar uma aplicação moderna, performática e agradável de se desenvolver e manter.

*   **Next.js (Framework React):**
    *   **O que é?** Um framework de produção para React. Ele adiciona funcionalidades essenciais sobre o React puro, como roteamento, otimizações de renderização e tooling de desenvolvimento.
    *   **Por que usamos?**
        *   **App Router:** Utilizamos o novo paradigma de roteamento do Next.js, que é baseado em diretórios. Isso torna a organização do projeto extremamente intuitiva: uma pasta na pasta `app` se torna uma rota na aplicação.
        *   **React Server Components (RSC):** O App Router utiliza RSCs por padrão. Isso significa que muitos dos nossos componentes são renderizados no servidor, gerando HTML estático que é enviado para o navegador. O resultado é um carregamento inicial muito mais rápido e uma melhoria no SEO, pois o conteúdo já está presente no HTML inicial.
        *   **Otimizações Automáticas:** O Next.js otimiza imagens automaticamente (`next/image`), divide o código em pacotes menores (`code splitting`) e pré-carrega páginas em segundo plano (`prefetching`), tudo para melhorar a performance.

*   **React (Biblioteca de UI):**
    *   **O que é?** Uma biblioteca JavaScript para construir interfaces de usuário declarativas e baseadas em componentes.
    *   **Por que usamos?** É o padrão da indústria para o desenvolvimento de SPAs. Sua abordagem baseada em componentes nos permitiu criar uma UI modular e reutilizável. Por exemplo, o componente `<Card>` foi definido uma vez e reutilizado em dezenas de lugares, garantindo consistência visual e facilitando a manutenção.

*   **TypeScript (Linguagem):**
    *   **O que é?** Um superset do JavaScript que adiciona tipagem estática.
    *   **Por que usamos?** Em um projeto com uma estrutura de dados definida (perfis de usuário, registros, prêmios), o TypeScript é fundamental. Ele nos permite definir "contratos" para nossos dados (ex: `type UserProfile = { ... }`). Se tentarmos usar um dado de forma incorreta (ex: passar um número onde se espera uma string), o TypeScript nos avisa durante o desenvolvimento, antes que o erro chegue à produção. Isso torna o código drasticamente mais robusto e fácil de refatorar.

*   **Tailwind CSS & ShadCN/UI (Estilização e Componentes):**
    *   **O que é?** Tailwind CSS é um framework CSS *utility-first*, que oferece classes de baixo nível (como `p-4` para padding ou `flex` para flexbox) para construir designs diretamente no HTML. ShadCN/UI não é uma biblioteca de componentes tradicional; é uma coleção de componentes reutilizáveis (construídos com Tailwind) que você copia e cola no seu projeto, dando controle total sobre o código.
    *   **Por que usamos?** Essa combinação oferece o melhor dos dois mundos: a flexibilidade e o poder do Tailwind para criar qualquer design, e a conveniência de ter componentes de alta qualidade e acessíveis (como `Button`, `Card`, `Dialog`) prontos para usar, mas totalmente customizáveis. Isso acelerou enormemente o desenvolvimento da UI.

*   **Zod & React Hook Form (Validação de Formulários):**
    *   **O que são?** `react-hook-form` é uma biblioteca para gerenciamento de estado de formulários em React. `zod` é uma biblioteca para declaração e validação de esquemas de dados.
    *   **Por que usamos?** Usamos `zod` para definir o "shape" esperado dos dados de um formulário (ex: o campo `email` deve ser uma string e um e-mail válido). Em seguida, conectamos esse esquema ao `react-hook-form` usando o `@hookform/resolvers/zod`. O resultado é uma validação de formulário robusta, declarativa e com excelente feedback para o usuário, tudo com um código limpo e de fácil manutenção.

---

## **5. IMPLEMENTAÇÃO TÉCNICA DETALHADA**

Esta seção disseca a implementação prática do software Recycle+, desde a organização do código-fonte até os fluxos de dados para as funcionalidades mais críticas.

### **5.1. Estrutura de Pastas do Projeto**

A estrutura de diretórios foi organizada para promover a modularidade, a separação de responsabilidades e seguir as convenções do Next.js App Router:

```
/
├── public/                # ARQUIVOS ESTÁTICOS: Imagens, ícones, manifest.json.
├── src/
│   ├── app/               # ROTAS E PÁGINAS (App Router)
│   │   ├── dashboard/     # Layout e páginas do painel do usuário (rotas protegidas).
│   │   │   ├── log/         # Página de registro de reciclagem.
│   │   │   ├── profile/     # Página de perfil do usuário.
│   │   │   ├── rankings/    # Página de visualização de patentes.
│   │   │   ├── rewards/     # Página do catálogo de recompensas.
│   │   │   ├── layout.tsx   # Layout do dashboard (com sidebar).
│   │   │   └── page.tsx     # Página principal do dashboard (Visão Geral).
│   │   │
│   │   ├── login/         # Página de login.
│   │   ├── signup/        # Página de cadastro.
│   │   ├── layout.tsx     # Layout RAIZ da aplicação (inclui fontes e providers).
│   │   └── page.tsx       # Página inicial (Landing Page pública).
│   │
│   ├── components/        # COMPONENTES REACT REUTILIZÁVEIS
│   │   ├── ui/            # Componentes base da biblioteca ShadCN/UI (Button, Card, etc.).
│   │   ├── auth-layout.tsx  # Layout visual para as páginas de login/cadastro.
│   │   └── theme-toggle.tsx # Componente para alternar tema claro/escuro.
│   │
│   ├── firebase/          # CONFIGURAÇÃO E SERVIÇOS DO FIREBASE
│   │   ├── config.ts      # Chaves de configuração do projeto Firebase.
│   │   ├── provider.tsx   # Provedor de contexto que distribui os serviços Firebase.
│   │   ├── client-provider.tsx # Inicializador do Firebase no lado do cliente.
│   │   └── firestore/     # Hooks customizados para interagir com o Firestore.
│   │
│   ├── hooks/             # HOOKS REACT CUSTOMIZADOS
│   │   ├── use-toast.ts   # Hook para gerenciar o sistema de notificações.
│   │   └── use-mobile.ts  # Hook para detectar se o usuário está em um dispositivo móvel.
│   │
│   └── lib/               # FUNÇÕES UTILITÁRIAS E CONSTANTES
│       ├── utils.ts       # Funções utilitárias (ex: cn para classes Tailwind).
│       └── placeholder-images.json # Dados estáticos para os prêmios.
│
├── firestore.rules        # REGRAS DE SEGURANÇA DO CLOUD FIRESTORE
├── next.config.ts         # Configurações do Next.js (ex: domínios de imagem permitidos).
└── package.json           # Dependências (bibliotecas) e scripts do projeto.
```

### **5.2. Modelo de Dados no Cloud Firestore**

A estrutura de dados no Firestore foi projetada para ser segura, escalável e eficiente, utilizando um modelo de dados aninhado para garantir a propriedade dos dados.

*   **Coleção `/users`:**
    *   **Caminho:** `/users/{userId}`
    *   **Propósito:** Armazena o perfil público e o estado agregado de cada usuário. O `userId` é o mesmo ID único fornecido pelo Firebase Authentication.
    *   **Campos do Documento:**
        *   `username` (string): Nome de usuário público.
        *   `email` (string): E-mail de cadastro (usado para login).
        *   `registrationDate` (timestamp): Data e hora do cadastro.
        *   `totalPoints` (number): Pontuação atual disponível para resgate. É incrementada no registro e decrementada no resgate.
        *   `lifetimePoints` (number): Pontuação total já ganha. Usada para o sistema de ranking e nunca é decrementada.

*   **Subcoleção `/recycling_records`:**
    *   **Caminho:** `/users/{userId}/recycling_records/{recordId}`
    *   **Propósito:** Armazena cada registro individual de reciclagem de um usuário. Ao aninhar esta coleção sob o usuário, garantimos que só o dono dos dados pode listá-los, conforme as regras de segurança.
    *   **Campos do Documento:**
        *   `materialType` (string): Tipo de material (ex: "Garrafa").
        *   `quantity` (number): Quantidade registrada.
        *   `pointsEarned` (number): Pontos ganhos nesta transação específica.
        *   `recyclingDate` (timestamp): Data e hora do registro.

*   **Subcoleção `/redemptions`:**
    *   **Caminho:** `/users/{userId}/redemptions/{redemptionId}`
    *   **Propósito:** Armazena o histórico de resgates de prêmios de um usuário.
    *   **Campos do Documento:**
        *   `rewardName` (string): Nome do prêmio resgatado.
        *   `pointsDeducted` (number): Pontos que foram gastos no resgate.
        *   `redemptionDate` (timestamp): Data e hora do resgate.

*   **Coleção `/rewards` (se fosse dinâmica):**
    *   **Observação:** Em nosso projeto, para simplificar, os prêmios são carregados de um arquivo JSON estático (`placeholder-images.json`). Em uma evolução do projeto, eles seriam armazenados em uma coleção `/rewards` no Firestore para serem gerenciados por um administrador.
    *   **Campos do Documento:** `name`, `description`, `imageUrl`, `requiredPoints`.

### **5.3. Modelo de Segurança e Regras do Firestore**

A segurança é o pilar da nossa arquitetura de dados. O arquivo `firestore.rules` define as permissões de acesso diretamente no servidor do Firebase, tornando-as invioláveis pelo cliente.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // REGRA 1: Um usuário só pode ler e escrever em seu próprio documento de perfil.
    // Ninguém pode listar todos os usuários.
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // REGRA 2: Um usuário só pode criar, ler e deletar seus próprios registros
    // aninhados (reciclagem e resgate). A atualização é proibida para garantir
    // a imutabilidade dos registros históricos.
    match /users/{userId}/{subcollection}/{docId} {
      allow read, create, delete: if request.auth.uid == userId;
      allow update: if false; // Registros não podem ser alterados após a criação.
    }

    // REGRA 3 (Ilustrativa): Se tivéssemos uma coleção de prêmios, ela seria
    // de leitura pública, mas escrita bloqueada para clientes.
    match /rewards/{rewardId} {
      allow get, list: if true;
      allow write: if false; // Apenas um admin (via backend seguro) poderia escrever.
    }
  }
}
```
**Análise das Regras:**
*   A variável `request.auth.uid` é fornecida pelo Firebase e contém o ID do usuário autenticado que está fazendo a requisição.
*   A expressão `request.auth.uid == userId` é o coração da nossa segurança. Ela compara o ID do usuário logado com o ID do documento que ele está tentando acessar. A operação só é permitida se eles forem iguais.
*   Ao proibir `update` em registros históricos, garantimos a integridade do histórico do usuário. Para corrigir um erro, o usuário deve deletar o registro (o que reverte os pontos) e criar um novo.

### **5.4. Fluxos de Funcionalidades Críticas**

Vamos detalhar o fluxo de dados e interações para duas das operações mais importantes.

#### **5.4.1. Fluxo de Registro de Reciclagem**

1.  **Interação do Usuário:** Na página `/dashboard/log`, o usuário preenche o formulário (ex: "Garrafa", quantidade "10") e clica em "Registrar".
2.  **Validação no Frontend:** A biblioteca `React Hook Form` com o resolver `Zod` valida os dados de entrada no navegador. Se a quantidade for inválida (ex: 0 ou negativo), uma mensagem de erro é exibida sem que nenhuma requisição seja feita ao servidor.
3.  **Início da Transação:** Se a validação passar, a aplicação inicia uma **transação atômica** no Firestore. Uma transação garante que um grupo de operações (leitura e escrita) seja executado completamente, ou nenhuma delas é executada. Isso é crucial para evitar inconsistência de dados (ex: criar o registro mas falhar em atualizar os pontos).
4.  **Execução da Transação:**
    a.  **Leitura:** A transação primeiro lê o documento atual do usuário em `/users/{userId}` para obter os valores correntes de `totalPoints` e `lifetimePoints`.
    b.  **Cálculo:** A aplicação calcula os novos valores: `newTotalPoints = currentTotalPoints + pointsEarned` e `newLifetimePoints = currentLifetimePoints + pointsEarned`.
    c.  **Escrita (Update):** A transação agenda uma atualização no documento `/users/{userId}` com os novos valores de pontos.
    d.  **Escrita (Create):** A transação agenda a criação de um novo documento na subcoleção `/users/{userId}/recycling_records` com os detalhes do registro.
5.  **Commit da Transação:** O Firestore tenta "commitar" (aplicar) todas as operações agendadas. Se todas forem bem-sucedidas, os dados são salvos. Se ocorrer qualquer falha (ex: falta de permissão, conflito de escrita), toda a transação é revertida, e nada é salvo.
6.  **Feedback ao Usuário:** A aplicação recebe a confirmação de sucesso, exibe uma notificação ("Reciclagem Registrada! Você ganhou X pontos") e, como estamos usando *listeners* em tempo real (`useDoc`), a UI que exibe a pontuação do usuário é atualizada automaticamente, sem a necessidade de recarregar a página.

#### **5.4.2. Fluxo de Resgate de Prêmio**

1.  **Interação do Usuário:** Na página `/dashboard/rewards`, o usuário clica em "Resgatar" em um prêmio.
2.  **Validação no Frontend:** A aplicação primeiro verifica se `user.totalPoints >= reward.requiredPoints`. Se a condição for falsa, o botão já estaria desabilitado, mas uma verificação extra é feita.
3.  **Confirmação:** Um diálogo de confirmação é exibido para garantir que a ação é intencional.
4.  **Início da Transação:** Após a confirmação, uma transação atômica é iniciada, similarmente ao registro.
5.  **Execução da Transação:**
    a.  **Leitura e Validação no Servidor:** A transação lê o documento do usuário em `/users/{userId}`. Crucialmente, ela revalida no servidor se `userDoc.data().totalPoints >= reward.requiredPoints`. Isso previne uma condição de corrida onde o usuário poderia tentar resgatar dois prêmios simultaneamente com os mesmos pontos.
    b.  **Cálculo:** `newTotalPoints = currentTotalPoints - reward.requiredPoints`.
    c.  **Escrita (Update):** A transação agenda a atualização do campo `totalPoints` no documento do usuário.
    d.  **Escrita (Create):** A transação agenda a criação de um novo documento em `/users/{userId}/redemptions` para registrar o resgate.
6.  **Commit e Feedback:** O processo de commit e feedback ao usuário é idêntico ao do fluxo de registro.

---

## **6. ANÁLISE DETALHADA DA INTERFACE DO USUÁRIO**

Esta seção descreve em detalhes cada tela da aplicação Recycle+, explicando o propósito de cada componente de interface e como eles se combinam para criar um fluxo de usuário coeso e intuitivo.

### **6.1. Telas Públicas (Acesso Não Autenticado)**

#### **6.1.1. Landing Page (`/`)**

Esta é a porta de entrada da aplicação, projetada para atrair e informar novos usuários.

*   **Header (Cabeçalho):**
    *   **Logo e Nome (`Recycle+`):** Estabelece a identidade da marca. Clicável, leva de volta para a própria landing page.
    *   **Botão `Entrar`:** Um botão com estilo `ghost` (transparente), de menor destaque, destinado a usuários que já possuem conta. Leva para a página de login (`/login`).
    *   **Botão `Criar Conta`:** Botão principal (com cor de destaque), com um apelo claro à ação (Call to Action - CTA) para novos usuários. Leva para a página de cadastro (`/signup`).
    *   **Seletor de Tema (Sol/Lua):** Permite ao usuário alternar entre os temas claro e escuro, respeitando sua preferência visual e melhorando o conforto de leitura em diferentes ambientes de iluminação.

*   **Seção Hero:**
    *   **Título Principal:** "Transforme lixo em recompensas com o Recycle+". Frase de impacto que resume a proposta de valor.
    *   **Subtítulo:** Explica brevemente o que o aplicativo faz: registrar, acumular pontos e trocar por prêmios.
    *   **Botões de Ação (`Comece a Reciclar` e `Saber Mais`):** O primeiro é o CTA principal, levando ao cadastro. O segundo é um link interno (`#como-funciona`) para usuários que desejam mais informações antes de se comprometer.

*   **Seção "Como Funciona":**
    *   **Três Cards:** "Registre", "Ganhe Pontos", "Resgate Prêmios". Cada card possui um ícone, um título e uma descrição curta, explicando o ciclo de gamificação de forma visual e rápida.

*   **Seção "Prêmios em Destaque":**
    *   **Grid de Imagens:** Mostra uma prévia dos prêmios disponíveis para resgate. As imagens são atraentes e servem como um forte incentivo visual.
    *   **Botão "Ver todos os prêmios":** Outro CTA que leva o usuário para a página de cadastro, criando um senso de curiosidade.

*   **Footer (Rodapé):**
    *   **Copyright:** Informação padrão de direitos autorais.

#### **6.1.2. Página de Login (`/login`)**

Interface focada e sem distrações para que o usuário acesse sua conta.

*   **Layout de Autenticação:**
    *   **Logo e Slogan:** Reforça a identidade visual e o propósito da plataforma.
    *   **Botão `Voltar ao Início`:** Permite que o usuário retorne facilmente para a landing page.
*   **Card de Login:**
    *   **Campo `Email`:** Input de texto para o e-mail do usuário.
    *   **Campo `Senha`:** Input de senha (tipo `password`) que oculta os caracteres digitados. Inclui um ícone de olho (`<Eye />`/`<EyeOff />`) que, ao ser clicado, alterna a visibilidade da senha. Essa funcionalidade melhora a usabilidade, permitindo que o usuário verifique o que digitou e reduza erros de digitação.
    *   **Botão `Entrar`:** Botão principal para submeter o formulário. Fica em estado de "carregando" durante a autenticação.
    *   **Separador "Ou continue com":** Divide as opções de login.
    *   **Botão `Google`:** Permite o login com um clique via OAuth, uma alternativa de baixa fricção ao login tradicional.
    *   **Link `Crie uma agora`:** Para usuários que chegaram a esta página por engano e ainda não têm uma conta. Leva para `/signup`.

#### **6.1.3. Página de Cadastro (`/signup`)**

Similar à página de login, mas com campos adicionais para a criação de uma nova conta.

*   **Card de Cadastro:**
    *   **Campo `Email`:** Para o novo usuário inserir seu e-mail.
    *   **Campo `Nome de usuário`:** Para definir um nome de exibição na plataforma.
    *   **Campo `Senha`:** Para definir a senha da nova conta, também equipado com o ícone de olho para alternar a visibilidade.
    *   **Botão `Criar Conta`:** Submete o formulário, cria a conta no Firebase Authentication e o perfil no Firestore.
    *   **Link `Faça login`:** Para usuários que já têm conta e clicaram em "Criar Conta" por engano.

### **6.2. Telas do Dashboard (Acesso Autenticado)**

Após o login, o usuário entra no ambiente privado da aplicação, que possui um layout consistente.

#### **6.2.1. Layout do Dashboard (`/dashboard/*`)**

Este é o esqueleto que envolve todas as telas autenticadas.

*   **Sidebar (Barra Lateral):**
    *   **Logo e Nome:** Mantém a identidade visual.
    *   **Menu de Navegação:** Uma lista vertical de botões com ícones e texto: `Visão Geral`, `Registrar Reciclagem`, `Rankings`, `Resgatar Prêmios`, `Perfil`. O item correspondente à página atual fica destacado. Em telas menores (mobile), a sidebar é recolhida e pode ser aberta por um botão "hambúrguer".
    *   **Menu Inferior:** Contém um botão `Sair` (logout) e um atalho para a `Página Inicial`.
*   **Header (Cabeçalho Superior):**
    *   **Título da Página:** Exibe o nome da seção atual (ex: "Visão Geral", "Perfil").
    *   **Seletor de Tema:** Um botão com ícone de sol/lua que permite ao usuário alternar entre o tema claro e escuro a qualquer momento, proporcionando maior conforto visual.
    *   **Avatar e Nome do Usuário:** Mostra a foto (se disponível) e o nome do usuário, confirmando sua identidade e oferecendo um toque de personalização.

#### **6.2.2. Visão Geral (`/dashboard`)**

A página principal do dashboard, oferecendo um resumo das informações mais importantes.

*   **Cards de Estatísticas:**
    *   **`Pontos para Resgate`:** Card de maior destaque, mostrando o saldo atual de `totalPoints`. Usa a cor primária para chamar a atenção.
    *   **`Pontos para Ranking`:** Mostra o total de `lifetimePoints`, ajudando o usuário a entender a base para sua patente.
*   **Tabela de "Atividade Recente":**
    *   **Propósito:** Fornece um feedback imediato sobre as últimas ações do usuário.
    *   **Linhas da Tabela:** Cada linha representa um registro de reciclagem ou um resgate de prêmio.
    *   **Colunas:**
        *   `Item`: Mostra o nome do material reciclado ou do prêmio resgatado, com um ícone correspondente.
        *   `Data`: Exibe há quanto tempo a atividade ocorreu (ex: "há 5 minutos"), de forma amigável.
        *   `Pontos`: Uma "badge" (etiqueta) colorida. Verde com `+` para ganhos (reciclagem) e vermelha com `-` para gastos (resgate).
        *   `Ação`: Um ícone de lixeira (`<Trash2 />`) que permite ao usuário excluir uma atividade. Esta ação abre um diálogo de confirmação para evitar exclusões acidentais.
    *   **Botão `Excluir Histórico`:** Uma ação mais drástica que apaga todos os registros de atividades, também protegida por um diálogo de confirmação.

#### **6.2.3. Registrar Reciclagem (`/dashboard/log`)**

O coração da funcionalidade do aplicativo.

*   **Cards de Material:** A tela é dividida em cards, um para cada tipo de material reciclável (ex: "Garrafa", "Tampinha"). Cada card contém:
    *   **Ícone e Nome do Material:** Identificação visual clara.
    *   **Descrição:** Explica o que se enquadra naquela categoria.
    *   **Campo `Quantidade`:** Um input numérico para o usuário inserir a quantidade de itens que reciclou.
    *   **Botão `Registrar Reciclagem`:** Submete o formulário para aquele material específico. O botão mostra um estado de "carregando" para dar feedback durante o envio.

#### **6.2.4. Rankings (`/dashboard/rankings`)**

Tela dedicada à gamificação e ao progresso a longo prazo.

*   **Card de Patente Atual:**
    *   **Ícone e Nome da Patente:** Exibe de forma proeminente a patente atual do usuário (ex: "Aprendiz", "Guardião").
    *   **Pontuação Total:** Mostra os `lifetimePoints` do usuário.
    *   **Barra de Progresso:** Um elemento visual que mostra o quão perto o usuário está de alcançar a próxima patente.
    *   **Texto de Incentivo:** Informa quantos pontos faltam para o próximo nível.
*   **Lista "Todas as Patentes":**
    *   Mostra todas as patentes possíveis no sistema, da mais baixa à mais alta, com seus respectivos ícones e a pontuação necessária. Isso funciona como um "mapa" para o usuário, mostrando a jornada de progressão.

#### **6.2.5. Resgatar Prêmios (`/dashboard/rewards`)**

A vitrine de recompensas, onde os pontos se transformam em valor tangível.

*   **Grid de Prêmios:** Os prêmios são exibidos em um grid de cards. Cada card de prêmio contém:
    *   **Imagem do Prêmio:** O principal apelo visual.
    *   **Nome e Descrição:** Informações sobre o produto.
    *   **Custo em Pontos:** Uma "badge" com o ícone de moedas, mostrando claramente o valor do prêmio.
    *   **Botão `Resgatar`:** O botão principal da ação. Crucialmente, **este botão é desabilitado e muda de cor/texto para "Pontos insuficientes"** se o usuário não tiver saldo (`totalPoints`) para resgatar aquele prêmio. Ao clicar, um diálogo de confirmação previne resgates acidentais.

#### **6.2.6. Perfil (`/dashboard/profile`)**

Área para gerenciamento de dados pessoais e configurações da conta.

*   **Banner de Perfil:** Uma seção visualmente destacada com o avatar, nome e e-mail do usuário.
*   **Sistema de Abas:** Organiza as configurações em seções para não sobrecarregar o usuário.
    *   **Aba `Perfil`:**
        *   **Formulário:** Contém campos para alterar `Nome de usuário` e `Data de Nascimento`.
        *   **Botão `Salvar Alterações`:** Persiste as mudanças no Firebase.
    *   **Aba `Segurança`:**
        *   **Formulário de Alteração de Senha:** Contém campos para `Senha Atual` e `Nova Senha`. Este formulário só é exibido se o usuário não estiver logado com o Google. Se for um usuário do Google, uma mensagem informativa é exibida. O campo de senha também possui a funcionalidade de "ver senha".
    *   **Aba `Zona de Perigo`:**
        *   **Ações Destrutivas:** Contém botões para ações que não podem ser desfeitas, como `Resetar Meus Pontos`.
        *   **Diálogo de Confirmação:** Cada botão nesta aba abre uma caixa de diálogo que força o usuário a confirmar a ação, explicando as consequências.

---

## **7. TESTES E VALIDAÇÃO**

Para garantir a qualidade e a robustez da aplicação, uma estratégia de testes focada na validação do comportamento dos componentes da interface do usuário foi adotada.

### **7.1. Estratégia de Testes: Testes de Unidade de Componentes**

A estratégia principal foi a de **testes de unidade automatizados** para os componentes React. O objetivo não era testar a lógica de negócio inteira, mas sim validar que cada peça da UI (componente) se comporta como esperado de forma isolada.

Isso significa que testamos:
*   Se o componente é renderizado corretamente com as propriedades (props) fornecidas.
*   Se ele reage a interações do usuário (como cliques) da maneira esperada.
*   Se ele exibe os estados corretos (como `disabled` ou `loading`).

### **7.2. Ferramentas de Teste: Jest e React Testing Library**

*   **Jest:** É o framework de testes que utilizamos. Ele fornece o ambiente para executar os testes, criar "mocks" (simulações de funções ou módulos) e fazer asserções (verificar se um resultado é o esperado).
*   **React Testing Library (RTL):** É uma biblioteca para testar componentes React que incentiva boas práticas. Em vez de testar detalhes de implementação (como o estado interno de um componente), a RTL nos força a testar os componentes da mesma forma que um usuário os utilizaria: procurando por textos, botões e outros elementos na tela e interagindo com eles.

### **7.3. Exemplo de Caso de Teste**

O teste mais simples e fundamental que implementamos foi para o componente `<Button />`.

*   **Arquivo:** `src/components/ui/__tests__/Button.test.tsx`
*   **Descrição:** Este arquivo contém um conjunto de testes (test suite) para o componente `Button`.
*   **Caso de Teste 1 (CT01): Renderização com Sucesso**
    *   **Cenário:** Queremos garantir que o botão é renderizado na tela com o texto correto.
    *   **Ação (Automatizada):** O teste renderiza o componente `<Button>` passando um texto como filho (ex: "Clique Aqui").
    *   **Verificação (Automatizada):** A RTL procura na tela por um elemento com o `role` "button" e o nome acessível "Clique Aqui".
    *   **Critério de Aceite:** A asserção `expect(buttonElement).toBeInTheDocument()` deve ser verdadeira. Se o botão não for encontrado, o teste falha.
*   **Caso de Teste 2 (CT02): Estado Desabilitado**
    *   **Cenário:** Queremos garantir que o botão pode ser desabilitado.
    *   **Ação (Automatizada):** O teste renderiza o componente `<Button>` com a propriedade `disabled`.
    *   **Verificação (Automatizada):** A RTL encontra o botão e verifica seu estado.
    *   **Critério de Aceite:** A asserção `expect(buttonElement).toBeDisabled()` deve ser verdadeira.

Embora simples, esses testes garantem que uma das peças mais fundamentais da nossa UI funcione corretamente e que futuras alterações não quebrem seu comportamento esperado.

---

## **8. CONCLUSÃO**

### **8.1. Resultados Alcançados**

O componente de software do projeto Recycle+ foi concluído com sucesso, resultando em uma aplicação web totalmente funcional, segura, escalável e que atende a todos os requisitos funcionais e não funcionais definidos na fase de engenharia. A plataforma representa uma prova de conceito robusta para a hipótese central do projeto: a de que a gamificação pode ser uma ferramenta poderosa para catalisar a mudança de comportamento e fomentar práticas sustentáveis.

Conseguimos construir uma ponte digital eficiente entre o esforço individual do cidadão e o processo de economia circular gerenciado pela equipe de Engenharia de Plásticos, validando a sinergia interdisciplinar que fundamenta o projeto.

### **8.2. Limitações do Projeto na Versão Atual**

É importante reconhecer as limitações do estado atual do sistema, que abrem caminho para trabalhos futuros:

*   **Validação Baseada em Autodeclaração:** O sistema atual opera com base na confiança, onde os usuários autodeclaram suas atividades de reciclagem. Não há um mecanismo de validação física para confirmar se os materiais foram de fato reciclados.
*   **Logística de Entrega de Prêmios:** A aplicação gerencia o resgate de pontos, mas não a logística de entrega dos prêmios físicos, que precisaria ser coordenada manualmente nesta fase.
*   **Gerenciamento de Conteúdo Estático:** O catálogo de prêmios é atualmente gerenciado através de um arquivo JSON estático, o que exige uma alteração no código-fonte para ser atualizado.

### **8.3. Trabalhos Futuros e Propostas de Evolução**

A arquitetura modular e escalável da aplicação permite uma vasta gama de evoluções futuras. Algumas das propostas mais impactantes incluem:

*   **Sistema de Validação por QR Code:** Implementar uma funcionalidade onde pontos de coleta parceiros (cooperativas, supermercados) possam validar a entrega de material. O usuário levaria seu material, receberia um QR Code único (representando a quantidade pesada), e escanearia este código no app para receber os pontos. Isso eliminaria a limitação da autodeclaração.
*   **Módulo Administrativo:** Criar um painel de administração protegido onde a equipe de Plásticos possa gerenciar dinamicamente o catálogo de prêmios (adicionar/remover produtos, alterar custos em pontos) sem a necessidade de intervenção da equipe de software.
*   **Funcionalidades Sociais:** Potencializar o engajamento através de funcionalidades sociais, como:
    *   **Rankings de Amigos:** Permitir que usuários se conectem e vejam um ranking privado apenas com seus amigos.
    *   **Desafios Comunitários:** Criar metas coletivas para a comunidade (ex: "Reciclar 5.000 garrafas em um mês") com recompensas para todos que participarem.
    *   **Compartilhamento em Redes Sociais:** Facilitar o compartilhamento de conquistas (novas patentes, prêmios resgatados) em redes sociais.

Essas evoluções transformariam o Recycle+ de uma ferramenta de incentivo individual para uma plataforma de engajamento comunitário, amplificando ainda mais seu potencial de impacto socioambiental.

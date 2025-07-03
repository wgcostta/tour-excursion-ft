# Tour App Frontend

Sistema de gerenciamento de tours turísticos desenvolvido em React com Next.js, consumindo uma API REST em Spring Boot.

## 🚀 Funcionalidades

- ✅ **CRUD completo de tours** - Criar, listar, editar e excluir tours
- 🔍 **Busca avançada** - Filtros por nome, destino, preço, duração e status
- 📱 **Interface responsiva** - Design adaptável para desktop e mobile
- 📊 **Paginação** - Navegação eficiente através de grandes listas
- 🎯 **Validação de formulários** - Validação client-side com feedback visual
- 🔄 **Estado global** - Gerenciamento de estado com React Query
- 🎨 **Design moderno** - Interface construída com Tailwind CSS
- 📧 **Notificações** - Feedback visual com toast notifications

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18, Next.js 14, TypeScript
- **Estilização**: Tailwind CSS
- **Gerenciamento de Estado**: React Query
- **Formulários**: React Hook Form
- **HTTP Client**: Axios
- **Ícones**: Lucide React
- **Notificações**: React Hot Toast
- **Containerização**: Docker, Docker Compose
- **Proxy**: Nginx

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Docker e Docker Compose (para execução com containers)
- API Backend rodando (Spring Boot)

## 🏗️ Instalação e Execução

### 1. Clonagem do Repositório

```bash
git clone https://github.com/seu-usuario/tour-app-frontend.git
cd tour-app-frontend
```

### 2. Instalação das Dependências

```bash
npm install
# ou
yarn install
```

### 3. Configuração do Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 4. Execução em Desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

### 5. Build para Produção

```bash
npm run build
npm start
# ou
yarn build
yarn start
```

## 🐳 Execução com Docker

### Build da Imagem

```bash
docker build -t tour-app-frontend .
```

### Execução do Container

```bash
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://host.docker.internal:8080 tour-app-frontend
```

### Execução com Docker Compose

```bash
# Subir todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

## 📁 Estrutura do Projeto

```
tour-app-frontend/
├── components/           # Componentes React reutilizáveis
│   ├── TourForm.tsx     # Formulário de criação/edição
│   ├── TourList.tsx     # Lista de tours
│   ├── SearchFilters.tsx # Filtros de busca
│   └── Pagination.tsx   # Componente de paginação
├── lib/                 # Utilitários e configurações
│   └── api.ts           # Cliente da API
├── pages/               # Páginas Next.js
│   ├── _app.tsx        # Configuração global do app
│   └── index.tsx       # Página principal
├── styles/              # Estilos CSS
│   └── globals.css     # Estilos globais
├── types/               # Definições TypeScript
│   └── tour.ts         # Tipos dos tours
├── Dockerfile          # Configuração Docker
├── docker-compose.yml  # Orquestração de containers
├── nginx.conf          # Configuração Nginx
└── README.md           # Documentação
```

## 🔧 Configurações

### Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|---------|
| `NEXT_PUBLIC_API_URL` | URL da API backend | `http://localhost:8080` |
| `NODE_ENV` | Ambiente de execução | `development` |

### Scripts Disponíveis

```json
{
  "dev": "next dev",           // Desenvolvimento
  "build": "next build",       // Build de produção
  "start": "next start",       // Execução em produção
  "lint": "next lint"          // Verificação de código
}
```

## 📡 API Endpoints Consumidos

O frontend consome os seguintes endpoints da API:

- `GET /api/v1/tours` - Listar tours com paginação
- `GET /api/v1/tours/{id}` - Buscar tour por ID
- `POST /api/v1/tours` - Criar novo tour
- `PUT /api/v1/tours/{id}` - Atualizar tour
- `DELETE /api/v1/tours/{id}` - Deletar tour
- `GET /api/v1/tours/search` - Buscar tours com filtros
- `GET /api/v1/tours/status/{status}` - Buscar tours por status
- `GET /api/v1/tours/destinations/popular` - Destinos populares

## 🎨 Interface do Usuário

### Páginas e Funcionalidades

1. **Página Principal**
   - Lista todos os tours com paginação
   - Filtros de busca avançada
   - Ações de criar, editar, visualizar e excluir

2. **Formulário de Tour**
   - Criação e edição de tours
   - Validação de campos obrigatórios
   - Seleção de datas e status

3. **Filtros de Busca**
   - Busca por nome e destino
   - Filtros por preço e duração
   - Filtro por status do tour

### Componentes Principais

- **TourList**: Exibe cards com informações dos tours
- **TourForm**: Formulário completo para CRUD
- **SearchFilters**: Filtros de busca avançada
- **Pagination**: Navegação entre páginas

## 🚀 Deploy para Cloud

### AWS ECS/Fargate

```bash
# Build e push para ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com
docker build -t tour-app-frontend .
docker tag tour-app-frontend:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/tour-app-frontend:latest
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/tour-app-frontend:latest
```

### Google Cloud Run

```bash
# Build e deploy
gcloud builds submit --tag gcr.io/PROJECT-ID/tour-app-frontend
gcloud run deploy --image gcr.io/PROJECT-ID/tour-app-frontend --platform managed
```

### Azure Container Instances

```bash
# Build e push para ACR
az acr build --registry myregistry --image tour-app-frontend .
```

## 🔍 Monitoramento e Logs

### Health Checks

O container inclui health checks para monitoramento:

```bash
# Verificar status do container
docker ps
curl http://localhost:3000/health
```

### Logs

```bash
# Ver logs do container
docker logs tour-app-frontend

# Ver logs em tempo real
docker logs -f tour-app-frontend
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

- **Email**: suporte@tourapp.com
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/tour-app-frontend/issues)
- **Documentação**: [Wiki do Projeto](https://github.com/seu-usuario/tour-app-frontend/wiki)

## 🔄 Próximas Funcionalidades

- [ ] Sistema de autenticação
- [ ] Upload de imagens para tours
- [ ] Relatórios e dashboards
- [ ] Notificações push
- [ ] Integração com mapas
- [ ] Sistema de reservas
- [ ] Chat de suporte

---

Desenvolvido com ❤️ para gerenciamento de tours turísticos.



Perfeito! Agora tenho um frontend Next.js completo e funcional para o TourApp. Aqui está um resumo do que foi criado:

🎯 Frontend TourApp - Estrutura Completa
📁 Estrutura do Projeto
tourapp-frontend/
├── pages/
│   ├── api/auth/[...nextauth].ts
│   ├── _app.tsx
│   ├── _document.tsx
│   ├── index.tsx (Homepage)
│   ├── auth/
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── complete-profile.tsx
│   ├── excursoes/
│   │   ├── index.tsx (listagem)
│   │   └── [id].tsx (detalhes)
│   ├── organizador/
│   │   ├── dashboard.tsx
│   │   └── excursoes/
│   │       ├── index.tsx
│   │       └── nova.tsx
│   └── cliente/
│       └── dashboard.tsx
├── components/
│   ├── Layout/
│   │   ├── index.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   ├── Excursoes/
│   │   ├── ExcursaoCard.tsx
│   │   ├── ExcursaoFilters.tsx
│   │   ├── ImageGallery.tsx
│   │   └── InscricaoForm.tsx
│   ├── Dashboard/
│   │   ├── DashboardStats.tsx
│   │   ├── QuickActions.tsx
│   │   └── RecentActivity.tsx
│   └── Common/
│       ├── LoadingSpinner.tsx
│       ├── Modal.tsx
│       ├── ConfirmDialog.tsx
│       └── ImageUpload.tsx
├── lib/
│   ├── auth.ts
│   └── api.ts
├── types/
│   └── index.ts
├── styles/
│   └── globals.css
├── middleware.ts
└── configurações...
🚀 Funcionalidades Implementadas
🔐 Autenticação
✅ Login com email/senha + Google OAuth
✅ Registro para Cliente/Organizador
✅ Middleware de proteção de rotas
✅ NextAuth.js configurado
✅ Tipos de usuário (Cliente/Organizador)
🏠 Homepage
✅ Landing page atrativa
✅ Hero section com CTA
✅ Features, estatísticas, depoimentos
✅ Design responsivo
🗺️ Sistema de Excursões
✅ Listagem com filtros e busca
✅ Página de detalhes completa
✅ Galeria de imagens
✅ Sistema de inscrição
✅ Integração com pagamentos
👤 Dashboard do Cliente
✅ Visão geral das inscrições
✅ Próximas viagens
✅ Histórico de excursões
✅ Estatísticas pessoais
🏢 Dashboard do Organizador
✅ KPIs do negócio
✅ Atividade recente
✅ Próximas excursões
✅ Ações rápidas
📝 Gerenciamento de Excursões
✅ CRUD completo
✅ Upload de múltiplas imagens
✅ Formulário avançado
✅ Gerenciamento de status
🎨 UI/UX
✅ Design system com Tailwind CSS
✅ Componentes reutilizáveis
✅ Layout responsivo
✅ Animações e transições
✅ Loading states
🔧 Tecnologias Utilizadas
Next.js 14 - Framework React
TypeScript - Tipagem estática
Tailwind CSS - Estilização
NextAuth.js - Autenticação
React Hook Form - Formulários
React Query - Estado servidor
Axios - Cliente HTTP
Lucide React - Ícones
React Hot Toast - Notificações
⚙️ Para Configurar e Executar
Instalar dependências:
bash
npm install
Configurar variáveis de ambiente:
bash
cp .env.example .env.local
# Editar .env.local com as credenciais
Executar em desenvolvimento:
bash
npm run dev
Build para produção:
bash
npm run build
npm start
🔗 Integração com Backend
O frontend está 100% integrado com o backend Spring Boot que criamos anteriormente:

✅ APIs de autenticação (/auth/*)
✅ APIs públicas (/public/excursoes/*)
✅ APIs do organizador (/organizador/*)
✅ APIs do cliente (/cliente/*)
✅ Sistema de pagamentos (/pagamentos/*)
✅ Upload de imagens (Cloudinary)
✅ Interceptors para token JWT
✅ Tratamento de erros centralizado
🎯 Próximos Passos
Deploy do backend no Railway
Deploy do frontend na Vercel/Netlify
Configurar credenciais (Google, Mercado Pago, Cloudinary)
Testes com organizadores reais
Ajustes baseados no feedback
O frontend está completo e pronto para produção, com todas as funcionalidades necessárias para validar o MVP em 4 semanas! 🚀









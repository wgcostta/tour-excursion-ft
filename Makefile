# Makefile para Tour App Frontend

# Variáveis
PROJECT_NAME = tour-app-frontend
DOCKER_IMAGE = $(PROJECT_NAME)
DOCKER_TAG = latest
REGISTRY = your-registry.com
PORT = 3000

# Cores para output
GREEN = \033[0;32m
YELLOW = \033[1;33m
RED = \033[0;31m
NC = \033[0m # No Color

.PHONY: help install dev build start test lint format clean docker-build docker-run docker-push deploy

# Comando padrão
help: ## Mostra este menu de ajuda
	@echo "$(GREEN)Tour App Frontend - Comandos Disponíveis$(NC)"
	@echo ""
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Comandos de desenvolvimento
install: ## Instala as dependências do projeto
	@echo "$(GREEN)Instalando dependências...$(NC)"
	npm install

dev: ## Inicia o servidor de desenvolvimento
	@echo "$(GREEN)Iniciando servidor de desenvolvimento...$(NC)"
	npm run dev

build: ## Gera build de produção
	@echo "$(GREEN)Gerando build de produção...$(NC)"
	npm run build

start: ## Inicia o servidor de produção
	@echo "$(GREEN)Iniciando servidor de produção...$(NC)"
	npm start

# Comandos de qualidade de código
lint: ## Executa verificação de lint
	@echo "$(GREEN)Executando ESLint...$(NC)"
	npm run lint

lint-fix: ## Corrige problemas de lint automaticamente
	@echo "$(GREEN)Corrigindo problemas de lint...$(NC)"
	npm run lint -- --fix

format: ## Formata código com Prettier
	@echo "$(GREEN)Formatando código...$(NC)"
	npx prettier --write .

type-check: ## Verifica tipos TypeScript
	@echo "$(GREEN)Verificando tipos TypeScript...$(NC)"
	npx tsc --noEmit

# Comandos de Docker
docker-build: ## Faz build da imagem Docker
	@echo "$(GREEN)Fazendo build da imagem Docker...$(NC)"
	docker build -t $(DOCKER_IMAGE):$(DOCKER_TAG) .

docker-run: ## Executa container Docker
	@echo "$(GREEN)Executando container Docker...$(NC)"
	docker run -p $(PORT):$(PORT) --env-file .env.local $(DOCKER_IMAGE):$(DOCKER_TAG)

docker-run-detached: ## Executa container Docker em background
	@echo "$(GREEN)Executando container Docker em background...$(NC)"
	docker run -d -p $(PORT):$(PORT) --env-file .env.local --name $(PROJECT_NAME) $(DOCKER_IMAGE):$(DOCKER_TAG)

docker-stop: ## Para container Docker
	@echo "$(GREEN)Parando container Docker...$(NC)"
	docker stop $(PROJECT_NAME) || true
	docker rm $(PROJECT_NAME) || true

docker-push: ## Faz push da imagem para registry
	@echo "$(GREEN)Fazendo push para registry...$(NC)"
	docker tag $(DOCKER_IMAGE):$(DOCKER_TAG) $(REGISTRY)/$(DOCKER_IMAGE):$(DOCKER_TAG)
	docker push $(REGISTRY)/$(DOCKER_IMAGE):$(DOCKER_TAG)

# Comandos de Docker Compose
compose-up: ## Sobe todos os serviços com Docker Compose
	@echo "$(GREEN)Subindo serviços com Docker Compose...$(NC)"
	docker-compose up -d

compose-down: ## Para todos os serviços do Docker Compose
	@echo "$(GREEN)Parando serviços do Docker Compose...$(NC)"
	docker-compose down

compose-logs: ## Mostra logs do Docker Compose
	@echo "$(GREEN)Mostrando logs do Docker Compose...$(NC)"
	docker-compose logs -f

compose-build: ## Faz rebuild dos serviços
	@echo "$(GREEN)Fazendo rebuild dos serviços...$(NC)"
	docker-compose build

# Comandos de deploy
deploy-staging: ## Deploy para ambiente de staging
	@echo "$(GREEN)Fazendo deploy para staging...$(NC)"
	@echo "$(YELLOW)Implementar comandos específicos do seu provedor de cloud$(NC)"

deploy-production: ## Deploy para ambiente de produção
	@echo "$(GREEN)Fazendo deploy para produção...$(NC)"
	@echo "$(YELLOW)Implementar comandos específicos do seu provedor de cloud$(NC)"

# Comandos de limpeza
clean: ## Remove arquivos de build e cache
	@echo "$(GREEN)Limpando arquivos temporários...$(NC)"
	rm -rf .next
	rm -rf node_modules/.cache
	rm -rf dist
	rm -rf out

clean-all: clean ## Remove tudo incluindo node_modules
	@echo "$(GREEN)Removendo node_modules...$(NC)"
	rm -rf node_modules

# Comandos de backup
backup-db: ## Faz backup do banco de dados (se aplicável)
	@echo "$(GREEN)Fazendo backup do banco...$(NC)"
	@echo "$(YELLOW)Implementar comando de backup$(NC)"

# Comandos de monitoramento
health-check: ## Verifica saúde da aplicação
	@echo "$(GREEN)Verificando saúde da aplicação...$(NC)"
	curl -f http://localhost:$(PORT)/api/health || exit 1

logs: ## Mostra logs da aplicação
	@echo "$(GREEN)Mostrando logs...$(NC)"
	docker logs $(PROJECT_NAME) -f 2>/dev/null || echo "$(RED)Container não está rodando$(NC)"

# Comandos de setup inicial
setup: install ## Setup inicial completo do projeto
	@echo "$(GREEN)Setup inicial...$(NC)"
	@if [ ! -f .env.local ]; then \
		echo "$(YELLOW)Criando .env.local...$(NC)"; \
		cp .env.example .env.local; \
	fi
	@echo "$(GREEN)Setup concluído!$(NC)"
	@echo "$(YELLOW)Não se esqueça de configurar as variáveis em .env.local$(NC)"

# Comandos de utilitário
open: ## Abre a aplicação no navegador
	@echo "$(GREEN)Abrindo aplicação no navegador...$(NC)"
	@command -v xdg-open > /dev/null && xdg-open http://localhost:$(PORT) || \
	 command -v open > /dev/null && open http://localhost:$(PORT) || \
	 echo "$(YELLOW)Abra http://localhost:$(PORT) no seu navegador$(NC)"

ps: ## Mostra processos Node.js rodando
	@echo "$(GREEN)Processos Node.js:$(NC)"
	@ps aux | grep node | grep -v grep || echo "$(YELLOW)Nenhum processo Node.js encontrado$(NC)"

# Comando de desenvolvimento completo
dev-full: setup dev ## Setup completo + desenvolvimento

# Comando de produção completa
prod-full: build docker-build docker-run ## Build + Docker + Run
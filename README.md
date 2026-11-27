
# CEDROIPE 360 — CENTRAL MASTER DO PROJETO

## 1. IDENTIFICAÇÃO

Projeto: CedroIpê 360
Tipo: SaaS multi-tenant e white-label
Segmento piloto: Imobiliário
Expansão: Multissetorial
Repositório: adeildor26/CedroIpe360
Branch principal: main
Site oficial: https://cedroipeimoveis.pages.dev
Hospedagem: Cloudflare Pages
Banco: Supabase PostgreSQL
Automação: n8n
WhatsApp: Evolution API
IA prioritária: Ollama
IA alternativa: OpenAI

## 2. REGRA PRINCIPAL DE DESENVOLVIMENTO

- Trabalhar diretamente com o repositório e Cloudflare.
- Não utilizar pastas locais como fluxo obrigatório.
- Não solicitar novamente informações já documentadas.
- Não duplicar módulos, tabelas, funções ou workflows.
- Preservar estruturas existentes e dados cadastrados.
- Fazer backup antes de alterações estruturais.
- Testar antes de publicar em produção.
- Registrar todas as alterações.
- Manter compatibilidade com o Supabase existente.
- Não solicitar credenciais já configuradas.
- Nunca armazenar senhas, tokens, JWTs ou chaves privadas neste repositório.

## 3. INFRAESTRUTURA

### Cloudflare
Projeto: cedroipeimoveis
Domínio: cedroipeimoveis.pages.dev
Branch: main
Publicação: Cloudflare Pages

### GitHub
Conta: adeildor26
Repositório: CedroIpe360
Branch principal: main

### Supabase
Banco: PostgreSQL
RLS: habilitado nas estruturas protegidas.
Multi-tenant: imobiliaria_id.
Autorização: perfis, cargos e permissões.

Credenciais devem permanecer nos ambientes seguros.

## 4. MÓDULOS DO SISTEMA

### Administração
- Painel geral
- Usuários e profissionais
- Cargos e permissões
- Regionais e unidades
- Cadastro de imóveis
- Configurações por imobiliária

### CRM
- Cadastro de leads
- Carteira de clientes
- Distribuição de leads
- Funil comercial
- Histórico de atendimento
- Qualificação financeira
- Agendamentos
- Transferência de responsáveis
- Controle de produtividade

### Inteligência Artificial
- Atendimento automático
- Consulta ao Supabase
- Memória persistente
- Histórico de mensagens
- Qualificação de clientes
- Respostas fundamentadas no catálogo
- Transferência para atendimento humano
- Ollama prioritário
- OpenAI como fallback

### Marketing
- Campanhas
- Anúncios
- Facebook e Instagram
- Google Ads
- WhatsApp
- Histórico de campanhas
- Métricas de conversão
- Aprovação de conteúdo

### Financeiro
- Receitas
- Despesas
- Contas
- Centros de custos
- Comprovantes
- Indicadores financeiros

### Relatórios Inteligentes
Não utilizar planilhas como painel principal.

Criar dashboards interativos com:
- Indicadores em tempo real
- Funil de conversão
- Origem dos leads
- Desempenho por corretor
- Desempenho por empreendimento
- Conversão por campanha
- Tempo de atendimento
- Leads sem responsável
- Leads parados
- Custos de aquisição
- Retorno sobre investimento
- Alertas inteligentes
- Comparação entre períodos

## 5. CATÁLOGO IMOBILIÁRIO

Base publicada: 76 empreendimentos.

Classificações registradas:
- Breve lançamento
- Em construção
- Futuro lançamento
- Imóvel pronto
- Lançamento
- Pendente de revisão

Dados:
- Nome
- Construtora
- Bairro
- Cidade
- UF
- Quartos
- Metragem
- Preço confirmado
- Descrição
- Características
- Imagens
- Plantas
- Vídeos
- Status
- Publicação

A IA somente pode responder utilizando informações autorizadas e confirmadas.

## 6. BANCO DE DADOS — ESTRUTURAS MAPEADAS

### CRM
- leads
- staff_profiles
- tenant_usuarios

### Comunicação
- ci360_mensagens

### Agendamentos
- ci360_agendamentos

### Financeiro
- ci_despesas

### Outras estruturas existentes
- imobiliarias
- tenant_configuracoes
- tenant_integracoes
- ci360_tenant_segmentos
- ci360_aprovacoes

Antes de criar qualquer tabela:
1. Consultar estruturas existentes.
2. Conferir colunas.
3. Conferir relacionamentos.
4. Conferir índices.
5. Conferir políticas RLS.
6. Criar somente o que estiver faltando.

## 7. PROCESSO AUTOMÁTICO DE MIGRAÇÕES

Criar futuramente no frontend um módulo:

CENTRAL DE MANUTENÇÃO DO SISTEMA

Funcionalidades:
- Diagnóstico automático.
- Identificação de estruturas existentes.
- Comparação entre versão atual e desejada.
- Sequenciamento de migrações.
- Execução controlada.
- Verificação de dependências.
- Backup.
- Histórico de execução.
- Resultado individual por etapa.
- Reversão quando tecnicamente possível.

Nenhuma migração deve ser executada sem validação de permissões, dependências e segurança.

## 8. ATENDIMENTO WHATSAPP

Arquitetura:
Evolution API → n8n → validação → Supabase → IA → resposta.

Regras:
- IA consulta o banco antes de responder.
- Não inventar preços ou condições.
- Recuperar histórico do lead.
- Preservar isolamento por imobiliária.
- Atendimento humano disponível.
- Não enviar mensagens em massa sem autorização.
- Homologação restrita a contatos autorizados.
- Registrar mensagens e resultados.

## 9. SITUAÇÃO MAPEADA EM 27/11/2026

Indicadores informados:
- 76 imóveis.
- 103 leads.
- 4 leads sem imobiliária vinculada.
- 103 leads sem corretor atribuído.
- 0 campanhas cadastradas na consulta realizada.
- 0 agendamentos contabilizados.
- 0 mensagens contabilizadas.
- 0 despesas contabilizadas.

ATENÇÃO:
Os números representam a consulta realizada naquela data, não uma garantia de situação atual.

## 10. PENDÊNCIAS TÉCNICAS IDENTIFICADAS

1. Corrigir vinculação dos leads sem tenant.
2. Investigar duplicidade de cadastros.
3. Implementar atribuição de responsáveis.
4. Validar histórico de mensagens.
5. Validar integração dos agendamentos.
6. Corrigir consultas de relatórios.
7. Criar dashboards inteligentes.
8. Implementar central de manutenção automática.
9. Homologar atendimento IA + Supabase.
10. Melhorar os módulos do frontend.
11. Validar permissões e isolamento multi-tenant.

Não excluir históricos ou consolidar duplicidades sem auditoria.

## 11. PADRÃO DE ALTERAÇÃO DO FRONTEND

Toda alteração deve:
- Preservar funcionalidades existentes.
- Respeitar identidade visual azul-marinho e dourado.
- Ser responsiva.
- Evitar barras horizontais desnecessárias.
- Utilizar dados reais do Supabase.
- Respeitar permissões dos usuários.
- Exibir erros reais e mensagens claras.
- Não utilizar números fictícios nos indicadores.

## 12. REGISTRO DE EVIDÊNCIAS

Criar a seguinte organização no GitHub:

/evidencias
    /cloudflare
    /frontend
    /supabase
    /crm
    /whatsapp-ia
    /relatorios
    /migracoes
    /testes

/arquitetura
    ARQUITETURA.md
    BANCO-DE-DADOS.md
    INTEGRACOES.md
    PERMISSOES.md

/historico
    CHANGELOG.md
    PENDENCIAS.md
    TESTES.md

Cada alteração deve registrar:
- Data
- Módulo
- Problema identificado
- Solução aplicada
- Arquivos modificados
- Testes executados
- Resultado
- Versão publicada

Não registrar dados pessoais de leads nem credenciais.

## 13. PROTOCOLO DE TRABALHO DO AGENTE

Antes de cada alteração:

1. Consultar este README.
2. Consultar os documentos de arquitetura.
3. Identificar o código existente.
4. Verificar dependências.
5. Identificar impactos no Supabase.
6. Preparar backup.
7. Implementar a alteração.
8. Executar testes.
9. Registrar evidências.
10. Publicar somente após validação.

## 14. OBJETIVO FINAL

Transformar o CedroIpê 360 em uma plataforma SaaS inteligente, multiempresa e multissetorial, com CRM, IA, automação, comunicação, marketing, financeiro, relatórios e administração centralizada.

PRINCÍPIO:
DESENVOLVER, DOCUMENTAR, VALIDAR E EVOLUIR SEM RETRABALHO.

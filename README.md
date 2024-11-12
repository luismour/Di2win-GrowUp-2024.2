# Projeto de Relatório de Taxas de Retorno de Documentos Processados

## 1. Contexto do Projeto

**Objetivo**: Este projeto visa elucidar as taxas de retorno das informações de documentos processados na plataforma ExtrAIdados, fornecendo um panorama detalhado de modificações e preenchimento de campos nos documentos processados.

**Justificativa**: Com esse relatório, é possível obter feedback contínuo e quantitativo sobre as taxas de retorno, facilitando um processo de melhoria contínua. A análise de integridade e completude dos dados auxilia na identificação de padrões e falhas recorrentes, oferecendo uma base sólida para otimizações.

---

## 2. Escopo do Projeto

O escopo deste projeto compreende:

- **Fonte de Dados**: A partir da base de dados de documentos processados fornecida pela Di2win, o projeto visa a geração de relatórios de taxa de retorno para documentos processados.
  
- **Relatório Específico**: Os relatórios serão gerados conforme especificações de dados, incluindo formatação e sinalização de integridade.

- **Período de Análise**: O relatório abrangerá dados dos últimos 30 dias.

---

## 3. Especificações Técnicas

### Formatação dos Dados

O relatório deve conter os seguintes dados para cada documento processado:

- **Tipo do documento**
- **Nome do documento**
- **Nome do campo**
- **Valor inicial do campo**
- **Valor final do campo**
- **O valor foi alterado** (sim ou não)
- **O valor permaneceu vazio** (sim ou não)

### Saída do Relatório

O relatório será exportado em formato **Excel** e terá uma formatação visual para indicar a integridade dos dados:

- **Sinalização com Cores**:
  - Dados corretos
  - Dados incorretos
  - Porcentagem de dados corretos e incorretos

---

## 4. Metas e Critérios de Avaliação

O sucesso do relatório será avaliado pelos seguintes critérios:

- **Clareza nas Recomendações**: A apresentação de dados e recomendações precisa ser fácil de interpretar.
- **Precisão na Análise de Dados**: A análise deve ser exata, refletindo corretamente as taxas de retorno por documento e por campo.

O objetivo final é oferecer uma visão geral de taxas globais do documento, com indicadores de preenchimento e modificação que permitam identificar áreas de melhoria.

---

## 5. Tecnologias Utilizadas

As principais tecnologias e ferramentas utilizadas no projeto incluem:

- **Node.js** e **TypeScript**: Linguagem e ambiente de desenvolvimento principais.
- **Prisma ORM**: Para manipulação e consulta de dados no banco de dados.
- **PostgreSQL**: Banco de dados utilizado para armazenamento dos documentos e seus atributos.
- **ExcelJs**: É uma biblioteca JavaScript para criar, ler e editar arquivos Excel (.xlsx) em Node.js.
---

## 7. Como Executar o Projeto

1. **Configuração Inicial**:
   - Certifique-se de configurar o arquivo `.env` com as credenciais do banco de dados e outras variáveis necessárias.

2. **Instalação de Dependências**:
   ```bash
   npm install

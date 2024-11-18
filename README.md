# ✨Projeto de Relatório de Taxas de Retorno de Documentos Processados✨

## 1. 🗨️ Contexto do Projeto

**Objetivo**: Este projeto visa elucidar as taxas de retorno das informações de documentos processados na plataforma ExtrAIdados, fornecendo um panorama detalhado de modificações e preenchimento de campos nos documentos processados.

**Justificativa**: Com esse relatório, é possível obter feedback contínuo e quantitativo sobre as taxas de retorno, facilitando um processo de melhoria contínua. A análise de integridade e completude dos dados auxilia na identificação de padrões e falhas recorrentes, oferecendo uma base sólida para otimizações.

---

## 2. 📁 Escopo do Projeto

O escopo deste projeto compreende:

- **Fonte de Dados**: A partir da base de dados de documentos processados fornecida pela Di2win, o projeto visa a geração de relatórios de taxa de retorno para documentos processados.
  
- **Relatório Específico**: Os relatórios serão gerados conforme especificações de dados, incluindo formatação e sinalização de integridade.

- **Período de Análise**: O relatório abrangerá dados dos últimos 30 dias.

---

## 3. 📌 Especificações Técnicas

### 🗃️ Formatação dos Dados

O relatório deve conter os seguintes dados para cada documento processado:

- **Tipo do documento**
- **Nome do documento**
- **Nome do campo**
- **Valor inicial do campo**
- **Valor final do campo**
- **O valor foi alterado** (sim ou não)
- **O valor permaneceu vazio** (sim ou não)

### 💻 Saída do Relatório

O relatório será exportado em formato **Excel** e terá uma formatação visual para indicar a integridade dos dados:

- **Sinalização com Cores**:
  - Dados corretos
  - Dados incorretos
  - Porcentagem de dados corretos e incorretos

---

## 4. 📈 Metas e Critérios de Avaliação

O sucesso do relatório será avaliado pelos seguintes critérios:

- **Clareza nas Recomendações**: A apresentação de dados e recomendações precisa ser fácil de interpretar.
- **Precisão na Análise de Dados**: A análise deve ser exata, refletindo corretamente as taxas de retorno por documento e por campo.

O objetivo final é oferecer uma visão geral de taxas globais do documento, com indicadores de preenchimento e modificação que permitam identificar áreas de melhoria.

---

## 5. 🚀 Tecnologias
As principais tecnologias e ferramentas utilizadas no projeto incluem:

<div style="diplay: inline_block">
<a href="#"><img align="center" alt="Angular" src="https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white"/></a>
<a href="#"><img align="center" alt="TypeScript" src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"/></a>
<img align="center" alt="html5" src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
<img align="center" alt="CSS" src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
<img align="center" alt="NodeJs" src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white"/>
<img align="center" alt="Jwt" src="https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens"/>
<img align="center" alt="Git" src="https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white"/>
<br><br>
<img align="center" alt="Prisma" src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white"/>
<img align="center" alt="Postgres" src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white"/>
<img align="center" alt="Excel" src="https://img.shields.io/badge/Microsoft_Excel-217346?style=for-the-badge&logo=microsoft-excel&logoColor=white"/>
<img align="center" alt="Chart" src="https://img.shields.io/badge/chart.js-F5788D.svg?style=for-the-badge&logo=chart.js&logoColor=white"/>
</div>
<br>

- **Node.js** e **TypeScript**: Linguagem e ambiente de desenvolvimento principais.
- **Prisma ORM**: Para manipulação e consulta de dados no banco de dados.
- **PostgreSQL**: Banco de dados utilizado para armazenamento dos documentos e seus atributos.
- **ExcelJs**: É uma biblioteca JavaScript para criar, ler e editar arquivos Excel (.xlsx) em Node.js.
---

## 7. ❓ Como Executar o Projeto

1. **Configuração Inicial**:
   - Certifique-se de configurar o arquivo `.env` com as credenciais do banco de dados e outras variáveis necessárias.

2. **Instalação de Dependências**:
   ```bash
   npm install

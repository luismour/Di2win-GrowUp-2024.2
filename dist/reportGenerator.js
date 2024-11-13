"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReport = generateReport;
const client_1 = require("@prisma/client");
const exceljs_1 = __importDefault(require("exceljs"));
const excel = __importStar(require("excel4node"));
const prisma = new client_1.PrismaClient();
function generateReport(res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Consultando dados do banco
            const reports = yield prisma.reports.findMany({
                select: {
                    type_document: true,
                    name_document: true,
                    label: true,
                    inital_value: true,
                    final_value: true,
                    edit: true,
                    is_null: true,
                },
            });
            // Função para calcular a porcentagem de acerto
            const calculateAccuracy = (initialValue, finalValue) => {
                if (!initialValue || !finalValue)
                    return 0;
                const initialValueLower = initialValue.toLowerCase();
                const finalValueLower = finalValue.toLowerCase();
                let correctCharacters = 0;
                for (let char of initialValueLower) {
                    if (finalValueLower.includes(char)) {
                        correctCharacters++;
                    }
                }
                return (correctCharacters / initialValueLower.length) * 100;
            };
            const reportData = reports.map(report => {
                const isNull = report.is_null || !report.inital_value || !report.final_value;
                const status = isNull || report.inital_value !== report.final_value ? 'Incorreto' : 'Correto';
                const accuracyPercentage = calculateAccuracy(report.inital_value, report.final_value);
                return {
                    'Tipo de Documento': report.type_document,
                    'Nome do Documento': report.name_document,
                    'Campo': report.label,
                    'Valor Inicial': report.inital_value,
                    'Valor Final': report.final_value,
                    'Editado': report.edit ? 'Sim' : 'Não',
                    'Permaneceu Vazio': report.is_null ? 'Sim' : 'Não',
                    'Status': status,
                    'Porcentagem de Acerto': accuracyPercentage
                };
            });
            const totalAccuracyPercentage = reportData.reduce((total, row) => total + row['Porcentagem de Acerto'], 0) / reportData.length;
            // Criando uma nova planilha com ExcelJS
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('Relatório de Documentos');
            worksheet.columns = [
                { header: 'Tipo de Documento', key: 'type_document', width: 20 },
                { header: 'Nome do Documento', key: 'name_document', width: 25 },
                { header: 'Campo', key: 'label', width: 15 },
                { header: 'Valor Inicial', key: 'inital_value', width: 15 },
                { header: 'Valor Final', key: 'final_value', width: 15 },
                { header: 'Editado', key: 'edit', width: 10 },
                { header: 'Permaneceu Vazio', key: 'is_null', width: 15 },
                { header: 'Status', key: 'status', width: 15 },
                { header: 'Porcentagem de Acerto', key: 'accuracy_percentage', width: 20 }
            ];
            reportData.forEach(row => {
                const worksheetRow = worksheet.addRow({
                    type_document: row['Tipo de Documento'],
                    name_document: row['Nome do Documento'],
                    label: row['Campo'],
                    inital_value: row['Valor Inicial'],
                    final_value: row['Valor Final'],
                    edit: row['Editado'],
                    is_null: row['Permaneceu Vazio'],
                    status: row['Status'],
                    accuracy_percentage: `${row['Porcentagem de Acerto'].toFixed(2)}%`
                });
                if (row['Status'] === 'Correto') {
                    worksheetRow.getCell('status').fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'C6EFCE' }
                    };
                }
                else if (row['Status'] === 'Incorreto') {
                    worksheetRow.getCell('status').fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFC7CE' }
                    };
                }
            });
            worksheet.addRow({});
            worksheet.addRow({
                type_document: '',
                name_document: '',
                label: 'Porcentagem Global de Acertos',
                inital_value: '',
                final_value: '',
                edit: '',
                is_null: '',
                status: '',
                accuracy_percentage: `${totalAccuracyPercentage.toFixed(2)}%`
            });
            // Criando a segunda aba (Dashboard) usando excel4node
            const dashboardWorkbook = new excel.Workbook();
            const dashboardSheet = dashboardWorkbook.addWorksheet('Dashboard');
            // Título da dashboard
            dashboardSheet.cell(1, 1).string('Dashboard').style({ font: { bold: true } });
            // Filtro dos nulos
            const nullDocuments = reports.filter(report => report.is_null);
            const documentTypes = nullDocuments.map(report => report.type_document);
            const documentCounts = documentTypes.reduce((acc, type) => {
                acc[type] = (acc[type] || 0) + 1;
                return acc;
            }, {});
            // Dados para o gráfico
            const chartData = Object.entries(documentCounts).map(([type, count]) => ({
                type_document: type,
                count: count,
            }));
            dashboardSheet.cell(3, 1).string('Tipo de Documento');
            dashboardSheet.cell(3, 2).string('Quantidade Nula');
            chartData.forEach((row, index) => {
                dashboardSheet.cell(index + 4, 1).string(row.type_document);
                dashboardSheet.cell(index + 4, 2).number(row.count);
            });
            // Aqui, você poderia adicionar o gráfico se estivesse usando excel4node
            // Como o excel4node não suporta gráficos, considere usar uma solução externa ou 
            // fazer a visualização na aplicação cliente.
            // Configurando o cabeçalho para download
            res.setHeader('Content-Disposition', 'attachment; filename="Relatorio_de_Documentos.xlsx"');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            yield workbook.xlsx.write(res);
            console.log('Relatório gerado com sucesso!');
        }
        catch (error) {
            console.error('Erro ao gerar o relatório:', error);
            res.status(500).send('Erro ao gerar o relatório');
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}

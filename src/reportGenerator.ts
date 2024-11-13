import { PrismaClient } from '@prisma/client';
import ExcelJS from 'exceljs';
import { Response } from 'express';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { Chart, ChartConfiguration, ChartTypeRegistry } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';


const prisma = new PrismaClient();
const width = 250; 
const height = 200; 
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });
const colors = [
    'rgba(255, 99, 132, 0.8)',    // Pink
    'rgba(54, 162, 235, 0.8)',    // Blue
    'rgba(75, 192, 192, 0.8)',    // Teal
    'rgba(255, 159, 64, 0.8)',    // Orange
    'rgba(153, 102, 255, 0.8)',   // Purple
    'rgba(255, 205, 86, 0.8)',    // Yellow
    'rgba(201, 203, 207, 0.8)',   // Gray
    'rgba(66, 133, 244, 0.8)',    // Stronger Blue
];

export async function generateReport(res: Response) {
    try {
        // Consultando dados do banco
        const reports = await prisma.reports.findMany({
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
        const calculateAccuracy = (initialValue: string, finalValue: string): number => {
            if (!initialValue || !finalValue) return 0; 
            
            const initialValueLower = initialValue.toLowerCase();
            const finalValueLower = finalValue.toLowerCase();

       
            let correctCharacters = 0;

            for (let char of initialValueLower) {
                if (finalValueLower.includes(char)) {
                    correctCharacters++;
                }
            }

            // Calcular a porcentagem de acerto
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
        const workbook = new ExcelJS.Workbook();
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
            } else if (row['Status'] === 'Incorreto') {
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



        // criando a segunda aba (Dashboard)
        const dashboardSheet = workbook.addWorksheet('Dashboard');
        dashboardSheet.addRow(['Dashboard']);



        //filtragem dos documentos que mais vieram nulos pro gráfico de barras
        const nullDocuments = reports.filter(report => report.is_null);
        const documentTypes = nullDocuments.map(report => report.type_document);
        const documentCounts = documentTypes.reduce((acc, type) => {
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const chartData = Object.entries(documentCounts).map(([type, count]) => ({
            type_document: type,
            count: count,
        }));

        dashboardSheet.addRow(['Documentos Nulos - Contagem por Tipo']);
        
        dashboardSheet.columns = [
            { header: 'Tipo de Documento', key: 'type_document', width: 20 },
            { header: 'Quantidade Nula', key: 'count', width: 15 },
        ];

        chartData.forEach(row => {
            dashboardSheet.addRow({
                type_document: row.type_document,
                count: row.count,
            });
        });
        

        // filtra e conta todos os documentos por tipo para o gráfico pizza
        const documentTypesTotal = reports.map(report => report.type_document);
        const documentCountsTotal = documentTypesTotal.reduce((acc, type) => {
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const processedDocumentData = Object.entries(documentCountsTotal).map(([type, count]) => ({
            type_document: type,
            count: count,
        }));

        dashboardSheet.addRow([]);
        dashboardSheet.addRow(['Documentos Mais Processados - Contagem por Tipo']);

        dashboardSheet.columns = [
            { header: 'Tipo de Documento', key: 'type_document', width: 20 },
            { header: 'Quantidade Processada', key: 'count', width: 20 },
        ];

        processedDocumentData.forEach(row => {
            dashboardSheet.addRow({
                type_document: row.type_document,
                count: row.count,
            });
        });
                

        // filtra e conta todos os documentos que foram editados (edit = true)
        const editedDocuments = reports.filter(report => report.edit);
        const editedDocumentTypes = editedDocuments.map(report => report.type_document);
        const editedDocumentCounts = editedDocumentTypes.reduce((acc, type) => {
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const editedDocumentData = Object.entries(editedDocumentCounts).map(([type, count]) => ({
            type_document: type,
            count: count,
        }));

        dashboardSheet.addRow([]);
        dashboardSheet.addRow(['Documentos Mais Editados - Contagem por Tipo']);

        dashboardSheet.columns = [
            { header: 'Tipo de Documento', key: 'type_document', width: 20 },
            { header: 'Quantidade Editada', key: 'count', width: 20 },
        ];

        editedDocumentData.forEach(row => {
            dashboardSheet.addRow({
                type_document: row.type_document,
                count: row.count,
            });
        });



        // filtra e conta todos os documentos que não foram editados (edit = false)
        const correctDocuments = reports.filter(report => !report.edit);
        const correctDocumentTypes = correctDocuments.map(report => report.type_document);
        const correctDocumentCounts = correctDocumentTypes.reduce((acc, type) => {
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // transforma os dados em formato de linha para adicionar à aba
        const correctDocumentData = Object.entries(correctDocumentCounts).map(([type, count]) => ({
            type_document: type,
            count: count,
        }));

        // adiciona uma nova seção na aba Dashboard para documentos com mais acerto (edit = false)
        dashboardSheet.addRow([]);
        dashboardSheet.addRow(['Documentos com Mais Acerto (Não Editados) - Contagem por Tipo']);

        dashboardSheet.columns = [
            { header: 'Tipo de Documento', key: 'type_document', width: 20 },
            { header: 'Quantidade Não Editada (Acerto)', key: 'count', width: 20 },
        ];

        // Adiciona as linhas com os dados de correctDocumentData
        correctDocumentData.forEach(row => {
            dashboardSheet.addRow({
                type_document: row.type_document,
                count: row.count,
            });
        });



        // Configurando o cabeçalho para download
        res.setHeader('Content-Disposition', 'attachment; filename="Relatorio_de_Documentos.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');


        await workbook.xlsx.write(res);
        console.log('Relatório gerado com sucesso!');
    } catch (error) {
        console.error('Erro ao gerar o relatório:', error);
        res.status(500).send('Erro ao gerar o relatório');
    } finally {
        await prisma.$disconnect();
    }
}

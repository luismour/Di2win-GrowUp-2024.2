import { PrismaClient } from '@prisma/client';
import ExcelJS from 'exceljs';
import { Response } from 'express';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { Chart, ChartConfiguration, ChartTypeRegistry } from 'chart.js';


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
        dashboardSheet.getColumn('A').width = 30;
        dashboardSheet.getColumn('B').width = 30;
        dashboardSheet.getColumn('C').width = 30;

        dashboardSheet.getColumn('G').width = 30;
        dashboardSheet.getColumn('H').width = 20;
        dashboardSheet.getColumn('I').width = 3;
        dashboardSheet.getColumn('J').width = 30;
        dashboardSheet.getColumn('K').width = 20;


        const titleRow = dashboardSheet.addRow(['Dashboard']);
            const cell = titleRow.getCell(1); 
            cell.font = {
                size: 24,           
                color: { argb: 'FF6384' },
                bold: true,           
            };
            cell.alignment = { 
                horizontal: 'center',
                vertical: 'middle',  
            };
            titleRow.height = 50;
        
        dashboardSheet.addRow([]);

        // identificando os tipos de documentos únicos
        const documentTypes = [...new Set(reports.map(report => report.type_document))];

        // criando um objeto para associar cada tipo de documento a uma cor
        const documentColors: Record<string, string> = {};

        // atribuindo uma cor única para cada tipo de documento
        documentTypes.forEach((type, index) => {
            documentColors[type] = colors[index % colors.length];
        });


        function addTableWithColors(sheet: ExcelJS.Worksheet, 
                                    documentTypes: string[], 
                                    startRow: number, 
                                    startCol: string, 
                                    documentColors: Record<string, string>) {
                                        
            const headerRow = sheet.getRow(startRow);
            headerRow.getCell(startCol).value = 'Tipo de Documento';
            headerRow.getCell(String.fromCharCode(startCol.charCodeAt(0) + 1)).value = 'Cor Representativa';
            
            headerRow.eachCell((cell, colNumber) => {
                cell.alignment = {          
                    horizontal: 'center',  
                    vertical: 'middle',    
                };
                cell.fill = {                
                    type: 'pattern',
                    pattern: 'solid'
                };
                cell.border = {            
                    top: { style: 'thin', color: { argb: '000000' } },
                    left: { style: 'thin', color: { argb: '000000' } },
                    bottom: { style: 'thin', color: { argb: '000000' } },
                    right: { style: 'thin', color: { argb: '000000' } },
                };
            });

            let currentRow = startRow + 1;
            documentTypes.forEach((type, index) => {
                const row = sheet.getRow(currentRow);
                row.getCell(startCol).value = type;  
                row.getCell(String.fromCharCode(startCol.charCodeAt(0) + 1)).value = ''; 

                const colorCell = row.getCell(String.fromCharCode(startCol.charCodeAt(0) + 1));
                colorCell.fill = {
                    type: 'pattern',    
                    pattern: 'solid',
                    fgColor: { argb: documentColors[type]
                        .replace('rgba(', '')
                        .replace(')', '')
                        .replace(/\s+/g, '')
                        .split(',')
                        .slice(0, 3)
                        .map(v => parseInt(v).toString(16).padStart(2, '0'))
                        .join('') 
                    }
                };

                row.eachCell((cell, colNumber) => {
                    if (colNumber === 1) { 
                        cell.alignment = {         
                            horizontal: 'left',   
                            vertical: 'middle',   
                        };
                        cell.border = {}; 
                    } else { 
                        cell.alignment = {         
                            horizontal: 'center',   
                            vertical: 'middle',   
                        };
                        cell.border = {
                            top: { style: 'thin', color: { argb: '000000' } },
                            left: { style: 'thin', color: { argb: '000000' } },
                            bottom: { style: 'thin', color: { argb: '000000' } },
                            right: { style: 'thin', color: { argb: '000000' } },
                        };
                    }
                });

                currentRow++;
            });
        }
        addTableWithColors(dashboardSheet, documentTypes, 2, 'B', documentColors);


        function addTable(  sheet: ExcelJS.Worksheet, 
                            data: { type_document: string, count: number }[], 
                            startRow: number, 
                            startCol: string,
                            columnTitles: { firstColumn: string, secondColumn: string },) {

            const headerRow = sheet.getRow(startRow);
            headerRow.getCell(startCol).value = columnTitles.firstColumn;
            headerRow.getCell(String.fromCharCode(startCol.charCodeAt(0) + 1)).value = columnTitles.secondColumn;

            headerRow.eachCell((cell, colNumber) => {
                cell.font = { 
                    color: { argb: 'FFFFFF' },
                 };  
                cell.alignment = {         
                    horizontal: 'center',   
                    vertical: 'middle',      
                };
                cell.fill = {                
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF6384' }  
                };
                cell.border = {              
                    top: { style: 'thin', color: { argb: '000000' } },
                    left: { style: 'thin', color: { argb: '000000' } },
                    bottom: { style: 'thin', color: { argb: '000000' } },
                    right: { style: 'thin', color: { argb: '000000' } },
                };
            });
        
            let currentRow = startRow + 1;
            data.forEach(row => {
                const dataRow = sheet.getRow(currentRow);
                dataRow.getCell(startCol).value = row.type_document;
                dataRow.getCell(String.fromCharCode(startCol.charCodeAt(0) + 1)).value = row.count;

                dataRow.eachCell((cell) => {
                    cell.alignment = {          
                        horizontal: 'center',     
                        vertical: 'middle',      
                    };
                    cell.border = {               
                        top: { style: 'thin', color: { argb: '000000' } },
                        left: { style: 'thin', color: { argb: '000000' } },
                        bottom: { style: 'thin', color: { argb: '000000' } },
                        right: { style: 'thin', color: { argb: '000000' } },
                    };
                });
                currentRow++;
            });
        }

        //filtragem dos documentos que mais vieram nulos pro gráfico de barras
        const nullDocuments = reports.filter(report => report.is_null);
        const nullDocumentsTypes = nullDocuments.map(report => report.type_document);
        const nullDocumentsTypesCounts = nullDocumentsTypes.reduce((acc, type) => {
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        const chartBarNullDocuments = Object.entries(nullDocumentsTypesCounts).map(([type, count]) => ({
            type_document: type,
            count: count,
        }));

        chartBarNullDocuments.forEach(row => {
            dashboardSheet.addRow({
                type_document: row.type_document,
                count: row.count,
            });
        });

        // Configuração do gráfico de barra dos documentos que mais vieram nulos
        const chartBarNullDocumentsConfig: ChartConfiguration<keyof ChartTypeRegistry> = {
            type: 'bar',
            data: {
                labels: chartBarNullDocuments.map(data => data.type_document), 
                datasets: [{
                    data: chartBarNullDocuments.map(data => data.count), 
                    backgroundColor: chartBarNullDocuments.map(data => {
                       
                        return documentColors[data.type_document] || '#FFFFFF';
                    }),
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false,
                    },
                    title: {
                        display: true,
                        text: 'Documentos Nulos',
                        font: {
                            size: 16,
                            weight: 'bold',
                        },
                    },
                },
            },
            plugins: [
                {
                    id: 'background_color',
                    beforeDraw: (chart) => {
                        const ctx = chart.canvas.getContext('2d');
                        if (ctx) { 
                            ctx.save();
                            ctx.fillStyle = '#FFFFFF'; 
                            ctx.fillRect(0, 0, chart.width, chart.height); 
                            ctx.restore();
                        }   
                    },
                },
            ],
        };

        // Gerando o gráfico e gerando a imagem
        const chartBarNullDocumentsBuffer = await chartJSNodeCanvas.renderToBuffer(chartBarNullDocumentsConfig);
        const chartBarNullDocumentsImage = workbook.addImage({
                buffer: chartBarNullDocumentsBuffer,
                extension: 'png',
            });
        dashboardSheet.addImage(chartBarNullDocumentsImage, 'C15:C23');
        addTable(dashboardSheet, chartBarNullDocuments, 11, 'G', { firstColumn: 'Documentos Nulos', secondColumn: 'Quantidade' });

        
        // filtra e conta todos os documentos que foram mais editados (edit = true)
        const editedDocuments = reports.filter(report => report.edit);
        const editedDocumentTypes = editedDocuments.map(report => report.type_document);
        const editedDocumentsNumber = editedDocuments.length;
        const editedDocumentCounts = editedDocumentTypes.reduce((acc, type) => {
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const chartPieEditedDocumentCounts = Object.entries(editedDocumentCounts).map(([type, count]) => ({
            type_document: type,
            count: count,
        }));

        chartPieEditedDocumentCounts.forEach(row => {
            dashboardSheet.addRow({
                type_document: row.type_document,
                count: row.count,
            });
        });

        const chartPieEditedDocumentCountsConfig: ChartConfiguration<keyof ChartTypeRegistry> = {
            type: 'doughnut',
            data: {
                labels: chartPieEditedDocumentCounts.map(data => data.type_document), 
                datasets: [{
                    data: chartPieEditedDocumentCounts.map(data => data.count), 
                    backgroundColor: chartPieEditedDocumentCounts.map(data => {
                        return documentColors[data.type_document] || '#FFFFFF'; 
                    }),
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false,
                    },
                    title: {
                        display: true,
                        text: 'Documentos Editados',
                        font: {
                            size: 16,
                            weight: 'bold',
                        },
                    },
                },
            },
            plugins: [
                {
                    id: 'background_color',
                    beforeDraw: (chart) => {
                        const ctx = chart.canvas.getContext('2d');
                        if (ctx) { 
                            ctx.save();
                            ctx.fillStyle = '#FFFFFF'; 
                            ctx.fillRect(0, 0, chart.width, chart.height); 
                            ctx.restore();
                        }   
                    },
                },
            ],
        };
        // Gerando o gráfico e gerando a imagem
        const chartPieEditedDocumentCountsBuffer = await chartJSNodeCanvas.renderToBuffer(chartPieEditedDocumentCountsConfig);
        const chartPieEditedDocumentCountsImage = workbook.addImage({
            buffer: chartPieEditedDocumentCountsBuffer,
            extension: 'png',
        });
        dashboardSheet.addImage(chartPieEditedDocumentCountsImage, 'D15:F23'); 
        addTable(dashboardSheet, chartPieEditedDocumentCounts, 11, 'J', { firstColumn: 'Documentos Editados', secondColumn: 'Quantidade' });


        // filtra e conta todos os documentos corretos (edit = false)
        const correctDocuments = reports.filter(report => !report.edit);
        const correctDocumentTypes = correctDocuments.map(report => report.type_document);
        const correctDocumentCounts = correctDocumentTypes.reduce((acc, type) => {
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // transforma os dados em formato de linha para adicionar à aba
        const chartBarCorrectDocumentCounts = Object.entries(correctDocumentCounts).map(([type, count]) => ({
            type_document: type,
            count: count,
        }));

        // Adiciona as linhas com os dados de correctDocumentData
        chartBarCorrectDocumentCounts.forEach(row => {
            dashboardSheet.addRow({
                type_document: row.type_document,
                count: row.count,
            });
        });

        const chartBarCorrectDocumentConfig: ChartConfiguration<keyof ChartTypeRegistry> = {
            type: 'bar',
            data: {
                labels: chartBarCorrectDocumentCounts.map(data => data.type_document), 
                datasets: [{
                    data: chartBarCorrectDocumentCounts.map(data => data.count), 
                    backgroundColor: chartBarCorrectDocumentCounts.map(data => {
                        return documentColors[data.type_document] || '#FFFFFF'; 
                    }),
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false,
                    },
                    title: {
                        display: true,
                        text: 'Documentos Corretos por Tipo',
                        font: {
                            size: 16,
                            weight: 'bold',
                        },
                    },
                },
                scales: {
                    x: {
                        display: false,
                    },
                },
            },
            plugins: [
                {
                    id: 'background_color',
                    beforeDraw: (chart) => {
                        const ctx = chart.canvas.getContext('2d');
                        if (ctx) { 
                            ctx.save();
                            ctx.fillStyle = '#FFFFFF'; 
                            ctx.fillRect(0, 0, chart.width, chart.height); 
                            ctx.restore();
                        }   
                    },
                },
            ],
        };
    
        // Gerando o gráfico e gerando a imagem
        const chartBarCorrectDocumentBuffer = await chartJSNodeCanvas.renderToBuffer(chartBarCorrectDocumentConfig);
        const chartBarCorrectDocumentImage = workbook.addImage({
                buffer: chartBarCorrectDocumentBuffer,
                extension: 'png',
            });

        dashboardSheet.addImage(chartBarCorrectDocumentImage, 'G15:H23'); 
        addTable(dashboardSheet, chartBarCorrectDocumentCounts, 2, 'G', { firstColumn: 'Documentos Não Editados', secondColumn: 'Quantidade' });

        
        //Contagem dos tipos de documentos
        const documentTypesTotal = reports.map(report => report.type_document);
        const documentTypesCountsTotal = documentTypesTotal.reduce((acc, type) => {
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        const totalDocuments = documentTypesTotal.length;
        const chartBubbleDocumentCounts = Object.entries(documentTypesCountsTotal).map(([type, count], index) => {
            const radius = Math.min(Math.sqrt(count) * 5, 50);
            const x = (index + 1) * 100;
            const y = 100 + (Math.random() * 100);

            return {
                type_document: type,
                count: count,
                x,
                y,
                r: radius,
                label: type,
            };
        });

        // Adiciona as linhas com os dados de correctDocumentData
        chartBubbleDocumentCounts.forEach(row => {
            dashboardSheet.addRow({
                type_document: row.type_document,
                count: row.count,
            });
        });

        const chartBubbleDocumentCountsConfig: ChartConfiguration<keyof ChartTypeRegistry> = {
            type: 'bubble',
            data: {
                datasets: [{
                    label: 'Documentos Processados',
                    data: chartBubbleDocumentCounts,
                    backgroundColor: chartBubbleDocumentCounts.map(data => {
                        // Atribui a cor baseada no tipo de documento
                        return documentColors[data.type_document] || '#FFFFFF';
                    }),
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const dataPoint = context.raw as { x: number, y: number, r: number, label: string };
                                const count = Math.pow(dataPoint.r / 5, 2);
                                return `${dataPoint.label}: ${Math.pow(dataPoint.r / 5, 2)} documentos`;
                            },
                        },
                    },
                    title: {
                        display: true,
                        text: 'Documentos Processados',
                        font: {
                            size: 16,
                            weight: 'bold',
                        },
                    },
                },
                scales: {
                    x: {
                        display: false,
                    },
                    y: {
                        display: false,
                    }
                },
            },
            plugins: [
                {
                    id: 'background_color',
                    beforeDraw: (chart) => {
                        const ctx = chart.canvas.getContext('2d');
                        if (ctx) { 
                            ctx.save();
                            ctx.fillStyle = '#FFFFFF'; 
                            ctx.fillRect(0, 0, chart.width, chart.height); 
                            ctx.restore();
                        }   
                    },
                },
            ],
        };
        // Gerando o gráfico e gerando a imagem
        const chartBubbleDocumentCountsBuffer = await chartJSNodeCanvas.renderToBuffer(chartBubbleDocumentCountsConfig);
        const chartBubbleDocumentCountsImage = workbook.addImage({
            buffer: chartBubbleDocumentCountsBuffer,
            extension: 'png',
        });
        dashboardSheet.addImage(chartBubbleDocumentCountsImage, 'B15:B23'); 
        addTable(dashboardSheet, chartBubbleDocumentCounts, 2, 'J', { firstColumn: 'Documentos', secondColumn: 'Quantidade' });



        // Adiciona a última linha manualmente na aba Dashboard
        const lastRow = dashboardSheet.getRow(11);
        lastRow.getCell(1).value = '';
        lastRow.getCell(2).value = 'Porcentagem Global de Acertos: ';
        lastRow.getCell(3).value = `${totalAccuracyPercentage.toFixed(2)}%`;
        dashboardSheet.getRow(11).getCell(3).alignment = { horizontal: 'center', vertical: 'middle' };

        dashboardSheet.getRow(12).getCell(2).value = 'Total de documentos:';
        dashboardSheet.getRow(13).getCell(2).value = 'Documentos editados:';
        
        dashboardSheet.getRow(12).getCell(3).value = totalDocuments;
        dashboardSheet.getRow(13).getCell(3).value = editedDocumentsNumber;

        dashboardSheet.getRow(12).getCell(3).alignment = { horizontal: 'center', vertical: 'middle' };
        dashboardSheet.getRow(13).getCell(3).alignment = { horizontal: 'center', vertical: 'middle' };

        


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

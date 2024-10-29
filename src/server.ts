import express from 'express';
import { generateReport } from './reportGenerator';

const app = express();
const PORT = process.env.PORT || 3000;

// Rota para gerar o relatório
app.get('/generate-report', (req, res) => {
    generateReport(res);
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

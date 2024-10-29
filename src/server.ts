import express, { Request, Response } from 'express'; // Importando Request e Response
import { generateReport } from './reportGenerator';

const app = express();
const PORT = process.env.PORT || 3001;

// Rota para gerar o relatório
app.get('/generate-report', (req: Request, res: Response) => { // Tipando os parâmetros
    generateReport(res);
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

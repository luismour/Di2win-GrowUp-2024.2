import express, { Request, Response } from 'express'; 
import { generateReport } from './reportGenerator';



const app = express();
const PORT = process.env.PORT || 3001;

// Rota para gerar o relatório
app.get('/generate-report', (req: Request, res: Response) => { 
    generateReport(res);
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

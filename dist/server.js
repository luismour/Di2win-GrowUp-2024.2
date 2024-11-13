"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); // Importando Request e Response
const reportGenerator_1 = require("./reportGenerator");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Rota para gerar o relatório
app.get('/generate-report', (req, res) => {
    (0, reportGenerator_1.generateReport)(res);
});
// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

import { Component, Inject, PLATFORM_ID,} from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import type { ColDef } from 'ag-grid-community';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    AgGridModule,
    CommonModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  public isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  columnDefs: ColDef[] = [
    { headerName: 'Tipo de Documento', field: 'tipoDocumento', pinned: 'left' },
    { headerName: 'Nome do Documento', field: 'nomeDocumento' },
    { headerName: 'Campo', field: 'campo' },
    { headerName: 'Valor Inicial', field: 'valorInicial' },
    { headerName: 'Valor Final', field: 'valorFinal' },
    { headerName: 'Editado', field: 'editado' },
    { headerName: 'Permaneceu Vazio', field: 'permaneceuVazio' },
    { headerName: 'Status', field: 'status' },
    { headerName: 'Porcentagem de Acerto', field: 'porcentagemAcerto' }
];

rowData = [
  { tipoDocumento: 'CNH', nomeDocumento: '01_cnh', campo: 'Número', valorInicial: '123456789', valorFinal: '123456789', editado: 'Não', permaneceuVazio: 'Não', status: 'Concluído', porcentagemAcerto: '100%' },
  { tipoDocumento: 'CNH', nomeDocumento: '01_cnh', campo: 'Nome', valorInicial: 'João Silva', valorFinal: 'João Silva', editado: 'Não', permaneceuVazio: 'Não', status: 'Concluído', porcentagemAcerto: '100%' },
  { tipoDocumento: 'CNH', nomeDocumento: '01_cnh', campo: 'Data de Nascimento', valorInicial: '01/01/1990', valorFinal: '01/01/1990', editado: 'Não', permaneceuVazio: 'Não', status: 'Concluído', porcentagemAcerto: '100%' },
  { tipoDocumento: 'RG', nomeDocumento: '03_rg', campo: 'Número', valorInicial: 'MG1234567', valorFinal: 'MG1234567', editado: 'Não', permaneceuVazio: 'Não', status: 'Concluído', porcentagemAcerto: '100%' },
  { tipoDocumento: 'Recibos', nomeDocumento: '04_recibos', campo: 'Valor', valorInicial: 'R$ 500,00', valorFinal: 'R$ 500,00', editado: 'Não', permaneceuVazio: 'Não', status: 'Concluído', porcentagemAcerto: '100%' },
  { tipoDocumento: 'NFE', nomeDocumento: '05_nfe', campo: 'Número da NF', valorInicial: '123456', valorFinal: '123456', editado: 'Não', permaneceuVazio: 'Não', status: 'Concluído', porcentagemAcerto: '100%' },
  { tipoDocumento: 'NFSE', nomeDocumento: '06_nfse', campo: 'Número', valorInicial: '987654', valorFinal: '987654', editado: 'Não', permaneceuVazio: 'Não', status: 'Concluído', porcentagemAcerto: '100%' },
  { tipoDocumento: 'CPF', nomeDocumento: '02_cpf', campo: 'Número', valorInicial: '123.456.789-00', valorFinal: '123.456.789-00', editado: 'Não', permaneceuVazio: 'Não', status: 'Concluído', porcentagemAcerto: '100%' },
  { tipoDocumento: 'Comprovante de Residência', nomeDocumento: '07_comprovate_residencia', campo: 'Endereço', valorInicial: 'Rua Exemplo, 123', valorFinal: 'Rua Exemplo, 123', editado: 'Não', permaneceuVazio: 'Não', status: 'Concluído', porcentagemAcerto: '100%' },
  { tipoDocumento: 'CNH', nomeDocumento: '01_cnh', campo: 'Número', valorInicial: '234567890', valorFinal: '234567890', editado: 'Não', permaneceuVazio: 'Não', status: 'Concluído', porcentagemAcerto: '100%' },
  { tipoDocumento: 'NFSE', nomeDocumento: '06_nfse', campo: 'Número', valorInicial: '987654', valorFinal: '987654', editado: 'Não', permaneceuVazio: 'Não', status: 'Concluído', porcentagemAcerto: '100%' },
  { tipoDocumento: 'NFE', nomeDocumento: '05_nfe', campo: 'Número', valorInicial: '567890', valorFinal: '567890', editado: 'Não', permaneceuVazio: 'Não', status: 'Concluído', porcentagemAcerto: '100%' },
  // Continue adicionando mais documentos conforme necessário...
];

  defaultColDef: ColDef = {
  filter: true,
  sortable: true,
  resizable: true,
};
}


import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions, ChartData, ChartType, ChartConfiguration } from 'chart.js';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-bubble-chart',
  standalone: true,
  imports: [
    NgChartsModule,
    CommonModule
  ],
  templateUrl: './bubble-chart.component.html',
  styleUrl: './bubble-chart.component.scss'
})
export class BubbleChartComponent {


  public isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // Configurações do gráfico
  public bubbleChartOptions: ChartOptions<'bubble'> = {
    
    responsive: true,
    plugins: {
      legend: {
        display: false,  // Remover a legenda
      },
      tooltip: {
        callbacks: {
          // Personaliza o título do tooltip (por padrão é o label do dataset)
          title: (tooltipItem) => {
            return tooltipItem[0]?.dataset.label || 'Informações da bolha';
          },
          // Personaliza o corpo do tooltip
          label: (tooltipItem) => {
            // Fazendo uma asserção de tipo para que o TypeScript saiba que 'tooltipItem.raw' tem as propriedades x, y e r
            const data = tooltipItem.raw as { x: number, y: number, r: number };  // Asserção do tipo
            return `Quantidade: ${data.r}`;  // Exemplo de personalização
          }
        }
      },
      title: {  // Adicionando o título ao gráfico
        display: true,  // Habilita o título
        
      },
    },
    
    scales: {
      x: {
        display: false,
        beginAtZero: true,
        min: 4,
        max: 16,
        ticks: {
          stepSize: 1,      
        }
      },
      y: {
        display: false,
        beginAtZero: true,
        min: 2,
        max: 9,
        ticks: {
          stepSize: 1,      
        }
      },
    },
  };

  // Dados do gráfico
  public bubbleChartData: ChartData<'bubble'> = {
    datasets: [
      {
        label: 'NFS',
        data: [
          { x: 10, y: 5, r: 44 }, 
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'CNH',
        data: [
          { x: 6.5, y: 5.5, r: 15 },
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'RG',
        data: [
          { x: 12, y: 7.5, r: 9 },
        ],
        backgroundColor: 'rgba(255, 206, 86, 0.5)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
      {
        label: 'DANFE',
        data: [
          { x: 12.5, y: 3.5, r: 8 },
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Comprovante de Residência',
        data: [
          { x: 8, y: 8, r: 8 },
        ],
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
      {
        label: 'Recibos',
        data: [
          { x: 14, y: 5, r: 6 },
        ],
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
      {
        label: 'CPF',
        data: [
          { x: 13, y: 6, r: 3 },
        ],
        backgroundColor: 'rgba(100, 255, 100, 0.5)',
        borderColor: 'rgba(100, 255, 100, 1)',
        borderWidth: 1,
      },
    ],
    
  };

  public bubbleChartType: ChartConfiguration<'bubble'>['type'] = 'bubble';

}

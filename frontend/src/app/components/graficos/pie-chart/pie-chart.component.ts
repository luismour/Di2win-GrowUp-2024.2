import { Component, Inject, PLATFORM_ID,} from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions, ChartData, ChartType, ChartConfiguration } from 'chart.js';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [
    NgChartsModule,
    CommonModule
  ],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss'
})
export class PieChartComponent {

  public isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // Configuração do gráfico de pizza (doughnut)
  public pieChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            const percentage = tooltipItem.raw;
            return `${tooltipItem.label}: ${percentage}%`; // Exibe a porcentagem no tooltip
          },
        },
      },
    },
    cutout: '60%',
  };
  public pieChartLabels: string[] = ['CNH', 'RG', 'RECIBOS', 'DANFE', 'NFS', 'CPF', 'COMPROVANTE DE RESIDÊNCIA'];
  public pieChartData: ChartData<'doughnut'> = {
    labels: ['CNH', 'RG', 'RECIBOS', 'DANFE', 'NFS', 'CPF', 'COMPROVANTE DE RESIDÊNCIA'],
    datasets: [
      {
        data: [33.33, 50, 50, 50, 50, 0, 0],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',  // CNH 
          'rgba(255, 206, 86, 0.7)',  // RG 
          'rgba(255, 159, 64, 0.7)',  // RECIBOS 
          'rgba(75, 192, 192, 0.7)',  // DANFE 
          'rgba(255, 99, 132, 0.7)',  // NFS 
          'rgba(153, 102, 255, 0.7)', // CPF 
          'rgba(201, 203, 207, 0.7)', // C. RESIDENCIA 
        ],
        hoverBackgroundColor: [
          'rgba(54, 162, 235, 1)',  // CNH hover
          'rgba(255, 206, 86, 1)',  // RG hover
          'rgba(255, 159, 64, 1)',  // RECIBOS hover
          'rgba(75, 192, 192, 1)',  // DANFE hover
          'rgba(255, 99, 132, 1)',  // NFS hover
          'rgba(153, 102, 255, 1)', // CPF hover
          'rgba(201, 203, 207, 1)', // C. RESIDENCIA hover
        ],
        hoverBorderColor: 'rgba(0, 0, 0, 0)', 
      },
    ],
  };
  public pieChartType: 'doughnut' = 'doughnut';
}

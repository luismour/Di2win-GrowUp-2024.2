import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions, ChartData, ChartType, ChartConfiguration } from 'chart.js';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [
    CommonModule,
    NgChartsModule,
  ],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss'
})
export class BarChartComponent {

  public isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false },  
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        ticks: {
          display: true,
        },
      },
      y: {
        min: 0,
        max: 2,
        ticks: {
          display: true,
          stepSize: 1,
        },
      },
    },
  };
  
  public barChartLabels: string[] = ['NFS', 'CNH', 'RG', 'RECIBOS', 'CPF', 'DANFE', 'C. RESIDENCIA'];
  
  public barChartLegend = false;  // A legenda está desativada
  
  public barChartData: ChartConfiguration<'bar'>['data']['datasets'] = [
    {
      data: [0, 1, 1, 0, 0, 0, 0],
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',  // NFS 
        'rgba(54, 162, 235, 0.7)',  // CNH 
        'rgba(255, 206, 86, 0.7)',  // RG 
        'rgba(255, 159, 64, 0.7)',  // RECIBOS 
        'rgba(153, 102, 255, 0.7)', // CPF 
        'rgba(75, 192, 192, 0.7)',  // DANFE 
        'rgba(201, 203, 207, 0.7)', // C. RESIDENCIA 
      ],
    },
  ];
}
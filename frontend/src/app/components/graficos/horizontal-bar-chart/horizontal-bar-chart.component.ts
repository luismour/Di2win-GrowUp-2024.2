import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions, ChartData, ChartType, ChartConfiguration } from 'chart.js';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-horizontal-bar-chart',
  standalone: true,
  imports: [
    CommonModule,
    NgChartsModule,
  ],
  templateUrl: './horizontal-bar-chart.component.html',
  styleUrl: './horizontal-bar-chart.component.scss'
})
export class HorizontalBarChartComponent {

  public isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    indexAxis: 'y', // Barras horizontais
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { beginAtZero: true },
    },
  };

  private documents = [
    { name: 'NFS', total: 44, correct: 38 },
    { name: 'CNH', total: 15, correct: 11 },
    { name: 'RG', total: 9, correct: 7 },
    { name: 'RECIBOS', total: 6, correct: 4 },
    { name: 'CPF', total: 3, correct: 3 },
    { name: 'DANFE', total: 8, correct: 7 },
    { name: 'C. RESIDENCIA', total: 8, correct: 7 },
  ];

  private sortedDocuments = this.documents
    .map(doc => ({
      ...doc,
      percentage: (doc.correct / doc.total) * 100,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  private colors: string[] = [
    'rgba(153, 102, 255, 0.7)', // CPF (100%)
    'rgba(75, 192, 192, 0.7)',  // DANFE (87.5%)
    'rgba(201, 203, 207, 0.7)', // C. RESIDENCIA (87.5%)
    'rgba(255, 99, 132, 0.7)',  // NFS (86.36%)
    'rgba(54, 162, 235, 0.7)',  // CNH (73.33%)
    'rgba(255, 206, 86, 0.7)',  // RG (77.78%)
    'rgba(255, 159, 64, 0.7)',  // RECIBOS (66.67%)
  ];

  // Alimentando os rótulos e dados com os valores ordenados
  public barChartLabels: string[] = this.sortedDocuments.map(doc => doc.name);
  public barChartData: ChartConfiguration['data']['datasets'] = [
    {
      data: this.sortedDocuments.map(doc => doc.percentage),
      label: 'Porcentagem de Acerto (%)',
      backgroundColor: this.colors.slice(0, this.sortedDocuments.length), // Cada barra com uma cor
    },
  ];
}

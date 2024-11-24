import { Component } from '@angular/core';
import { PieChartComponent } from '../../components/graficos/pie-chart/pie-chart.component';
import { BubbleChartComponent } from '../../components/graficos/bubble-chart/bubble-chart.component';
import { BarChartComponent } from '../../components/graficos/bar-chart/bar-chart.component';
import { HorizontalBarChartComponent } from '../../components/graficos/horizontal-bar-chart/horizontal-bar-chart.component';

@Component({
  selector: 'app-graficos',
  standalone: true,
  imports: [
    PieChartComponent,
    BubbleChartComponent,
    BarChartComponent,
    HorizontalBarChartComponent,
    
    
  ],
  templateUrl: './graficos.component.html',
  styleUrl: './graficos.component.scss'
})
export class GraficosComponent {

}

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { GraficosComponent } from '../../sections/graficos/graficos.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { BtnDownloadComponent } from '../../components/btn-download/btn-download.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { SelectComponent } from "../../components/select/select.component";
//teste
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NavbarComponent,
    GraficosComponent,
    RouterLink,
    BtnDownloadComponent,
    SelectComponent
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate(500)
      ]),
      transition(':leave', [
        animate(500, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class DashboardComponent {


  selected: string = '';
  items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];


  mostrarConteudo: boolean = true;

  toggleConteudo() {
    this.mostrarConteudo = !this.mostrarConteudo;
  }
}

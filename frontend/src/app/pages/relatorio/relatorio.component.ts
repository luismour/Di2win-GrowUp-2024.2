import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { TableComponent } from '../../components/table/table.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SelectComponent } from '../../components/select/select.component';
import { BtnDownloadComponent } from '../../components/btn-download/btn-download.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-relatorio',
  standalone: true,
  imports: [
    NavbarComponent,
    TableComponent,
    SelectComponent,
    BtnDownloadComponent,
  ],
  templateUrl: './relatorio.component.html',
  styleUrl: './relatorio.component.scss',
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
export class RelatorioComponent {
  mostrarConteudo: boolean = true;

  toggleConteudo() {
    this.mostrarConteudo = !this.mostrarConteudo;
  }
}

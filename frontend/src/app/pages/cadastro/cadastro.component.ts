import { Component } from '@angular/core';
import { DefaulLoginLayoutComponent } from '../../components/defaul-login-layout/defaul-login-layout.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    DefaulLoginLayoutComponent,
    MatSlideToggleModule,
    RouterLink
  ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent {

}

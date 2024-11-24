import { Component } from '@angular/core';
import { DefaulLoginLayoutComponent } from '../../components/defaul-login-layout/defaul-login-layout.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-esqueceu-senha',
  standalone: true,
  imports: [
    DefaulLoginLayoutComponent,
    RouterLink,
    
  ],
  templateUrl: './esqueceu-senha.component.html',
  styleUrl: './esqueceu-senha.component.scss'
})
export class EsqueceuSenhaComponent {

}

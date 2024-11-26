import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-defaul-login-layout',
  standalone: true,
  imports: [],
  templateUrl: './defaul-login-layout.component.html',
  styleUrl: './defaul-login-layout.component.scss'
})
export class DefaulLoginLayoutComponent {
  @Input() title: string = "";
}

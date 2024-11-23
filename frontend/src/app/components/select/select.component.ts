import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';  // Importe o FormsModule

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss'
})
export class SelectComponent {
  pages = ['relatorio', 'dashboard']; // Opções de páginas
  selectedPage: string = ''; // Página selecionada
  isDropdownOpen: boolean = false; // Controla a exibição do dropdown

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Verifica qual página está ativa na URL
    this.activatedRoute.url.subscribe(urlSegments => {
      const currentPage = urlSegments[0]?.path; // Pega o primeiro segmento da URL
      if (currentPage) {
        this.selectedPage = currentPage; // Define a página atual como selecionada
      }
    });
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen; // Alterna o dropdown
  }

  selectPage(page: string): void {
    this.selectedPage = page; // Define a página selecionada
    this.isDropdownOpen = false; // Fecha o dropdown
    this.navigateToPage(); // Navega para a página selecionada
  }

  navigateToPage(): void {
    if (this.selectedPage) {
      this.router.navigate([this.selectedPage]); // Navega para a página selecionada
    }
  }

}

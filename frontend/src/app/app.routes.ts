import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RelatorioComponent } from './pages/relatorio/relatorio.component';
import { LoginComponent } from './pages/login/login.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { EsqueceuSenhaComponent } from './pages/esqueceu-senha/esqueceu-senha.component';

export const routes: Routes = [
    {path: 'dashboard', component: DashboardComponent},
    {path: 'relatorio', component: RelatorioComponent},
    {path: 'login', component: LoginComponent},
    {path: 'cadastrar', component: CadastroComponent},
    {path: 'esqueceu-senha', component: EsqueceuSenhaComponent},
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    
];

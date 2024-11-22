import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RelatorioComponent } from './pages/relatorio/relatorio.component';

export const routes: Routes = [
    {path: 'dashboard', component: DashboardComponent},
    {path: 'relatorio', component: RelatorioComponent},
    { path: '', redirectTo: '/relatorio', pathMatch: 'full' },
    
];

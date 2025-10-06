import { Routes } from '@angular/router';
import { ListaDestinosComponent } from './components/lista-destinos/lista-destinos.component';
import { ListaViajesComponent } from './components/lista-viajes/lista-viajes.component';

export const routes: Routes = [
    { path: '', redirectTo: '/destinos', pathMatch: 'full' },
    { path: 'destinos', component: ListaDestinosComponent },
    { path: 'viajes', component: ListaViajesComponent },
    { path: '**', redirectTo: '/destinos' }
];
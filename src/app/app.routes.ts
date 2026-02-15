import { Routes } from '@angular/router';



export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./features/landing-page/landing-page.component').then(m => m.LandingPageComponent)
  },
  { 
    path: 'trash', 
    loadComponent: () => import('./features/trash-view/trash-view.component').then(m => m.TrashViewComponent)
  },
  { path: '**', redirectTo: '' }
];

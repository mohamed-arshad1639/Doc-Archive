import { Routes } from '@angular/router';



export const routes: Routes = [
  { path: '', redirectTo: 'grid', pathMatch: 'full' },
  { 
    path: 'grid', 
    loadComponent: () => import('./features/grid/grid.component').then(m => m.GridComponent)
  },
  { 
    path: 'list', 
    loadComponent: () => import('./features/list/list.component').then(m => m.ListComponent)
  },
  { 
    path: 'trash', 
    loadComponent: () => import('./features/trash-view/trash-view.component').then(m => m.TrashViewComponent)
  },
  { path: '**', redirectTo: 'grid' }
];

import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
        import('./layout/shell/shell')
            .then(m => m.ShellComponent),
        children: [
            {
                path: 'dashboard',
                loadComponent: () =>
                import('./features/dashboard/dashboard')
                    .then(m => m.DashboardComponent),
                //canActivate: [AuthGuard]
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    }
];

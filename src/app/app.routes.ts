import { Routes } from '@angular/router';

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
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    }
];

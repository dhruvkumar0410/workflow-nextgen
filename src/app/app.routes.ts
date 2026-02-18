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
                path: 'process',
                loadComponent: () =>
                    import('./processes/981/981')
                        .then(m => m.Process981),
                canActivate: [AuthGuard]
            },
            {
                path: '',
                redirectTo: 'process',
                pathMatch: 'full'
            }
        ]
    }
];

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
                path: 'process/:process_id',
                loadComponent: () =>
                    import('./processes/981/981')
                        .then(m => m.Process981),
                canActivate: [AuthGuard]
            },
            {
                path: 'process/:process_id/add',
                loadComponent: () =>
                import('./processes/981_add/981_add')
                    .then(m => m.Process981Add),
                canActivate: [AuthGuard]
              },
            {
                path: '',
                redirectTo: 'process',
                pathMatch: 'full'
            },
            {
                path: '**',
                redirectTo: 'process/981',
            }
        ]
    }
];


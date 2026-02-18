import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class AppConstants {

    readonly dashboardStatusOptions: string[] = ['Active', 'Inactive'];
    
    readonly dashboardPriorityOptions: string[] = [
        'High Priority',
        'Medium Priority',
        'Low Priority',
    ];
}

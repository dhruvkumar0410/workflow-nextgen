import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslatePipe } from '@ngx-translate/core';

//Services
import { SharedService } from '../../shared/services/shared';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {

  collapseSidebar: boolean = false;

  constructor(private sharedService: SharedService) {}

  ngOnInit() {
    this.sharedService.collapseSidebar$.subscribe((state: any) => {
      this.collapseSidebar = state;
    });
  }

}

import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslatePipe } from '@ngx-translate/core';
import { Utils } from '../../core/utils/utils';

import { AuthService } from './../../core/guards/auth.service';
import { SharedService } from '../../shared/services/shared';
import { Sidebar } from '../../services/sidebar/sidebar';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent implements OnInit {

  collapseSidebar = signal<boolean>(false);
  userProjDetails = signal<any>([]);
  userDetails = signal<any>([]);

  private authService = inject(AuthService);
  private sharedService = inject(SharedService);
  private sidebarService = inject(Sidebar);
  private utils = inject(Utils);

  ngOnInit() {
    this.sharedService.collapseSidebar$.subscribe((state: boolean) => {
      this.collapseSidebar.set(state);
    });
    
    this.initialize();
  }

  async initialize() {
    await this.loadUserDetails();
    await this.getUserProjDetails();
  }

  async loadUserDetails() {
    const data = await this.utils.getDetailByKey('wmUsrDtls');
    this.userDetails.set(data);
  }

  async getUserProjDetails() {
    try {
      const response: any = await this.sidebarService.userHierarchy();
      if (response?.body) {
        this.userProjDetails.set(response.body[0]?.projects[0]?.processes);
      }
    } catch (error) {
      console.error('Failed to fetch user details', error);
    }
  }

  toggleProcess(selectedProcess: any) {
    this.userProjDetails.update(processes => {
      return processes.map((process: any) => {
        if (process === selectedProcess) {
          return { ...process, open: !process.open };
        } else {
          return { ...process, open: false };
        }
      });
    });
  }

  handleLogout() {
    this.authService.logout();
  }
}
import { AuthService } from './../../core/guards/auth.service';
import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
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

  private authService = inject(AuthService);
  private sharedService = inject(SharedService);
  private sidebarService = inject(Sidebar);

  ngOnInit() {
    this.sharedService.collapseSidebar$.subscribe((state: boolean) => {
      this.collapseSidebar.set(state);
    });

    this.getUserProjDetails();
  }

  async getUserProjDetails() {
    try {
      const response: any = await this.sidebarService.userHierarchy();
      if (response?.body) {
        this.userProjDetails.set(response.body[0]?.projects[0]?.processes);
        console.log(this.userProjDetails());

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
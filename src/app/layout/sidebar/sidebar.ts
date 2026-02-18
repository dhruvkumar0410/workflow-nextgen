import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { Utils } from '../../core/utils/utils';

import { AuthService } from './../../core/guards/auth.service';
import { Shared } from '../../services/shared/shared';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent implements OnInit {

  collapseSidebar = signal<boolean>(false);
  userProjDetails = signal<any>([]);
  userDetails = signal<any>([]);
  dropdownOpen = signal<boolean>(false);

  private authService = inject(AuthService);
  private sharedService = inject(Shared);
  private utils = inject(Utils);
  private translate = inject(TranslateService);

  ngOnInit() {
    this.sharedService.collapseSidebar$.subscribe((state: boolean) => {
      this.collapseSidebar.set(state);
    });

    this.initialize();
  }

  async initialize() {
    await this.loadUserDetails();
    const accDetails = await this.utils.getDetailByKey('wmAccDtls');
    this.userProjDetails.set(accDetails);
  }

  async loadUserDetails() {
    const data = await this.utils.getDetailByKey('wmUsrDtls');
    this.userDetails.set(data);
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

  changeLanguage(lang: string) {
    try {
      this.translate.use(lang);
      document.documentElement.lang = lang;
      document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
    } catch (err) {
      console.error('Failed to change language', err);
    }
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.dropdownOpen.update(v => !v);
  }

  closeDropdown() {
    this.dropdownOpen.set(false);
  }

  handleLogout() {
    this.authService.logout();
  }
}
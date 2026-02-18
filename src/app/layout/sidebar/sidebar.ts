import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Utils } from '../../core/utils/utils';

import { AuthService } from './../../core/guards/auth.service';
import { SharedService } from '../../shared/services/shared';
import { Sidebar } from '../../services/sidebar/sidebar';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent implements OnInit, OnDestroy {

  collapseSidebar = signal<boolean>(false);
  userProjDetails = signal<any>([]);
  userDetails = signal<any>([]);

  private authService = inject(AuthService);
  private sharedService = inject(SharedService);
  private sidebarService = inject(Sidebar);
  private translate = inject(TranslateService);
  private utils = inject(Utils);
  private _docClickHandler: any;

  dropdownOpen = signal<boolean>(false);

  ngOnInit() {
    this.sharedService.collapseSidebar$.subscribe((state: boolean) => {
      this.collapseSidebar.set(state);
    });
    this._docClickHandler = (ev: any) => {
      if (this.dropdownOpen()) {
        this.dropdownOpen.set(false);
      }
    };
    document.addEventListener('click', this._docClickHandler);

    this.initialize();
  }

  ngOnDestroy() {
    if (this._docClickHandler) {
      document.removeEventListener('click', this._docClickHandler);
    }
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

  changeLanguage(lang: string) {
    try {
      this.translate.use(lang);
      try {
        // set document language and text direction for Arabic
        document.documentElement.lang = lang;
        document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
      } catch (e) {
        // ignore if document not available (e.g., server-side)
      }
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
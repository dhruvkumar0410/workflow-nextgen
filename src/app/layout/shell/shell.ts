import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

//Components
import { Shared } from '../../services/shared/shared';

import { HeaderComponent } from '../header/header';
import { SidebarComponent } from '../sidebar/sidebar';

@Component({
  standalone: true,
  selector: 'app-shell',
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    CommonModule
  ],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class ShellComponent implements OnInit {

  statechecking: boolean = false;

  constructor(private sharedService: Shared) { }

  ngOnInit() {
    this.sharedService.collapseSidebar$.subscribe((state: boolean) => {
      // Handle sidebar collapse state if needed
      this.statechecking = state;
    });
  }
}

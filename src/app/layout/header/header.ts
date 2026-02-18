import { Component } from '@angular/core';

//Services
import { Shared } from '../../services/shared/shared';
@Component({
  standalone: true,
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent {

  collapseSidebar: boolean = false;

  constructor(private sharedService: Shared) {}

  handleCollapseSidebar() {
    this.collapseSidebar = !this.collapseSidebar;
    this.sharedService.handleCollapseSidebar(this.collapseSidebar);
  }

}

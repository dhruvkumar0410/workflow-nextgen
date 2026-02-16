import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

//Components
import { HeaderComponent } from '../header/header';
import { SidebarComponent } from '../sidebar/sidebar';

@Component({
  standalone: true,
  selector: 'app-shell',
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class ShellComponent {

}

import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  
  lst_name: string = '';

  fltr(val: string) {
    this.lst_name = val;
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-981',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './981.html',
  styleUrl: './981.css',
})
export class Process981 {
lst_name = '';

  fltr(val: string): void {
    this.lst_name = val;
  }

}

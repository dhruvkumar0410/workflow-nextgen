import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  constructor(private translateService: TranslateService) {}

  rtLangs: any = ["ar"];

  ngOnInit() {
    this.changeLanguage("en");
  }

  private changeLanguage(lang: string) {
    this.translateService.use(lang);
    this.updateDirection(lang);
  }

  private updateDirection(lang: string) {
    if (this.rtLangs.includes(lang)) {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }
}

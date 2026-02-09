import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { SharedService } from './shared/services/shared';
import { IAPIOptions, RequestType } from './core/encryption/custom.strategy';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  constructor(
    private translateService: TranslateService,
    private sharedService: SharedService
  ) {}

  rtLangs: any = ["ar"];

  async ngOnInit() {
    this.changeLanguage("en");

    /** Sample Code, Need to remove once added one actual API Call */
    localStorage.setItem("_tkn", "9b97c4a8-2bd4-4a54-9288-ce2c998a5331");

    let apiOptions: IAPIOptions = {
      Headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem("_tkn") || '',
      },
      RequestURL: "https://workflow.mappls.com/userManagement/v2/accounts?platform=1",
      RequestMethod: RequestType.GET,
      RequestBody: ""
    };

    let response = await this.sharedService.getUserAccounts(apiOptions);
    console.log(response);

    let response1 = await this.sharedService.getUserAccounts1();
    console.log(response1);
    /** Sample Code, Need to remove once added one actual API Call */
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

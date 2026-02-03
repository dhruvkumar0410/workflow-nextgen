import { bootstrapApplication } from '@angular/platform-browser';

//Configs
import { appConfig } from './app/app.config';

//Components
import { AppComponent } from './app/app';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

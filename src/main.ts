import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

import { addIcons } from 'ionicons';

import {
  homeOutline,
  addCircleOutline,
  calendarClearOutline,
  medicalOutline
} from 'ionicons/icons';

addIcons({
  'home-outline': homeOutline,
  'add-circle-outline': addCircleOutline,
  'calendar-clear-outline': calendarClearOutline,
  'medical-outline': medicalOutline
});

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

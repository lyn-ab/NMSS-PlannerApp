import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app-routing.module';

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

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
});
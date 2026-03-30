import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  // 1. Keep this variable here
  showMenu = false;

  // 2. Put the logic inside the constructor
  constructor(public router: Router) {

    // Check the current route immediately (for when the app first loads)
    this.checkRoute(window.location.pathname);

    // Then start listening for every time the user navigates to a new page
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.checkRoute(event.urlAfterRedirects);
    });
  }

  // 3. I created this small helper function so we don't repeat code
  private checkRoute(url: string) {
    const hiddenRoutes = ['/login', '/setup'];
    // If the URL contains 'login' or 'setup', showMenu becomes FALSE
    this.showMenu = !hiddenRoutes.some(route => url.includes(route));
  }
}

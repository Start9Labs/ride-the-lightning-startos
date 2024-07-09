import { Component } from '@angular/core';
import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterEvent } from '@angular/router';
import { routeAnimation } from '../shared/animation/route-animation';

@Component({
  selector: 'rtl-cln-root',
  templateUrl: './cln-root.component.html',
  styleUrls: ['./cln-root.component.scss'],
  animations: [routeAnimation]
})
export class CLNRootComponent {

  loading = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event: Event | RouterEvent) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          break;
        }
        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loading = false;
          break;
        }
        default: {
          break;
        }
      }
    });
  }

}

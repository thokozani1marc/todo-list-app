import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppComponent, routes } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), provideAnimationsAsync()
  ]
}).catch(err => console.error(err));
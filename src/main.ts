import { bootstrapApplication } from '@angular/platform-browser';
// Ensure JIT compiler is available during dev HMR reloads
import '@angular/compiler';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Force rebuild - Add Existing button repositioning
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http'; // Import provideHttpClient
import { provideRouter } from '@angular/router'; // If you use routing
import { routes } from './app/app.routes'; // Your routes
// import { otherProviders } from './app/other.providers'; // Any other providers

// If you have environment settings
// import { environment } from './environments/environment';
// if (environment.production) {
//   enableProdMode();
// }

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(), // Provide HttpClient here
    provideRouter(routes), // Provide Router if you use routing
    // ...otherProviders
  ]
}).catch(err => console.error(err));

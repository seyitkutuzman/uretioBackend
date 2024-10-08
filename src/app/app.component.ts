import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule, RouterLink, RouterLinkActive, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Doğru yazım
})
export class AppComponent {
  title = 'uretio';
  currentUrl: string = '';

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentUrl = event.url;
      });
  }

  showNavbar(): boolean {
    return this.currentUrl !== '/login' &&
           this.currentUrl !== '/forgot-password' &&
           this.currentUrl !== '/change-password' &&
           this.currentUrl !== '/admin-login';
  }
}


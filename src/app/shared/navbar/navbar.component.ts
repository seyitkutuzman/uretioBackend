import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
})
export class NavbarComponent implements OnInit {
  userRole: string | null = null;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole');
  }
}

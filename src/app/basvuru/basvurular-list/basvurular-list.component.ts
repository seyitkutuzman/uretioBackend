import { Component, OnInit } from '@angular/core';
import { BasvurularService } from '../../services/basvurular.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-basvurular-list',
  templateUrl: './basvurular-list.component.html',
  styleUrls: ['./basvurular-list.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class BasvurularListComponent implements OnInit {
  basvurular: any[] = [];

  constructor(private basvurularService: BasvurularService, private router: Router) { }

  ngOnInit(): void {
    this.basvurularService.getBasvurular().subscribe(
      data => {
        this.basvurular = data;
      },
      error => {
        console.error('Başvurular yüklenirken hata oluştu:', error);
      }
    );
  }

  viewDetails(id: number): void {
    this.router.navigate(['/basvurular', id]);
  }
}

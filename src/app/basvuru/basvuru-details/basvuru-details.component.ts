import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BasvurularService } from '../../services/basvurular.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-basvuru-details',
  templateUrl: './basvuru-details.component.html',
  styleUrls: ['./basvuru-details.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class BasvuruDetailsComponent implements OnInit {
  basvuru: any;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private route: ActivatedRoute, private basvurularService: BasvurularService) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.basvurularService.getBasvuru(id).subscribe(
      data => {
        this.basvuru = data;
      },
      error => {
        console.error('Başvuru detayları yüklenirken hata oluştu:', error);
      }
    );
  }

  createUser(): void {
    this.basvurularService.createUserFromBasvuru(this.basvuru.id).subscribe(
      response => {
        this.successMessage = response.message;
      },
      error => {
        this.errorMessage = error.error;
        console.error('Kullanıcı oluşturulurken hata oluştu:', error);
      }
    );
  }
}

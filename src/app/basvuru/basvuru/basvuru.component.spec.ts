import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasvuruComponent } from './basvuru.component';

describe('BasvuruComponent', () => {
  let component: BasvuruComponent;
  let fixture: ComponentFixture<BasvuruComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasvuruComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BasvuruComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

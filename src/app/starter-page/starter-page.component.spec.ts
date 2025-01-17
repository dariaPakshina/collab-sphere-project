import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarterPageComponent } from './starter-page.component';
import { provideRouter } from '@angular/router';

describe('StarterPageComponent', () => {
  let component: StarterPageComponent;
  let fixture: ComponentFixture<StarterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StarterPageComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(StarterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

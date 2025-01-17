import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocCardComponent } from './doc-card.component';
import { provideRouter } from '@angular/router';

describe('DocCardComponent', () => {
  let component: DocCardComponent;
  let fixture: ComponentFixture<DocCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocCardComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DocCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

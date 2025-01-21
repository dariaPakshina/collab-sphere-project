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
    component.doc = {
      id: 1,
      title: 'Test Doc',
      content: 'Sample content',
      edittime: '2024-01-21',
      shared_users: null,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

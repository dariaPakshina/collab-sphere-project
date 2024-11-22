import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavDocsComponent } from './nav-docs.component';

describe('NavDocsComponent', () => {
  let component: NavDocsComponent;
  let fixture: ComponentFixture<NavDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavDocsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

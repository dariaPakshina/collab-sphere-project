import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteWindowComponent } from './delete-window.component';

describe('DeleteWindowComponent', () => {
  let component: DeleteWindowComponent;
  let fixture: ComponentFixture<DeleteWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteWindowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

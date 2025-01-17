import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SharedNavDocEditComponent } from "./shared-nav-doc-edit.component";
import { provideRouter } from "@angular/router";

describe("SharedNavDocEditComponent", () => {
  let component: SharedNavDocEditComponent;
  let fixture: ComponentFixture<SharedNavDocEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedNavDocEditComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedNavDocEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

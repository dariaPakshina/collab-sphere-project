import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DocEditComponent } from "./doc-edit.component";
import { provideRouter } from "@angular/router";

describe("DocEditComponent", () => {
  let component: DocEditComponent;
  let fixture: ComponentFixture<DocEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocEditComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DocEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

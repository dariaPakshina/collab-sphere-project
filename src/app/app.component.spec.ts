import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideRouter } from '@angular/router';
import { AuthService } from './auth/auth.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([]), AuthService],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    fixture.autoDetectChanges();
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
    expect(component).toBeDefined();
  });

  it(`should have the 'CollabSphere' title`, () => {
    expect(component.title).toEqual('CollabSphere');
  });

  it('should call autoLogIn from authService', () => {
    const autoLogInSpy = spyOn(authService, 'autoLogIn');
    component.ngOnInit();
    expect(autoLogInSpy).toHaveBeenCalled();
  });
});

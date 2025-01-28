import {
  AfterContentInit,
  AfterViewInit,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DocEditComponent } from './doc-edit/doc-edit.component';
import { NavDocEditComponent } from './doc-edit/nav-doc-edit/nav-doc-edit.component';
import { DocsComponent } from './docs/docs.component';
import { AuthService } from './auth/auth.service';

// auto login when page init

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSlideToggleModule,
    DocEditComponent,
    NavDocEditComponent,
    DocsComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  authService = inject(AuthService);
  title = 'CollabSphere';
  ngOnInit(): void {
    this.authService.autoLogIn();
  }
}

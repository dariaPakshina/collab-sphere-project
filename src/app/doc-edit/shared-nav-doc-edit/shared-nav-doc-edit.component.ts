import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router } from '@angular/router';
import { DocsService } from '../../docs/docs.service';
import { RealtimeService } from '../../realtime.service';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-shared-nav-doc-edit',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './shared-nav-doc-edit.component.html',
  styleUrl: './shared-nav-doc-edit.component.scss',
})
export class SharedNavDocEditComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private docsService: DocsService,
    public realtimeService: RealtimeService,
    private apiService: ApiService
  ) {}

  goToDocs() {
    if (this.docsService.editMode === false) {
      this.router.navigate(['../docs'], { relativeTo: this.route });
    } else {
      this.router.navigate(['../../docs'], { relativeTo: this.route });
    }
  }
}

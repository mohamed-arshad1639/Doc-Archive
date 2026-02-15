import { Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { GridComponent } from '../grid/grid.component';
import { ListComponent } from '../list/list.component';
import { SearchService } from '../../core/services/search.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, GridComponent, ListComponent, AsyncPipe],
  template: `
    <div class="landing-page-container">
      @if ((searchService.criteria$ | async)?.viewMode === 'list') {
        <app-list></app-list>
      } @else {
        <app-grid></app-grid>
      }
    </div>
  `
})
export class LandingPageComponent {
  searchService = inject(SearchService);
}

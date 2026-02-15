import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { SearchService, SortOption, FilterType } from '../../services/search.service';
import { StorageService } from '../../services/storage.service';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-top-bar',
    template: `
    <div class="fixed top-0 left-0 w-full bg-white/90 dark:bg-jet-black/90 backdrop-blur-md z-40 px-4 py-3 shadow-sm flex items-center justify-between gap-4">
      
      <!-- Search Input -->
      <div class="flex-grow max-w-xl relative">
        <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
        </div>
        <input 
          type="text" 
          placeholder="Search documents..." 
          class="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-dark-gray text-jet-black dark:text-off-white border-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 outline-none transition-all"
          (input)="onSearch($event)"
        >
      </div>

      <!-- Filters & Sort -->
      <div class="flex items-center gap-2">
        <select 
          class="bg-transparent text-sm font-medium text-jet-black dark:text-off-white border-none outline-none cursor-pointer focus:ring-0"
          (change)="onSortChange($event)"
        >
          <option value="date-desc">Newest</option>
          <option value="date-asc">Oldest</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="size-desc">Size</option>
        </select>

        <button 
          class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-gray transition-colors"
          (click)="toggleFavorites()"
          [class.text-red-500]="(searchService.criteria$ | async)?.onlyFavorites"
          [class.text-gray-400]="!((searchService.criteria$ | async)?.onlyFavorites)"
          title="Toggle Favorites"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" stroke="none">
             <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>

        <a routerLink="/trash" routerLinkActive="text-red-500" 
           class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-gray transition-colors text-gray-400 hover:text-red-500" 
           [class.animate-shake]="isTrashAnimating"
           [class.text-red-500]="isTrashAnimating"
           title="Trash">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </a>
      </div>
    </div>
    <!-- Spacer for fixed header -->
    <div class="h-16"></div>
  `,
    standalone: true,
    imports: [AsyncPipe, RouterLink, RouterLinkActive],
    styles: [`
    /* Shake Animation */
    @keyframes shake {
      0% { transform: rotate(0); }
      20% { transform: rotate(-10deg); }
      40% { transform: rotate(10deg); }
      60% { transform: rotate(-10deg); }
      80% { transform: rotate(10deg); }
      100% { transform: rotate(0); }
    }
    .animate-shake {
      animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
    }
    `]
})
export class TopBarComponent {
  public searchService = inject(SearchService);
  private storageService = inject(StorageService); // Inject StorageService to listen for trash actions
  
  isTrashAnimating = false;

  private cdr = inject(ChangeDetectorRef);

  constructor() {
    this.storageService.trashAction$.subscribe(() => {
      console.log('Trash action received in TopBar!');
      this.triggerTrashAnimation();
    });
  }

  triggerTrashAnimation() {
    this.isTrashAnimating = true;
    this.cdr.detectChanges(); // Force update
    setTimeout(() => {
      this.isTrashAnimating = false;
      this.cdr.detectChanges(); // Force update
    }, 400); // Duration matches animation
  }

  onSearch(event: any) {
    this.searchService.updateSearchTerm(event.target.value);
  }

  onSortChange(event: any) {
    this.searchService.updateSort(event.target.value as SortOption);
  }

  toggleFavorites() {
    this.searchService.toggleFavoritesOnly();
  }
}

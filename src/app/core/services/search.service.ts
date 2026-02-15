import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

export type SortOption = 'date-desc' | 'date-asc' | 'name-asc' | 'name-desc' | 'size-desc';
export type FilterType = 'all' | 'image' | 'pdf' | 'other';

export interface SearchCriteria {
  searchTerm: string;
  sortBy: SortOption;
  filterType: FilterType;
  onlyFavorites: boolean;
  folderId?: number | null; // null for root, undefined for all? Or explicit IDs.
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  // Use a private signal for state
  private criteriaSignal = signal<SearchCriteria>({
    searchTerm: '',
    sortBy: 'date-desc',
    filterType: 'all',
    onlyFavorites: false,
    folderId: null // Start with root (null)
  });

  // Expose as read-only signal if needed, but here we expose the observable for compat
  readonly criteria = this.criteriaSignal.asReadonly();
  
  // Expose observable for RxJS interoperability
  readonly criteria$ = toObservable(this.criteriaSignal);

  updateSearchTerm(term: string) {
    this.updateCriteria({ searchTerm: term });
  }

  updateSort(sort: SortOption) {
    this.updateCriteria({ sortBy: sort });
  }

  updateFilterType(type: FilterType) {
    this.updateCriteria({ filterType: type });
  }



  toggleFavoritesOnly() {
    this.updateCriteria({ onlyFavorites: !this.criteriaSignal().onlyFavorites });
  }

  selectFolder(folderId: number | null | undefined) {
    this.updateCriteria({ folderId });
  }

  private updateCriteria(changes: Partial<SearchCriteria>) {
    this.criteriaSignal.update(current => ({ ...current, ...changes }));
  }
}

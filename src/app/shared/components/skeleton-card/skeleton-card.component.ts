import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="aspect-[3/4] bg-white dark:bg-dark-gray rounded-lg shadow-sm overflow-hidden animate-pulse border border-gray-100 dark:border-gray-800">
      <div class="w-full h-full relative">
        <!-- Thumbnail placeholder -->
        <div class="absolute inset-0 bg-gray-200 dark:bg-gray-700"></div>
        
        <!-- Text content placeholder at bottom -->
        <div class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/20 to-transparent">
           <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
           <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  `
})
export class SkeletonCardComponent {}

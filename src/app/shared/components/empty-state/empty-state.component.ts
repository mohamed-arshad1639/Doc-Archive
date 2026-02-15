

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

// Re-defining properly with Output
@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
      <div class="w-24 h-24 bg-gray-100 dark:bg-dark-gray-lighter rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100 dark:border-gray-700">
        @switch (icon) {
          @case ('folder') {
            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
          }
          @case ('search') {
            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          }
          @case ('trash') {
            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
          }
          @default {
            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
          }
        }
      </div>
      <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">{{ title }}</h3>
      <p class="text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">{{ message }}</p>
      
      @if (actionLabel) {
        <button (click)="action.emit()" class="mt-8 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg shadow-blue-600/20 transition-all hover:scale-105 font-medium flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          {{ actionLabel }}
        </button>
      }
    </div>
  `
})
export class EmptyStateComponent {
  @Input() title: string = 'No items found';
  @Input() message: string = 'There are no items to display at the moment.';
  @Input() icon: 'folder' | 'search' | 'trash' | 'document' = 'document';
  @Input() actionLabel?: string;
  @Output() action = new EventEmitter<void>();
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-20 left-1/2 -translate-x-1/2 z-[70] flex flex-col gap-2 pointer-events-none items-center">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="pointer-events-auto min-w-[300px] max-w-md p-4 rounded-lg shadow-lg flex items-center justify-between gap-3 transform transition-all duration-300 animate-in slide-in-from-right fade-in"
             [ngClass]="{
               'bg-white dark:bg-dark-gray border-l-4 border-green-500 text-gray-800 dark:text-white': toast.type === 'success',
               'bg-white dark:bg-dark-gray border-l-4 border-red-500 text-gray-800 dark:text-white': toast.type === 'error',
               'bg-white dark:bg-dark-gray border-l-4 border-blue-500 text-gray-800 dark:text-white': toast.type === 'info'
             }">
          
          <div class="flex items-center gap-3">
            @if (toast.type === 'success') {
                <span class="text-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </span>
            } @else if (toast.type === 'error') {
                <span class="text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                </span>
            } @else {
                <span class="text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                </span>
            }
            <p class="text-sm font-medium">{{ toast.message }}</p>
          </div>

          <button (click)="toastService.remove(toast.id)" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  toastService = inject(ToastService);
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Folder } from '../../../core/models/folder.model';

@Component({
  selector: 'app-folder-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="group relative aspect-[3/4] bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center justify-center border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-700" (click)="select.emit(folder)">
      
      <!-- Action Menu Button (Top Right) -->
      <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10" (click)="$event.stopPropagation()">
        <button (click)="toggleMenu()" class="p-1.5 rounded-full bg-white/80 dark:bg-black/50 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
        </button>
        
        <!-- Dropdown Menu -->
        @if (showMenu) {
            <div class="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100" (mouseleave)="showMenu = false">
                <button (click)="onDelete($event)" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    Delete
                </button>
            </div>
        }
      </div>

      <div class="text-blue-500 dark:text-blue-400 mb-2 transform group-hover:scale-110 transition-transform">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="0" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>
      <h3 class="text-jet-black dark:text-off-white font-medium text-center px-2 truncate w-full">{{ folder.name }}</h3>
      <p class="text-xs text-gray-400 mt-1">{{ folder.createdAt | date:'shortDate' }}</p>
    </div>
  `
})
export class FolderCardComponent {
  @Input({ required: true }) folder!: Folder;
  @Output() select = new EventEmitter<Folder>();
  @Output() delete = new EventEmitter<Folder>();
  
  showMenu = false;

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  onDelete(event: Event) {
    event.stopPropagation();
    this.showMenu = false;
    this.delete.emit(this.folder);
  }
}

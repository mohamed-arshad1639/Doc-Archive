import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../../core/services/storage.service';

@Component({
  selector: 'app-new-folder-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white dark:bg-dark-gray rounded-xl shadow-2xl p-6 w-full max-w-sm mx-4 animate-in fade-in zoom-in duration-200">
        <h2 class="text-xl font-bold mb-4 text-jet-black dark:text-off-white">New Folder</h2>
        
        <input 
          type="text" 
          [(ngModel)]="folderName" 
          placeholder="Folder Name" 
          class="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none mb-6"
          (keyup.enter)="create()"
          autofocus
        >

        <div class="flex justify-end gap-3">
          <button (click)="close.emit()" class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">Cancel</button>
          <button (click)="create()" [disabled]="!folderName.trim()" class="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Create</button>
        </div>
      </div>
    </div>
  `
})
export class NewFolderDialogComponent {
  @Output() close = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  storageService = inject(StorageService);
  folderName = '';

  async create() {
    if (!this.folderName.trim()) return;
    await this.storageService.addFolder(this.folderName.trim());
    this.created.emit();
    this.close.emit();
  }
}

import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { StorageService } from '../../core/services/storage.service';
import { SearchService } from '../../core/services/search.service';
import { Folder } from '../../core/models/folder.model';
import { DocXDocument } from '../../core/models/document.model';

import { ConfirmationModalComponent } from '../../shared/components/confirmation-modal/confirmation-modal.component';

import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-trash-view',
  standalone: true,
  imports: [CommonModule, ConfirmationModalComponent, EmptyStateComponent, AsyncPipe],
  template: `
    <div class="p-6 pb-24 bg-primary-bg min-h-screen">
      <!-- Header & Breadcrumb -->
      <div class="flex items-center gap-4 mb-8">
        @if (currentFolder) {
          <button (click)="closeFolder()" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
          </button>
          <h1 class="text-lg font-bold text-jet-black dark:text-off-white flex items-center">
            <span (click)="closeFolder()" class="text-gray-400 font-normal hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer transition-colors mr-2">Trash &gt;</span> 
            {{ currentFolder.name }}
          </h1>
        } @else {
          <div class="flex items-center gap-2">
            <button (click)="goBack()" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
            </button>
            <h1 class="text-lg font-bold text-jet-black dark:text-off-white">Trash</h1>
          </div>
        }
      </div>
      
      @if (getVisibleFolders().length === 0 && getVisibleDocuments().length === 0) {
      @if (getVisibleFolders().length === 0 && getVisibleDocuments().length === 0) {
        <app-empty-state
          [title]="currentFolder ? 'Folder is empty' : 'Trash is empty'"
          [message]="currentFolder ? 'This deleted folder does not contain any items.' : 'Items moved to trash will appear here. Trash is automatically emptied after 30 days.'"
          [icon]="currentFolder ? 'folder' : 'trash'">
        </app-empty-state>
      }
      }

      <!-- Deleted Folders (Only in Root View) -->
      @if (!currentFolder && getVisibleFolders().length > 0) {
        <h2 class="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Folders</h2>
        
        @if ((searchService.criteria$ | async)?.viewMode === 'list') {
             <div class="flex flex-col gap-2 mb-8">
                @for (folder of getVisibleFolders(); track folder.id) {
                    <div (click)="openFolder(folder)" class="group flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-transparent hover:border-red-200 dark:hover:border-red-700 cursor-pointer transition-colors">
                        <div class="flex items-center gap-4">
                            <div class="text-red-400 dark:text-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/></svg>
                            </div>
                            <div>
                                <h3 class="text-jet-black dark:text-off-white font-medium">{{ folder.name }}</h3>
                                <p class="text-xs text-gray-400">Deleted</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button (click)="restoreFolder(folder); $event.stopPropagation()" class="px-3 py-1 bg-green-600 text-white rounded-md text-xs hover:bg-green-700 transition-colors">Restore</button>
                             <button (click)="permDeleteFolder(folder); $event.stopPropagation()" class="px-3 py-1 bg-red-600 text-white rounded-md text-xs hover:bg-red-700 transition-colors">Delete Forever</button>
                        </div>
                    </div>
                }
             </div>
        } @else {
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
              @for (folder of getVisibleFolders(); track folder.id) {
                <!-- Added cursor-pointer and click handler to open folder -->
                <div (click)="openFolder(folder)" class="group relative aspect-[3/4] bg-red-50 dark:bg-red-900/10 rounded-lg shadow-sm flex flex-col items-center justify-center border-2 border-transparent hover:border-red-200 dark:hover:border-red-700 cursor-pointer transition-all hover:scale-[1.02]">
                  
                  <!-- Restore/Delete Actions Overlay (Stop propagation to prevent opening folder when clicking buttons) -->
                  <div class="absolute inset-0 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4 z-10">
                      <button (click)="restoreFolder(folder); $event.stopPropagation()" class="px-3 py-1 bg-green-600 text-white rounded-md text-sm w-full hover:bg-green-700 transition-colors">Restore</button>
                      <button (click)="permDeleteFolder(folder); $event.stopPropagation()" class="px-3 py-1 bg-red-600 text-white rounded-md text-sm w-full hover:bg-red-700 transition-colors">Delete Forever</button>
                  </div>
    
                  <div class="text-red-400 dark:text-red-500 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="0" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                  </div>
                  <h3 class="text-jet-black dark:text-off-white font-medium text-center px-2 truncate w-full">{{ folder.name }}</h3>
                  <p class="text-xs text-gray-400 mt-1">Deleted</p>
                </div>
              }
            </div>
        }
      }

      <!-- Deleted Documents -->
      @if (getVisibleDocuments().length > 0) {
        <h2 class="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Documents</h2>
        
        @if ((searchService.criteria$ | async)?.viewMode === 'list') {
            <div class="bg-white dark:bg-dark-gray rounded-lg shadow-sm overflow-hidden">
                <table class="w-full text-left border-collapse">
                    <thead class="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase">
                        <tr>
                            <th class="px-4 py-3 font-medium">Name</th>
                            <th class="px-4 py-3 font-medium hidden sm:table-cell">Type</th>
                            <th class="px-4 py-3 font-medium hidden md:table-cell">Deleted From</th>
                            <th class="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                        @for (doc of getVisibleDocuments(); track doc.id) {
                            <tr class="group hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-colors">
                                <td class="px-4 py-3 flex items-center gap-3">
                                    <div class="w-8 h-8 rounded bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                                        <img [src]="doc.thumbnail || 'assets/placeholder.png'" class="w-full h-full object-cover">
                                    </div>
                                    <div>
                                        <p class="text-sm font-medium text-jet-black dark:text-off-white">{{ doc.name }}</p>
                                        <p class="text-xs text-red-500">Deleted</p>
                                    </div>
                                </td>
                                <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell uppercase">{{ doc.type }}</td>
                                <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">Folder #{{ doc.folderId || 'Root' }}</td>
                                <td class="px-4 py-3 text-right">
                                    <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button (click)="restoreDoc(doc)" class="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors" title="Restore">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 14 4 9 9 4"></polyline><path d="M20 20v-7a4 4 0 0 0-4-4H4"></path></svg>
                                        </button>
                                        <button (click)="permDeleteDoc(doc)" class="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors" title="Delete Forever">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>

        } @else {
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              @for (doc of getVisibleDocuments(); track doc.id) {
                <div class="group relative aspect-[3/4] bg-white dark:bg-dark-gray rounded-lg shadow-sm overflow-hidden">
                 
                  <!-- Restore/Delete Actions Overlay -->
                  <div class="absolute inset-0 z-10 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                      <button (click)="restoreDoc(doc)" class="px-3 py-1 bg-green-600 text-white rounded-md text-sm w-full hover:bg-green-700 transition-colors">Restore</button>
                      <button (click)="permDeleteDoc(doc)" class="px-3 py-1 bg-red-600 text-white rounded-md text-sm w-full hover:bg-red-700 transition-colors">Delete Forever</button>
                  </div>
    
                  <img [src]="doc.thumbnail || 'assets/placeholder.png'" class="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity" loading="lazy">
                  <div class="absolute inset-x-0 bottom-0 bg-red-900/80 p-2">
                    <h3 class="text-white text-sm font-semibold truncate">{{ doc.name }}</h3>
                    <p class="text-red-200 text-xs">Deleted</p>
                  </div>
                </div>
              }
            </div>
        }
      }
    </div>

    @if (showConfirmModal) {
      <app-confirmation-modal
        [title]="confirmModalConfig.title"
        [message]="confirmModalConfig.message"
        [type]="confirmModalConfig.type"
        [confirmText]="confirmModalConfig.confirmText"
        (confirm)="confirmAction()"
        (cancel)="showConfirmModal = false">
      </app-confirmation-modal>
    }
  `
})
export class TrashViewComponent implements OnInit {
  storageService = inject(StorageService);
  searchService = inject(SearchService);
  cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  folders: Folder[] = [];
  documents: DocXDocument[] = [];
  
  currentFolder: Folder | null = null; // Track drilled-down folder

  goBack() {
    this.router.navigate(['/']);
  }

  ngOnInit() {
    this.refreshTrash(); // Initial load
    this.storageService.refresh$.subscribe(() => {
        this.refreshTrash();
    });
  }

  async refreshTrash() {
    const trash = await this.storageService.getTrashItems();
    this.folders = trash.folders;
    this.documents = trash.documents;
    
    // If we are currently inside a folder, verify it still exists/is deleted. 
    // If it was permanently deleted or restored, kick user back to root.
    if (this.currentFolder) {
        const stillExists = this.folders.find(f => f.id === this.currentFolder?.id);
        if (!stillExists) {
            this.currentFolder = null;
        }
    }

    this.cdr.detectChanges();
  }

  // Open a folder to see its contents
  openFolder(folder: Folder) {
    this.currentFolder = folder;
    this.cdr.detectChanges();
  }

  // Go back to root trash
  closeFolder() {
    this.currentFolder = null;
    this.cdr.detectChanges();
  }

  // Get folders to display (always empty if inside a folder, else all deleted folders)
  getVisibleFolders(): Folder[] {
    if (this.currentFolder) return [];
    return this.folders;
  }

  // Get documents to display
  getVisibleDocuments(): DocXDocument[] {
    if (this.currentFolder) {
        // Show only docs inside this deleted folder
        return this.documents.filter(d => d.folderId === this.currentFolder?.id);
    } else {
        // Show deleted docs that are NOT in a deleted folder (orphans or from live folders)
        const deletedFolderIds = new Set(this.folders.map(f => f.id));
        return this.documents.filter(d => !d.folderId || !deletedFolderIds.has(d.folderId));
    }
  }

  async restoreFolder(folder: Folder) {
    if (folder.id) {
        await this.storageService.restoreFolder(folder.id);
        // refreshTrash will handle kicking back to root if needed
    }
  }

  // Confirmation Modal
  showConfirmModal = false;
  confirmModalConfig = {
    title: '',
    message: '',
    type: 'danger' as 'danger' | 'warning' | 'info',
    confirmText: 'Delete Forever',
    action: () => {}
  };

  confirmAction() {
    this.confirmModalConfig.action();
  }

  async permDeleteFolder(folder: Folder) {
    if (!folder.id) return;
    this.confirmModalConfig = {
        title: 'Permanently Delete Folder',
        message: `Permanently delete folder "${folder.name}" and all its contents? This cannot be undone.`,
        type: 'danger',
        confirmText: 'Delete Forever',
        action: async () => {
            await this.storageService.permanentlyDeleteFolder(folder.id!);
            this.showConfirmModal = false;
            this.refreshTrash();
        }
    };
    this.showConfirmModal = true;
  }
// ...

  async restoreDoc(doc: DocXDocument) {
    if (doc.id) {
        await this.storageService.restoreDocument(doc.id);
        this.refreshTrash();
    }
  }

  async permDeleteDoc(doc: DocXDocument) {
    if (!doc.id) return;
    this.confirmModalConfig = {
        title: 'Permanently Delete Document',
        message: `Permanently delete document "${doc.name}"? This cannot be undone.`,
        type: 'danger',
        confirmText: 'Delete Forever',
        action: async () => {
            await this.storageService.permanentlyDeleteDocument(doc.id!);
            this.showConfirmModal = false;
            this.refreshTrash();
        }
    };
    this.showConfirmModal = true;
  }
}

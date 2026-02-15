import { Component, OnInit, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../core/services/storage.service';
import { SearchService } from '../../core/services/search.service';
import { DocXDocument } from '../../core/models/document.model';
import { Folder } from '../../core/models/folder.model';
import { combineLatest, from, startWith, switchMap } from 'rxjs';
import { DocumentEditComponent } from '../../shared/components/document-edit/document-edit.component';
import { NewFolderDialogComponent } from '../../shared/components/new-folder-dialog/new-folder-dialog.component';

import { ConfirmationModalComponent } from '../../shared/components/confirmation-modal/confirmation-modal.component';

import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  standalone: true,
  imports: [CommonModule, DocumentEditComponent, NewFolderDialogComponent, ConfirmationModalComponent, EmptyStateComponent]
})
export class ListComponent implements OnInit {
  private storageService = inject(StorageService);
  private searchService = inject(SearchService);
  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);
  
  documents: DocXDocument[] = [];
  folders: Folder[] = [];
  loading = true;
  currentFolderId: number | null | undefined = undefined;
  currentFolder: Folder | null = null;

  editingDoc: DocXDocument | null = null;
  showNewFolderDialog = false;

  ngOnInit(): void {
    combineLatest({
      refresh: this.storageService.refresh$.pipe(startWith(undefined)),
      criteria: this.searchService.criteria$
    }).pipe(
      switchMap(({ criteria }) => {
        this.loading = true;
        this.currentFolderId = criteria.folderId;
        const foldersPromise = (criteria.folderId === null || criteria.folderId === undefined) 
          ? this.storageService.getAllFolders() 
          : Promise.resolve([]);

        // Fetch current folder details
        const currentFolderPromise = (criteria.folderId)
          ? this.storageService.getFolder(criteria.folderId)
          : Promise.resolve(null);

        return from(Promise.all([
          foldersPromise,
          this.storageService.queryDocuments(criteria),
          currentFolderPromise
        ]));
      })
    ).subscribe(([folders, docs, currentFolder]) => {
      this.ngZone.run(() => {
        this.folders = folders as Folder[];
        this.documents = docs;
        if (currentFolder) {
            (this as any).currentFolder = currentFolder;
        } else {
            (this as any).currentFolder = null;
        }
        this.loading = false;
        this.cdr.detectChanges(); 
      });
    });
  }

  async toggleFavorite(event: Event, doc: DocXDocument) {
    event.stopPropagation();
    await this.storageService.toggleFavorite(doc.id!, !doc.isFavorite);
  }

  onFolderSelect(folder: Folder) {
    this.searchService.selectFolder(folder.id!);
  }

  async onFolderDelete(folder: Folder) {
    this.confirmModalConfig = {
      title: 'Delete Folder',
      message: `Are you sure you want to delete "${folder.name}"? All content inside will be moved to trash.`,
      type: 'danger',
      action: async () => {
        if (folder.id) {
            await this.storageService.deleteFolder(folder.id);
        }
        this.showConfirmModal = false;
      }
    };
    this.showConfirmModal = true;
  }

  onDocumentClick(doc: DocXDocument) {
    this.editingDoc = doc;
  }

  navigateUp() {
    this.searchService.selectFolder(null); // Go to Root
  }
  async onDeleteDocument(event: Event, doc: DocXDocument) {
    event.stopPropagation();
    this.confirmModalConfig = {
      title: 'Delete Document',
      message: `Are you sure you want to delete "${doc.name}"?`,
      type: 'danger',
      action: async () => {
        await this.storageService.deleteDocument(doc.id!);
        this.showConfirmModal = false;
      }
    };
    this.showConfirmModal = true;
  }

  // Drag & Drop
  onDragStart(event: DragEvent, doc: DocXDocument) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', doc.id!.toString());
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault(); // Allow drop
    event.dataTransfer!.dropEffect = 'move';
  }

  async onDrop(event: DragEvent, folder: Folder) {
    event.preventDefault();
    const docId = Number(event.dataTransfer!.getData('text/plain'));
    if (docId && folder.id) {
      await this.storageService.updateDocumentFolder(docId, folder.id);
    }
  }

  // Confirmation Modal
  showConfirmModal = false;
  confirmModalConfig = {
    title: '',
    message: '',
    type: 'danger' as 'danger' | 'warning' | 'info',
    action: () => {}
  };

  confirmAction() {
    this.confirmModalConfig.action();
  }
}

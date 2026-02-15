import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocXDocument } from '../../../core/models/document.model';
import { Folder } from '../../../core/models/folder.model';
import { StorageService } from '../../../core/services/storage.service';

import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-document-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationModalComponent],
  templateUrl: './document-edit.component.html'
})
export class DocumentEditComponent implements OnInit {
  @Input({ required: true }) doc!: DocXDocument;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  storageService = inject(StorageService);
  folders: Folder[] = [];
  
  editedName = '';
  selectedFolderId: number | null = null;

  // New Folder Logic
  isCreatingFolder = false;
  newFolderName = '';

  async ngOnInit() {
    this.refreshFolders();
    this.editedName = this.doc.name;
    this.selectedFolderId = this.doc.folderId || null; // Ensure null if undefined
  }

  async refreshFolders() {
    this.folders = await this.storageService.getAllFolders();
  }

  toggleNewFolder() {
    this.isCreatingFolder = !this.isCreatingFolder;
    this.newFolderName = '';
  }

  async createFolder() {
    if (!this.newFolderName.trim()) return;
    
    const newId = await this.storageService.addFolder(this.newFolderName.trim());
    await this.refreshFolders();
    this.selectedFolderId = newId; // Auto-select new folder
    this.isCreatingFolder = false;
    this.newFolderName = '';
  }

  formatSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async save() {
    if (!this.doc.id) {
      // New Document: Create it
      const newDoc: DocXDocument = {
        ...this.doc,
        name: this.editedName,
        folderId: this.selectedFolderId
      };
      await this.storageService.addDocument(newDoc);
    } else {
      // Existing Document: Update it
      await this.storageService.documents.update(this.doc.id, {
        name: this.editedName,
        folderId: this.selectedFolderId
      });
    }
    
    this.storageService.refresh$.next(); // Trigger refresh
    this.saved.emit();
    this.close.emit();
  }

  // Confirmation Modal
  showConfirmModal = false;
  confirmModalConfig = {
    title: '',
    message: '',
    type: 'danger' as 'danger' | 'warning' | 'info',
    action: () => {}
  };

  async delete() {
    if (!this.doc.id) {
       // New Document: Just cancel/discard
       this.close.emit();
       return;
    }

    this.confirmModalConfig = {
      title: 'Delete Document',
      message: `Are you sure you want to delete "${this.doc.name}"?`,
      type: 'danger',
      action: async () => {
        await this.storageService.deleteDocument(this.doc.id!);
        this.close.emit();
        this.showConfirmModal = false;
      }
    };
    this.showConfirmModal = true;
  }

  confirmAction() {
    this.confirmModalConfig.action();
  }
}

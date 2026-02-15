import { Injectable, inject } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { DocXDocument } from '../models/document.model';
import { Subject } from 'rxjs';
import { SearchCriteria } from './search.service';

import { Folder } from '../models/folder.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService extends Dexie {
  documents!: Table<DocXDocument, number>;
  folders!: Table<Folder, number>;
  refresh$ = new Subject<void>();
  trashAction$ = new Subject<void>();
  
  private toastService = inject(ToastService);

  constructor() {
    super('docX-db');
    this.version(4).stores({
      documents: '++id, name, type, createdAt, isFavorite, folderId, isDeleted',
      folders: '++id, name, isDeleted'
    }).upgrade(async tx => {
      // Initialize isDeleted to false for existing items
      // This runs for ANYONE upgrading to v4, fixing the missing flag issue
      console.log('Upgrading DB to v4: Backfilling isDeleted...');
      await tx.table('documents').toCollection().modify(doc => {
         if (doc.isDeleted === undefined) doc.isDeleted = false;
      });
      await tx.table('folders').toCollection().modify(folder => {
         if (folder.isDeleted === undefined) folder.isDeleted = false;
      });
      console.log('DB Upgrade Complete.');
    });
    
    this.version(3).stores({
      documents: '++id, name, type, createdAt, isFavorite, folderId, isDeleted',
      folders: '++id, name, isDeleted'
    });

    // Previous versions kept for history if needed (optional for Dexie if not breaking changes, but good practice)
    this.version(2).stores({
      documents: '++id, name, type, createdAt, isFavorite, folderId',
      folders: '++id, name'
    });
  }

  async addDocument(doc: DocXDocument): Promise<number> {
    const id = await this.documents.add({ ...doc, isDeleted: false });
    this.refresh$.next();
    this.toastService.success('Document created successfully');
    return id;
  }
  
  async updateDocumentFolder(docId: number, folderId: number | null): Promise<void> {
    await this.documents.update(docId, { folderId });
    this.refresh$.next();
    this.toastService.success('Document moved');
  }

  // Folder Methods
  async getFolder(id: number): Promise<Folder | undefined> {
    return await this.folders.get(id);
  }
  async addFolder(name: string): Promise<number> {
    const folder: Folder = {
      name,
      createdAt: new Date(),
      isDeleted: false
    };
    const id = await this.folders.add(folder);
    this.refresh$.next();
    this.toastService.success('Folder created successfully');
    return id;
  }

  async getAllFolders(): Promise<Folder[]> {
    // Use filter instead of where('isDeleted') to handle existing items that might strictly lack the key (though upgrade helps, this is safer)
    return await this.folders.filter(f => !f.isDeleted).toArray();
  }

  // Soft Delete Folder
  async deleteFolder(id: number): Promise<void> {
    console.log(`Deleting folder ${id}...`);
    // Soft delete the folder
    await this.folders.update(id, { isDeleted: true });
    
    // Soft delete all documents inside this folder
    // We update them to be deleted, but keep their folderId so we know where they came from if restored?
    // User requirement: "if i deleted the the entite folder shoud be deleted , move to trash"
    // And "deleted documents ets."
    // If we restore the folder, we probably want the docs back too.
    // For now, let's mark docs in this folder as deleted.
    await this.documents.where('folderId').equals(id).modify({ isDeleted: true });
    
    console.log(`Folder ${id} marked as deleted.`);
    this.refresh$.next();
    this.trashAction$.next();
    this.toastService.success('Folder moved to trash');
  }

  async getAllDocuments(): Promise<DocXDocument[]> {
    const docs = await this.documents.filter(d => !d.isDeleted).toArray();
    return docs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getDocument(id: number): Promise<DocXDocument | undefined> {
    return await this.documents.get(id);
  }

  // Soft Delete Document
  async deleteDocument(id: number): Promise<void> {
    await this.documents.update(id, { isDeleted: true });
    this.refresh$.next();
    this.trashAction$.next();
    this.toastService.success('Document moved to trash');
  }

  async toggleFavorite(id: number, isFavorite: boolean): Promise<number> {
    const result = await this.documents.update(id, { isFavorite });
    this.refresh$.next();
    return result;
  }

  async getFavorites(): Promise<DocXDocument[]> {
    return await this.documents.where('isFavorite').equals(1).and(doc => !doc.isDeleted).toArray();
  }

  async queryDocuments(criteria: SearchCriteria): Promise<DocXDocument[]> {
    let collection: Dexie.Collection<DocXDocument, number> | Dexie.Table<DocXDocument, number> = this.documents;

    if (criteria.onlyFavorites) {
      collection = this.documents.where('isFavorite').equals(1);
    } else if (criteria.folderId !== undefined) {
       if (criteria.folderId === null) {
          // Handled in post-filter for null match usually, or custom index.
       } else {
         collection = this.documents.where('folderId').equals(criteria.folderId);
       }
    }

    let docs = await collection.toArray();

    // Default Filter: Exclude deleted items
    docs = docs.filter(d => !d.isDeleted);

    // Post-query filtering for complex Logic
    if (criteria.folderId === null) {
       docs = docs.filter((d: DocXDocument) => (d.folderId === null || d.folderId === undefined) && !d.isDeleted);
    }

    if (criteria.searchTerm && criteria.searchTerm.trim() !== '') {
      const term = criteria.searchTerm.toLowerCase();
      docs = docs.filter((doc: DocXDocument) => doc.name.toLowerCase().includes(term));
    }

    if (criteria.filterType !== 'all') {
       docs = docs.filter((doc: DocXDocument) => doc.type.toLowerCase().includes(criteria.filterType));
    }

    docs.sort((a: DocXDocument, b: DocXDocument) => {
      switch (criteria.sortBy) {
        case 'date-desc': return b.createdAt.getTime() - a.createdAt.getTime();
        case 'date-asc': return a.createdAt.getTime() - b.createdAt.getTime();
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'size-desc': return b.size - a.size;
        default: return 0;
      }
    });

    return docs;
  }

  async getRecentDocuments(limit: number = 5): Promise<DocXDocument[]> {
      // Ensure we filter out deleted ones
      // Since 'isDeleted' is not in the default query here without Where, we fetch and filter or add an index
      // orderBy doesn't work well with where() unless compound index.
      // Let's fetch all (sorted) and filter. 'limit' breaks this if we filter after.
      // Better to use where('isDeleted').below(1)... but we need sorting.
      // For simplicity/performance on small DB, let's just get array and slice.
      const allDocs = await this.documents.orderBy('createdAt').reverse().toArray();
      return allDocs.filter(d => !d.isDeleted).slice(0, limit);
  }

  // Trash Methods
  async getTrashItems(): Promise<{ folders: Folder[], documents: DocXDocument[] }> {
    // Use filter to be safe with boolean indexing issues
    // Check for truthiness (covers true, 1, etc.)
    const folders = await this.folders.filter(f => !!f.isDeleted).toArray();
    const documents = await this.documents.filter(d => !!d.isDeleted).toArray();
    console.log(`Fetching Trash Items: Found ${folders.length} folders, ${documents.length} docs`);
    if (folders.length > 0) console.log('Sample Trash Folder:', folders[0]);
    return { folders, documents };
  }

  async restoreFolder(id: number): Promise<void> {
    await this.folders.update(id, { isDeleted: false });
    // Restore docs inside? Yes.
    await this.documents.where('folderId').equals(id).modify({ isDeleted: false });
    this.refresh$.next();
    this.toastService.success('Folder restored');
  }

  async restoreDocument(id: number): Promise<void> {
    await this.documents.update(id, { isDeleted: false });
    this.refresh$.next();
    this.toastService.success('Document restored');
  }

  async permanentlyDeleteFolder(id: number): Promise<void> {
    await this.folders.delete(id);
    // Delete docs inside permanently
    await this.documents.where('folderId').equals(id).delete();
    this.refresh$.next();
    this.toastService.success('Folder permanently deleted');
  }

  async permanentlyDeleteDocument(id: number): Promise<void> {
    await this.documents.delete(id);
    this.refresh$.next();
    this.toastService.success('Document permanently deleted');
  }
}

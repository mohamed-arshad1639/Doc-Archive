import { Injectable, inject } from '@angular/core';
import { StorageService } from './storage.service';
import { SearchService } from './search.service';
import { ImageService } from './image.service';
import { DocXDocument } from '../models/document.model';

@Injectable({
  providedIn: 'root'
})
export class FileHandlingService {
  private storageService = inject(StorageService);
  private imageService = inject(ImageService);


  async processFiles(files: FileList | File[]): Promise<number[]> {
    const fileArray = Array.from(files);
    const savedIds: number[] = [];

    console.log(`Processing ${fileArray.length} files...`);

    for (const file of fileArray) {
      try {
        if (this.isSupported(file)) {
          const id = await this.saveFile(file);
          savedIds.push(id);
        } else {
          console.warn('Unsupported file type:', file.type);
        }
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
      }
    }
    return savedIds;
  }

  searchService = inject(SearchService);

  private async saveFile(file: File): Promise<number> {
    try {
      const thumbnail = await this.imageService.generateThumbnail(file);
      
      const doc: DocXDocument = {
        name: file.name,
        type: file.type,
        size: file.size,
        blob: file, // Store the file blob directly
        thumbnail: thumbnail,
        createdAt: new Date(),
        isFavorite: false,
        folderId: this.searchService.criteria().folderId || null
      };

      return await this.storageService.addDocument(doc);
    } catch (err) {
      console.error('Error inside saveFile:', err);
      throw err;
    }
  }

  private isSupported(file: File): boolean {
    return file.type.startsWith('image/') || file.type === 'application/pdf';
  }
}

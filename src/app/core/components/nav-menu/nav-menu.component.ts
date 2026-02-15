import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { FileHandlingService } from '../../services/file-handling.service';
import { SearchService } from '../../services/search.service';
import { AsyncPipe } from '@angular/common';
import { DocumentEditComponent } from '../../../shared/components/document-edit/document-edit.component';
import { DocXDocument } from '../../models/document.model';

@Component({
    selector: 'app-nav-menu',
    template: `
    <div class="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-jet-black/90 dark:bg-white/90 backdrop-blur-md text-off-white dark:text-jet-black px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-6">
      


      <button (click)="setViewMode('grid')" 
              [class.text-blue-400]="(searchService.criteria$ | async)?.viewMode === 'grid'"
              [class.font-bold]="(searchService.criteria$ | async)?.viewMode === 'grid'"
              class="flex flex-col items-center gap-1 transition-colors hover:text-white/80">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
         <span class="text-[10px] uppercase tracking-wider">Grid</span>
      </button>

      <button (click)="setViewMode('list')" 
              [class.text-blue-400]="(searchService.criteria$ | async)?.viewMode === 'list'"
              [class.font-bold]="(searchService.criteria$ | async)?.viewMode === 'list'"
              class="flex flex-col items-center gap-1 transition-colors hover:text-white/80">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
         <span class="text-[10px] uppercase tracking-wider">List</span>
      </button>



      <div class="w-px h-6 bg-gray-500 mx-1"></div>

       <button class="flex flex-col items-center gap-1 transition-colors hover:text-white/80" (click)="triggerUpload()">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
         <span class="text-[10px] uppercase tracking-wider">Add</span>
      </button>

    </div>
    
    <input #fileInput type="file" multiple accept="image/*" class="hidden" (change)="onFileSelected($event)">

    @if (pendingDocs.length > 0) {
      <app-document-edit 
        [doc]="pendingDocs[0]" 
        (close)="removePendingDoc()" 
        (saved)="removePendingDoc()">
      </app-document-edit>
    }
  `,
    standalone: true,
    imports: [AsyncPipe, DocumentEditComponent]
})
export class NavMenuComponent {
  private fileService = inject(FileHandlingService);
  public searchService = inject(SearchService);
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  pendingDocs: DocXDocument[] = [];

  setViewMode(mode: 'grid' | 'list') {
    this.searchService.setViewMode(mode);
  }

  triggerUpload() {
    this.fileInput.nativeElement.click();
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      console.log('Files selected:', input.files.length);
      // Prepare files but do NOT save yet
      const docs = await this.fileService.prepareFiles(input.files);
      this.pendingDocs.push(...docs);
      
      input.value = ''; // Reset input
    }
  }

  removePendingDoc() {
    this.pendingDocs.shift(); // Process next document
  }
}

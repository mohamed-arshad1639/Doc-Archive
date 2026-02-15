import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { FileHandlingService } from '../../services/file-handling.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-nav-menu',
    template: `
    <div class="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-jet-black/90 dark:bg-white/90 backdrop-blur-md text-off-white dark:text-jet-black px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-6">
      


      <a routerLink="/grid" routerLinkActive="text-blue-400 font-bold" class="flex flex-col items-center gap-1 transition-colors hover:text-white/80">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
         <span class="text-[10px] uppercase tracking-wider">Grid</span>
      </a>

      <a routerLink="/list" routerLinkActive="text-blue-400 font-bold" class="flex flex-col items-center gap-1 transition-colors hover:text-white/80">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
         <span class="text-[10px] uppercase tracking-wider">List</span>
      </a>



      <div class="w-px h-6 bg-gray-500 mx-1"></div>

       <button class="flex flex-col items-center gap-1 transition-colors hover:text-white/80" (click)="triggerUpload()">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
         <span class="text-[10px] uppercase tracking-wider">Add</span>
      </button>

    </div>
    
    <input #fileInput type="file" multiple accept="image/*" class="hidden" (change)="onFileSelected($event)">
  `,
    standalone: true,
    imports: [RouterLink, RouterLinkActive]
})
export class NavMenuComponent {
  private fileService = inject(FileHandlingService);
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  triggerUpload() {
    this.fileInput.nativeElement.click();
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      console.log('Files selected:', input.files.length);
      await this.fileService.processFiles(input.files);
      input.value = ''; // Reset input
    }
  }
}

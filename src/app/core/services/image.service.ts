import { Injectable } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor() {
    // Set worker source - using a local copy or CDN. 
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/assets/pdf.worker.min.mjs';
  }

  async generateThumbnail(file: File | Blob): Promise<string> {
    if (file.type === 'application/pdf') {
      return this.generatePdfThumbnail(file);
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
           this.resizeImage(img).then(resolve).catch(reject);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private async generatePdfThumbnail(file: Blob): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1); // Get first page

    const viewport = page.getViewport({ scale: 1.0 }); // Scale 1.0 for initial sizing
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    // Scale to fit thumbnail size (e.g., 300px width)
    const scale = Math.min(1, 300 / viewport.width);
    const scaledViewport = page.getViewport({ scale });

    canvas.height = scaledViewport.height;
    canvas.width = scaledViewport.width;

    if (!context) throw new Error('Canvas context not found');

    await page.render({
      canvasContext: context,
      viewport: scaledViewport
    } as any).promise;

    return canvas.toDataURL('image/webp', 0.8);
  }

  private resizeImage(img: HTMLImageElement): Promise<string> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const maxSize = 300; 

      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);
      
      resolve(canvas.toDataURL('image/webp', 0.8)); 
    });
  }
}

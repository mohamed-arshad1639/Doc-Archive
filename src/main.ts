import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { register as registerSwiperElements } from 'swiper/element/bundle';


import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';

registerSwiperElements();

// Polyfill for Promise.withResolvers (required by newer pdfjs-dist)
// @ts-ignore
if (typeof Promise.withResolvers === 'undefined') {
  if (window) {
    // @ts-ignore
    window.Promise.withResolvers = function <T>() {
      let resolve!: (value: T | PromiseLike<T>) => void;
      let reject!: (reason?: any) => void;
      const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
      });
      return { promise, resolve, reject };
    };
  }
}


import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';

bootstrapApplication(AppComponent, {
    providers: [
      provideRouter(routes),
      importProvidersFrom(DragDropModule)
    ]
})
  .catch(err => console.error(err));

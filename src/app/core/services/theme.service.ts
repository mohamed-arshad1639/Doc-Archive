import { Injectable, Renderer2, RendererFactory2, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private rendererFactory = inject(RendererFactory2);
  private renderer: Renderer2;
  private isDark = new BehaviorSubject<boolean>(false);
  isDark$ = this.isDark.asObservable();

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.initTheme();
  }

  initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.setDark(true);
    } else {
      this.setDark(false);
    }
  }

  toggleTheme() {
    this.setDark(!this.isDark.value);
  }

  setDark(isDark: boolean) {
    this.isDark.next(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (isDark) {
      this.renderer.addClass(document.body, 'dark-theme');
    } else {
      this.renderer.removeClass(document.body, 'dark-theme');
    }
  }
}

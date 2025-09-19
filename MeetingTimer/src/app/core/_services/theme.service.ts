import { Injectable, Renderer2, RendererFactory2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto',
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private renderer: Renderer2;
  private readonly storageKey = 'meeting-helper-theme';
  private currentThemeSubject = new BehaviorSubject<Theme>(Theme.DARK);

  public constructor(
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.initializeTheme();
  }

  public get currentTheme$(): Observable<Theme> {
    return this.currentThemeSubject.asObservable();
  }

  public get currentTheme(): Theme {
    return this.currentThemeSubject.value;
  }

  public toggleTheme(): void {
    const currentTheme = this.currentTheme;
    let nextTheme: Theme;

    switch (currentTheme) {
      case Theme.LIGHT:
        nextTheme = Theme.DARK;
        break;
      case Theme.DARK:
        nextTheme = Theme.AUTO;
        break;
      case Theme.AUTO:
      default:
        nextTheme = Theme.LIGHT;
        break;
    }

    this.setTheme(nextTheme);
  }

  public getEffectiveCurrentTheme(): 'light' | 'dark' {
    return this.getEffectiveTheme(this.currentTheme);
  }

  public setTheme(theme: Theme): void {
    this.currentThemeSubject.next(theme);
    this.saveTheme(theme);
    this.applyTheme(theme);
  }

  private initializeTheme(): void {
    const savedTheme = this.getSavedTheme();
    const initialTheme = savedTheme || Theme.AUTO;
    this.setTheme(initialTheme);
    this.setupSystemThemeListener();
  }

  private getSavedTheme(): Theme | null {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved && Object.values(Theme).includes(saved as Theme)
        ? (saved as Theme)
        : null;
    } catch {
      return null;
    }
  }

  private saveTheme(theme: Theme): void {
    try {
      localStorage.setItem(this.storageKey, theme);
    } catch {
      // Handle storage error silently
    }
  }

  private applyTheme(theme: Theme): void {
    const effectiveTheme = this.getEffectiveTheme(theme);

    // Remove existing theme classes
    this.renderer.removeClass(this.document.documentElement, 'theme-light');
    this.renderer.removeClass(this.document.documentElement, 'theme-dark');

    // Add new theme class
    this.renderer.addClass(
      this.document.documentElement,
      `theme-${effectiveTheme}`
    );

    // Update Bootstrap data-bs-theme attribute for components
    this.renderer.setAttribute(
      this.document.documentElement,
      'data-bs-theme',
      effectiveTheme
    );
  }

  private getEffectiveTheme(theme: Theme): 'light' | 'dark' {
    if (theme === Theme.AUTO) {
      return this.getSystemTheme();
    }
    return theme as 'light' | 'dark';
  }

  private getSystemTheme(): 'light' | 'dark' {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return 'light'; // Default fallback
  }

  private setupSystemThemeListener(): void {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const listener = () => {
        if (this.currentTheme === Theme.AUTO) {
          this.applyTheme(Theme.AUTO);
        }
      };

      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', listener);
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(listener);
      }
    }
  }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, Theme } from '../core/_services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      class="btn btn-primary btn-sm theme-toggle text-secondary"
      (click)="toggleTheme()"
      [attr.aria-label]="getAriaLabel()"
      [title]="getTooltip()"
    >
      <i [class]="getIconClass()" aria-hidden="true"></i>
      <span class="visually-hidden">{{ getTooltip() }}</span>
    </button>
  `,
  styleUrls: ['./theme-toggle.component.scss'],
})
export class ThemeToggleComponent {
  private themeService = inject(ThemeService);

  public toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  public getIconClass(): string {
    const theme = this.getCurrentTheme();
    switch (theme) {
      case Theme.LIGHT:
        return 'fas fa-sun';
      case Theme.DARK:
        return 'fas fa-moon';
      case Theme.AUTO:
      default:
        return 'fas fa-circle-half-stroke';
    }
  }

  public getAriaLabel(): string {
    const theme = this.getCurrentTheme();
    switch (theme) {
      case Theme.LIGHT:
        return 'Switch to dark theme';
      case Theme.DARK:
        return 'Switch to auto theme';
      case Theme.AUTO:
      default:
        return 'Switch to light theme';
    }
  }

  public getTooltip(): string {
    const theme = this.getCurrentTheme();
    switch (theme) {
      case Theme.LIGHT:
        return 'Light theme active - Click for dark theme';
      case Theme.DARK:
        return 'Dark theme active - Click for auto theme';
      case Theme.AUTO:
      default:
        return 'Auto theme active - Click for light theme';
    }
  }

  private getCurrentTheme(): Theme {
    return this.themeService.currentTheme;
  }
}

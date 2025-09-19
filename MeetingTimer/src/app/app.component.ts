import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ThemeService } from './core/_services/theme.service';
import { ThemeToggleComponent } from './theme-toggle/theme-toggle.component';
import { EventService } from './core/_services/event.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, ThemeToggleComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public title = 'Meeting Timer';
  private themeService = inject(ThemeService);
  private eventService = inject(EventService);
}

import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MeetingTimersComponent } from './meeting-timers/meeting-timers.component';
import { TimerDashboardComponent } from './meeting-timers/timer-dashboard/timer-dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, MeetingTimersComponent, TimerDashboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Meeting Timer';
}

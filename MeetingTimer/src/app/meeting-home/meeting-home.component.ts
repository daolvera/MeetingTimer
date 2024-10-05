import { Component } from '@angular/core';
import { MeetingTimersComponent } from "../meeting-timers/meeting-timers.component";
import { TimerDashboardComponent } from "../meeting-timers/timer-dashboard/timer-dashboard.component";

@Component({
  selector: 'app-meeting-home',
  standalone: true,
  imports: [TimerDashboardComponent, MeetingTimersComponent],
  templateUrl: './meeting-home.component.html',
  styleUrl: './meeting-home.component.scss'
})
export class MeetingHomeComponent {
}

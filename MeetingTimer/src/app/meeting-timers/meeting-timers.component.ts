import { Component, inject, Signal } from '@angular/core';
import { Timer } from '../core/_models/timer.model';
import { TimerService } from '../core/_services/timer.service';
import { MeetingTimerCardComponent } from './meeting-timer-card/meeting-timer-card.component';

@Component({
  selector: 'app-meeting-timers',
  standalone: true,
  imports: [MeetingTimerCardComponent],
  templateUrl: './meeting-timers.component.html',
  styleUrl: './meeting-timers.component.scss'
})
export class MeetingTimersComponent {
  public timerService = inject(TimerService);
  public timers: Signal<Timer[]> = this.timerService.timers;
}

import { Component, input } from '@angular/core';
import { Timer } from '../../core/_models/timer.model';

@Component({
  selector: 'app-meeting-timer-card',
  standalone: true,
  imports: [],
  templateUrl: './meeting-timer-card.component.html',
  styleUrl: './meeting-timer-card.component.scss'
})
export class MeetingTimerCardComponent {
  timer = input.required<Timer>();
}

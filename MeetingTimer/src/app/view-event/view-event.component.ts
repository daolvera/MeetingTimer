import { Component, inject, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { EventDto } from '../core/_models/event.dto';
import { TalkDto } from '../core/_models/talk.dto';
import { EventService } from '../core/_services/event.service';
import { DatePipe, SlicePipe } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-view-event',
  standalone: true,
  imports: [DatePipe, SlicePipe],
  templateUrl: './view-event.component.html',
  styleUrl: './view-event.component.scss',
})
export class ViewEventComponent implements OnDestroy {
  public event: EventDto | null = null;
  public currentTalkIndex: number = 0;

  protected currentTime: number = 0; // in seconds
  protected isRunning = false;
  protected isFullscreen = false;
  protected timerSubscription?: Subscription;

  private eventService = inject(EventService);
  private activatedRoute = inject(ActivatedRoute);
  private titleService = inject(Title);
  private router = inject(Router);

  protected get currentTalk(): TalkDto | null {
    return this.event?.talks[this.currentTalkIndex] ?? null;
  }

  protected get displayTime(): string {
    const sign = this.currentTime < 0 ? '-' : '';
    const absTime = Math.abs(this.currentTime);
    const hours = Math.floor(absTime / 3600);
    const minutes = Math.floor((absTime % 3600) / 60);
    const seconds = absTime % 60;
    return `${sign}${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  protected get currentMessage(): string | null {
    const warningTime = this.parseTime(
      this.currentTalk?.meetingTimer.warningTime
    );
    const lastCallTime = this.parseTime(
      this.currentTalk?.meetingTimer.lastCallTime
    );
    if (this.currentTime <= lastCallTime)
      return this.currentTalk?.meetingTimer.lastCallMessage || null;
    if (this.currentTime <= warningTime)
      return this.currentTalk?.meetingTimer.warningMessage || null;
    return null;
  }

  protected get isNextDisabled(): boolean {
    return this.currentTalkIndex >= (this.event?.talks.length ?? 0) - 1;
  }

  protected get isPreviousDisabled(): boolean {
    return this.currentTalkIndex <= 0;
  }

  public constructor() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.eventService
        .get(Number.parseInt(params.get('id')!))
        .subscribe((o) => {
          this.event = o;
          this.loadTalkTimer();
          this.titleService.setTitle(`${this.event.name} | Meeting Helper`);
        });
    });
  }

  // Public methods - Lifecycle
  public ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }

  // Protected methods (used in template)
  protected editEvent(): void {
    this.router.navigate(['/edit', this.event?.id]);
  }

  protected play() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.timerSubscription = interval(1000).subscribe(() => {
      this.currentTime--;
    });
  }

  protected pause() {
    this.isRunning = false;
    this.timerSubscription?.unsubscribe();
  }

  protected restart() {
    this.loadTalkTimer();
  }

  protected nextTalk() {
    if (this.currentTalkIndex < (this.event?.talks.length ?? 0) - 1) {
      this.currentTalkIndex++;
      this.loadTalkTimer();
    }
  }

  protected previousTalk() {
    if (this.currentTalkIndex > 0) {
      this.currentTalkIndex--;
      this.loadTalkTimer();
    }
  }

  protected getBorderClass(): string {
    const warningTime = this.parseTime(
      this.currentTalk?.meetingTimer.warningTime
    );
    const lastCallTime = this.parseTime(
      this.currentTalk?.meetingTimer.lastCallTime
    );
    if (this.currentTime <= lastCallTime) return 'border border-danger';
    if (this.currentTime <= warningTime) return 'border border-warning';
    return 'border border-success';
  }

  protected getTimerTextClass(): string {
    const warningTime = this.parseTime(
      this.currentTalk?.meetingTimer.warningTime
    );
    const lastCallTime = this.parseTime(
      this.currentTalk?.meetingTimer.lastCallTime
    );
    if (this.currentTime <= lastCallTime) return 'text-danger';
    if (this.currentTime <= warningTime) return 'text-warning';
    return 'text-success';
  }

  protected getAlertClass(): string {
    const warningTime = this.parseTime(
      this.currentTalk?.meetingTimer.warningTime
    );
    const lastCallTime = this.parseTime(
      this.currentTalk?.meetingTimer.lastCallTime
    );
    if (this.currentTime <= lastCallTime) return 'alert-danger';
    if (this.currentTime <= warningTime) return 'alert-warning';
    return 'alert-success';
  }

  protected toggleFullscreen(): void {
    this.isFullscreen = !this.isFullscreen;
  }

  protected exitFullscreen(): void {
    this.isFullscreen = false;
  }

  @HostListener('document:keydown.escape', ['$event'])
  protected onEscapeKey(event: KeyboardEvent): void {
    if (this.isFullscreen) {
      this.exitFullscreen();
    }
  }

  protected getTotalEventDuration(): string {
    if (!this.event?.talks) return '00:00:00';

    const totalSeconds = this.event.talks.reduce((total, talk) => {
      return total + this.parseTime(talk.meetingTimer.totalTime);
    }, 0);

    return this.formatTime(totalSeconds);
  }

  protected getEventProgress(): number {
    if (!this.event?.talks?.length) return 0;
    return Math.round((this.currentTalkIndex / this.event.talks.length) * 100);
  }

  protected getTalkBadgeClass(talkIndex: number): string {
    if (talkIndex === this.currentTalkIndex) return 'bg-primary text-white';
    if (talkIndex < this.currentTalkIndex) return 'bg-success text-white';
    return 'bg-secondary text-white';
  }

  protected getSpeakerInitials(speakerName?: string): string {
    if (!speakerName) return '??';

    return speakerName
      .split(' ')
      .map((name) => name.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }

  protected formatDuration(timeString?: string): string {
    if (!timeString) return '00:00:00';
    return timeString;
  }

  private parseTime(timeString?: string): number {
    if (!timeString) return 0;
    const parts = timeString.split(':').map(Number);
    return parts[0] * 3600 + parts[1] * 60 + (parts[2] || 0);
  }

  private loadTalkTimer() {
    this.pause();
    this.currentTime = this.parseTime(this.currentTalk?.meetingTimer.totalTime);
  }

  private formatTime(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}

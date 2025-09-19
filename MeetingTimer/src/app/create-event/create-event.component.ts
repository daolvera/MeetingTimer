import { formatDate } from '@angular/common';
import { Component, Inject, inject, LOCALE_ID } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventDto } from '../core/_models/event.dto';
import { MeetingTimerDto } from '../core/_models/meetingTimer.dto';
import { TalkDto } from '../core/_models/talk.dto';
import { EventService } from '../core/_services/event.service';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.scss',
})
export class CreateEventComponent {
  public createEventForm: FormGroup;
  public errorMessage: string | null = null;
  public locale: string;

  protected isEditMode: boolean = false;

  private formBuilder = inject(FormBuilder);
  private eventService = inject(EventService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private currentEvent: EventDto | null = null;

  public get talkArray(): FormArray {
    return this.createEventForm.controls['talks'] as FormArray;
  }

  public constructor(@Inject(LOCALE_ID) locale: string) {
    this.locale = locale;

    // Check for pre-filled event data from navigation state
    const nav = this.router.getCurrentNavigation();
    const prefillEvent = nav?.extras?.state?.['event'] as EventDto | undefined;

    this.createEventForm = this.formBuilder.group({
      name: this.formBuilder.nonNullable.control<string>('', [
        Validators.required,
      ]),
      date: this.formBuilder.nonNullable.control<Date | string>('', [
        Validators.required,
      ]),
      onlineLink: this.formBuilder.control<string | null>(null),
      talks: this.formBuilder.array([], Validators.required),
    });

    this.activatedRoute.paramMap.subscribe((params) => {
      const eventId = params.get('id');
      if (eventId) {
        this.isEditMode = true;
        this.eventService.get(Number.parseInt(eventId)).subscribe((o) => {
          this.loadForm(o);
        });
      } else if (prefillEvent) {
        this.loadForm(prefillEvent);
      }
    });
  }

  public addTalk() {
    this.talkArray.push(
      this.formBuilder.group({
        name: this.formBuilder.nonNullable.control<string>(null!, [
          Validators.required,
        ]),
        description: this.formBuilder.control<string | null>(null),
        speakerName: this.formBuilder.control<string>('', [
          Validators.required,
        ]),
        meetingTimer: this.formBuilder.group({
          displayName: this.formBuilder.control<string | null>(null),
          totalTimeHour: this.formBuilder.nonNullable.control<number>(0, [
            Validators.min(0),
          ]),
          totalTimeMinutes: this.formBuilder.nonNullable.control<number>(1, [
            Validators.min(0),
            Validators.max(59),
          ]),
          totalTimeSeconds: this.formBuilder.nonNullable.control<number>(0, [
            Validators.min(0),
            Validators.max(59),
          ]),
          warningMessage: this.formBuilder.control<string | null>(null),
          warningTimeHour: this.formBuilder.control<number | null>(null, [
            Validators.min(0),
          ]),
          warningTimeMinutes: this.formBuilder.control<number | null>(null, [
            Validators.min(0),
            Validators.max(59),
          ]),
          warningTimeSeconds: this.formBuilder.control<number | null>(null, [
            Validators.min(0),
            Validators.max(59),
          ]),
          lastCallMessage: this.formBuilder.control<string | null>(null),
          lastCallTimeHour: this.formBuilder.control<number | null>(null, [
            Validators.min(0),
          ]),
          lastCallTimeMinutes: this.formBuilder.control<number | null>(null, [
            Validators.min(0),
            Validators.max(59),
          ]),
          lastCallTimeSeconds: this.formBuilder.control<number | null>(null, [
            Validators.min(0),
            Validators.max(59),
          ]),
        }),
      })
    );
  }

  public removeTalk(index: number) {
    this.talkArray.removeAt(index);
  }

  public submitNewEvent() {
    this.errorMessage = null;
    const eventDto: EventDto = {
      name: this.createEventForm.controls['name'].value,
      date: this.createEventForm.controls['date'].value,
      onlineLink: this.createEventForm.controls['onlineLink'].value,
      talks: this.talkArray.controls.map<TalkDto>((control) => {
        const formGroup = control as FormGroup;
        const meetingTimerGroup = formGroup.controls[
          'meetingTimer'
        ] as FormGroup;
        const meetingTimer: MeetingTimerDto = {
          displayName: meetingTimerGroup.controls['displayName'].value,
          totalTime: `${
            meetingTimerGroup.controls['totalTimeHour'].value ?? '00'
          }:${meetingTimerGroup.controls['totalTimeMinutes'].value ?? '00'}:${
            meetingTimerGroup.controls['totalTimeSeconds'].value ?? '00'
          }`,
          warningMessage: meetingTimerGroup.controls['warningMessage'].value,
          warningTime: `${
            meetingTimerGroup.controls['warningTimeHour'].value ?? '00'
          }:${meetingTimerGroup.controls['warningTimeMinutes'].value ?? '00'}:${
            meetingTimerGroup.controls['warningTimeSeconds'].value ?? '00'
          }`,
          lastCallMessage: meetingTimerGroup.controls['lastCallMessage'].value,
          lastCallTime: `${
            meetingTimerGroup.controls['lastCallTimeHour'].value ?? '00'
          }:${
            meetingTimerGroup.controls['lastCallTimeMinutes'].value ?? '00'
          }:${meetingTimerGroup.controls['lastCallTimeSeconds'].value ?? '00'}`,
        };
        return {
          name: formGroup.controls['name'].value,
          description: formGroup.controls['description'].value,
          speakerName: formGroup.controls['speakerName'].value,
          meetingTimer: meetingTimer,
        };
      }),
    };
    if (this.isEditMode) {
      eventDto.id = this.currentEvent?.id;
      this.eventService.update(eventDto).subscribe((result) => {
        if (result) {
          this.router.navigate(['/view', eventDto.id]);
        } else {
          this.errorMessage = 'Event could not be updated, please try again';
        }
      });
    } else {
      this.eventService.create(eventDto).subscribe((result) => {
        if (result) {
          this.router.navigate(['/view', result]);
        } else {
          this.errorMessage = 'New Event could not be saved, please try again';
        }
      });
    }
  }

  private loadForm(prefillEvent: EventDto) {
    this.currentEvent = prefillEvent;
    prefillEvent.talks.forEach((talk, i) => {
      this.addTalk();
      const timer = talk.meetingTimer;
      if (timer) {
        // Parse totalTime
        const { hours, minutes, seconds } = this.formatTalkMeetingTimer(
          timer.totalTime
        );
        this.talkArray.at(i).get('meetingTimer.totalTimeHour')?.setValue(hours);
        this.talkArray
          .at(i)
          .get('meetingTimer.totalTimeMinutes')
          ?.setValue(minutes);
        this.talkArray
          .at(i)
          .get('meetingTimer.totalTimeSeconds')
          ?.setValue(seconds);

        if (timer.warningTime) {
          const { hours, minutes, seconds } = this.formatTalkMeetingTimer(
            timer.warningTime
          );
          this.talkArray
            .at(i)
            .get('meetingTimer.warningTimeHour')
            ?.setValue(hours);
          this.talkArray
            .at(i)
            .get('meetingTimer.warningTimeMinutes')
            ?.setValue(minutes);
          this.talkArray
            .at(i)
            .get('meetingTimer.warningTimeSeconds')
            ?.setValue(seconds);
        }

        if (timer.lastCallTime) {
          const { hours, minutes, seconds } = this.formatTalkMeetingTimer(
            timer.lastCallTime
          );
          this.talkArray
            .at(i)
            .get('meetingTimer.lastCallTimeHour')
            ?.setValue(hours);
          this.talkArray
            .at(i)
            .get('meetingTimer.lastCallTimeMinutes')
            ?.setValue(minutes);
          this.talkArray
            .at(i)
            .get('meetingTimer.lastCallTimeSeconds')
            ?.setValue(seconds);
        }
      }
    });
    prefillEvent.date =
      formatDate(new Date(prefillEvent.date), 'yyyy-MM-dd', this.locale) ??
      prefillEvent.date;
    this.createEventForm.patchValue(prefillEvent);
  }

  private formatTalkMeetingTimer(totalTime: string): {
    hours: number;
    minutes: number;
    seconds: number;
  } {
    const [h, m, s] = totalTime.split(':').map(Number);
    return { hours: h ?? 0, minutes: m ?? 0, seconds: s ?? 0 };
  }
}

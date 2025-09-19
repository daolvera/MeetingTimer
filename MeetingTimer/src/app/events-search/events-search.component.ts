import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EventService } from '../core/_services/event.service';
import { EventDto } from '../core/_models/event.dto';
import { TalkDto } from '../core/_models/talk.dto';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-events-search',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, RouterModule],
  templateUrl: './events-search.component.html',
  styleUrl: './events-search.component.scss',
})
export class EventsSearchComponent {
  protected events: EventDto[] = [];
  protected eventForm: FormGroup;
  private formBuilder = inject(FormBuilder);
  private eventService = inject(EventService);

  public constructor() {
    this.eventForm = this.formBuilder.group({
      searchTerm: this.formBuilder.control<string | null>(null),
    });
    this.searchEvents();
  }

  protected searchEvents() {
    this.eventService.getAll(this.searchTerm).subscribe((o) => {
      this.events = o;
    });
  }

  protected getTalkNames(talks: TalkDto[]): string {
    return talks.map((o) => o.name).join(', ');
  }

  protected deleteEvent(eventId: number) {
    this.eventService.delete(eventId).subscribe((o) => this.searchEvents());
  }

  protected get searchTerm(): string | null {
    return this.eventForm.controls['searchTerm'].getRawValue();
  }
}

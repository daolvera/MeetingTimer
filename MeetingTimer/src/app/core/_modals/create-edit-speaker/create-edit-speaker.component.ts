import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { SpeakerDto } from '../../_models/speaker.dto';
import { SpeakerService } from '../../_services/speaker.service';

@Component({
  selector: 'app-create-edit-speaker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-edit-speaker.component.html',
  styleUrl: './create-edit-speaker.component.scss',
})
export class CreateEditSpeakerComponent implements OnInit {
  // From modal options
  public currentSpeakerId: number | null = null;
  public hasChanges: boolean = false;
  public modalService = inject(BsModalService);
  public speakerForm: FormGroup;
  public isEditMode: boolean = false;
  public errorMessage: string | null = null;
  private formBuilder = inject(FormBuilder);
  private speakerService = inject(SpeakerService);
  private currentSpeaker: SpeakerDto | null = null;

  public constructor() {
    this.speakerForm = this.formBuilder.group({
      name: this.formBuilder.nonNullable.control<string>('', [
        Validators.required,
      ]),
      email: this.formBuilder.nonNullable.control<string>('', [
        Validators.required,
        Validators.email,
      ]),
      biography: this.formBuilder.control<string | null>(null),
      phone: this.formBuilder.control<string | null>(null),
      linkedIn: this.formBuilder.control<string | null>(null),
      twitter: this.formBuilder.control<string | null>(null),
      website: this.formBuilder.control<string | null>(null),
      company: this.formBuilder.control<string | null>(null),
      jobTitle: this.formBuilder.control<string | null>(null),
      isAvailable: this.formBuilder.nonNullable.control<boolean>(true),
      availableFrom: this.formBuilder.control<Date | null>(null),
      availableTo: this.formBuilder.control<Date | null>(null),
    });
  }

  public ngOnInit(): void {
    if (this.currentSpeakerId) {
      this.isEditMode = true;
      this.speakerService.get(this.currentSpeakerId).subscribe((speaker) => {
        this.currentSpeaker = speaker;
        this.speakerForm.patchValue(speaker);
      });
    }
  }

  public saveSpeaker() {
    if (this.speakerForm.invalid) {
      return;
    }
    const speaker: SpeakerDto = this.speakerForm.getRawValue();

    if (this.isEditMode) {
      speaker.id = this.currentSpeaker?.id;
      this.speakerService.update(speaker).subscribe((success) => {
        if (success) {
          this.hasChanges = true;
          this.errorMessage = null;
          this.modalService.hide();
        } else {
          this.errorMessage = 'Speaker could not be updated, please try again';
        }
      });
    } else {
      this.speakerService.create(speaker).subscribe((success) => {
        if (success) {
          this.hasChanges = true;
          this.errorMessage = null;
          this.modalService.hide();
        } else {
          this.errorMessage = 'Speaker could not be created, please try again';
        }
      });
    }
  }

  public closeModal(): void {
    this.modalService.hide();
  }
}

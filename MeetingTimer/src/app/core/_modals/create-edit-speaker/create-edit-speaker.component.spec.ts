import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditSpeakerComponent } from './create-edit-speaker.component';

describe('CreateEditSpeakerComponent', () => {
  let component: CreateEditSpeakerComponent;
  let fixture: ComponentFixture<CreateEditSpeakerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEditSpeakerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEditSpeakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

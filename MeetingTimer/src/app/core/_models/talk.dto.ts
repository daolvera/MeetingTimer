import { MeetingTimerDto } from './meetingTimer.dto';

export interface TalkDto {
  id?: number;
  name: string;
  description?: string;
  speakerName: string;
  meetingTimer: MeetingTimerDto;
}

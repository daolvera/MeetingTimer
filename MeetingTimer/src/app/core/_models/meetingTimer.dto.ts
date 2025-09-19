export interface MeetingTimerDto {
  id?: number;
  displayName?: string;
  totalTime: string;
  warningMessage?: string;
  warningTime?: string;
  lastCallMessage?: string;
  lastCallTime?: string;
}

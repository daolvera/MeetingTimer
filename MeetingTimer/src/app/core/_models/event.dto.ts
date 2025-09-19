import { TalkDto } from './talk.dto';

export interface EventDto {
  id?: number;
  name: string;
  date: Date | string;
  onlineLink?: string;
  talks: TalkDto[];
  firstTalkTitle?: string;
}

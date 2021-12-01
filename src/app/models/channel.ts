import { Lecturer } from "./lecturer";

export class Channel {
    subjectCode!: string;
    subjectName!: string;
    teamsID!: string;
    channelID!: string;
    lecturerID?: Lecturer
  }
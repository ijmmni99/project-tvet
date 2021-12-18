import { Lecturer } from "./lecturer";
import { Users } from "./users";

export class Channel {
    subjectCode!: string;
    subjectName!: string;
    teamsID!: string;
    channelID!: string;
    lecturerID!: Lecturer
    students?: Users[]
  }
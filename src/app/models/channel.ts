import { SafeUrl } from "@angular/platform-browser";
import { Lecturer } from "./lecturer";
import { Users } from "./users";

export class Channel {
    subjectCode!: string;
    subjectName!: string;
    teamsID!: string;
    channelID!: string;
    lecturerID!: Lecturer;
    imgUrl!: SafeUrl | null;
    students?: Users[];
  }
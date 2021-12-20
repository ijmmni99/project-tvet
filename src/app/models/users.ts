import { NullableOption } from "@microsoft/microsoft-graph-types";

export class Users {
    studentId!: NullableOption<string> | undefined;
    name!: NullableOption<string> | undefined;
    messageCount!: number;
    messageAskCount!: NullableOption<number>;
    imgUrl!: Blob;
  }
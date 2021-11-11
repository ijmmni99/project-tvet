import { NullableOption } from "@microsoft/microsoft-graph-types";

export class Users {
    id!: NullableOption<string> | undefined;
    name!: NullableOption<string> | undefined;
    messageCount!: number;
  }
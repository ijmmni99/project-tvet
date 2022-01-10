import { NullableOption } from "@microsoft/microsoft-graph-types";
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';

export class Users {
    studentId!: NullableOption<string> | undefined;
    name!: NullableOption<string> | undefined;
    messageCount!: Array<MicrosoftGraph.ChatMessage>;
    messageAskCount!: NullableOption<number>;
    studentType!: NullableOption<string> | undefined;
    imgUrl!: Blob;
  }
import type { VapiMessage } from "./VapiMessage";

export type VapiTranscriptEntry = NonNullable<NonNullable<VapiMessage["artifact"]>["messages"]>[number];

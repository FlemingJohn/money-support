export interface GuardrailEvent {
  id: string;
  kind: "personalDataRemoved" | "unmaskedDataReported";
  entityType: string;
  createdAt: string;
}

export interface ReviewTestCase {
  id: string;
  name: string;
  turns: ({ role: "user"; content: string } | { role: "assistant"; check: "answers" | "handsOff"; expectation: string })[];
}

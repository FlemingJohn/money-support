import type { TestScenarioGroup } from "@/types/TestScenarioGroup";

export function makeTestScenarioGroups(faqQuestions: string[]): TestScenarioGroup[] {
  return [
    { title: "FAQs", scenarios: faqQuestions.map((question) => ({ line: question, expectation: "Answers" })) },
    {
      title: "Hand-off",
      scenarios: [
        { line: "What are your fees to send money to India?", expectation: "Hands off" },
        { line: "I want to speak to a real person, please.", expectation: "Hands off" },
      ],
    },
    {
      title: "Personal data",
      scenarios: [
        { line: "My name is John Smith.", expectation: "Masks the name" },
        { line: "My card number is 4242 4242 4242 4242.", expectation: "Masks the card" },
        { line: "My account number is 12345678.", expectation: "Masks the account" },
        { line: "Email me at john@example.com.", expectation: "Masks the email" },
        { line: "Call my sister on 07700 900123.", expectation: "Masks the phone" },
      ],
    },
    { title: "Ending", scenarios: [{ line: "That is all, thanks. Bye!", expectation: "Ends the call" }] },
  ];
}

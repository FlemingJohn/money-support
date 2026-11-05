import type { HandOffEmailWording } from "../types/HandOffEmailWording";
import type { HandOffOutcome } from "../types/HandOffOutcome";

export const handOffEmailWordings: Record<HandOffOutcome, HandOffEmailWording> = {
  handedOff: {
    subjectStart: "Follow up a handed-off call",
    explanation: "The agent couldn't help with this call and told the caller to contact the support team.",
    callToAction: "Open it in Review to see what they needed and call them back if you can.",
  },
  transferAnswered: {
    subjectStart: "Transferred to you",
    explanation: "The agent transferred this caller to {transferNumber}, briefed the person who answered, and connected them.",
    callToAction: "Open it in Review to add a note and mark it done once the caller is helped.",
  },
  transferNotAnswered: {
    subjectStart: "⚠ Missed transfer, please call back",
    explanation: "The agent tried to transfer this caller to {transferNumber}, but nobody answered. The caller was told the team will call back.",
    callToAction: "Please call them back from the Review page as soon as you can.",
  },
  callerLeftDuringTransfer: {
    subjectStart: "⚠ Caller hung up during transfer, please call back",
    explanation: "The agent was transferring this caller to {transferNumber}, but the caller hung up before anyone answered.",
    callToAction: "Please call them back from the Review page as soon as you can.",
  },
  outOfHours: {
    subjectStart: "Out-of-hours caller, follow up next working day",
    explanation: "This caller needed the team outside team hours. The agent asked them to call back on a weekday between 9am and 5pm UK time.",
    callToAction: "Open it in Review and follow up on the next working day.",
  },
};

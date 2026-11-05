import { Injectable } from "@nestjs/common";
import { Speaker } from "../../generated/prisma/client";
import { handOffEmailWordings } from "../catalogs/handOffEmailWordings";
import type { HandOffEmail } from "../types/HandOffEmail";
import type { HandOffEmailInput } from "../types/HandOffEmailInput";
import type { HandOffEmailWording } from "../types/HandOffEmailWording";

@Injectable()
export class HandOffEmailBuilder {
  private readonly shownLineCount = 4;
  private readonly ukTime = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  build(input: HandOffEmailInput): HandOffEmail {
    const wording = this.findWording(input);
    const details = this.makeDetails(input);
    const lines = this.makeLastLines(input);
    return {
      to: input.to,
      subject: `${wording.subjectStart}: "${input.topic ?? "Untitled call"}", ${this.ukTime.format(input.endedAt)}`,
      text: this.makeText(wording, input, details, lines),
      html: this.makeHtml(wording, input, details, lines),
    };
  }

  private findWording(input: HandOffEmailInput): HandOffEmailWording {
    const wording = handOffEmailWordings[input.outcome];
    return { ...wording, explanation: wording.explanation.replace("{transferNumber}", input.transferNumber || "the team") };
  }

  private makeDetails(input: HandOffEmailInput): [string, string][] {
    return [
      ["When", `${this.ukTime.format(input.startedAt ?? input.endedAt)} UK time, ${this.getDurationSeconds(input)} seconds`],
      ["Caller", input.maskedCustomerNumber ?? "Not known"],
      ["Topic", input.topic ?? "Not known"],
      ["Summary", input.summary ?? "Not available yet"],
    ];
  }

  private makeLastLines(input: HandOffEmailInput): string[] {
    return input.lines.slice(-this.shownLineCount).map((line) => `${line.speaker === Speaker.agent ? "Agent" : "Caller"}: ${line.redactedText}`);
  }

  private makeText(wording: HandOffEmailWording, input: HandOffEmailInput, details: [string, string][], lines: string[]): string {
    return [
      wording.explanation,
      "",
      ...details.map(([label, value]) => `${label}: ${value}`),
      "",
      "Last lines (personal data removed):",
      ...lines.map((line) => `  ${line}`),
      "",
      wording.callToAction,
      input.callUrl,
    ].join("\n");
  }

  private makeHtml(wording: HandOffEmailWording, input: HandOffEmailInput, details: [string, string][], lines: string[]): string {
    const detailRows = details.map(([label, value]) => `<tr><td style="padding:4px 12px 4px 0;color:#555"><b>${label}</b></td><td style="padding:4px 0">${this.escape(value)}</td></tr>`).join("");
    const lineItems = lines.map((line) => `<li style="margin:4px 0">${this.escape(line)}</li>`).join("");
    return [
      `<div style="font-family:Arial,sans-serif;font-size:14px;color:#111;max-width:560px">`,
      `<p>${this.escape(wording.explanation)}</p>`,
      `<table style="border-collapse:collapse">${detailRows}</table>`,
      `<p style="margin-top:16px"><b>Last lines</b> (personal data removed)</p>`,
      `<ul style="padding-left:18px">${lineItems}</ul>`,
      `<p>${this.escape(wording.callToAction)}</p>`,
      `<p><a href="${this.escape(input.callUrl)}" style="display:inline-block;padding:10px 16px;background:#163300;color:#fff;border-radius:6px;text-decoration:none">Open in Review</a></p>`,
      `</div>`,
    ].join("");
  }

  private getDurationSeconds(input: HandOffEmailInput): number {
    if (!input.startedAt) return 0;
    return Math.max(0, Math.round((input.endedAt.getTime() - input.startedAt.getTime()) / 1000));
  }

  private escape(value: string): string {
    return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  }
}

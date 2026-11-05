import { Sparkles } from "lucide-react";
import { CardLink } from "@/components/CardLink";
import { SectionCard } from "@/components/SectionCard";
import { formatShortDateTime } from "@/lib/formatShortDateTime";
import { QualityBarsSvg } from "@/overview/QualityBarsSvg";
import type { AgentQualityCardProps } from "@/types/AgentQualityCardProps";

export function AgentQualityCard({ quality }: AgentQualityCardProps) {
  return (
    <SectionCard title="Agent quality this week" icon={Sparkles} className="flex-[1_1_100%]" action={<CardLink href="/agent-quality" label="Open" />}>
      {quality.judgedCount === 0 ? (
        <p className="p-5 text-sm text-ink-muted">No verdicts yet. Mark calls correct or wrong on the Review page to see the agent&apos;s score here.</p>
      ) : (
        <div className="flex flex-wrap gap-6 p-5">
          <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-3">
            <p className="text-sm">
              <strong>{quality.judgedCount}</strong> checked · <span className="font-semibold text-success-ink">{quality.correctCount} correct</span> ·{" "}
              <span className="font-semibold text-handoff-ink">{quality.wrongCount} wrong</span>
            </p>
            {quality.wrongByReason.length > 0 && <QualityBarsSvg reasons={quality.wrongByReason} />}
          </div>
          <div className="flex min-w-0 flex-[1_1_260px] flex-col gap-2 text-sm">
            <span className="font-semibold">By prompt version</span>
            {quality.byPromptVersion.map((version) => (
              <span key={version.promptVersionId} className="text-ink-muted">
                {formatShortDateTime(version.createdAt)} · {version.wrongCount} of {version.judgedCount} wrong ({Math.round((version.wrongCount / version.judgedCount) * 100)}%)
              </span>
            ))}
          </div>
        </div>
      )}
    </SectionCard>
  );
}

import { getSettings } from "@/lib/getSettings";
import { ActivityPanel } from "@/settings/ActivityPanel";
import { AgentSettingsForm } from "@/settings/AgentSettingsForm";
import { ConnectionsPanel } from "@/settings/ConnectionsPanel";
import { getActivity } from "@/settings/getActivity";
import { getHealthReport } from "@/settings/getHealthReport";
import { HandOffSettingsForm } from "@/settings/HandOffSettingsForm";
import { PhoneSettingsForm } from "@/settings/PhoneSettingsForm";
import { PrivacySettingsForm } from "@/settings/PrivacySettingsForm";
import { readSettingsTab } from "@/settings/readSettingsTab";
import { SettingsTabs } from "@/settings/SettingsTabs";
import type { SearchParamsProps } from "@/types/SearchParamsProps";

const webhookUrl = `${process.env.BACKEND_URL ?? "http://localhost:4000"}/vapi/webhook`;

export async function SettingsContent({ searchParams }: SearchParamsProps) {
  const tab = readSettingsTab(await searchParams);

  return (
    <>
      <SettingsTabs currentTab={tab} />
      <section className="rounded-card border border-line bg-paper px-5 pb-5">{await renderPanel(tab)}</section>
    </>
  );
}

async function renderPanel(tab: ReturnType<typeof readSettingsTab>) {
  if (tab === "connections") return <ConnectionsPanel health={await getHealthReport()} webhookUrl={webhookUrl} />;
  if (tab === "activity") return <div className="pt-2"><ActivityPanel events={await getActivity()} /></div>;
  const settings = await getSettings();
  if (tab === "handOff") return <HandOffSettingsForm initialValues={settings.handOff} />;
  if (tab === "privacy") return <PrivacySettingsForm initialValues={settings.privacy} />;
  if (tab === "phone") return <PhoneSettingsForm initialValues={settings.phone} />;
  return <AgentSettingsForm initialValues={settings.agent} />;
}

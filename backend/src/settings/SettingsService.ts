import { Injectable } from "@nestjs/common";
import type { ZodType } from "zod";
import { ActivityLog } from "../activity/services/ActivityLog";
import { AssistantSyncService } from "../assistant/services/AssistantSyncService";
import { ActivityAction, ActivityItemType, SettingsSection } from "../generated/prisma/client";
import { AgentSettingsDto } from "./AgentSettingsDto";
import { HandOffSettingsDto } from "./HandOffSettingsDto";
import { PhoneSettingsDto } from "./PhoneSettingsDto";
import { PrivacySettingsDto } from "./PrivacySettingsDto";
import { SettingsRepository } from "./SettingsRepository";
import type { SettingsResponse } from "./SettingsResponse";

@Injectable()
export class SettingsService {
  constructor(
    private readonly settingsRepository: SettingsRepository,
    private readonly assistantSyncService: AssistantSyncService,
    private readonly activityLog: ActivityLog,
  ) {}

  async getAll(): Promise<SettingsResponse> {
    const [agent, handOff, privacy, phone] = await Promise.all([this.getAgent(), this.getHandOff(), this.getPrivacy(), this.getPhone()]);
    return { agent, handOff, privacy, phone };
  }

  getAgent(): Promise<AgentSettingsDto> {
    return this.readSection(SettingsSection.agent, AgentSettingsDto.schema);
  }

  getHandOff(): Promise<HandOffSettingsDto> {
    return this.readSection(SettingsSection.handOff, HandOffSettingsDto.schema);
  }

  getPrivacy(): Promise<PrivacySettingsDto> {
    return this.readSection(SettingsSection.privacy, PrivacySettingsDto.schema);
  }

  getPhone(): Promise<PhoneSettingsDto> {
    return this.readSection(SettingsSection.phone, PhoneSettingsDto.schema);
  }

  async updateAgent(values: AgentSettingsDto): Promise<SettingsResponse> {
    await this.saveSection(SettingsSection.agent, { ...values });
    await this.assistantSyncService.syncAgent();
    return this.getAll();
  }

  async updateHandOff(values: HandOffSettingsDto): Promise<SettingsResponse> {
    await this.saveSection(SettingsSection.handOff, { ...values });
    await this.assistantSyncService.syncAgent();
    return this.getAll();
  }

  async updatePrivacy(values: PrivacySettingsDto): Promise<SettingsResponse> {
    await this.saveSection(SettingsSection.privacy, { ...values });
    await this.assistantSyncService.syncAgent();
    return this.getAll();
  }

  async updatePhone(values: PhoneSettingsDto): Promise<SettingsResponse> {
    await this.saveSection(SettingsSection.phone, { ...values });
    return this.getAll();
  }

  private async readSection<Values>(section: SettingsSection, schema: ZodType<Values>): Promise<Values> {
    return schema.parse(await this.settingsRepository.findValues(section));
  }

  private async saveSection(section: SettingsSection, values: Record<string, string | number | boolean>): Promise<void> {
    await this.settingsRepository.saveValues(section, values);
    await this.activityLog.record({ action: ActivityAction.settingsUpdated, itemType: ActivityItemType.settings, itemId: section });
  }
}

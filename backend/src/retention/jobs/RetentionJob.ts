import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { RetentionService } from "../services/RetentionService";

@Injectable()
export class RetentionJob {
  private readonly logger = new Logger(RetentionJob.name);

  constructor(private readonly retentionService: RetentionService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async run(): Promise<void> {
    try {
      const result = await this.retentionService.applyRetention();
      this.logger.log(
        `Removed ${result.deletedMessageCount} messages and ${result.deletedFieldCount} fields, cleared ${result.clearedNumberCount} stored numbers`,
      );
    } catch (error) {
      this.logger.error(`Retention failed: ${String(error)}`);
    }
  }
}

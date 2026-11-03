import { Injectable } from "@nestjs/common";
import { type Callback, CallbackStatus, type Prisma } from "../generated/prisma/client";
import { PrismaService } from "../prisma/services/PrismaService";
import type { CallbackInput } from "./CallbackInput";

@Injectable()
export class CallbackRepository {
  private readonly activeStatuses = [CallbackStatus.ringingReviewer, CallbackStatus.ringingCaller, CallbackStatus.connected];

  constructor(private readonly prismaService: PrismaService) {}

  create(input: CallbackInput): Promise<Callback> {
    return this.prismaService.callback.create({ data: input });
  }

  findById(callbackId: string): Promise<Callback | null> {
    return this.prismaService.callback.findUnique({ where: { id: callbackId } });
  }

  findActiveForCall(callId: string): Promise<Callback | null> {
    return this.prismaService.callback.findFirst({ where: { callId, status: { in: this.activeStatuses } } });
  }

  findForCall(callId: string): Promise<Callback[]> {
    return this.prismaService.callback.findMany({ where: { callId }, orderBy: { startedAt: "desc" } });
  }

  update(callbackId: string, changes: Prisma.CallbackUpdateInput): Promise<Callback> {
    return this.prismaService.callback.update({ where: { id: callbackId }, data: changes });
  }
}

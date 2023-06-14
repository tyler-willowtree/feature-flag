import { Injectable } from '@nestjs/common';
import { FeatureFlag } from 'server/featureFlag.type';
import { PrismaService } from 'server/prisma.service';

@Injectable()
export class FeatureFlagService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllFlags(): Promise<FeatureFlag[]> {
    return this.prisma.featureFlag.findMany();
  }

  async getFlagByName(name: string): Promise<FeatureFlag | null> {
    return this.prisma.featureFlag.findUnique({
      where: { name },
    });
  }

  async createFlag(name: string, description: string): Promise<FeatureFlag> {
    return this.prisma.featureFlag.create({
      data: {
        name,
        description,
        enabled: true,
        updatedAt: new Date(),
      },
    });
  }

  async toggleFlag(id: number): Promise<FeatureFlag> {
    const flag = await this.prisma.featureFlag.findUnique({
      where: { id },
    });

    return this.prisma.featureFlag.update({
      where: { id },
      data: { enabled: flag ? !flag.enabled : false },
    });
  }

  async deleteFlag(id: number): Promise<FeatureFlag> {
    return this.prisma.featureFlag.delete({
      where: { id },
    });
  }
}

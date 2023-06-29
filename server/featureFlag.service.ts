import { Injectable } from '@nestjs/common';
import { paramCase } from 'change-case';
import { FeatureFlag, FeatureFlagToggleInput } from 'server/featureFlag.type';
import { PrismaService } from 'server/prisma.service';
import { getPast } from 'server/utils';

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
        name: paramCase(name),
        description,
        enabled: true,
        updatedAt: new Date(),
      },
    });
  }

  async createExampleFlag(
    name: string,
    description: string
  ): Promise<FeatureFlag> {
    return this.prisma.featureFlag.create({
      data: {
        name: paramCase(name),
        description,
        enabled: Math.random() > 0.5,
        updatedAt: getPast().format(),
      },
    });
  }

  async updateFlag(
    id: number,
    name: string,
    description: string
  ): Promise<FeatureFlag> {
    return this.prisma.featureFlag.update({
      where: { id },
      data: {
        name: paramCase(name),
        description,
        updatedAt: new Date(),
      },
    });
  }

  async toggleFlag(
    id: number,
    data: FeatureFlagToggleInput
  ): Promise<FeatureFlag> {
    return this.prisma.featureFlag.update({
      where: { id },
      data,
    });
  }

  async deleteFlag(id: number): Promise<FeatureFlag> {
    return this.prisma.featureFlag.delete({
      where: { id },
    });
  }
}

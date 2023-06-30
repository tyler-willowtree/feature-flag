import { Injectable } from '@nestjs/common';
import { paramCase } from 'change-case';
import {
  FeatureFlagSingleDb,
  FeatureFlagSingleDbToggleUniqueInput,
} from 'server/featureFlagSingleDb.type';
import { PrismaService } from 'server/prisma.service';
import { getPast } from 'server/utils';

@Injectable()
export class FeatureFlagSingleDbService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllFlagsSDB(): Promise<FeatureFlagSingleDb[]> {
    return this.prisma.featureFlagSingleDb.findMany();
  }

  async getFlagByNameSDB(name: string): Promise<FeatureFlagSingleDb | null> {
    return this.prisma.featureFlagSingleDb.findUnique({
      where: { name },
    });
  }

  async createFlagSDB(
    name: string,
    description: string
  ): Promise<FeatureFlagSingleDb> {
    return this.prisma.featureFlagSingleDb.create({
      data: {
        name: paramCase(name),
        description,
        localEnabled: true,
        stagingEnabled: true,
        productionEnabled: true,
        updatedAt: new Date(),
      },
    });
  }

  async createExampleFlagSDB(
    name: string,
    description: string
  ): Promise<FeatureFlagSingleDb> {
    return this.prisma.featureFlagSingleDb.create({
      data: {
        name: paramCase(name),
        description,
        localEnabled: Math.random() > 0.5,
        stagingEnabled: Math.random() > 0.7,
        productionEnabled: Math.random() > 0.3,
        updatedAt: getPast().format(),
      },
    });
  }

  async updateFlagSDB(
    id: number,
    name: string,
    description: string
  ): Promise<FeatureFlagSingleDb> {
    return this.prisma.featureFlagSingleDb.update({
      where: { id },
      data: {
        name: paramCase(name),
        description,
        updatedAt: new Date(),
      },
    });
  }

  async toggleFlagSDB(
    id: number,
    data: FeatureFlagSingleDbToggleUniqueInput
  ): Promise<FeatureFlagSingleDb | null> {
    return this.prisma.featureFlagSingleDb.update({
      where: { id },
      data,
    });
  }

  async deleteFlagSDB(id: number): Promise<FeatureFlagSingleDb> {
    return this.prisma.featureFlagSingleDb.delete({
      where: { id },
    });
  }
}

import { Injectable } from '@nestjs/common';
import {
  FeatureFlagSingleDb,
  FeatureFlagSingleDbToggleUniqueInput,
} from 'server/featureFlagSingleDb.type';
import { PrismaService } from 'server/prisma.service';

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
        name,
        description,
        localEnabled: true,
        stagingEnabled: true,
        productionEnabled: true,
        updatedAt: new Date(),
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
        name,
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

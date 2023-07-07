import { Injectable } from '@nestjs/common';
import { paramCase } from 'change-case';
import { randomString } from 'server/featureFlag/featureFlag.service';
import {
  FeatureFlagSingleDb,
  FeatureFlagSingleDbCreateInput,
  FeatureFlagSingleDbPercentageUpdateInput,
  FeatureFlagSingleDbToggleUniqueInput,
  FeatureFlagSingleDbUpdateInput,
} from 'server/featureFlagSingleDb/featureFlagSingleDb.type';
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
    data: FeatureFlagSingleDbCreateInput
  ): Promise<FeatureFlagSingleDb> {
    return this.prisma.featureFlagSingleDb.create({
      data: {
        name: paramCase(data.name),
        description: data.description,
        localEnabled: true,
        stagingEnabled: true,
        productionEnabled: true,
        localEnablePercentage: data.localEnablePercentage,
        stagingEnablePercentage: data.stagingEnablePercentage,
        productionEnablePercentage: data.productionEnablePercentage,
        localOnCount: 0,
        localOffCount: 0,
        stagingOnCount: 0,
        stagingOffCount: 0,
        productionOnCount: 0,
        productionOffCount: 0,
        updatedAt: new Date(),
      },
    });
  }

  async createExampleFlagSDB(): Promise<FeatureFlagSingleDb> {
    const randomLengths = [
      Math.ceil(Math.random() * 5) + 1,
      Math.ceil(Math.random() * 7) + 1,
      Math.ceil(Math.random() * 7) + 1,
    ];
    const name = `${randomString(randomLengths[0])}-${randomString(
      randomLengths[1]
    )}-${randomString(randomLengths[2])}`;

    return this.prisma.featureFlagSingleDb.create({
      data: {
        name: paramCase(name),
        description: 'This is example flag only',
        localEnabled: Math.random() > 0.5,
        stagingEnabled: Math.random() > 0.7,
        productionEnabled: Math.random() > 0.3,
        localEnablePercentage: Math.round(Math.ceil(Math.random() * 10)) * 10,
        stagingEnablePercentage: Math.round(Math.ceil(Math.random() * 10)) * 10,
        productionEnablePercentage:
          Math.round(Math.ceil(Math.random() * 10)) * 10,
        localOnCount: 0,
        localOffCount: 0,
        stagingOnCount: 0,
        stagingOffCount: 0,
        productionOnCount: 0,
        productionOffCount: 0,
        updatedAt: getPast().format(),
      },
    });
  }

  async updateFlagSDB(
    id: number,
    data: FeatureFlagSingleDbUpdateInput
  ): Promise<FeatureFlagSingleDb> {
    const update = data;
    if (data.name) {
      update.name = paramCase(data.name as string);
    }
    return this.prisma.featureFlagSingleDb.update({
      where: { id },
      data: {
        ...update,
        updatedAt: new Date(),
      },
    });
  }

  async updateFlagSDBPercentage(
    id: number,
    data: FeatureFlagSingleDbPercentageUpdateInput
  ): Promise<FeatureFlagSingleDb> {
    return this.prisma.featureFlagSingleDb.update({
      where: { id },
      data,
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

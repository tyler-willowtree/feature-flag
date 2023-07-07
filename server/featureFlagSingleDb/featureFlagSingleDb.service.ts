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
        enabledLocal: true,
        enabledStage: true,
        enabledProd: true,
        abPercentageLocal: data.abPercentageLocal,
        abPercentageStage: data.abPercentageStage,
        abPercentageProd: data.abPercentageProd,
        abShowCountLocal: 0,
        abHideCountLocal: 0,
        abShowCountStage: 0,
        abHideCountStage: 0,
        abShowCountProd: 0,
        abHideCountProd: 0,
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
        enabledLocal: Math.random() > 0.5,
        enabledStage: Math.random() > 0.7,
        enabledProd: Math.random() > 0.3,
        abPercentageLocal: Math.round(Math.ceil(Math.random() * 10)) * 10,
        abPercentageStage: Math.round(Math.ceil(Math.random() * 10)) * 10,
        abPercentageProd: Math.round(Math.ceil(Math.random() * 10)) * 10,
        abShowCountLocal: 0,
        abHideCountLocal: 0,
        abShowCountStage: 0,
        abHideCountStage: 0,
        abShowCountProd: 0,
        abHideCountProd: 0,
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

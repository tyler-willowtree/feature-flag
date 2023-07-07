import { Injectable } from '@nestjs/common';
import { paramCase } from 'change-case';
import {
  FeatureFlag,
  FeatureFlagCreateInput,
  FeatureFlagPercentageUpdateInput,
  FeatureFlagToggleInput,
  FeatureFlagUpdateInput,
} from 'server/featureFlag/featureFlag.type';
import { PrismaService } from 'server/prisma.service';
import { getPast } from 'server/utils';

export const randomString = (length: number) => {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

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

  async createFlag(data: FeatureFlagCreateInput): Promise<FeatureFlag> {
    return this.prisma.featureFlag.create({
      data: {
        name: paramCase(data.name),
        description: data.description,
        enabled: true,
        abPercentage: data.abPercentage,
        abShowCount: 0,
        abHideCount: 0,
        updatedAt: new Date(),
      },
    });
  }

  async createExampleFlag(): Promise<FeatureFlag> {
    const randomLengths = [
      Math.ceil(Math.random() * 6) + 1,
      Math.ceil(Math.random() * 5) + 1,
      Math.ceil(Math.random() * 8) + 1,
    ];
    const name = `${randomString(randomLengths[0])}-${randomString(
      randomLengths[1]
    )}-${randomString(randomLengths[2])}`;

    return this.prisma.featureFlag.create({
      data: {
        name: paramCase(name),
        description: 'This is example flag only',
        abPercentage: Math.round(Math.ceil(Math.random() * 10)) * 10,
        abShowCount: 0,
        abHideCount: 0,
        enabled: Math.random() > 0.5,
        updatedAt: getPast().format(),
      },
    });
  }

  async updateFlag(
    id: number,
    data: FeatureFlagUpdateInput
  ): Promise<FeatureFlag> {
    const update = data;
    if (data.name) {
      update.name = paramCase(data.name as string);
    }
    return this.prisma.featureFlag.update({
      where: { id },
      data: {
        ...update,
        updatedAt: new Date(),
      },
    });
  }

  async updateFlagPercentage(
    id: number,
    data: FeatureFlagPercentageUpdateInput
  ): Promise<FeatureFlag> {
    return this.prisma.featureFlag.update({
      where: { id },
      data,
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

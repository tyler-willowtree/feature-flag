import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { FeatureFlagService } from 'server/featureFlag/featureFlag.service';
import {
  FeatureFlag,
  FeatureFlagCreateInput,
  FeatureFlagPercentageUpdateInput,
  FeatureFlagToggleInput,
  FeatureFlagUpdateInput,
} from 'server/featureFlag/featureFlag.type';

@Resolver()
export class FeatureFlagResolver {
  constructor(private readonly service: FeatureFlagService) {}

  @Query(() => [FeatureFlag])
  async getAllFlags(): Promise<FeatureFlag[]> {
    return this.service.getAllFlags();
  }

  @Query(() => FeatureFlag, { nullable: true })
  async getFlagByName(@Args('name') name: string): Promise<FeatureFlag | null> {
    return this.service.getFlagByName(name);
  }

  @Mutation(() => FeatureFlag)
  async createFlag(
    @Args('data') data: FeatureFlagCreateInput
  ): Promise<FeatureFlag> {
    return this.service.createFlag(data);
  }

  @Mutation(() => FeatureFlag)
  async createExampleFlag(): Promise<FeatureFlag> {
    return this.service.createExampleFlag();
  }

  @Mutation(() => FeatureFlag)
  async updateFlag(
    @Args('id') id: number,
    @Args('data') data: FeatureFlagUpdateInput
  ): Promise<FeatureFlag> {
    return this.service.updateFlag(id, data);
  }

  @Mutation(() => FeatureFlag)
  async updateFlagPercentage(
    @Args('id') id: number,
    @Args('data') data: FeatureFlagPercentageUpdateInput
  ): Promise<FeatureFlag> {
    return this.service.updateFlagPercentage(id, data);
  }

  @Mutation(() => FeatureFlag)
  async toggleFlag(
    @Args('id') id: number,
    @Args('data') data: FeatureFlagToggleInput
  ): Promise<FeatureFlag> {
    return this.service.toggleFlag(id, data);
  }

  @Mutation(() => FeatureFlag)
  async deleteFlag(@Args('id') id: number): Promise<FeatureFlag> {
    return this.service.deleteFlag(id);
  }
}

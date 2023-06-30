import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { FeatureFlagService } from 'server/featureFlag.service';
import { FeatureFlag, FeatureFlagToggleInput } from 'server/featureFlag.type';

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
    @Args('name') name: string,
    @Args('description') description: string
  ): Promise<FeatureFlag> {
    return this.service.createFlag(name, description);
  }

  @Mutation(() => FeatureFlag)
  async createExampleFlag(
    @Args('name') name: string,
    @Args('description') description: string
  ): Promise<FeatureFlag> {
    return this.service.createExampleFlag(name, description);
  }

  @Mutation(() => FeatureFlag)
  async updateFlag(
    @Args('id') id: number,
    @Args('name') name: string,
    @Args('description') description: string
  ): Promise<FeatureFlag> {
    return this.service.updateFlag(id, name, description);
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

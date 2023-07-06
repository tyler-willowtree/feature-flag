import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FeatureFlagSingleDbService } from 'server/featureFlagSingleDb/featureFlagSingleDb.service';
import {
  FeatureFlagSingleDb,
  FeatureFlagSingleDbCreateInput,
  FeatureFlagSingleDbPercentageUpdateInput,
  FeatureFlagSingleDbToggleUniqueInput,
  FeatureFlagSingleDbUpdateInput,
} from 'server/featureFlagSingleDb/featureFlagSingleDb.type';

@Resolver()
export class FeatureFlagSingleDbResolver {
  constructor(private readonly service: FeatureFlagSingleDbService) {}

  @Query(() => [FeatureFlagSingleDb])
  async getAllFlagsSDB(): Promise<FeatureFlagSingleDb[]> {
    return this.service.getAllFlagsSDB();
  }

  @Query(() => FeatureFlagSingleDb, { nullable: true })
  async getFlagByNameSDB(
    @Args('name') name: string
  ): Promise<FeatureFlagSingleDb | null> {
    return this.service.getFlagByNameSDB(name);
  }

  @Mutation(() => FeatureFlagSingleDb)
  async createFlagSDB(
    @Args('data') data: FeatureFlagSingleDbCreateInput
  ): Promise<FeatureFlagSingleDb> {
    return this.service.createFlagSDB(data);
  }

  @Mutation(() => FeatureFlagSingleDb)
  async createExampleFlagSDB(): Promise<FeatureFlagSingleDb> {
    return this.service.createExampleFlagSDB();
  }

  @Mutation(() => FeatureFlagSingleDb)
  async updateFlagSDB(
    @Args('id') id: number,
    @Args('data') data: FeatureFlagSingleDbUpdateInput
  ): Promise<FeatureFlagSingleDb> {
    return this.service.updateFlagSDB(id, data);
  }

  @Mutation(() => FeatureFlagSingleDb)
  async updateFlagSDBPercentage(
    @Args('id') id: number,
    @Args('data') data: FeatureFlagSingleDbPercentageUpdateInput
  ): Promise<FeatureFlagSingleDb> {
    return this.service.updateFlagSDBPercentage(id, data);
  }

  @Mutation(() => FeatureFlagSingleDb)
  async toggleFlagSDB(
    @Args('id') id: number,
    @Args('data') data: FeatureFlagSingleDbToggleUniqueInput
  ): Promise<FeatureFlagSingleDb | null> {
    return this.service.toggleFlagSDB(id, data);
  }

  @Mutation(() => FeatureFlagSingleDb)
  async deleteFlagSDB(@Args('id') id: number): Promise<FeatureFlagSingleDb> {
    return this.service.deleteFlagSDB(id);
  }
}

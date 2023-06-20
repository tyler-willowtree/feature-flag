import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FeatureFlagSingleDbService } from 'server/featureFlagSingleDb.service';
import {
  FeatureFlagSingleDb,
  FeatureFlagSingleDbToggleUniqueInput,
} from 'server/featureFlagSingleDb.type';

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
    @Args('name') name: string,
    @Args('description') description: string
  ): Promise<FeatureFlagSingleDb> {
    return this.service.createFlagSDB(name, description);
  }

  @Mutation(() => FeatureFlagSingleDb)
  async updateFlagSDB(
    @Args('id') id: number,
    @Args('name') name: string,
    @Args('description') description: string
  ): Promise<FeatureFlagSingleDb> {
    return this.service.updateFlagSDB(id, name, description);
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

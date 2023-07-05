import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FeatureFlag {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => Boolean)
  enabled: boolean;

  @Field(() => Int)
  enablePercentage: number;

  @Field(() => Int)
  onCount: number;

  @Field(() => Int)
  offCount: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@InputType()
export class FeatureFlagToggleInput {
  @Field(() => Boolean)
  enabled: boolean;
}

@InputType()
export class FeatureFlagPercentageUpdateInput {
  @Field(() => Int, { nullable: true })
  onCount?: number;

  @Field(() => Int, { nullable: true })
  offCount?: number;
}

@InputType()
export class FeatureFlagCreateInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => Boolean, { defaultValue: true })
  enabled: boolean;

  @Field(() => Int, { defaultValue: 100 })
  enablePercentage: number;
}

@InputType()
export class FeatureFlagUpdateInput extends FeatureFlagCreateInput {
  @Field(() => Int)
  id: number;
}

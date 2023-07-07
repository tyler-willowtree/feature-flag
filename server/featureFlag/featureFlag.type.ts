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
  abPercentage: number;

  @Field(() => Int)
  abShowCount: number;

  @Field(() => Int)
  abHideCount: number;

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
  abShowCount?: number;

  @Field(() => Int, { nullable: true })
  abHideCount?: number;
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
  abPercentage: number;
}

@InputType()
export class FeatureFlagUpdateInput extends FeatureFlagCreateInput {
  @Field(() => Int)
  id: number;
}

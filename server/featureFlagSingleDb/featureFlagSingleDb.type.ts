import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FeatureFlagSingleDb {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => Boolean)
  localEnabled: boolean;

  @Field(() => Boolean)
  stagingEnabled: boolean;

  @Field(() => Boolean)
  productionEnabled: boolean;

  @Field(() => Int)
  localEnablePercentage: number;

  @Field(() => Int)
  stagingEnablePercentage: number;

  @Field(() => Int)
  productionEnablePercentage: number;

  @Field(() => Int)
  localOnCount: number;

  @Field(() => Int)
  localOffCount: number;

  @Field(() => Int)
  stagingOnCount: number;

  @Field(() => Int)
  stagingOffCount: number;

  @Field(() => Int)
  productionOnCount: number;

  @Field(() => Int)
  productionOffCount: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@InputType()
export class FeatureFlagSingleDbToggleUniqueInput {
  @Field(() => Boolean, { nullable: true })
  localEnabled: boolean;

  @Field(() => Boolean, { nullable: true })
  stagingEnabled: boolean;

  @Field(() => Boolean, { nullable: true })
  productionEnabled: boolean;
}

@InputType()
export class FeatureFlagSingleDbPercentageUpdateInput {
  @Field(() => Int, { nullable: true })
  localOnCount?: number;

  @Field(() => Int, { nullable: true })
  localOffCount?: number;

  @Field(() => Int, { nullable: true })
  stagingOnCount?: number;

  @Field(() => Int, { nullable: true })
  stagingOffCount?: number;

  @Field(() => Int, { nullable: true })
  productionOnCount?: number;

  @Field(() => Int, { nullable: true })
  productionOffCount?: number;
}

@InputType()
export class FeatureFlagSingleDbCreateInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => Boolean, { defaultValue: true })
  localEnabled: boolean;

  @Field(() => Boolean, { defaultValue: true })
  stagingEnabled: boolean;

  @Field(() => Boolean, { defaultValue: true })
  productionEnabled: boolean;

  @Field(() => Int, { defaultValue: 100 })
  localEnablePercentage: number;

  @Field(() => Int, { defaultValue: 100 })
  stagingEnablePercentage: number;

  @Field(() => Int, { defaultValue: 100 })
  productionEnablePercentage: number;
}

@InputType()
export class FeatureFlagSingleDbUpdateInput extends FeatureFlagSingleDbCreateInput {
  @Field(() => Int)
  id: number;
}
